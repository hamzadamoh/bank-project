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

// Simulated Tenant Context Middleware
const tenantContext = (req: any, res: any, next: any) => {
  // In a real app, this would come from JWT/Auth
  req.tenantId = "bank_alpha_eu"; // Simulated European Bank tenant
  req.userId = "user_alpha_admin";
  next();
};

export async function registerRoutes(app: Express): Promise<Server> {
  app.use(tenantContext);

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
  app.post("/api/tax-queries", async (req, res) => {
    try {
      const { query, jurisdiction } = req.body;
      const tenantId = (req as any).tenantId;

      if (!query || !jurisdiction) {
        return res.status(400).json({ success: false, message: "Query and jurisdiction are required" });
      }

      const taxResponse = await getTaxAdvice({ query, jurisdiction });

      // Audit Logging
      await securityService.logAction({
        tenantId,
        userId: (req as any).userId,
        action: 'QUERY',
        resource: 'TAX_COUNSEL',
        details: `Complex tax query processed for jurisdiction: ${jurisdiction}`,
        severity: 'INFO',
        ipAddress: req.ip
      });

      const taxQuery = await storage.createTaxQuery({
        tenantId,
        query,
        jurisdiction,
        response: taxResponse,
        confidence: taxResponse.confidence >= 80 ? "high" : taxResponse.confidence >= 60 ? "medium" : "low"
      });

      res.json({ success: true, id: taxQuery.id, response: taxResponse });
    } catch (error) {
      console.error("Tax query error:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  });

  // SQL query conversion endpoint
  app.post("/api/sql-queries", async (req, res) => {
    try {
      const { type, input } = req.body;
      const tenantId = (req as any).tenantId;

      if (!type || !input) {
        return res.status(400).json({ success: false, message: "Type and input are required" });
      }

      const conversionResult = await convertQuery({ type, input });

      // Audit Logging
      await securityService.logAction({
        tenantId,
        userId: (req as any).userId,
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
  app.post("/api/document-analysis", async (req, res) => {
    try {
      const { filename, fileContent, fileType } = req.body;
      const tenantId = (req as any).tenantId;

      const analysisResult = await analyzeDocument({
        filename: filename || 'uploaded_document',
        fileContent: fileContent ? Buffer.from(fileContent, 'base64') : undefined,
        fileType
      });

      // Audit Logging
      await securityService.logAction({
        tenantId,
        userId: (req as any).userId,
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
      const tenantId = (req as any).tenantId;

      const assessment = await assessSkills({ category, responses });

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
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, conversationId, language } = req.body;
      const tenantId = (req as any).tenantId;

      if (!message) return res.status(400).json({ success: false, message: "Message is required" });

      const chatResponse = await chat({ message, conversationId, language });

      // Audit Logging
      await securityService.logAction({
        tenantId,
        userId: (req as any).userId,
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
  app.post("/api/omniserve/voice", upload.single('audio'), async (req, res) => {
    try {
      if (!req.file) return res.status(400).json({ success: false, message: "No audio file provided" });
      const tenantId = (req as any).tenantId;

      const transcription = await transcribeAudioWithGroq(req.file.buffer);
      if (!transcription || transcription.trim().length === 0) {
        return res.json({ success: true, transcription: "", response: "I couldn't hear anything." });
      }

      const chatResponse = await chat({ message: transcription, language: 'auto' });

      // Audit Logging
      await securityService.logAction({
        tenantId,
        userId: (req as any).userId,
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
  app.post("/api/wellbeing-analysis", async (req, res) => {
    try {
      const { physicalMetrics, mentalMetrics, socialMetrics } = req.body;
      const tenantId = (req as any).tenantId;

      const analysis = await analyzeWellbeing({ physicalMetrics, mentalMetrics, socialMetrics });

      // Audit Logging
      await securityService.logAction({
        tenantId,
        userId: (req as any).userId,
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
  app.post("/api/satisfaction-analysis", async (req, res) => {
    try {
      const { responses, context } = req.body;
      const tenantId = (req as any).tenantId;

      const analysis = await analyzeSatisfaction({ responses });

      // Audit Logging
      await securityService.logAction({
        tenantId,
        userId: (req as any).userId,
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
  app.post("/api/kyc/submit", upload.single('document'), async (req, res) => {
    try {
      if (!req.file) return res.status(400).json({ success: false, message: "No document provided" });
      const { documentType } = req.body;
      const tenantId = (req as any).tenantId;
      const userId = (req as any).userId;

      const kycResult = await financialAssessor.processKyc({
        documentType: documentType || 'ID_CARD',
        imageBuffer: req.file.buffer,
        mimeType: req.file.mimetype
      });

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
  app.post("/api/credit-risk/assess", async (req, res) => {
    try {
      const { financialData, context } = req.body;
      const tenantId = (req as any).tenantId;
      const userId = (req as any).userId;

      if (!financialData) return res.status(400).json({ success: false, message: "Financial data is required" });

      const assessmentResult = await financialAssessor.assessCreditRisk({ financialData, context });

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
  app.get("/api/orders", async (req, res) => {
    try {
      const tenantId = (req as any).tenantId;
      const orders = await storage.getOrdersByTenant(tenantId);
      res.json({ success: true, data: orders });
    } catch (error) {
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  });

  app.post("/api/orders", async (req, res) => {
    try {
      const validatedData = insertOrderSchema.parse(req.body);
      const tenantId = (req as any).tenantId;
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

  // Health check endpoint (Public)
  app.get("/api/health", (req, res) => {
    res.json({
      success: true,
      message: "FiscAI API is running (Bank-Grade Security Active)",
      residency: securityService.getDataResidency((req as any).tenantId || "default"),
      timestamp: new Date().toISOString()
    });
  });

  const httpServer = createServer(app);
  return httpServer;
}
