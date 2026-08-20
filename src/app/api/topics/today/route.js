export const runtime = 'edge';
import { NextResponse } from 'next/server';
import { getRecommendation } from '@/lib/recommend';
import { topics } from '@/data/topics';

export async function GET(request) {
  const { searchParams } = request.nextUrl;
  const userId = searchParams.get('userId');
  const categoriesParam = searchParams.get('categories');
  const readingStyle = searchParams.get('readingStyle');

  let userPreferences = { categories: [] };
  if (categoriesParam) {
    userPreferences.categories = categoriesParam.split(',');
  }
  if (readingStyle) {
    userPreferences.readingStyle = readingStyle;
  }
  if (userId) {
    userPreferences.userId = userId;
  }

  try {
    const recommendedTopic = getRecommendation(userPreferences, []);
    return NextResponse.json(recommendedTopic, { status: 200 });
  } catch (error) {
    // If getRecommendation is missing or fails
    const fallbackTopic = topics ? topics[0] : null;
    return NextResponse.json(fallbackTopic, { status: 200 });
  }
}
