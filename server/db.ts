import admin from 'firebase-admin';
import path from 'path';
import fs from 'fs';

// Initialize Firebase Admin
try {
    // Try to load the service account from the root directory
    const serviceAccountPath = path.resolve(process.cwd(), 'firebase-service-account.json');

    if (fs.existsSync(serviceAccountPath)) {
        const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
        console.log('Firebase Admin initialized successfully using service account file.');
    } else {
        // Fallback if trying to initialize without a service account (e.g., in a cloud environment with ADC)
        admin.initializeApp();
        console.log('Firebase Admin initialized using default credentials.');
    }
} catch (error) {
    console.error('Error initializing Firebase Admin:', error);
}

export const db = admin.firestore();
export const auth = admin.auth();
