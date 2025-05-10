const admin = require('firebase-admin');
require('dotenv').config();

// Initialize Firebase Admin SDK
const initializeFirebase = () => {
  try {
    if (admin.apps.length === 0) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          // Handle newline characters in private key
          privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
        }),
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET
      });
      
      console.log('✅ Firebase initialized successfully...');
    }
    return {
      db: admin.firestore(),
      auth: admin.auth(),
      storage: admin.storage(),
      admin // Export admin for additional functionality
    };
  } catch (error) {
    console.error(`❌ Firebase initialization error: ${error.message}`);
    // In production, consider a more graceful error handling approach
    throw new Error(`Firebase initialization failed: ${error.message}`);
  }
};

module.exports = initializeFirebase;