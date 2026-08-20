import { Client, Databases } from 'node-appwrite';

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

async function run() {
  try {
    await databases.createBooleanAttribute(DB_ID, 'daily_assignments', 'isMarked', false, false);
    console.log("✅ Added isMarked boolean to daily_assignments");
  } catch (err) {
    if (err.code === 409) {
      console.log("⚠️ isMarked attribute already exists");
    } else {
      console.error("❌ Error:", err.message);
    }
  }
}

run();
