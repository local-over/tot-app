import { NextResponse } from 'next/server';
import { categories } from '@/data/categories';
import { validateAuth } from '@/lib/auth';

export async function GET() {
  return NextResponse.json(categories || [], { status: 200 });
}

export async function POST(request) {
  if (!validateAuth(request)) {
    return NextResponse.json(
      { error: "Unauthorized. Provide a valid API key in the Authorization header as: Bearer <your_key>" },
      { status: 401 }
    );
  }

  const body = await request.json();

  if (!body.id || !body.name) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  return NextResponse.json(
    {
      message: "Not Implemented. In production this would write to a database, but currently categories are bundled in the codebase.",
      receivedCategory: body
    },
    { status: 501 }
  );
}
