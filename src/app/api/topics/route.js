export const runtime = 'edge';
import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/appwrite-server';
import { validateAuth } from '@/lib/auth';
import { Query, ID } from 'appwrite';

const DB_ID = 'tot_db';
const COLLECTION_ID = 'topics';

export async function GET(request) {
  if (!validateAuth(request)) {
    return NextResponse.json(
      { error: "Unauthorized. Provide a valid API key in the Authorization header as: Bearer <your_key>" },
      { status: 401 }
    );
  }

  const { searchParams } = request.nextUrl;
  const category = searchParams.get('category');
  const vibe = searchParams.get('vibe');
  const includeStats = searchParams.get('includeStats') === 'true';

  try {
    const { databases } = createAdminClient();
    const queries = [];
    if (category) queries.push(Query.equal('categoryId', category));
    if (vibe) queries.push(Query.equal('vibe', vibe));
    // Fetch all topics (limit up to 1000 for now)
    queries.push(Query.limit(1000));

    const response = await databases.listDocuments(DB_ID, COLLECTION_ID, queries);
    
    let feedbackDocs = [];
    if (includeStats) {
      try {
        const feedbackResponse = await databases.listDocuments(DB_ID, 'feedback', [Query.limit(5000)]);
        feedbackDocs = feedbackResponse.documents;
      } catch (err) {
        console.warn("Could not fetch feedback stats", err);
      }
    }

    // Parse JSON fields and map $id to id
    const parsedTopics = response.documents.map(doc => {
      const topic = {
        ...doc,
        id: doc.$id,
        body: JSON.parse(doc.body || '[]'),
        resources: doc.resources ? JSON.parse(doc.resources) : [],
        teasers: doc.teasers ? JSON.parse(doc.teasers) : []
      };

      if (includeStats) {
        const tf = feedbackDocs.filter(f => f.topicId === doc.$id);
        topic.stats = {
          feedbackCount: tf.length,
          avgRating: tf.length ? parseFloat((tf.reduce((a, b) => a + (b.rating || 0), 0) / tf.length).toFixed(1)) : 0,
          tooLongCount: tf.filter(f => f.length === 'long').length,
          tooShortCount: tf.filter(f => f.length === 'short').length,
          wantMoreCount: tf.filter(f => f.moreOrLess === 'more').length,
          wantLessCount: tf.filter(f => f.moreOrLess === 'less').length,
        };
      }

      return topic;
    });

    return NextResponse.json(parsedTopics, { status: 200 });
  } catch (error) {
    console.error('Error fetching topics:', error);
    return NextResponse.json({ error: 'Failed to fetch topics' }, { status: 500 });
  }
}

export async function POST(request) {
  if (!validateAuth(request)) {
    return NextResponse.json(
      { error: "Unauthorized. Provide a valid API key in the Authorization header as: Bearer <your_key>" },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();

    if (!body.categoryId || !body.title || !body.body) {
      return NextResponse.json({ error: "Missing required fields (categoryId, title, body)" }, { status: 400 });
    }

    const { databases } = createAdminClient();
    const docId = body.id || ID.unique();

    const data = {
      title: body.title,
      categoryId: body.categoryId,
      readTime: body.readTime || 3,
      vibe: body.vibe || 'mix',
      body: JSON.stringify(body.body),
      closingFact: body.closingFact || '',
      imageUrl: body.imageUrl || '',
      resources: JSON.stringify(body.resources || []),
      teasers: JSON.stringify(body.teasers || [])
    };

    const result = await databases.createDocument(DB_ID, COLLECTION_ID, docId, data);

    return NextResponse.json({ success: true, topic: result }, { status: 201 });
  } catch (error) {
    console.error('Error creating topic:', error);
    return NextResponse.json({ error: 'Failed to create topic' }, { status: 500 });
  }
}
