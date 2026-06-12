import admin from 'firebase-admin';
import { env, features } from './env.js';

let app = null;
let db = null;
let bucket = null;

if (features.hasFirebase) {
  app = admin.initializeApp({
    credential: admin.credential.cert({
      projectId: env.firebaseProjectId,
      clientEmail: env.firebaseClientEmail,
      privateKey: env.firebasePrivateKey,
    }),
    storageBucket: env.firebaseStorageBucket || undefined,
  });
  db = admin.firestore();
  if (env.firebaseStorageBucket) {
    bucket = admin.storage().bucket();
  }
}

export { admin, app, db, bucket };
