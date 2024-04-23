const admin = require('firebase-admin');

// Initialize Firebase Admin SDK with service account credentials
const serviceAccount = require('my_firebase.json'); // Path to your service account key file
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Access Firebase services (e.g., authentication, firestore, storage, etc.)
const db = admin.firestore();

// Export Firebase Admin SDK and services if needed
module.exports = { admin, auth };
