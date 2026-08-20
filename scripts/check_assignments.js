import { Client, Databases } from 'node-appwrite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://nyc.cloud.appwrite.io/v1';
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
const apiKey = process.env.APPWRITE_API_KEY;

const client = new Client().setEndpoint(endpoint).setProject(projectId).setKey(apiKey);
const databases = new Databases(client);

async function check() {
  try {
    const assignments = await databases.listDocuments('tot_db', 'daily_assignments');
    console.log("Daily Assignments:", assignments.documents);
  } catch(e) {
    console.error(e.message);
  }
}
check();
