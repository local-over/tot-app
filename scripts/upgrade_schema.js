try { process.loadEnvFile('.env.local'); } catch(e) {}
const { Client, Databases } = require('node-appwrite');

async function upgradeSchema() {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://nyc.cloud.appwrite.io/v1')
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

  const databases = new Databases(client);
  const dbId = 'tot_db';

  console.log('Upgrading schema for users collection...');
  
  const attributes = [
    { type: 'string', key: 'categories', size: 50, required: false, array: true },
    { type: 'string', key: 'readingStyle', size: 50, required: false },
    { type: 'string', key: 'contentVibe', size: 50, required: false },
    { type: 'string', key: 'readingTime', size: 50, required: false },
    { type: 'integer', key: 'streak', required: false, min: 0, max: 10000, default: 0 },
    { type: 'boolean', key: 'gateCompleted', required: false, default: false },
    { type: 'string', key: 'studentEmail', size: 255, required: false }
  ];

  for (const attr of attributes) {
    try {
      if (attr.type === 'string') {
        await databases.createStringAttribute(dbId, 'users', attr.key, attr.size, attr.required, attr.default, attr.array);
      } else if (attr.type === 'integer') {
        await databases.createIntegerAttribute(dbId, 'users', attr.key, attr.required, attr.min, attr.max, attr.default);
      } else if (attr.type === 'boolean') {
        await databases.createBooleanAttribute(dbId, 'users', attr.key, attr.required, attr.default);
      }
      console.log(`Added attribute: ${attr.key}`);
    } catch (e) {
      if (e.code === 409) {
        console.log(`Attribute ${attr.key} already exists.`);
      } else {
        console.error(`Error adding ${attr.key}:`, e.message);
      }
    }
  }

  console.log('Schema upgrade complete.');
}

upgradeSchema().catch(console.error);
