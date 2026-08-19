import { Client, Databases, Users, Account } from 'node-appwrite';

export function createAdminClient() {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || 'tot_project_placeholder')
    .setKey(process.env.APPWRITE_API_KEY);

  return {
    get account() { return new Account(client); },
    get databases() { return new Databases(client); },
    get users() { return new Users(client); }
  };
}
