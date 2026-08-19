import { NextResponse } from 'next/server';
import { validateAuth } from '@/lib/auth';

// In-memory array to store feedback
let feedbackStore = [];

export async function GET(request) {
  if (!validateAuth(request)) {
    return NextResponse.json(
      { error: "Unauthorized. Provide a valid API key in the Authorization header as: Bearer <your_key>" },
      { status: 401 }
    );
  }

  return NextResponse.json(feedbackStore, { status: 200 });
}

export async function POST(request) {
  const body = await request.json();
  const { topicId, rating, moreOrLess, length, userId } = body;

  if (!topicId || !rating || !moreOrLess || !length) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const feedbackEntry = {
    id: Date.now().toString(),
    topicId,
    rating,
    moreOrLess,
    length,
    userId,
    createdAt: new Date().toISOString()
  };

  feedbackStore.push(feedbackEntry);

  return NextResponse.json(feedbackEntry, { status: 201 });
}
