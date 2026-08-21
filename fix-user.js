import { Client, Databases, Query } from 'node-appwrite';

const client = new Client()
  .setEndpoint('https://nyc.cloud.appwrite.io/v1')
  .setProject('6a859c9e000dbd956790')
  .setKey(process.env.APPWRITE_API_KEY || 'no-key-in-env');

const databases = new Databases(client);

async function run() {
  try {
    const res = await databases.listDocuments('tot_db', 'users', [
      Query.equal('email', 'heromoheromo1998@gmail.com')
    ]);
    if (res.documents.length > 0) {
      const user = res.documents[0];
      
      const expDate = new Date();
      expDate.setDate(expDate.getDate() + 30);
      
      await databases.updateDocument('tot_db', 'users', user.$id, {
        plan: 'paid_subscription',
        plan_expires_at: expDate.toISOString(),
        dodo_subscription_id: 'sub_0NlpLZm08KLvqhRomF7KL'
      });
      console.log('User manually updated to paid_subscription');
    } else {
      console.log('User not found');
    }
  } catch (e) {
    console.error("Error:", e.message);
  }
}
run();
