export const runtime = 'edge';
import { NextResponse } from 'next/server';
import { getRecommendation } from '@/lib/recommend';
import { createAdminClient } from '@/lib/appwrite-server';
import { Query, ID } from 'appwrite';

const DB_ID = 'tot_db';

export async function GET(request) {
  const { searchParams } = request.nextUrl;
  const userId = searchParams.get('userId');
  const categoriesParam = searchParams.get('categories');
  const readingStyle = searchParams.get('readingStyle');

  if (!userId) {
    return NextResponse.json({ error: 'userId is required' }, { status: 400 });
  }

  const { databases } = createAdminClient();
  const todayDate = new Date().toISOString().split('T')[0];

  try {
    // 1. Check if there's already an assignment for today
    const existingAssignment = await databases.listDocuments(DB_ID, 'daily_assignments', [
      Query.equal('userId', userId),
      Query.equal('date', todayDate)
    ]);

    if (existingAssignment.documents.length > 0) {
      const topicId = existingAssignment.documents[0].topicId;
      try {
        const topicDoc = await databases.getDocument(DB_ID, 'topics', topicId);
        const parsedTopic = {
          ...topicDoc,
          id: topicDoc.$id,
          assignmentId: existingAssignment.documents[0].$id,
          isMarked: existingAssignment.documents[0].isMarked || false,
          body: JSON.parse(topicDoc.body || '[]'),
          resources: topicDoc.resources ? JSON.parse(topicDoc.resources) : []
        };
        return NextResponse.json(parsedTopic, { status: 200 });
      } catch (err) {
        console.error("Topic assigned but not found in DB:", err);
        // Fall back to generating a new one
      }
    }

    // 2. We need to generate a new topic. Fetch all topics.
    const topicsRes = await databases.listDocuments(DB_ID, 'topics', [Query.limit(1000)]);
    const topics = topicsRes.documents.map(t => ({
      ...t,
      body: JSON.parse(t.body || '[]'),
      resources: t.resources ? JSON.parse(t.resources) : []
    }));

    // 3. Fetch user feedback history
    const feedbackRes = await databases.listDocuments(DB_ID, 'feedback', [
      Query.equal('userId', userId),
      Query.limit(100)
    ]);
    const feedbackHistory = feedbackRes.documents;

    // 4. Run recommendation engine
    let userPreferences = { categories: [], readingStyle, userId };
    if (categoriesParam) {
      userPreferences.categories = categoriesParam.split(',');
    }

    const recommendedTopic = getRecommendation(topics, userPreferences, feedbackHistory);

    if (recommendedTopic) {
      const topicId = recommendedTopic.id || recommendedTopic.$id;
      // Save assignment
      const newAssignment = await databases.createDocument(DB_ID, 'daily_assignments', ID.unique(), {
        userId,
        topicId: topicId,
        date: todayDate
      });
      // Ensure the recommended topic has .id
      recommendedTopic.id = topicId;
      recommendedTopic.assignmentId = newAssignment.$id;
      recommendedTopic.isMarked = false;
      return NextResponse.json(recommendedTopic, { status: 200 });
    } else {
      return NextResponse.json({ error: 'No topics available' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error in today topic:', error);
    return NextResponse.json({ error: 'Failed to fetch topic' }, { status: 500 });
  }
}
