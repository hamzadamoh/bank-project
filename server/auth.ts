import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express } from "express";
import session from "express-session";
import { storage } from "./storage.js";
import { User as SelectUser } from "../shared/schema.js";
import crypto from "crypto";
import MemoryStore from "memorystore";

const SessionStore = MemoryStore(session);

declare global {
    namespace Express {
        interface User extends SelectUser { }
    }
}

// Password hashing helper
function hashPassword(password: string): string {
    const salt = crypto.randomBytes(16).toString("hex");
    const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
    return `${salt}:${hash}`;
}

function comparePasswords(password: string, storedHash: string): boolean {
    const [salt, hash] = storedHash.split(":");
    const currentHash = crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
    return hash === currentHash;
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
    app.use(passport.initialize());
    app.use(passport.session());

    passport.use(
        new LocalStrategy(async (username, password, done) => {
            try {
                const user = await storage.getUserByUsername(username);
                if (!user || !comparePasswords(password, user.password)) {
                    return done(null, false, { message: "Invalid username or password" });
                }
                return done(null, user);
            } catch (err) {
                return done(err);
            }
        }),
    );

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(async (id: string, done) => {
        try {
            const user = await storage.getUser(id);
            done(null, user);
        } catch (err) {
            done(err);
        }
    });

    app.post("/api/register", async (req, res, next) => {
        try {
            const existingUser = await storage.getUserByUsername(req.body.username);
            if (existingUser) {
                return res.status(400).json({ message: "Username already exists" });
            }

            // Automatically create a tenant for new registrations if not specified
            let tenantId = req.body.tenantId;
            if (!tenantId) {
                const tenant = await storage.createTenant({
                    name: `${req.body.username}'s Organization`,
                    region: "Morocco",
                    tier: "Starter",
                    queryLimit: "100"
                });
                tenantId = tenant.id;
            }

            const user = await storage.createUser({
                ...req.body,
                password: hashPassword(req.body.password),
                tenantId,
                role: "client"
            });

            req.login(user, (err) => {
                if (err) return next(err);
                res.status(201).json(user);
            });
        } catch (err) {
            next(err);
        }
    });

    app.post("/api/login", (req, res, next) => {
        passport.authenticate("local", (err: any, user: Express.User, info: any) => {
            if (err) return next(err);
            if (!user) return res.status(401).json(info);
            req.login(user, (err) => {
                if (err) return next(err);
                res.json(user);
            });
        })(req, res, next);
    });

    app.post("/api/logout", (req, res, next) => {
        req.logout((err) => {
            if (err) return next(err);
            res.sendStatus(200);
        });
    });

    app.get("/api/user", (req, res) => {
        if (!req.isAuthenticated()) return res.sendStatus(401);
        res.json(req.user);
    });
}
