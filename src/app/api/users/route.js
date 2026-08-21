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
    if (profile?.plan_expires_at !== undefined) data.plan_expires_at = profile.plan_expires_at;
    if (profile?.dodo_subscription_id !== undefined) data.dodo_subscription_id = profile.dodo_subscription_id;

    if (isStudent !== undefined) {
      data.isStudent = isStudent;
      data.plan = isStudent ? 'student' : (isNew ? 'free_month' : undefined);
    }

    Object.keys(data).forEach(key => data[key] === undefined && delete data[key]);

    let result;
    if (!isNew) {
      result = await databases.updateDocument('tot_db', 'users', existing.documents[0].$id, data);
    } else {
      // Auto-verify if primary email is a student email
      const isEdu = email.toLowerCase().endsWith('.edu') || email.toLowerCase().endsWith('.ac.uk');
      const isStudentFinal = data.isStudent || isEdu;
      
      const planName = isStudentFinal ? 'student' : (data.plan || 'free_month');
      // Set expiration: 365 days for student, 30 days for free_month
      const expDate = new Date();
      expDate.setDate(expDate.getDate() + (planName === 'student' ? 365 : 30));
      
      result = await databases.createDocument('tot_db', 'users', ID.unique(), {
        ...data,
        name: data.name || '',
        isStudent: isStudentFinal,
        plan: planName,
        plan_expires_at: data.plan_expires_at || expDate.toISOString(),
        dodo_subscription_id: data.dodo_subscription_id || '',
        streak: data.streak || 0,
        gateCompleted: data.gateCompleted || isEdu,
        studentEmail: isEdu ? email.toLowerCase() : (data.studentEmail || '')
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
