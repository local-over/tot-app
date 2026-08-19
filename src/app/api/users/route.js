import { NextResponse } from 'next/server';
import { validateAuth } from '@/lib/auth';

// In-memory array to store user profiles
let usersStore = [];

export async function GET(request) {
  if (!validateAuth(request)) {
    return NextResponse.json(
      { error: "Unauthorized. Provide a valid API key in the Authorization header as: Bearer <your_key>" },
      { status: 401 }
    );
  }

  return NextResponse.json(usersStore, { status: 200 });
}

export async function POST(request) {
  const body = await request.json();
  const { name, categories, readingStyle, contentVibe, readingTime } = body;

  if (!categories || !readingStyle || !contentVibe || !readingTime) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const userProfile = {
    id: Date.now().toString(),
    name,
    categories,
    readingStyle,
    contentVibe,
    readingTime,
    createdAt: new Date().toISOString()
  };

  // Replace user profile if user id already exists (can enhance by adding logic, but appending for now)
  usersStore.push(userProfile);

  return NextResponse.json(userProfile, { status: 201 });
}
