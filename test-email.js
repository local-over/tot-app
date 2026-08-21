import { Client, Account, ID } from 'node-appwrite';

const client = new Client()
  .setEndpoint('https://nyc.cloud.appwrite.io/v1')
  .setProject('6a859c9e000dbd956790')
  .setKey(process.env.APPWRITE_API_KEY || 'no-key-in-env');

const account = new Account(client);

async function run() {
  try {
    const token = await account.createEmailToken(ID.unique(), "test.tot.app@gmail.com");
    console.log("Token created:", token);
  } catch (e) {
    console.error("Error:", e.message);
  }
}
run();
