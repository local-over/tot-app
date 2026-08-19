import { NextResponse } from 'next/server';
import { validateAuth } from '@/lib/auth';

// In-memory organization store
const organizations = [];

export async function POST(request) {
  const body = await request.json();

  if (!body.companyName || !body.email) {
    return NextResponse.json(
      { error: 'Company name and email are required' },
      { status: 400 }
    );
  }

  const org = {
    id: crypto.randomUUID(),
    companyName: body.companyName,
    email: body.email,
    teamSize: body.teamSize || '1-10',
    plan: body.plan || 'starter',
    createdAt: new Date().toISOString(),
    status: 'pending',
  };

  organizations.push(org);

  return NextResponse.json({
    organization: org,
    message: 'Organization registered. We\'ll get back to you within 24 hours.',
  }, { status: 201 });
}

export async function GET(request) {
  if (!validateAuth(request)) {
    return NextResponse.json(
      { error: 'Unauthorized. Provide a valid API key in the Authorization header as: Bearer <your_key>' },
      { status: 401 }
    );
  }

  return NextResponse.json(organizations, { status: 200 });
}
