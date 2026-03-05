
import { Request, Response, NextFunction } from "express";
import { storage } from "./storage.js";

// Enhanced Perimeter Security Middlewares
export const securityHeaders = (req: Request, res: Response, next: NextFunction) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://apis.google.com https://www.gstatic.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: blob: https://*.googleusercontent.com; connect-src 'self' https://api.groq.com https://api-inference.huggingface.co https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://www.googleapis.com https://*.firebaseapp.com https://*.firebaseio.com; frame-src 'self' https://bank-abe75.firebaseapp.com;");
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
    next();
};

const loginRateLimiter = new Map<string, { count: number, lastAttempt: number }>();
export const rateLimit = (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip || 'unknown';
    const now = Date.now();
    const limit = 5; // 5 attempts
    const window = 15 * 60 * 1000; // 15 minutes

    const entry = loginRateLimiter.get(ip) || { count: 0, lastAttempt: 0 };
    if (now - entry.lastAttempt > window) {
        entry.count = 0;
    }

    if (entry.count >= limit) {
        return res.status(429).json({ message: "Too many login attempts. Please try again later." });
    }

    entry.count++;
    entry.lastAttempt = now;
    loginRateLimiter.set(ip, entry);
    next();
};

// Auth & Security Middlewares
export const isAuthenticated = (req: any, res: Response, next: NextFunction) => {
    if (req.isAuthenticated && req.isAuthenticated()) {
        console.log(`[AUTH] User ${req.user?.id} (${req.user?.username}) authenticated for ${req.method} ${req.path}`);
        return next();
    }
    // Allow guest access with a default user (no DB required)
    (req as any).user = {
        id: "guest",
        username: "guest",
        tenantId: "tenant_default",
        role: "client",
        password: "",
        consentSettings: { analytics: true, marketing: false, thirdParty: false },
        mfaEnabled: false,
        mfaSecret: null
    };
    console.log(`[AUTH] Guest access for ${req.method} ${req.path}`);
    return next();
};

export const isAdmin = (req: any, res: Response, next: NextFunction) => {
    if (req.isAuthenticated && req.isAuthenticated() && (req.user as any)?.role === 'admin') return next();
    // Allow guest admin access for now (no DB)
    if ((req as any).user?.id === 'guest') return next();
    res.status(403).json({ message: "Forbidden: Admin access required" });
};

export const checkTierLimit = async (req: any, res: Response, next: NextFunction) => {
    if (!(req.isAuthenticated && req.isAuthenticated())) return next();
    const tenant = await storage.getTenant((req.user as any)!.tenantId);
    if (!tenant) return next();

    const logs = await storage.getAuditLogsByTenant((req.user as any)!.tenantId);
    if (logs.length >= parseInt(tenant.queryLimit)) {
        return res.status(403).json({
            message: "Tier limit reached",
            limit: tenant.queryLimit,
            usage: logs.length
        });
    }
    next();
};
