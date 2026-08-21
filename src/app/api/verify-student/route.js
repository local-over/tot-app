export const runtime = 'edge';
import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/appwrite-server';
import { Query } from 'appwrite';

export async function POST(request) {
  try {
    const { databases } = createAdminClient();
    const body = await request.json();
    const { studentUserId, secret, studentEmail, currentUserEmail } = body;

    if (!studentUserId || !secret || !studentEmail || !currentUserEmail) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 1. Validate that studentEmail is not already used by another user
    const existing = await databases.listDocuments('tot_db', 'users', [Query.equal('studentEmail', studentEmail)]);
    if (existing.documents.length > 0) {
      return NextResponse.json({ error: 'This college email has already been used for verification by another account.' }, { status: 400 });
    }

    // 2. Verify the code with Appwrite by hitting the REST API directly
    const verifyRes = await fetch('https://nyc.cloud.appwrite.io/v1/account/sessions/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Appwrite-Project': process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID,
      },
      body: JSON.stringify({ userId: studentUserId, secret })
    });

    if (!verifyRes.ok) {
      const errData = await verifyRes.json();
      return NextResponse.json({ error: errData.message || 'Invalid code' }, { status: 400 });
    }

    // 3. Code is valid! Update the current user's profile
    const currentUserDocs = await databases.listDocuments('tot_db', 'users', [Query.equal('email', currentUserEmail)]);
    if (currentUserDocs.documents.length === 0) {
      return NextResponse.json({ error: 'Current user not found in database' }, { status: 404 });
    }
    const currentUser = currentUserDocs.documents[0];

    const updatedUser = await databases.updateDocument('tot_db', 'users', currentUser.$id, {
      isStudent: true,
      gateCompleted: true,
      studentEmail: studentEmail,
      plan: 'student'
    });

    // 4. Cleanup: Delete the temporary student user account from Appwrite Auth
    try {
      // Need Server SDK Account or direct fetch using API Key to delete user
      const deleteRes = await fetch(`https://nyc.cloud.appwrite.io/v1/users/${studentUserId}`, {
        method: 'DELETE',
        headers: {
          'X-Appwrite-Project': process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID,
          'X-Appwrite-Key': process.env.APPWRITE_API_KEY,
        }
      });
      if (!deleteRes.ok) {
        console.warn('Failed to delete temporary student user:', await deleteRes.text());
      }
    } catch (e) {
      console.warn('Error during temporary user cleanup:', e);
    }

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error('Student verification error:', error);
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 });
  }
}
