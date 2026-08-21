import { Client, Account, ID } from 'node-appwrite';

const client = new Client()
  .setEndpoint('https://nyc.cloud.appwrite.io/v1')
  .setProject('6a859c9e000dbd956790')
  .setKey(process.env.APPWRITE_API_KEY || 'no-key-in-env');

const account = new Account(client);

async function run() {
  try {
    const session = await account.createSession('6a8837b10016698595e5', '361550');
    console.log("Session created:", session);
  } catch (e) {
    console.error("Error:", e.message);
  }
}
run();
