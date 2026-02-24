import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage.js";
import {
  insertDemoRequestSchema,
  insertContactSubmissionSchema,
  insertTaxQuerySchema,
  insertSqlQuerySchema,
  insertDocumentAnalysisSchema,
  insertWaitlistSchema,
  insertOrderSchema
} from "../shared/schema.js";
import { z } from "zod";
// Import all services statically to ensure they're bundled
import { getTaxAdvice } from "./services/tax-counsel.js";
import { convertQuery } from "./services/query-architect.js";
import { analyzeDocument } from "./services/factoring-guardian.js";
import { assessSkills } from "./services/skillarcade.js";
import { chat, transcribeAudioWithGroq } from "./services/omniserve.js";
import { analyzeWellbeing } from "./services/rhalia.js";
import { analyzeSatisfaction } from "./services/satisfai.js";
import multer from "multer";
import { securityService } from "./services/security.js";
import { financialAssessor } from "./services/financial-assessor.js";

// Configure multer for memory storage
const upload = multer({ storage: multer.memoryStorage() });

import {
  securityHeaders,
  rateLimit,
  isAuthenticated,
  isAdmin,
  checkTierLimit
} from "./middleware.js";

export async function registerRoutes(app: Express): Promise<Server> {

  // --- MFA Routes ---
  app.post("/api/mfa/setup", isAuthenticated, async (req, res) => {
    try {
      console.log(`[API] Starting MFA Setup for user: ${req.user!.username}`);
      const secret = securityService.generateMfaSecret();
      await storage.updateUserMfa(req.user!.id, { secret, enabled: false });

      const qrCodeUrl = `otpauth://totp/FiscAI:${req.user!.username}?secret=${secret}&issuer=FiscAI`;
      console.log(`[API] MFA Secret generated successfully for: ${req.user!.username}`);

      res.json({
        success: true,
        secret,
        qrCode: qrCodeUrl
      });
    } catch (error) {
      console.error("[API] MFA Setup Error:", error);
      res.status(500).json({ success: false, message: "Failed to setup MFA" });
    }
  });

  app.post("/api/mfa/verify", isAuthenticated, async (req, res) => {
    try {
      const { code } = req.body;
      const user = await storage.getUser(req.user!.id);
      if (!user?.mfaSecret) return res.status(400).json({ success: false, message: "MFA not set up" });

      const isValid = securityService.verifyMfaCode(user.mfaSecret, code);
      if (isValid) {
        await storage.updateUserMfa(req.user!.id, { enabled: true });
        res.json({ success: true, message: "MFA verified and enabled" });
      } else {
        res.status(400).json({ success: false, message: "Invalid MFA code" });
      }
    } catch (error) {
      console.error("[API] MFA Verify Error:", error);
      res.status(500).json({ success: false, message: "Failed to verify MFA" });
    }
  });

  // --- Tokenization Routes ---
  app.post("/api/security/tokenize", isAuthenticated, async (req, res) => {
    try {
      const { data } = req.body;
      if (!data) return res.status(400).json({ success: false, message: "Data is required" });

      if (!req.user) {
        console.error("[API] Tokenize Error: No user in request");
        return res.status(401).json({ success: false, message: "Authentication required" });
      }

      console.log(`[API] Tokenizing data for user: ${req.user.username}`);
      const token = await securityService.tokenize(data);
      res.json({ success: true, token });
    } catch (error: any) {
      console.error("[API] Tokenize Error:", error.message, error.stack);
      res.status(500).json({ success: false, message: error.message || "Internal server error" });
    }
  });

  app.post("/api/security/detokenize", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const { token } = req.body;
      if (!token) return res.status(400).json({ success: false, message: "Token is required" });
      const data = await securityService.detokenize(token);
      res.json({ success: true, data });
    } catch (error: any) {
      console.error("[API] Detokenize Error:", error.message, error.stack);
      res.status(error.message === "Invalid token" ? 404 : 500).json({ success: false, message: error.message });
    }
  });

  // --- Compliance & Monitoring ---
  app.get("/api/security/compliance-status", isAuthenticated, async (req, res) => {
    try {
      const status = await securityService.getComplianceStatus(req.user!.tenantId);
      res.json({ success: true, ...status });
    } catch (error) {
      console.error("[API] Compliance Status Error:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  });

  // --- Simulated SSO Routes ---
  app.post("/api/auth/sso/login", async (req, res) => {
    const { domain } = req.body;
    // Simulation: redirect to provider
    res.json({
      success: true,
      redirectUrl: `/api/auth/sso/callback?domain=${domain}&token=sim_sso_${Math.random().toString(36).substring(7)}`
    });
  });

  app.get("/api/auth/sso/callback", async (req, res) => {
    const { domain, token } = req.query;
    // In simulation, we just find a user from that "domain" or create one
    const username = `sso_user_${domain}@enterprise.com`;
    let user = await storage.getUserByUsername(username);

    if (!user) {
      user = await storage.createUser({
        username,
        password: "sso_managed_password",
        tenantId: "tenant_enterprise_sim", // Should ideally find by domain
        role: "client"
      });
    }

    req.login(user, (err) => {
      if (err) return res.redirect("/login?error=sso_failed");
      res.redirect("/dashboard");
    });
  });

  // Demo request endpoint (Public-ish)
  app.post("/api/demo-requests", async (req, res) => {
    try {
      const validatedData = insertDemoRequestSchema.parse(req.body);
      const demoRequest = await storage.createDemoRequest(validatedData);
      res.json({ success: true, id: demoRequest.id });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ success: false, message: "Invalid request data", errors: error.errors });
      } else {
        res.status(500).json({ success: false, message: "Internal server error" });
      }
    }
  });

  // Contact submission endpoint
  app.post("/api/contact", async (req, res) => {
    try {
      const validatedData = insertContactSubmissionSchema.parse(req.body);
      const contact = await storage.createContactSubmission(validatedData);
      res.json({ success: true, id: contact.id });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ success: false, message: "Invalid request data", errors: error.errors });
      } else {
        res.status(500).json({ success: false, message: "Internal server error" });
      }
    }
  });

  // Tax counsel query endpoint
  app.post("/api/tax-queries", isAuthenticated, checkTierLimit, async (req, res) => {
    try {
      const { query, jurisdiction } = req.body;
      const tenantId = req.user!.tenantId;
      const tenant = await storage.getTenant(tenantId);
      const provider = (tenant?.aiProvider as 'cloud' | 'local') || 'cloud';

      if (!query || !jurisdiction) {
        return res.status(400).json({ success: false, message: "Query and jurisdiction are required" });
      }

      console.log(`[TAX-QUERY] Starting analysis for jurisdiction: ${jurisdiction}`);
      const taxResponse = await getTaxAdvice({ query, jurisdiction }, { provider });
      console.log(`[TAX-QUERY] Service returned results with confidence: ${taxResponse.confidence}`);

      // Audit Logging
      await securityService.logAction({
        tenantId,
        userId: req.user!.id,
        action: 'QUERY',
        resource: 'TAX_COUNSEL',
        details: `Complex tax query processed for jurisdiction: ${jurisdiction}`,
        severity: 'INFO',
        ipAddress: req.ip
      });

      console.log(`[TAX-QUERY] Finalizing record in storage...`);
      const taxQuery = await storage.createTaxQuery({
        tenantId,
        query,
        jurisdiction,
        response: taxResponse,
        confidence: (taxResponse.confidence || 0) >= 80 ? "high" : (taxResponse.confidence || 0) >= 60 ? "medium" : "low"
      });

      res.json({ success: true, id: taxQuery.id, response: taxResponse });
    } catch (error: any) {
      console.error("[TAX-QUERY] CRITICAL FAILURE:", error.message);
      res.status(500).json({
        success: false,
        message: error.message || "Internal server error",
        error: error.message,
        debug: {
          user: req.user ? { id: req.user.id, tenantId: req.user.tenantId } : null,
          stack: error.stack?.substring(0, 500)
        }
      });
    }
  });

  // SQL query conversion endpoint
  app.post("/api/sql-queries", isAuthenticated, checkTierLimit, async (req, res) => {
    try {
      const { type, input } = req.body;
      const tenantId = req.user!.tenantId;
      const tenant = await storage.getTenant(tenantId);
      const provider = (tenant?.aiProvider as 'cloud' | 'local') || 'cloud';

      if (!type || !input) {
        return res.status(400).json({ success: false, message: "Type and input are required" });
      }

      const conversionResult = await convertQuery({ type, input }, { provider });

      // Audit Logging
      await securityService.logAction({
        tenantId,
        userId: req.user!.id,
        action: 'QUERY',
        resource: 'QUERY_ARCHITECT',
        details: `SQL conversion: ${type}`,
        severity: 'INFO',
        ipAddress: req.ip
      });

      const sqlQuery = await storage.createSqlQuery({
        tenantId,
        type,
        input,
        output: await securityService.encrypt(conversionResult.output),
        metadata: conversionResult.metadata
      });

      res.json({ success: true, id: sqlQuery.id, output: conversionResult.output, metadata: conversionResult.metadata });
    } catch (error) {
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  });

  // Document analysis endpoint
  app.post("/api/document-analysis", isAuthenticated, checkTierLimit, async (req, res) => {
    try {
      const { filename, fileContent, fileType } = req.body;
      const tenantId = req.user!.tenantId;
      const tenant = await storage.getTenant(tenantId);
      const provider = (tenant?.aiProvider as 'cloud' | 'local') || 'cloud';

      const analysisResult = await analyzeDocument({
        filename: filename || 'uploaded_document',
        fileContent: fileContent ? Buffer.from(fileContent, 'base64') : undefined,
        fileType
      }, { provider });

      // Audit Logging
      await securityService.logAction({
        tenantId,
        userId: req.user!.id,
        action: 'QUERY',
        resource: 'FACTORING_GUARDIAN',
        details: `Document analysis completed for: ${filename}`,
        severity: analysisResult.decision === 'REJECTED' ? 'CRITICAL' : 'INFO',
        ipAddress: req.ip
      });

      const analysis = await storage.createDocumentAnalysis({
        tenantId,
        filename: filename || 'uploaded_document',
        extractedData: analysisResult.extractedData,
        anomalies: analysisResult.anomalies,
        decision: analysisResult.decision,
        confidence: analysisResult.confidence >= 80 ? "high" : analysisResult.confidence >= 60 ? "medium" : "low"
      });

      res.json({ success: true, id: analysis.id, ...analysisResult });
    } catch (error) {
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  });

  // SkillArcade assessment endpoint
  app.post("/api/skill-assessments", async (req, res) => {
    try {
      const { category, responses } = req.body;
      const tenantId = (req as any).tenantId || req.user?.tenantId || 'tenant_default';
      const tenant = await storage.getTenant(tenantId);
      const provider = (tenant?.aiProvider as 'cloud' | 'local') || 'cloud';

      const assessment = await assessSkills({ category, responses }, { provider });

      // Audit Logging
      await securityService.logAction({
        tenantId,
        userId: (req as any).userId,
        action: 'QUERY',
        resource: 'SKILL_ARCADE',
        details: `Skill assessment completed for category: ${category}`,
        severity: 'INFO',
        ipAddress: req.ip
      });

      res.json({ success: true, assessment });
    } catch (error) {
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  });

  // OmniServe chat endpoint
  app.post("/api/chat", isAuthenticated, checkTierLimit, async (req, res) => {
    try {
      const { message, conversationId, language } = req.body;
      const tenantId = req.user!.tenantId;
      const tenant = await storage.getTenant(tenantId);
      const provider = (tenant?.aiProvider as 'cloud' | 'local') || 'cloud';

      if (!message) return res.status(400).json({ success: false, message: "Message is required" });

      const chatResponse = await chat({ message, conversationId, language }, { provider });

      // Audit Logging
      await securityService.logAction({
        tenantId,
        userId: req.user!.id,
        action: 'QUERY',
        resource: 'OMNISERVE',
        details: `Chat interaction processed`,
        severity: 'INFO',
        ipAddress: req.ip
      });

      res.json({ success: true, ...chatResponse });
    } catch (error) {
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  });

  // OmniServe voice chat endpoint
  app.post("/api/omniserve/voice", isAuthenticated, checkTierLimit, upload.single('audio'), async (req, res) => {
    try {
      if (!req.file) return res.status(400).json({ success: false, message: "No audio file provided" });
      const tenantId = req.user!.tenantId;
      const tenant = await storage.getTenant(tenantId);
      const provider = (tenant?.aiProvider as 'cloud' | 'local') || 'cloud';

      const transcription = await transcribeAudioWithGroq(req.file.buffer, provider);
      if (!transcription || transcription.trim().length === 0) {
        return res.json({ success: true, transcription: "", response: "I couldn't hear anything." });
      }

      const chatResponse = await chat({ message: transcription, language: 'auto' }, { provider });

      // Audit Logging
      await securityService.logAction({
        tenantId,
        userId: req.user!.id,
        action: 'QUERY',
        resource: 'OMNISERVE_VOICE',
        details: `Voice interaction processed`,
        severity: 'INFO',
        ipAddress: req.ip
      });

      res.json({ success: true, transcription, response: chatResponse.response, detectedLanguage: chatResponse.detectedLanguage });
    } catch (error) {
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  });

  // Rhalia wellbeing analysis endpoint
  app.post("/api/wellbeing-analysis", isAuthenticated, checkTierLimit, async (req, res) => {
    try {
      const { physicalMetrics, mentalMetrics, socialMetrics } = req.body;
      const tenantId = req.user!.tenantId;
      const tenant = await storage.getTenant(tenantId);
      const provider = (tenant?.aiProvider as 'cloud' | 'local') || 'cloud';

      const analysis = await analyzeWellbeing({ physicalMetrics, mentalMetrics, socialMetrics }, { provider });

      // Audit Logging
      await securityService.logAction({
        tenantId,
        userId: req.user!.id,
        action: 'QUERY',
        resource: 'RHALIA',
        details: `Wellbeing analysis processed`,
        severity: 'INFO',
        ipAddress: req.ip
      });

      res.json({ success: true, analysis });
    } catch (error) {
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  });

  // SatisfAI satisfaction analysis endpoint
  app.post("/api/satisfaction-analysis", isAuthenticated, checkTierLimit, async (req, res) => {
    try {
      const { responses, context } = req.body;
      const tenantId = req.user!.tenantId;
      const tenant = await storage.getTenant(tenantId);
      const provider = (tenant?.aiProvider as 'cloud' | 'local') || 'cloud';

      const analysis = await analyzeSatisfaction({ responses }, { provider });

      // Audit Logging
      await securityService.logAction({
        tenantId,
        userId: req.user!.id,
        action: 'QUERY',
        resource: 'SATISFAI',
        details: `Satisfaction analysis processed`,
        severity: 'INFO',
        ipAddress: req.ip
      });

      res.json({ success: true, analysis });
    } catch (error) {
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  });

  // KYC Submission endpoint
  app.post("/api/kyc/submit", isAuthenticated, checkTierLimit, upload.single('document'), async (req, res) => {
    try {
      if (!req.file) return res.status(400).json({ success: false, message: "No document provided" });
      const { documentType } = req.body;
      const tenantId = req.user!.tenantId;
      const userId = req.user!.id;
      const tenant = await storage.getTenant(tenantId);
      const provider = (tenant?.aiProvider as 'cloud' | 'local') || 'cloud';

      const kycResult = await financialAssessor.processKyc({
        documentType: documentType || 'ID_CARD',
        imageBuffer: req.file.buffer,
        mimeType: req.file.mimetype
      }, { provider });

      // Audit Logging
      await securityService.logAction({
        tenantId,
        userId,
        action: 'SUBMIT',
        resource: 'KYC',
        details: `KYC submission processed for: ${documentType || 'ID_CARD'}`,
        severity: kycResult.status === 'REJECTED' ? 'WARNING' : 'INFO',
        ipAddress: req.ip
      });

      const record = await storage.createKycRecord({
        tenantId,
        userId,
        status: kycResult.status,
        documentType: documentType || 'ID_CARD',
        extractedInfo: kycResult.extractedInfo,
        notes: kycResult.notes
      });

      res.json({ success: true, record });
    } catch (error) {
      console.error("KYC endpoint error:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  });

  // Credit Risk Assessment endpoint
  app.post("/api/credit-risk/assess", isAuthenticated, checkTierLimit, async (req, res) => {
    try {
      const { financialData, context } = req.body;
      const tenantId = req.user!.tenantId;
      const userId = req.user!.id;
      const tenant = await storage.getTenant(tenantId);
      const provider = (tenant?.aiProvider as 'cloud' | 'local') || 'cloud';

      if (!financialData) return res.status(400).json({ success: false, message: "Financial data is required" });

      const assessmentResult = await financialAssessor.assessCreditRisk({ financialData, context }, { provider });

      // Audit Logging
      await securityService.logAction({
        tenantId,
        userId,
        action: 'QUERY',
        resource: 'CREDIT_ASSESSMENT',
        details: `Credit risk assessment completed. Risk: ${assessmentResult.riskLevel}`,
        severity: assessmentResult.riskLevel === 'CRITICAL' ? 'CRITICAL' : assessmentResult.riskLevel === 'HIGH' ? 'WARNING' : 'INFO',
        ipAddress: req.ip
      });

      const assessment = await storage.createCreditAssessment({
        tenantId,
        userId,
        score: assessmentResult.score,
        riskLevel: assessmentResult.riskLevel,
        recommendation: assessmentResult.recommendation,
        metadata: assessmentResult.metadata
      });

      res.json({ success: true, assessment });
    } catch (error) {
      console.error("Credit assessment endpoint error:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  });

  // Waitlist endpoint
  app.post("/api/waitlist", async (req, res) => {
    try {
      const validatedData = insertWaitlistSchema.parse(req.body);
      const waitlistEntry = await storage.createWaitlistEntry(validatedData);
      res.json({ success: true, id: waitlistEntry.id, message: "Successfully added to waitlist" });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ success: false, message: "Invalid request data", errors: error.errors });
      } else if (error instanceof Error && error.message.includes('already registered')) {
        res.status(409).json({ success: false, message: error.message });
      } else {
        res.status(500).json({ success: false, message: "Internal server error" });
      }
    }
  });

  // Orders endpoints
  app.get("/api/orders", isAuthenticated, async (req, res) => {
    try {
      console.log(`[ORDERS] Fetching orders for user ${req.user?.id} (Tenant: ${req.user?.tenantId})...`);
      if (!req.user) throw new Error("User not found in request");
      const tenantId = req.user.tenantId;
      if (!tenantId) throw new Error("tenantId not found in user object");

      const orders = await storage.getOrdersByTenant(tenantId);
      console.log(`[ORDERS] Successfully retrieved ${orders.length} orders.`);
      res.json({ success: true, data: orders });
    } catch (error: any) {
      console.error("[ORDERS] Critical failure:", error.message);
      res.status(500).json({
        success: false,
        message: error.message || "Internal server error",
        error: error.message,
        debug: {
          user: req.user ? { id: req.user.id, tenantId: req.user.tenantId } : null,
          stack: error.stack?.substring(0, 500)
        }
      });
    }
  });

  app.post("/api/orders", isAuthenticated, async (req, res) => {
    try {
      const validatedData = insertOrderSchema.parse(req.body);
      const tenantId = req.user!.tenantId;
      const order = await storage.createOrder({ ...validatedData, tenantId });
      res.json({ success: true, data: order });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ success: false, message: "Invalid order data", errors: error.errors });
      } else {
        res.status(500).json({ success: false, message: "Internal server error" });
      }
    }
  });

  // Privacy & Data endpoints
  app.put("/api/user/me/privacy", isAuthenticated, async (req, res) => {
    try {
      await storage.updateUserConsent(req.user!.id, req.body);
      res.json({ success: true, message: "Consent settings updated" });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to update consent" });
    }
  });

  app.delete("/api/user/me", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user!.id;
      await storage.deleteUserAccount(userId);
      req.logout((err) => {
        if (err) return res.status(500).json({ success: false, message: "Logout failed during deletion" });
        res.json({ success: true, message: "Account and all associated data deleted successfully" });
      });
    } catch (error) {
      res.status(500).json({ success: false, message: "Account deletion failed" });
    }
  });

  app.post("/api/admin/purge-old-data", isAuthenticated, isAdmin, async (req, res) => {
    try {
      await storage.applyRetentionPolicy(req.user!.tenantId);
      res.json({ success: true, message: "Data retention policy applied. Old records purged." });
    } catch (error) {
      res.status(500).json({ success: false, message: "Data purge failed" });
    }
  });

  // Analytics endpoints
  app.get("/api/analytics/usage", isAuthenticated, async (req, res) => {
    try {
      const stats = await storage.getUsageStats(req.user!.tenantId);
      res.json({ success: true, ...stats });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch analytics" });
    }
  });

  app.get("/api/tenant/ai-provider", isAuthenticated, async (req, res) => {
    try {
      const tenant = await storage.getTenant(req.user!.tenantId);
      res.json({ success: true, provider: tenant?.aiProvider || 'cloud' });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch AI provider" });
    }
  });

  app.put("/api/tenant/ai-provider", isAuthenticated, async (req, res) => {
    try {
      const { provider } = req.body;
      if (provider !== 'cloud' && provider !== 'local') {
        return res.status(400).json({ success: false, message: "Invalid provider. Must be 'cloud' or 'local'" });
      }
      await storage.updateTenantAiProvider(req.user!.tenantId, provider);
      res.json({ success: true, provider });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to update AI provider" });
    }
  });

  // Diagnostic
  app.get("/api/internal/debug/storage", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const users = (storage as any).users;
      const tenants = (storage as any).tenants;
      res.json({
        userCount: users?.size || 0,
        tenantCount: tenants?.size || 0,
        users: Array.from(users.values()).map((u: any) => ({ id: u.id, tenantId: u.tenantId, username: u.username })),
        tenants: Array.from(tenants.values()).map((t: any) => ({ id: t.id, name: t.name, aiProvider: t.aiProvider }))
      });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Health check endpoint (Public)
  app.get("/api/health", async (req, res) => {
    const tenantId = req.user?.tenantId || "default";
    const residency = await securityService.getDataResidency(tenantId);
    console.log(`[API] Health check requested (Tenant: ${tenantId}, Residency: ${residency})`);
    res.json({
      success: true,
      status: "Healthy",
      version: "1.2.0-Enterprise",
      residency,
      services: {
        database: "Connected",
        ai_gateway: "Active",
        encryption_node: "AES-256-GCM"
      },
      timestamp: new Date().toISOString()
    });
  });

  const httpServer = createServer(app);
  return httpServer;
}
