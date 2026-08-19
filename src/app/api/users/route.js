export const runtime = 'edge';
import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/appwrite';
import { ID } from 'appwrite';

export async function POST(request) {
  try {
    const { databases } = createAdminClient();
    const body = await request.json();
    const { email, profile, isStudent } = body;

    // We will save user profile to the 'users' collection in 'tot_db'
    // This requires Project ID to be correct.
    const result = await databases.createDocument(
      'tot_db',
      'users',
      ID.unique(),
      {
        email,
        profile: JSON.stringify(profile),
        isStudent: isStudent || false,
        createdAt: new Date().toISOString()
      }
    );

    return NextResponse.json({ success: true, documentId: result.$id });
  } catch (error) {
    console.error('Appwrite save error:', error);
    return NextResponse.json({ error: 'Failed to save to cloud' }, { status: 500 });
  }
}
