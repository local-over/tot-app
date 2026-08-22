import { createAdminClient } from '@/lib/appwrite-server';
import { Query } from 'appwrite';
import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET(request) {
  try {
    const { databases, DB_ID } = createAdminClient();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
    }

    // Fetch the user's daily assignments
    const assignmentsRes = await databases.listDocuments(DB_ID, 'daily_assignments', [
      Query.equal('userId', userId),
      Query.orderDesc('date'),
      Query.limit(50)
    ]);

    const assignments = assignmentsRes.documents;
    
    // Fetch user's feedback to verify which ones they actually read
    const feedbackRes = await databases.listDocuments(DB_ID, 'feedback', [
      Query.equal('userId', userId),
      Query.limit(1000)
    ]);
    const feedbackTopicIds = new Set(feedbackRes.documents.map(f => f.topicId));
    
    // Filter assignments that are read or marked
    const validAssignments = assignments.filter(assignment => 
      feedbackTopicIds.has(assignment.topicId) || assignment.isMarked
    );

    if (validAssignments.length === 0) {
      return NextResponse.json({ history: [] });
    }

    const topicIds = [...new Set(validAssignments.map(a => a.topicId))];
    
    // Fetch all relevant topics in one query instead of N+1
    const topicsRes = await databases.listDocuments(DB_ID, 'topics', [
      Query.equal('$id', topicIds),
      Query.limit(50)
    ]);
    
    const topicsMap = new Map(topicsRes.documents.map(t => [t.$id, t]));

    const validHistory = validAssignments.map(assignment => {
      const topic = topicsMap.get(assignment.topicId);
      if (!topic) return null; // Topic was deleted

      return {
        id: assignment.$id,
        topicId: assignment.topicId,
        date: assignment.date,
        isMarked: assignment.isMarked || false,
        title: topic.title,
        categoryId: topic.categoryId,
        readTime: topic.readTime,
        vibe: topic.vibe
      };
    }).filter(h => h !== null);

    return NextResponse.json({ history: validHistory });
  } catch (error) {
    console.error('Error fetching user history:', error);
    return NextResponse.json({ error: 'Failed to fetch history' }, { status: 500 });
  }
}
