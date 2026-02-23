
import { Request, Response, NextFunction } from "express";
import { storage } from "./storage.js";

// Enhanced Perimeter Security Middlewares
export const securityHeaders = (req: Request, res: Response, next: NextFunction) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; connect-src 'self' https://api.groq.com https://api-inference.huggingface.co;");
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
export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    if (req.isAuthenticated()) return next();
    res.status(401).json({ message: "Unauthorized" });
};

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
    if (req.isAuthenticated() && (req.user as any)?.role === 'admin') return next();
    res.status(403).json({ message: "Forbidden: Admin access required" });
};

export const checkTierLimit = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.isAuthenticated()) return next();
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
