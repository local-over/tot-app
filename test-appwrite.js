import { Client, Account, ID } from 'node-appwrite';
const client = new Client()
    .setEndpoint('https://nyc.cloud.appwrite.io/v1')
    .setProject('6a859c9e000dbd956790');
const account = new Account(client);
async function test() {
    try {
        console.log("Sending email token...");
        const res = await account.createEmailToken(ID.unique(), 'hassan@test.com');
        console.log("Success:", res);
    } catch(e) {
        console.error("Error:", e.message);
    }
}
test();
