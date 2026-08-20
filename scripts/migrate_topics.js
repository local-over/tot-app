import { Client, Databases, ID } from 'node-appwrite';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// We have to import the topics data. Since it's ES module syntax with export const,
// we can just import it.
import { topics } from '../src/data/topics.js';

const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://nyc.cloud.appwrite.io/v1';
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
const apiKey = process.env.APPWRITE_API_KEY;

const client = new Client().setEndpoint(endpoint).setProject(projectId).setKey(apiKey);
const databases = new Databases(client);

async function migrate() {
  console.log(`Starting migration of ${topics.length} topics...`);
  
  for (const topic of topics) {
    try {
      await databases.createDocument('tot_db', 'topics', topic.id, {
        title: topic.title,
        categoryId: topic.categoryId,
        readTime: topic.readTime,
        vibe: topic.vibe,
        body: JSON.stringify(topic.body),
        closingFact: topic.closingFact || '',
        imageUrl: topic.imageUrl || '',
        resources: JSON.stringify(topic.resources || [])
      });
      console.log(`✅ Migrated: ${topic.id} - ${topic.title}`);
    } catch (e) {
      if (e.code === 409) {
        console.log(`⚠️ Skipped (already exists): ${topic.id}`);
      } else {
        console.error(`❌ Error migrating ${topic.id}:`, e.message);
      }
    }
  }
  console.log("Migration complete!");
}

migrate();
