
const { Client, Databases } = require('node-appwrite');

async function init() {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

  const databases = new Databases(client);

  try {
    console.log('Creating database...');
    // We try to create the database, if it exists we catch and ignore
    let dbId = 'tot_db';
    try {
      await databases.create(dbId, 'TOT Database');
      console.log('Database created.');
    } catch (e) {
      if (e.code === 409) console.log('Database already exists.');
      else throw e;
    }

    console.log('Creating collections...');
    
    // Users collection
    try {
      await databases.createCollection(dbId, 'users', 'Users');
      await databases.createStringAttribute(dbId, 'users', 'email', 255, true);
      await databases.createStringAttribute(dbId, 'users', 'name', 255, false);
      await databases.createBooleanAttribute(dbId, 'users', 'isStudent', false, false, false);
      await databases.createStringAttribute(dbId, 'users', 'plan', 50, false, 'free');
      
      // New profile attributes
      await databases.createStringAttribute(dbId, 'users', 'categories', 50, false, null, true); // array of strings
      await databases.createStringAttribute(dbId, 'users', 'readingStyle', 50, false, '');
      await databases.createStringAttribute(dbId, 'users', 'contentVibe', 50, false, '');
      await databases.createStringAttribute(dbId, 'users', 'readingTime', 50, false, '');
      await databases.createIntegerAttribute(dbId, 'users', 'streak', false, 0, 10000, 0);
      console.log('Users collection created.');
    } catch (e) {
      if (e.code === 409) console.log('Users collection already exists.');
      else throw e;
    }

    // Topics collection
    try {
      await databases.createCollection(dbId, 'topics', 'Topics');
      await databases.createStringAttribute(dbId, 'topics', 'groupId', 100, true);
      await databases.createStringAttribute(dbId, 'topics', 'title', 255, true);
      await databases.createStringAttribute(dbId, 'topics', 'content', 10000, true);
      await databases.createStringAttribute(dbId, 'topics', 'date', 20, true); // YYYY-MM-DD
      console.log('Topics collection created.');
    } catch (e) {
      if (e.code === 409) console.log('Topics collection already exists.');
      else throw e;
    }

    // Feedback collection
    try {
      await databases.createCollection(dbId, 'feedback', 'Feedback');
      await databases.createStringAttribute(dbId, 'feedback', 'userId', 255, true);
      await databases.createStringAttribute(dbId, 'feedback', 'topicId', 255, true);
      await databases.createIntegerAttribute(dbId, 'feedback', 'rating', true, 1, 5);
      await databases.createStringAttribute(dbId, 'feedback', 'moreOrLess', 50, false);
      await databases.createStringAttribute(dbId, 'feedback', 'length', 50, false);
      console.log('Feedback collection created.');
    } catch (e) {
      if (e.code === 409) console.log('Feedback collection already exists.');
      else throw e;
    }

    console.log('Setup complete!');
  } catch (error) {
    console.error('Failed to setup Appwrite:', error);
  }
}

init();
