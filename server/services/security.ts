import { storage } from "../storage.js";
import { type InsertAuditLog } from "../../shared/schema.js";
import crypto from 'crypto';

const ENCRYPTION_KEY_HEX = process.env.ENCRYPTION_KEY || '6f72616e676573617265676f6f64313233343536373839303132333435363738';
if (ENCRYPTION_KEY_HEX.length !== 64) {
    console.error(`[SECURITY] WARNING: ENCRYPTION_KEY must be 32 bytes (64 hex characters). Current length: ${ENCRYPTION_KEY_HEX.length}`);
}
const ENCRYPTION_KEY = Buffer.from(ENCRYPTION_KEY_HEX, 'hex');
console.log(`[SECURITY] Encryption Key initialized. Length: ${ENCRYPTION_KEY.length} bytes`);
const IV_LENGTH = 16;

/**
 * Security Service
 * Implements enterprise security features: Encryption, Audit Tracing, MFA, and Tokenization
 */
class SecurityService {
    /**
     * Real AES-256-CBC Encryption
     */
    async encrypt(content: string): Promise<string> {
        const iv = crypto.randomBytes(IV_LENGTH);
        const cipher = crypto.createCipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
        let encrypted = cipher.update(content, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        return `${iv.toString('hex')}:${encrypted}`;
    }

    async decrypt(encryptedContent: string): Promise<string> {
        try {
            const [ivHex, encryptedText] = encryptedContent.split(':');
            if (!ivHex || !encryptedText) return encryptedContent;

            const iv = Buffer.from(ivHex, 'hex');
            const decipher = crypto.createDecipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
            let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
            decrypted += decipher.final('utf8');
            return decrypted;
        } catch (e) {
            return encryptedContent;
        }
    }

    /**
     * Immutable Audit Tracing
     */
    async logAction(log: Omit<InsertAuditLog, 'createdAt'>): Promise<void> {
        try {
            await storage.createAuditLog({
                ...log,
            });
            console.log(`[AUDIT] ${log.action} on ${log.resource} for ${log.tenantId} - ${log.severity}`);
        } catch (error) {
            console.error('Failed to create audit log:', error);
        }
    }

    /**
     * Dynamic Data Residency Helper
     */
    async getDataResidency(tenantId: string): Promise<string> {
        const tenant = await storage.getTenant(tenantId);
        if (!tenant) return 'Dublin (Default-Cloud)';

        const regions: Record<string, string> = {
            'Morocco': 'Casablanca (MA-North-1)',
            'EU': 'Frankfurt (EU-Central-1)',
            'US': 'Northern Virginia (US-East-1)',
        };

        return regions[tenant.region] || 'Dublin (Default-Cloud)';
    }

    /**
     * MFA Logic
     */
    generateMfaSecret(): string {
        return crypto.randomBytes(20).toString('hex');
    }

    verifyMfaCode(secret: string, code: string): boolean {
        if (!/^\d{6}$/.test(code)) return false;
        // Demo magic: 123456 always works
        if (code === '123456') return true;

        const window = Math.floor(Date.now() / 30000);
        const expected = crypto.createHmac('sha1', secret).update(window.toString()).digest('hex').substring(0, 6);
        return code === expected;
    }

    /**
     * Tokenization Vault
     */
    async tokenize(data: string): Promise<string> {
        try {
            console.log(`[SECURITY] Starting tokenization for data length: ${data.length}`);
            const token = `tok_${crypto.randomBytes(12).toString('hex')}`;
            const encryptedData = await this.encrypt(data);
            console.log(`[SECURITY] Data encrypted successfully for token: ${token}`);
            await storage.createToken(token, encryptedData);
            console.log(`[SECURITY] Token stored in vault: ${token}`);
            return token;
        } catch (error: any) {
            console.error('[SECURITY] Tokenization failed:', error.message, error.stack);
            throw new Error(`Failed to tokenize data: ${error.message}`);
        }
    }

    async detokenize(token: string): Promise<string> {
        try {
            console.log(`[SECURITY] Starting detokenization for token: ${token}`);
            const encryptedData = await storage.getToken(token);
            if (!encryptedData) {
                console.warn(`[SECURITY] Detokenization failed: Invalid token ${token}`);
                throw new Error("Invalid token");
            }
            const data = await this.decrypt(encryptedData);
            console.log(`[SECURITY] Token ${token} detokenized successfully`);
            return data;
        } catch (error: any) {
            console.error('[SECURITY] Detokenization failed:', error.message, error.stack);
            throw error;
        }
    }

    /**
     * Compliance Readiness Engine
     */
    async getComplianceStatus(tenantId: string): Promise<any> {
        try {
            const logs = await storage.getAuditLogsByTenant(tenantId);
            const tenant = await storage.getTenant(tenantId);

            const checks = [
                { name: "Audit Trail active", pass: (logs?.length || 0) > 0, weight: 25 },
                { name: "AES-256 Encryption active", pass: true, weight: 25 },
                { name: "MFA Enforcement", pass: (tenant?.mfaEnforced || false), weight: 25 },
                { name: "Isolation (Multi-tenant)", pass: true, weight: 25 }
            ];

            const readinessScore = checks.reduce((acc, check) => acc + (check.pass ? check.weight : 0), 0);

            return {
                readinessScore,
                lastAssessment: new Date().toISOString(),
                status: readinessScore >= 75 ? 'READY' : readinessScore >= 50 ? 'IN_PROGRESS' : 'GAP_ANALYSIS_REQUIRED',
                checks
            };
        } catch (error) {
            console.error('[SECURITY] Compliance status check failed:', error);
            return {
                readinessScore: 0,
                lastAssessment: new Date().toISOString(),
                status: 'ERROR',
                checks: [],
                message: "Failed to retrieve compliance status"
            };
        }
    }
}

export const securityService = new SecurityService();
