import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertDemoRequestSchema, 
  insertContactSubmissionSchema,
  insertTaxQuerySchema,
  insertSqlQuerySchema,
  insertDocumentAnalysisSchema
} from "@shared/schema";
import { z } from "zod";

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
      const { query, jurisdiction } = req.body;
      
      if (!query || !jurisdiction) {
        return res.status(400).json({
          success: false,
          message: "Query and jurisdiction are required"
        });
      }

      // Use the tax counsel service
      let taxResponse;
      try {
        const taxCounselModule = await import("./services/tax-counsel");
        if (!taxCounselModule || !taxCounselModule.getTaxAdvice) {
          throw new Error("Tax counsel service module not found or getTaxAdvice function missing");
        }
        taxResponse = await taxCounselModule.getTaxAdvice({ query, jurisdiction });
      } catch (importError) {
        console.error("Import error:", importError);
        throw new Error(`Failed to import tax counsel service: ${importError instanceof Error ? importError.message : String(importError)}`);
      }

      const taxQuery = await storage.createTaxQuery({
        query,
        jurisdiction,
        response: taxResponse,
        confidence: taxResponse.confidence >= 80 ? "high" : taxResponse.confidence >= 60 ? "medium" : "low"
      });

      res.json({ 
        success: true, 
        id: taxQuery.id,
        response: taxResponse 
      });

    } catch (error) {
      console.error("Tax query error:", error);
      console.error("Error details:", JSON.stringify(error, Object.getOwnPropertyNames(error)));
      console.error("Error stack:", error instanceof Error ? error.stack : "No stack trace");
      res.status(500).json({ 
        success: false, 
        message: error instanceof Error ? error.message : "Internal server error",
        error: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.stack : String(error)) : undefined
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
      let conversionResult;
      try {
        const queryArchitectModule = await import("./services/query-architect");
        if (!queryArchitectModule || !queryArchitectModule.convertQuery) {
          throw new Error("Query architect service module not found or convertQuery function missing");
        }
        conversionResult = await queryArchitectModule.convertQuery({ type, input });
      } catch (importError) {
        console.error("Import error:", importError);
        throw new Error(`Failed to import query architect service: ${importError instanceof Error ? importError.message : String(importError)}`);
      }

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
      let analysisResult;
      try {
        const factoringGuardianModule = await import("./services/factoring-guardian");
        if (!factoringGuardianModule || !factoringGuardianModule.analyzeDocument) {
          throw new Error("Factoring guardian service module not found or analyzeDocument function missing");
        }
        analysisResult = await factoringGuardianModule.analyzeDocument({ filename });
      } catch (importError) {
        console.error("Import error:", importError);
        throw new Error(`Failed to import factoring guardian service: ${importError instanceof Error ? importError.message : String(importError)}`);
      }

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

      let assessment;
      try {
        const skillarcadeModule = await import("./services/skillarcade");
        if (!skillarcadeModule || !skillarcadeModule.assessSkills) {
          throw new Error("SkillArcade service module not found or assessSkills function missing");
        }
        assessment = await skillarcadeModule.assessSkills({ category, responses });
      } catch (importError) {
        console.error("Import error:", importError);
        throw new Error(`Failed to import SkillArcade service: ${importError instanceof Error ? importError.message : String(importError)}`);
      }

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

      let chatResponse;
      try {
        const omniserveModule = await import("./services/omniserve");
        if (!omniserveModule || !omniserveModule.chat) {
          throw new Error("OmniServe service module not found or chat function missing");
        }
        chatResponse = await omniserveModule.chat({ message, conversationId, language });
      } catch (importError) {
        console.error("Import error:", importError);
        throw new Error(`Failed to import OmniServe service: ${importError instanceof Error ? importError.message : String(importError)}`);
      }

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
      
      let analysis;
      try {
        const rhaliaModule = await import("./services/rhalia");
        if (!rhaliaModule || !rhaliaModule.analyzeWellbeing) {
          throw new Error("Rhalia service module not found or analyzeWellbeing function missing");
        }
        analysis = await rhaliaModule.analyzeWellbeing({ physicalMetrics, mentalMetrics, socialMetrics });
      } catch (importError) {
        console.error("Import error:", importError);
        throw new Error(`Failed to import Rhalia service: ${importError instanceof Error ? importError.message : String(importError)}`);
      }

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

      let analysis;
      try {
        const satisfaiModule = await import("./services/satisfai");
        if (!satisfaiModule || !satisfaiModule.analyzeSatisfaction) {
          throw new Error("SatisfAI service module not found or analyzeSatisfaction function missing");
        }
        analysis = await satisfaiModule.analyzeSatisfaction({ responses, context });
      } catch (importError) {
        console.error("Import error:", importError);
        throw new Error(`Failed to import SatisfAI service: ${importError instanceof Error ? importError.message : String(importError)}`);
      }

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
