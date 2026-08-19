export const runtime = 'edge';
import { NextResponse } from 'next/server';
import { topics } from '@/data/topics';
import { validateAuth } from '@/lib/auth';

export async function GET(request) {
  const { searchParams } = request.nextUrl;
  const category = searchParams.get('category');
  const vibe = searchParams.get('vibe');

  let filteredTopics = topics || [];

  if (category) {
    filteredTopics = filteredTopics.filter(t => t.categoryId === category);
  }
  if (vibe) {
    filteredTopics = filteredTopics.filter(t => t.vibe === vibe);
  }

  return NextResponse.json(filteredTopics, { status: 200 });
}

export async function POST(request) {
  if (!validateAuth(request)) {
    return NextResponse.json(
      { error: "Unauthorized. Provide a valid API key in the Authorization header as: Bearer <your_key>" },
      { status: 401 }
    );
  }

  const body = await request.json();

  if (!body.id || !body.categoryId || !body.title || !body.body) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  return NextResponse.json(
    {
      message: "Not Implemented. In production this would write to a database, but currently topics are bundled in the codebase.",
      receivedTopic: body
    },
    { status: 501 }
  );
}
