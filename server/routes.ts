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

      // Mock AI processing - in production this would call actual AI models
      const mockResponse = {
        shortAnswer: `Tax analysis for ${jurisdiction}: ${query}`,
        explanation: "This is a mock response for demonstration purposes. In production, this would contain actual AI-generated tax advice.",
        details: [
          {
            title: "Analysis Overview",
            content: "Mock tax analysis content would appear here with proper legal research and citations."
          }
        ],
        checklist: [
          "Review applicable tax regulations",
          "Consult with local tax advisor",
          "Ensure proper documentation"
        ],
        citations: [
          { code: "Mock Citation", description: "Example legal reference" }
        ],
        confidence: 85
      };

      const taxQuery = await storage.createTaxQuery({
        query,
        jurisdiction,
        response: mockResponse,
        confidence: "high"
      });

      res.json({ 
        success: true, 
        id: taxQuery.id,
        response: mockResponse 
      });

    } catch (error) {
      console.error("Tax query error:", error);
      res.status(500).json({ 
        success: false, 
        message: "Internal server error" 
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

      // Mock AI processing - in production this would call actual NL2SQL models
      let mockOutput = "";
      let mockMetadata = {};

      if (type === "nl_to_sql") {
        mockOutput = `SELECT 
    column1,
    column2,
    SUM(amount) as total
FROM table_name
WHERE condition = 'value'
GROUP BY column1, column2
ORDER BY total DESC
LIMIT 100;`;

        mockMetadata = {
          executionTime: "~1.5s",
          rowsEstimate: 15000,
          optimization: "Query includes proper indexing and LIMIT clause"
        };
      } else {
        mockOutput = "This query retrieves data from the specified table with aggregation and filtering. It groups results by specified columns and returns the top 100 records ordered by total amount.";
        mockMetadata = {
          complexity: "Medium",
          tables: ["table_name"],
          operations: ["SELECT", "GROUP BY", "ORDER BY", "LIMIT"]
        };
      }

      const sqlQuery = await storage.createSqlQuery({
        type,
        input,
        output: mockOutput,
        metadata: mockMetadata
      });

      res.json({
        success: true,
        id: sqlQuery.id,
        output: mockOutput,
        metadata: mockMetadata
      });

    } catch (error) {
      console.error("SQL query error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error"
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

      // Mock document processing - in production this would use actual OCR/AI models
      const mockExtractedData = {
        supplier: {
          name: "Mock Supplier SARL",
          taxId: "123456789",
          address: "123 Mock Street, City",
          iban: "MA64011090000001234567890"
        },
        invoice: {
          number: "INV-2024-001",
          date: "2024-01-15",
          dueDate: "2024-02-15",
          currency: "MAD",
          totalHT: 100000.00,
          totalTVA: 20000.00,
          totalTTC: 120000.00
        },
        lineItems: [
          { description: "Service Item 1", quantity: 1, unitPrice: 60000.00, total: 60000.00 },
          { description: "Service Item 2", quantity: 1, unitPrice: 40000.00, total: 40000.00 }
        ]
      };

      const mockAnomalies = [
        {
          type: "AMOUNT_CHECK",
          severity: "LOW",
          message: "All amounts validated successfully"
        }
      ];

      const analysis = await storage.createDocumentAnalysis({
        filename,
        extractedData: mockExtractedData,
        anomalies: mockAnomalies,
        decision: "VALIDATED",
        confidence: "high"
      });

      res.json({
        success: true,
        id: analysis.id,
        extractedData: mockExtractedData,
        anomalies: mockAnomalies,
        decision: "VALIDATED",
        confidence: 98.5
      });

    } catch (error) {
      console.error("Document analysis error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error"
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
