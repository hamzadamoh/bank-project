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
      const { getTaxAdvice } = await import("./services/tax-counsel");
      const taxResponse = await getTaxAdvice({ query, jurisdiction });

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
      res.status(500).json({ 
        success: false, 
        message: error instanceof Error ? error.message : "Internal server error" 
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
      const { convertQuery } = await import("./services/query-architect");
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
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : "Internal server error"
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
      const { analyzeDocument } = await import("./services/factoring-guardian");
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
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : "Internal server error"
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
