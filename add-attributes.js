import { Client, Databases } from 'node-appwrite';

const client = new Client()
  .setEndpoint('https://nyc.cloud.appwrite.io/v1')
  .setProject('6a859c9e000dbd956790')
  .setKey(process.env.APPWRITE_API_KEY || 'no-key-in-env');

const databases = new Databases(client);

async function run() {
  try {
    await databases.createDatetimeAttribute('tot_db', 'users', 'plan_expires_at', false);
    console.log('Created plan_expires_at');
  } catch (e) { console.log(e.message); }
  
  try {
    await databases.createStringAttribute('tot_db', 'users', 'dodo_subscription_id', 255, false);
    console.log('Created dodo_subscription_id');
  } catch (e) { console.log(e.message); }
}
run();
