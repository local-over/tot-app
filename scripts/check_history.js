import { Client, Databases, Query } from 'node-appwrite';

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://nyc.cloud.appwrite.io/v1')
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID)
  .setKey(process.env.APPWRITE_API_KEY);

const databases = new Databases(client);
const DB_ID = 'tot_db';

async function checkData() {
  const usersRes = await databases.listDocuments(DB_ID, 'users', [Query.limit(5)]);
  console.log("Users:", usersRes.documents.map(u => ({ id: u.$id, email: u.email })));

  if (usersRes.documents.length >= 0) {
    const assignmentsRes = await databases.listDocuments(DB_ID, 'daily_assignments', [Query.limit(50)]);
    console.log("Distinct Assignment UserIds:", [...new Set(assignmentsRes.documents.map(a => a.userId))]);

    const feedbackRes = await databases.listDocuments(DB_ID, 'feedback', [Query.limit(50)]);
    console.log("Distinct Feedback UserIds:", [...new Set(feedbackRes.documents.map(f => f.userId))]);
  }
}

checkData();
