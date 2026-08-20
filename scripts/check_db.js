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
    const topics = await databases.listAttributes('tot_db', 'topics');
    console.log("Topics attributes:", topics.attributes.map(a => a.key));
    const fb = await databases.listAttributes('tot_db', 'feedback');
    console.log("Feedback attributes:", fb.attributes.map(a => a.key));
  } catch(e) {
    console.error(e.message);
  }
}
check();
