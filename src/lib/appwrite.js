import { Client, Databases, Users, Account } from 'node-appwrite';

export function createAdminClient() {
  const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
  const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
  const apiKey = process.env.APPWRITE_API_KEY;

  if (!projectId) {
    console.warn('Missing NEXT_PUBLIC_APPWRITE_PROJECT_ID. Appwrite database calls will fail.');
  }

  const client = new Client()
    .setEndpoint(endpoint || 'https://nyc.cloud.appwrite.io/v1')
    .setProject(projectId || 'placeholder_project_id')
    .setKey(apiKey);

  return {
    get account() { return new Account(client); },
    get databases() { return new Databases(client); },
    get users() { return new Users(client); }
  };
}
