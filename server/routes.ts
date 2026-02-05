import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage.js";
import { 
  insertDemoRequestSchema, 
  insertContactSubmissionSchema,
  insertTaxQuerySchema,
  insertSqlQuerySchema,
  insertDocumentAnalysisSchema
} from "@shared/schema";
import { z } from "zod";
// Import all services statically to ensure they're bundled
import { getTaxAdvice } from "./services/tax-counsel.js";
import { convertQuery } from "./services/query-architect.js";
import { analyzeDocument } from "./services/factoring-guardian.js";
import { assessSkills } from "./services/skillarcade.js";
import { chat } from "./services/omniserve.js";
import { analyzeWellbeing } from "./services/rhalia.js";
import { analyzeSatisfaction } from "./services/satisfai.js";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Demo request endpoint
  app.post("/api/demo-requests", async (req, res) => {
    try {
      const validatedData = insertDemoRequestSchema.parse(req.body);
      const demoRequest = await storage.createDemoRequest(validatedData);
      res.json({ success: true, id: demoRequest.id });
    } catch (error) {
      console.error("Demo request error:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          success: false, 
          message: "Invalid request data",
          errors: error.errors 
        });
      } else {
        res.status(500).json({ 
          success: false, 
          message: "Internal server error" 
        });
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
      console.error("Contact submission error:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          success: false, 
          message: "Invalid request data",
          errors: error.errors 
        });
      } else {
        console.error("Internal server error:", error);
        res.status(500).json({ 
          success: false, 
          message: "Internal server error" 
        });
      }
    }
  });

  // Tax counsel query endpoint
  app.post("/api/tax-queries", async (req, res) => {
    try {
      console.log("Tax query request received:", { 
        body: req.body, 
        hasQuery: !!req.body?.query, 
        hasJurisdiction: !!req.body?.jurisdiction 
      });
      
      const { query, jurisdiction } = req.body;
      
      if (!query || !jurisdiction) {
        console.warn("Missing required fields:", { query: !!query, jurisdiction: !!jurisdiction });
        return res.status(400).json({
          success: false,
          message: "Query and jurisdiction are required"
        });
      }

      console.log("Calling getTaxAdvice service...");
      // Use the tax counsel service
      const taxResponse = await getTaxAdvice({ query, jurisdiction });
      console.log("Tax advice received, confidence:", taxResponse.confidence);

      console.log("Creating tax query record...");
      const taxQuery = await storage.createTaxQuery({
        query,
        jurisdiction,
        response: taxResponse,
        confidence: taxResponse.confidence >= 80 ? "high" : taxResponse.confidence >= 60 ? "medium" : "low"
      });
      console.log("Tax query created with ID:", taxQuery.id);

      res.json({ 
        success: true, 
        id: taxQuery.id,
        response: taxResponse 
      });

    } catch (error) {
      console.error("Tax query error:", error);
      console.error("Error type:", error?.constructor?.name);
      console.error("Error details:", JSON.stringify(error, Object.getOwnPropertyNames(error)));
      console.error("Error stack:", error instanceof Error ? error.stack : "No stack trace");
      
      const errorMessage = error instanceof Error ? error.message : "Internal server error";
      const errorStack = process.env.NODE_ENV === 'development' 
        ? (error instanceof Error ? error.stack : String(error)) 
        : undefined;
      
      res.status(500).json({ 
        success: false, 
        message: errorMessage,
        error: errorStack
      });
    }
  });

  // SQL query conversion endpoint
  app.post("/api/sql-queries", async (req, res) => {
    try {
      const { type, input } = req.body;
      
      if (!type || !input || !['nl_to_sql', 'sql_to_nl'].includes(type)) {
        return res.status(400).json({
          success: false,
          message: "Valid type (nl_to_sql or sql_to_nl) and input are required"
        });
      }

      // Use the query architect service
      const conversionResult = await convertQuery({ type, input });

      const sqlQuery = await storage.createSqlQuery({
        type,
        input,
        output: conversionResult.output,
        metadata: conversionResult.metadata
      });

      res.json({
        success: true,
        id: sqlQuery.id,
        output: conversionResult.output,
        metadata: conversionResult.metadata
      });

    } catch (error) {
      console.error("SQL query error:", error);
      console.error("Error details:", JSON.stringify(error, Object.getOwnPropertyNames(error)));
      console.error("Error stack:", error instanceof Error ? error.stack : "No stack trace");
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : "Internal server error",
        error: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.stack : String(error)) : undefined
      });
    }
  });

  // Document analysis endpoint
  app.post("/api/document-analysis", async (req, res) => {
    try {
      const { filename } = req.body;
      
      if (!filename) {
        return res.status(400).json({
          success: false,
          message: "Filename is required"
        });
      }

      // Use the factoring guardian service
      const analysisResult = await analyzeDocument({ filename });

      const analysis = await storage.createDocumentAnalysis({
        filename,
        extractedData: analysisResult.extractedData,
        anomalies: analysisResult.anomalies,
        decision: analysisResult.decision,
        confidence: analysisResult.confidence >= 80 ? "high" : analysisResult.confidence >= 60 ? "medium" : "low"
      });

      res.json({
        success: true,
        id: analysis.id,
        extractedData: analysisResult.extractedData,
        anomalies: analysisResult.anomalies,
        decision: analysisResult.decision,
        confidence: analysisResult.confidence
      });

    } catch (error) {
      console.error("Document analysis error:", error);
      console.error("Error details:", JSON.stringify(error, Object.getOwnPropertyNames(error)));
      console.error("Error stack:", error instanceof Error ? error.stack : "No stack trace");
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : "Internal server error",
        error: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.stack : String(error)) : undefined
      });
    }
  });

  // Get all demo requests (admin endpoint)
  app.get("/api/demo-requests", async (req, res) => {
    try {
      const demoRequests = await storage.getAllDemoRequests();
      res.json({ success: true, data: demoRequests });
    } catch (error) {
      console.error("Get demo requests error:", error);
      res.status(500).json({ 
        success: false, 
        message: "Internal server error" 
      });
    }
  });

  // Get all contact submissions (admin endpoint)
  app.get("/api/contact", async (req, res) => {
    try {
      const contacts = await storage.getAllContactSubmissions();
      res.json({ success: true, data: contacts });
    } catch (error) {
      console.error("Get contacts error:", error);
      res.status(500).json({ 
        success: false, 
        message: "Internal server error" 
      });
    }
  });

  // SkillArcade assessment endpoint
  app.post("/api/skill-assessments", async (req, res) => {
    try {
      const { category, responses } = req.body;
      
      if (!category || !responses || !Array.isArray(responses)) {
        return res.status(400).json({
          success: false,
          message: "Category and responses array are required"
        });
      }

      const assessment = await assessSkills({ category, responses });

      res.json({
        success: true,
        assessment
      });

    } catch (error) {
      console.error("Skill assessment error:", error);
      console.error("Error stack:", error instanceof Error ? error.stack : "No stack trace");
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : "Internal server error"
      });
    }
  });

  // OmniServe chat endpoint
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, conversationId, language } = req.body;
      
      if (!message) {
        return res.status(400).json({
          success: false,
          message: "Message is required"
        });
      }

      const chatResponse = await chat({ message, conversationId, language });

      res.json({
        success: true,
        ...chatResponse
      });

    } catch (error) {
      console.error("Chat error:", error);
      console.error("Error details:", JSON.stringify(error, Object.getOwnPropertyNames(error)));
      console.error("Error stack:", error instanceof Error ? error.stack : "No stack trace");
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : "Internal server error",
        error: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.stack : String(error)) : undefined
      });
    }
  });

  // Rhalia wellbeing analysis endpoint
  app.post("/api/wellbeing-analysis", async (req, res) => {
    try {
      const { physicalMetrics, mentalMetrics, socialMetrics } = req.body;
      
      const analysis = await analyzeWellbeing({ physicalMetrics, mentalMetrics, socialMetrics });

      res.json({
        success: true,
        analysis
      });

    } catch (error) {
      console.error("Wellbeing analysis error:", error);
      console.error("Error details:", JSON.stringify(error, Object.getOwnPropertyNames(error)));
      console.error("Error stack:", error instanceof Error ? error.stack : "No stack trace");
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : "Internal server error",
        error: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.stack : String(error)) : undefined
      });
    }
  });

  // SatisfAI satisfaction analysis endpoint
  app.post("/api/satisfaction-analysis", async (req, res) => {
    try {
      const { responses, context } = req.body;
      
      if (!responses || !Array.isArray(responses)) {
        return res.status(400).json({
          success: false,
          message: "Responses array is required"
        });
      }

      const analysis = await analyzeSatisfaction({ responses, context });

      res.json({
        success: true,
        analysis
      });

    } catch (error) {
      console.error("Satisfaction analysis error:", error);
      console.error("Error details:", JSON.stringify(error, Object.getOwnPropertyNames(error)));
      console.error("Error stack:", error instanceof Error ? error.stack : "No stack trace");
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : "Internal server error",
        error: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.stack : String(error)) : undefined
      });
    }
  });

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ 
      success: true, 
      message: "FiscAI API is running", 
      timestamp: new Date().toISOString() 
    });
  });

  const httpServer = createServer(app);
  return httpServer;
}
