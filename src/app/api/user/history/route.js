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
    
    // For each assignment, fetch the corresponding topic to get the title and category
    // Doing this in parallel to be fast, but edge runtime is fine with this
    const history = await Promise.all(
      assignments.map(async (assignment) => {
        try {
          // If the user hasn't read it (no feedback), skip it unless it's marked/saved
          if (!feedbackTopicIds.has(assignment.topicId) && !assignment.isMarked) {
            return null;
          }

          const topic = await databases.getDocument(DB_ID, 'topics', assignment.topicId);
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
        } catch (e) {
          // If a topic was deleted, just ignore it
          return null;
        }
      })
    );

    const validHistory = history.filter(h => h !== null);

    return NextResponse.json({ history: validHistory });
  } catch (error) {
    console.error('Error fetching user history:', error);
    return NextResponse.json({ error: 'Failed to fetch history' }, { status: 500 });
  }
}
