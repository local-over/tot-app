export const runtime = 'edge';
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    version: process.env.CF_PAGES_COMMIT_SHA || process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA || 'dev-' + Date.now()
  });
}
