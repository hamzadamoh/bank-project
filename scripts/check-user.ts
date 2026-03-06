
import admin from 'firebase-admin';
import path from 'path';
import fs from 'fs';

async function checkUser(email: string) {
    if (!admin.apps.length) {
        const serviceAccountPath = path.resolve(process.cwd(), 'firebase-service-account.json');
        const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
    }

    const db = admin.firestore();
    console.log(`Searching for user with email: ${email}`);

    // Search in users collection
    const snapshot = await db.collection("users").get();
    console.log(`Total users found: ${snapshot.size}`);
    snapshot.forEach(doc => {
        const data = doc.data();
        console.log(`- ID=${doc.id}, Username=${data.username}, Role=${data.role}`);
    });
}

const targetEmail = process.argv[2] || "hamzadamoh06@gmail.com";
checkUser(targetEmail).catch(console.error);
