import { Express } from "express";
import session from "express-session";
import { storage } from "./storage.js";
import { User as SelectUser } from "../shared/schema.js";
import MemoryStore from "memorystore";
import { auth as adminAuth } from "./db.js";
import fs from 'fs';
import path from 'path';

const SessionStore = MemoryStore(session);

declare global {
    namespace Express {
        interface User extends SelectUser { }
    }
}

export function setupAuth(app: Express) {
    const sessionSettings: session.SessionOptions = {
        secret: process.env.SESSION_SECRET || "fiscai_secret_123",
        resave: false,
        saveUninitialized: false,
        store: new SessionStore({
            checkPeriod: 86400000, // prune expired entries every 24h
        }),
        cookie: {
            secure: app.get("env") === "production",
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        },
    };

    if (app.get("env") === "production") {
        app.set("trust proxy", 1);
    }

    app.use(session(sessionSettings));

    // Custom middleware to verify Firebase tokens
    const verifyToken = async (req: any, res: any, next: any) => {
        const authHeader = req.headers.authorization;
        const idToken = authHeader?.split('Bearer ')[1];

        if (!idToken) {
            console.log(`[AUTH] Unauthorized: No token provided for ${req.method} ${req.path}`);
            return res.status(401).send('Unauthorized: No token provided');
        }

        if (!adminAuth) {
            console.error('[AUTH] Critical: Firebase Admin Auth not initialized.');
            return res.status(500).send('Internal Server Error: Authentication service not initialized on server.');
        }

        try {
            const decodedToken = await adminAuth.verifyIdToken(idToken);
            const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || "hamzadamoh06@gmail.com").toLowerCase();
            const userEmail = (decodedToken.email || "").toLowerCase();

            // Debug logging to specific file
            const debugLog = `[${new Date().toISOString()}] AUTH CHECK: Email="${userEmail}", AdminEmail="${ADMIN_EMAIL}", Match=${userEmail === ADMIN_EMAIL}, UID=${decodedToken.uid}\n`;
            fs.appendFileSync(path.resolve(process.cwd(), 'admin-debug.log'), debugLog);

            let user = await storage.getUser(decodedToken.uid);

            if (!user) {
                console.log(`[AUTH] Auto-provisioning user for UID: ${decodedToken.uid}`);
                try {
                    const isBootstrapAdmin = userEmail === ADMIN_EMAIL;

                    user = await storage.createUser({
                        id: decodedToken.uid,
                        username: decodedToken.email || `user_${decodedToken.uid.substring(0, 8)}`,
                        password: "firebase_managed",
                        tenantId: "tenant_default",
                        role: isBootstrapAdmin ? "admin" : "client"
                    });
                    console.log(`[AUTH] Auto-provisioned user: ${user.username} (Role: ${user.role})`);
                } catch (provisionError: any) {
                    console.error('[AUTH] Auto-provisioning failed:', provisionError.message);
                    return res.status(500).send('Internal Server Error: Failed to create user profile.');
                }
            } else if (userEmail === ADMIN_EMAIL && user.role !== "admin") {
                console.log(`[AUTH] Promoting existing user ${user.username} to admin.`);
                if (user.id) {
                    await storage.updateUserRole(user.id, "admin");
                    user.role = "admin";
                }
            }

            if (user) {
                req.user = user;
                next();
            } else {
                res.status(401).send('Unauthorized: User profile could not be retrieved or created.');
            }
        } catch (error: any) {
            console.error('[AUTH] Token verification failed:', error.message);
            if (error.code === 'auth/id-token-expired') {
                return res.status(401).send('Unauthorized: Token expired');
            }
            res.status(401).send(`Unauthorized: ${error.message}`);
        }
    };

    // Make req.isAuthenticated available for legacy routes
    app.use((req: any, res, next) => {
        req.isAuthenticated = () => {
            return !!req.user;
        };
        next();
    });

    app.post("/api/register", async (req, res, next) => {
        try {
            console.log(`[AUTH] Register attempt for: ${req.body.username}`);
            const existingUser = await storage.getUserByUsername(req.body.username);
            if (existingUser) {
                return res.status(400).json({ message: "Username already exists" });
            }

            let tenantId = req.body.tenantId;
            if (!tenantId) {
                const tenant = await storage.createTenant({
                    name: `${req.body.username}'s Organization`,
                    region: "Morocco",
                    tier: "Starter",
                    queryLimit: "100",
                    retentionDays: "30",
                    mfaEnforced: false,
                    ssoConfig: { enabled: false, provider: "local", domain: "" }
                });
                tenantId = tenant.id;
            }

            // Create user in Firestore via storage wrapper
            const user = await storage.createUser({
                ...req.body,
                password: "firebase_managed", // We don't store passwords locally anymore
                tenantId,
                role: "client"
            });

            // If we're fully migrating, the actual account creation happens on the client via Firebase Auth,
            // and this endpoint should probably verify the token and then sync the user profile into Firestore.
            // For now, returning the created profile.
            res.status(201).json(user);
        } catch (err) {
            next(err);
        }
    });

    // In a pure Firebase setup, login is handled purely client side. 
    // This endpoint is left here to provide legacy support if the client hasn't migrated UI yet.
    app.post("/api/login", async (req, res, next) => {
        return res.status(400).json({ message: "Please use Firebase client authentication." });
    });

    app.post("/api/logout", (req: any, res, next) => {
        req.session.destroy((err: any) => {
            if (err) return next(err);
            res.sendStatus(200);
        });
    });

    app.get("/api/user", verifyToken, (req: any, res) => {
        res.json(req.user);
    });
}
