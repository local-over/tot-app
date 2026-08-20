import { createAdminClient } from '@/lib/appwrite-server';
import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function PUT(request) {
  try {
    const { databases, DB_ID } = createAdminClient();
    const body = await request.json();
    const { assignmentId, isMarked } = body;

    if (!assignmentId) {
      return NextResponse.json({ error: 'Missing assignmentId' }, { status: 400 });
    }

    const updated = await databases.updateDocument(DB_ID, 'daily_assignments', assignmentId, {
      isMarked: Boolean(isMarked)
    });

    return NextResponse.json({ success: true, isMarked: updated.isMarked });
  } catch (error) {
    console.error('Error marking assignment:', error);
    return NextResponse.json({ error: 'Failed to mark assignment' }, { status: 500 });
  }
}
