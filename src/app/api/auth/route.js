export const runtime = 'edge';
import { NextResponse } from 'next/server';

// In-memory session store (production would use a database)
const sessions = [];

export async function POST(request) {
  const body = await request.json();

  if (!body.email) {
    return NextResponse.json(
      { error: 'Email is required' },
      { status: 400 }
    );
  }

  const email = body.email.toLowerCase().trim();
  const isStudent = email.endsWith('.edu') || email.endsWith('.ac.uk') || email.endsWith('.edu.au');

  const session = {
    id: crypto.randomUUID(),
    email,
    isStudent,
    plan: isStudent ? 'student' : 'free_trial',
    createdAt: new Date().toISOString(),
  };

  sessions.push(session);

  return NextResponse.json({
    session,
    message: isStudent
      ? 'Student access verified. Welcome to TOT.'
      : 'Account created. Your free month starts now.',
  }, { status: 201 });
}

export async function GET(request) {
  const email = request.nextUrl.searchParams.get('email');

  if (!email) {
    return NextResponse.json(
      { error: 'Email query parameter is required' },
      { status: 400 }
    );
  }

  const session = sessions.find(s => s.email === email.toLowerCase().trim());

  if (!session) {
    return NextResponse.json({ exists: false }, { status: 200 });
  }

  return NextResponse.json({ exists: true, session }, { status: 200 });
}
