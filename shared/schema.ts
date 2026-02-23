import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, jsonb, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const tenants = pgTable("tenants", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  region: text("region").notNull().default("Morocco"), // Data Residency: 'Morocco', 'EU', 'US'
  tier: text("tier").notNull().default("Starter"), // 'Starter', 'Professional', 'Enterprise'
  queryLimit: text("query_limit").notNull().default("100"),
  retentionDays: text("retention_days").notNull().default("30"), // Default 30 days retention
  mfaEnforced: boolean("mfa_enforced").notNull().default(false),
  ssoConfig: jsonb("sso_config").notNull().default({
    enabled: false,
    provider: "local", // 'okta', 'azure', 'local'
    domain: ""
  }),
  createdAt: timestamp("created_at").defaultNow(),
});

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(), // This will store the hash
  tenantId: text("tenant_id").notNull().default("tenant_default"),
  role: text("role").notNull().default("client"), // 'client', 'admin'
  consentSettings: jsonb("consent_settings").notNull().default({
    analytics: true,
    marketing: false,
    thirdParty: false
  }),
  mfaEnabled: boolean("mfa_enabled").notNull().default(false),
  mfaSecret: text("mfa_secret"),
});

export const auditLogs = pgTable("audit_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  tenantId: text("tenant_id").notNull(),
  userId: text("user_id"),
  action: text("action").notNull(), // 'QUERY', 'LOGIN', 'EXPORT', 'DELETE'
  resource: text("resource").notNull(), // 'TAX_CONSEL', 'QUERY_ARCHITECT', etc.
  details: text("details").notNull(),
  severity: text("severity").notNull(), // 'INFO', 'WARNING', 'CRITICAL'
  ipAddress: text("ip_address"),
  createdAt: timestamp("created_at").defaultNow(),
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
  tenantId: text("tenant_id").notNull().default("tenant_default"),
  query: text("query").notNull(),
  jurisdiction: text("jurisdiction").notNull(),
  response: jsonb("response").notNull(),
  confidence: text("confidence").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const sqlQueries = pgTable("sql_queries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  tenantId: text("tenant_id").notNull().default("tenant_default"),
  type: text("type").notNull(), // 'nl_to_sql' or 'sql_to_nl'
  input: text("input").notNull(),
  output: text("output").notNull(),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const documentAnalysis = pgTable("document_analysis", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  tenantId: text("tenant_id").notNull().default("tenant_default"),
  filename: text("filename").notNull(),
  extractedData: jsonb("extracted_data").notNull(),
  anomalies: jsonb("anomalies").notNull(),
  decision: text("decision").notNull(),
  confidence: text("confidence").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const waitlist = pgTable("waitlist", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  name: text("name"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const orders = pgTable("orders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  tenantId: text("tenant_id").notNull().default("tenant_default"),
  planId: text("plan_id").notNull(),
  planName: text("plan_name").notNull(),
  amount: text("amount").notNull(),
  status: text("status").notNull(), // 'pending', 'completed', 'failed'
  customerEmail: text("customer_email").notNull(),
  paymentMethod: text("payment_method").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const kycRecords = pgTable("kyc_records", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  tenantId: text("tenant_id").notNull(),
  userId: text("user_id").notNull(),
  status: text("status").notNull(), // 'PENDING', 'APPROVED', 'REJECTED'
  documentType: text("document_type").notNull(),
  extractedInfo: jsonb("extracted_info").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const creditAssessments = pgTable("credit_assessments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  tenantId: text("tenant_id").notNull(),
  userId: text("user_id").notNull(),
  score: text("score").notNull(),
  riskLevel: text("risk_level").notNull(), // 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'
  recommendation: text("recommendation").notNull(),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Zod schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true, // Plain text during input, hashed before storage
  tenantId: true,
  role: true,
});

export const insertTenantSchema = createInsertSchema(tenants).omit({
  id: true,
  createdAt: true,
});

export const insertAuditLogSchema = createInsertSchema(auditLogs).omit({
  id: true,
  createdAt: true,
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

export const insertWaitlistSchema = createInsertSchema(waitlist).omit({
  id: true,
  createdAt: true,
});

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  createdAt: true,
});

export const insertKycRecordSchema = createInsertSchema(kycRecords).omit({
  id: true,
  createdAt: true,
});

export const insertCreditAssessmentSchema = createInsertSchema(creditAssessments).omit({
  id: true,
  createdAt: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertAuditLog = z.infer<typeof insertAuditLogSchema>;
export type AuditLog = typeof auditLogs.$inferSelect;

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

export type InsertWaitlist = z.infer<typeof insertWaitlistSchema>;
export type Waitlist = typeof waitlist.$inferSelect;

export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof orders.$inferSelect;

export type InsertKycRecord = z.infer<typeof insertKycRecordSchema>;
export type KycRecord = typeof kycRecords.$inferSelect;

export type InsertCreditAssessment = z.infer<typeof insertCreditAssessmentSchema>;
export type CreditAssessment = typeof creditAssessments.$inferSelect;

export type InsertTenant = z.infer<typeof insertTenantSchema>;
export type Tenant = typeof tenants.$inferSelect;
