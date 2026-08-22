import { Client, Databases, Query } from 'node-appwrite';

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://nyc.cloud.appwrite.io/v1')
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID)
  .setKey(process.env.APPWRITE_API_KEY);

const databases = new Databases(client);
const DB_ID = 'tot_db';

const OLD_USER_ID = '6a8605c633fc4333a606';
const NEW_USER_ID = '6a87676f0027e21ce0f9';

async function migrate() {
  console.log(`Migrating history from ${OLD_USER_ID} to ${NEW_USER_ID}...`);

  try {
    // 1. Migrate daily_assignments
    const assignmentsRes = await databases.listDocuments(DB_ID, 'daily_assignments', [
      Query.equal('userId', OLD_USER_ID),
      Query.limit(500)
    ]);
    
    console.log(`Found ${assignmentsRes.documents.length} assignments to migrate.`);
    for (const doc of assignmentsRes.documents) {
      await databases.updateDocument(DB_ID, 'daily_assignments', doc.$id, {
        userId: NEW_USER_ID
      });
      console.log(`Updated assignment ${doc.$id}`);
    }

    // 2. Migrate feedback
    const feedbackRes = await databases.listDocuments(DB_ID, 'feedback', [
      Query.equal('userId', OLD_USER_ID),
      Query.limit(500)
    ]);

    console.log(`Found ${feedbackRes.documents.length} feedback items to migrate.`);
    for (const doc of feedbackRes.documents) {
      await databases.updateDocument(DB_ID, 'feedback', doc.$id, {
        userId: NEW_USER_ID
      });
      console.log(`Updated feedback ${doc.$id}`);
    }

    console.log("Migration complete!");

  } catch (err) {
    console.error("Migration failed:", err);
  }
}

migrate();
