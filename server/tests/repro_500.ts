import { securityService } from "../services/security.js";
import { storage } from "../storage.js";

async function runRepro() {
    console.log("Starting reproduction test...");

    try {
        // 1. Create a user
        const user = await storage.createUser({
            username: "testuser",
            password: "password123",
            tenantId: "tenant_default",
            role: "client"
        });
        console.log("User created:", user.id);

        // 2. Test MFA Setup
        try {
            console.log("Testing MFA Setup...");
            const secret = securityService.generateMfaSecret();
            await storage.updateUserMfa(user.id, { secret, enabled: false });
            console.log("MFA Setup Success");
        } catch (e: any) {
            console.error("MFA Setup Failed:", e.message);
        }

        // 3. Test Tokenization
        try {
            console.log("Testing Tokenization...");
            const token = await securityService.tokenize("test data");
            console.log("Tokenization Success:", token);
        } catch (e: any) {
            console.error("Tokenization Failed:", e.message, e.stack);
        }

        // 4. Test Compliance Status
        try {
            console.log("Testing Compliance Status...");
            const status = await securityService.getComplianceStatus(user.tenantId);
            console.log("Compliance Status Success:", status.status);
        } catch (e: any) {
            console.error("Compliance Status Failed:", e.message);
        }

        // 5. Test Privacy Update
        try {
            console.log("Testing Privacy Update...");
            await storage.updateUserConsent(user.id, { marketing: false });
            console.log("Privacy Update Success");
        } catch (e: any) {
            console.error("Privacy Update Failed:", e.message);
        }

    } catch (e: any) {
        console.error("Global Test Error:", e.message);
    }
}

runRepro();
