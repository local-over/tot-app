const { Client, Account, ID } = require('appwrite');

const client = new Client()
  .setEndpoint('https://nyc.cloud.appwrite.io/v1')
  .setProject('6a859c9e000dbd956790');

const account = new Account(client);

async function test() {
  try {
    // 1. Create a normal session (simulate being logged in)
    // We can just create an anonymous session for testing
    console.log("Creating anon session...");
    await account.createAnonymousSession();
    
    // 2. Try to create an email token while logged in
    console.log("Creating email token...");
    const token = await account.createEmailToken(ID.unique(), "teststudent@mit.edu");
    console.log("Success! Token userId:", token.userId);
  } catch (err) {
    console.error("Error:", err.message);
  }
}
test();
