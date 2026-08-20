export const runtime = 'edge';
import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/appwrite-server';
import { ID, Query } from 'appwrite';

export async function POST(request) {
  try {
    const { databases } = createAdminClient();
    const body = await request.json();
    const { email, profile, isStudent } = body;

    if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 });

    const existing = await databases.listDocuments('tot_db', 'users', [Query.equal('email', email)]);
    const isNew = existing.documents.length === 0;

    const data = { email };
    if (profile?.name !== undefined) data.name = profile.name;
    if (profile?.categories !== undefined) data.categories = profile.categories;
    if (profile?.readingStyle !== undefined) data.readingStyle = profile.readingStyle;
    if (profile?.contentVibe !== undefined) data.contentVibe = profile.contentVibe;
    if (profile?.readingTime !== undefined) data.readingTime = profile.readingTime;
    if (profile?.streak !== undefined) data.streak = profile.streak;
    if (profile?.gateCompleted !== undefined) data.gateCompleted = profile.gateCompleted;
    if (profile?.studentEmail !== undefined) data.studentEmail = profile.studentEmail;

    if (isStudent !== undefined) {
      data.isStudent = isStudent;
      data.plan = isStudent ? 'student' : (isNew ? 'free_month' : undefined);
    }

    Object.keys(data).forEach(key => data[key] === undefined && delete data[key]);

    let result;
    if (!isNew) {
      result = await databases.updateDocument('tot_db', 'users', existing.documents[0].$id, data);
    } else {
      result = await databases.createDocument('tot_db', 'users', ID.unique(), {
        ...data,
        name: data.name || '',
        isStudent: data.isStudent || false,
        plan: data.plan || 'free_month',
        streak: data.streak || 0,
        gateCompleted: data.gateCompleted || false,
      });
    }

    return NextResponse.json({ success: true, user: result });
  } catch (error) {
    console.error('Appwrite save error:', error);
    return NextResponse.json({ error: 'Failed to save to cloud' }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 });

    const { databases } = createAdminClient();
    const existing = await databases.listDocuments('tot_db', 'users', [Query.equal('email', email)]);
    
    if (existing.documents.length > 0) {
      return NextResponse.json({ success: true, user: existing.documents[0] });
    }
    return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 });
  }
}
