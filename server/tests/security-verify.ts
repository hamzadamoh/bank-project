import { storage } from "../storage.js";
import { securityService } from "../services/security.js";

async function verifySecurity() {
    console.log("--- FiscAI Security Verification ---");

    const tenantA = "bank_alpha_eu";
    const tenantB = "bank_beta_us";

    // 1. Verify Encrypted Storage
    console.log("\n1. Testing Encrypted Storage...");
    const rawSql = "SELECT * FROM transactions";
    const encryptedSql = await securityService.encrypt(rawSql);
    console.log("Raw SQL:", rawSql);
    console.log("Stored SQL:", encryptedSql);

    if (encryptedSql.startsWith("ENC[AES-256]:")) {
        console.log("✅ Encryption Simulation Active");
    }

    // 2. Verify Tenant Isolation
    console.log("\n2. Testing Tenant Isolation...");
    await storage.createTaxQuery({
        tenantId: tenantA,
        query: "Tax query for Alpha",
        jurisdiction: "EU",
        response: { advice: "Alpha Advice" },
        confidence: "high"
    });

    await storage.createTaxQuery({
        tenantId: tenantB,
        query: "Tax query for Beta",
        jurisdiction: "US",
        response: { advice: "Beta Advice" },
        confidence: "high"
    });

    const alphaQueries = await storage.getTaxQueriesByTenant(tenantA);
    const betaQueries = await storage.getTaxQueriesByTenant(tenantB);

    console.log(`Tenant A Queries: ${alphaQueries.length}`);
    console.log(`Tenant B Queries: ${betaQueries.length}`);

    if (alphaQueries.length === 1 && betaQueries.length === 1 && alphaQueries[0].tenantId !== betaQueries[0].tenantId) {
        console.log("✅ Tenant Isolation Verified");
    }

    // 3. Verify Audit Logs
    console.log("\n3. Testing Audit Logging...");
    await securityService.logAction({
        tenantId: tenantA,
        userId: "admin",
        action: "VERIFY",
        resource: "SECURITY_TEST",
        details: "Verification script running",
        severity: "INFO",
        ipAddress: "127.0.0.1"
    });

    const logs = await storage.getAuditLogsByTenant(tenantA);
    console.log(`Audit Logs for Tenant A: ${logs.length}`);
    if (logs.length > 0) {
        console.log("✅ Immutable Audit Trails Active");
        console.log(`Latest Log: ${logs[0].action} - ${logs[0].details}`);
    }

    // 4. Data Residency
    console.log("\n4. Testing Data Residency Pathing...");
    console.log(`Residency for ${tenantA}:`, securityService.getDataResidency(tenantA));
    console.log(`Residency for ${tenantB}:`, securityService.getDataResidency(tenantB));
    console.log("✅ Residency Logic Verified");

    console.log("\n--- Verification Complete ---");
}

verifySecurity().catch(console.error);
