import { storage } from "../storage.js";
import { type InsertAuditLog } from "../../shared/schema.js";
import crypto from 'crypto';

const ENCRYPTION_KEY = Buffer.from(process.env.ENCRYPTION_KEY || '6f72616e676573617265676f6f64313233343536373839303132333435363738', 'hex'); // 32 bytes for AES-256
const IV_LENGTH = 16;

/**
 * Security Service
 * Implements enterprise security features: Simulated Encryption, Audit Tracing, and Tenant Management
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
     * Fetches real residency configuration from the tenant record
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
}

export const securityService = new SecurityService();
