export const runtime = 'edge';
import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/appwrite-server';
import { validateAuth } from '@/lib/auth';
import { Query } from 'appwrite';

const DB_ID = 'tot_db';

export async function GET(request, { params }) {
  const { id } = params;

  try {
    const { databases } = createAdminClient();
    
    // Fetch the topic
    const topicDoc = await databases.getDocument(DB_ID, 'topics', id);
    
    // Fetch the feedback for this topic
    const feedbackList = await databases.listDocuments(DB_ID, 'feedback', [
      Query.equal('topicId', id),
      Query.limit(1000)
    ]);

    const topic = {
      ...topicDoc,
      id: topicDoc.$id,
      body: JSON.parse(topicDoc.body || '[]'),
      resources: topicDoc.resources ? JSON.parse(topicDoc.resources) : [],
      feedback: feedbackList.documents
    };

    return NextResponse.json(topic, { status: 200 });
  } catch (error) {
    if (error.code === 404) {
      return NextResponse.json({ error: 'Topic not found' }, { status: 404 });
    }
    console.error('Error fetching topic:', error);
    return NextResponse.json({ error: 'Failed to fetch topic' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  if (!validateAuth(request)) {
    return NextResponse.json(
      { error: "Unauthorized. Provide a valid API key in the Authorization header as: Bearer <your_key>" },
      { status: 401 }
    );
  }

  const { id } = params;

  try {
    const body = await request.json();
    const { databases } = createAdminClient();

    const data = {};
    if (body.title !== undefined) data.title = body.title;
    if (body.categoryId !== undefined) data.categoryId = body.categoryId;
    if (body.readTime !== undefined) data.readTime = body.readTime;
    if (body.vibe !== undefined) data.vibe = body.vibe;
    if (body.body !== undefined) data.body = JSON.stringify(body.body);
    if (body.closingFact !== undefined) data.closingFact = body.closingFact;
    if (body.imageUrl !== undefined) data.imageUrl = body.imageUrl;
    if (body.resources !== undefined) data.resources = JSON.stringify(body.resources);

    const result = await databases.updateDocument(DB_ID, 'topics', id, data);

    return NextResponse.json({ success: true, topic: result }, { status: 200 });
  } catch (error) {
    if (error.code === 404) {
      return NextResponse.json({ error: 'Topic not found' }, { status: 404 });
    }
    console.error('Error updating topic:', error);
    return NextResponse.json({ error: 'Failed to update topic' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  if (!validateAuth(request)) {
    return NextResponse.json(
      { error: "Unauthorized. Provide a valid API key in the Authorization header as: Bearer <your_key>" },
      { status: 401 }
    );
  }

  const { id } = params;

  try {
    const { databases } = createAdminClient();
    await databases.deleteDocument(DB_ID, 'topics', id);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    if (error.code === 404) {
      return NextResponse.json({ error: 'Topic not found' }, { status: 404 });
    }
    console.error('Error deleting topic:', error);
    return NextResponse.json({ error: 'Failed to delete topic' }, { status: 500 });
  }
}
