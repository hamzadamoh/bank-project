import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, jsonb, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const demoRequests = pgTable("demo_requests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  company: text("company").notNull(),
  role: text("role").notNull(),
  tools: jsonb("tools").notNull(), // Array of tool names
  message: text("message"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const contactSubmissions = pgTable("contact_submissions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  company: text("company"),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const taxQueries = pgTable("tax_queries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  query: text("query").notNull(),
  jurisdiction: text("jurisdiction").notNull(),
  response: jsonb("response").notNull(),
  confidence: text("confidence").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const sqlQueries = pgTable("sql_queries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  type: text("type").notNull(), // 'nl_to_sql' or 'sql_to_nl'
  input: text("input").notNull(),
  output: text("output").notNull(),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const documentAnalysis = pgTable("document_analysis", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  filename: text("filename").notNull(),
  extractedData: jsonb("extracted_data").notNull(),
  anomalies: jsonb("anomalies").notNull(),
  decision: text("decision").notNull(),
  confidence: text("confidence").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Zod schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertDemoRequestSchema = createInsertSchema(demoRequests).omit({
  id: true,
  createdAt: true,
});

export const insertContactSubmissionSchema = createInsertSchema(contactSubmissions).omit({
  id: true,
  createdAt: true,
});

export const insertTaxQuerySchema = createInsertSchema(taxQueries).omit({
  id: true,
  createdAt: true,
});

export const insertSqlQuerySchema = createInsertSchema(sqlQueries).omit({
  id: true,
  createdAt: true,
});

export const insertDocumentAnalysisSchema = createInsertSchema(documentAnalysis).omit({
  id: true,
  createdAt: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertDemoRequest = z.infer<typeof insertDemoRequestSchema>;
export type DemoRequest = typeof demoRequests.$inferSelect;

export type InsertContactSubmission = z.infer<typeof insertContactSubmissionSchema>;
export type ContactSubmission = typeof contactSubmissions.$inferSelect;

export type InsertTaxQuery = z.infer<typeof insertTaxQuerySchema>;
export type TaxQuery = typeof taxQueries.$inferSelect;

export type InsertSqlQuery = z.infer<typeof insertSqlQuerySchema>;
export type SqlQuery = typeof sqlQueries.$inferSelect;

export type InsertDocumentAnalysis = z.infer<typeof insertDocumentAnalysisSchema>;
export type DocumentAnalysis = typeof documentAnalysis.$inferSelect;
