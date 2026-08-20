export const runtime = 'edge';
import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/appwrite-server';
import { ID } from 'appwrite';

export async function POST(request) {
  try {
    const { databases } = createAdminClient();
    const body = await request.json();
    const { userId, topicId, rating, moreOrLess, length } = body;

    const result = await databases.createDocument(
      'tot_db',
      'feedback',
      ID.unique(),
      {
        userId: userId || 'anonymous',
        rating,
        moreOrLess,
        length,
        topicId: topicId || ''
      }
    );

    return NextResponse.json({ success: true, documentId: result.$id });
  } catch (error) {
    console.error('Appwrite feedback save error:', error);
    return NextResponse.json({ error: 'Failed to save feedback to cloud' }, { status: 500 });
  }
}
