import admin from 'firebase-admin';
import path from 'path';
import fs from 'fs';

// Initialize Firebase Admin
try {
    if (admin.apps.length === 0) {
        if (process.env.FIREBASE_SERVICE_ACCOUNT) {
            console.log('Initializing Firebase Admin from environment variable...');
            try {
                const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
                admin.initializeApp({
                    credential: admin.credential.cert(serviceAccount)
                });
                console.log('Firebase Admin initialized successfully using environment variable.');
            } catch (jsonError) {
                console.error('Error parsing FIREBASE_SERVICE_ACCOUNT environment variable:', jsonError);
                throw jsonError;
            }
        } else {
            // Try to load the service account from the root directory
            const serviceAccountPath = path.resolve(process.cwd(), 'firebase-service-account.json');

            if (fs.existsSync(serviceAccountPath)) {
                console.log('Found service account file, initializing...');
                const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

                admin.initializeApp({
                    credential: admin.credential.cert(serviceAccount)
                });
                console.log('Firebase Admin initialized successfully using service account file.');
            } else {
                // Fallback for cloud environments with ADC
                console.log('No service account found, initializing with default credentials (ADC)...');
                admin.initializeApp();
                console.log('Firebase Admin initialized using default credentials (ADC).');
            }
        }
    } else {
        console.log('Firebase Admin already initialized.');
    }
} catch (error) {
    console.error('CRITICAL: Error initializing Firebase Admin:', error);
}

// Wrapper to prevent crashes if not properly initialized
export const getFirestore = () => {
    try {
        return admin.firestore();
    } catch (err) {
        console.error("Failed to access Firestore:", err);
        return null!;
    }
};

export const getAuth = () => {
    try {
        return admin.auth();
    } catch (err) {
        console.error("Failed to access Auth:", err);
        return null!;
    }
};

export const db = getFirestore();
export const auth = getAuth();
