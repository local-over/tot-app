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

async function upgradeSchema() {
  console.log("Upgrading Appwrite schema...");

  try {
    // Add teasers attribute
    try {
      await databases.createStringAttribute(DB_ID, 'topics', 'teasers', 65000, false);
      console.log('✅ Added "teasers" attribute to topics collection');
    } catch (e) {
      if (e.code === 409) {
        console.log('⚠️ "teasers" attribute already exists');
      } else {
        throw e;
      }
    }
  } catch (err) {
    console.error("❌ Error upgrading schema:", err.message);
  }
}

upgradeSchema();
