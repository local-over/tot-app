import { Client, Databases, Query } from 'node-appwrite';

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://nyc.cloud.appwrite.io/v1')
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID)
  .setKey(process.env.APPWRITE_API_KEY);

const databases = new Databases(client);
const DB_ID = 'tot_db';

async function checkQuery() {
  try {
    const assignmentsRes = await databases.listDocuments(DB_ID, 'daily_assignments', [
      Query.equal('userId', '6a87676f0027e21ce0f9'),
      Query.limit(50)
    ]);
    console.log("Assignments success:", assignmentsRes.documents.length);
  } catch (err) {
    console.error("Feedback error:", err.message);
  }
}

checkQuery();
