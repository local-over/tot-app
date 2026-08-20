import { Client, Databases } from 'node-appwrite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://nyc.cloud.appwrite.io/v1';
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
const apiKey = process.env.APPWRITE_API_KEY;

if (!projectId || !apiKey) {
  console.error("Missing APPWRITE variables in .env.local");
  process.exit(1);
}

const client = new Client()
  .setEndpoint(endpoint)
  .setProject(projectId)
  .setKey(apiKey);

const databases = new Databases(client);
const DB_ID = 'tot_db';

async function createSchema() {
  console.log("Initializing Appwrite schema...");

  try {
    // We assume tot_db already exists since users are stored there.
    // Topics Collection
    try {
      await databases.createCollection(DB_ID, 'topics', 'Topics');
      console.log('✅ Created "topics" collection');
      
      await databases.createStringAttribute(DB_ID, 'topics', 'title', 255, true);
      await databases.createStringAttribute(DB_ID, 'topics', 'categoryId', 255, true);
      await databases.createIntegerAttribute(DB_ID, 'topics', 'readTime', true);
      await databases.createStringAttribute(DB_ID, 'topics', 'vibe', 50, true);
      await databases.createStringAttribute(DB_ID, 'topics', 'body', 65000, true); // JSON array of paragraphs
      await databases.createStringAttribute(DB_ID, 'topics', 'closingFact', 5000, false);
      await databases.createStringAttribute(DB_ID, 'topics', 'imageUrl', 2000, false);
      await databases.createStringAttribute(DB_ID, 'topics', 'resources', 65000, false); // JSON array of urls
    } catch (e) {
      if (e.code === 409) console.log('⚠️ "topics" collection already exists');
      else throw e;
    }

    // Daily Assignments Collection
    try {
      await databases.createCollection(DB_ID, 'daily_assignments', 'Daily Assignments');
      console.log('✅ Created "daily_assignments" collection');
      
      await databases.createStringAttribute(DB_ID, 'daily_assignments', 'userId', 255, true);
      await databases.createStringAttribute(DB_ID, 'daily_assignments', 'topicId', 255, true);
      await databases.createStringAttribute(DB_ID, 'daily_assignments', 'date', 20, true); // YYYY-MM-DD
    } catch (e) {
      if (e.code === 409) console.log('⚠️ "daily_assignments" collection already exists');
      else throw e;
    }

    // Feedback Collection
    try {
      await databases.createCollection(DB_ID, 'feedback', 'Feedback');
      console.log('✅ Created "feedback" collection');
      
      await databases.createStringAttribute(DB_ID, 'feedback', 'userId', 255, true);
      await databases.createStringAttribute(DB_ID, 'feedback', 'topicId', 255, true);
      await databases.createIntegerAttribute(DB_ID, 'feedback', 'rating', false);
      await databases.createStringAttribute(DB_ID, 'feedback', 'moreOrLess', 50, false);
      await databases.createStringAttribute(DB_ID, 'feedback', 'length', 50, false);
    } catch (e) {
      if (e.code === 409) console.log('⚠️ "feedback" collection already exists');
      else throw e;
    }

    console.log("🎉 Schema initialization complete! Please wait a few moments for the attributes to become available.");
  } catch (err) {
    console.error("❌ Error initializing schema:", err.message);
  }
}

createSchema();
