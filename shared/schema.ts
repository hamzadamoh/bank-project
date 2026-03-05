import { z } from "zod";

export const tenantsSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  region: z.string().default("Morocco"),
  tier: z.string().default("Starter"),
  queryLimit: z.string().default("100"),
  retentionDays: z.string().default("30"),
  mfaEnforced: z.boolean().default(false),
  ssoConfig: z.object({
    enabled: z.boolean(),
    provider: z.string(),
    domain: z.string()
  }).default({ enabled: false, provider: "local", domain: "" }),
  createdAt: z.date().optional(),
});

export const usersSchema = z.object({
  id: z.string().optional(),
  username: z.string(),
  password: z.string(),
  tenantId: z.string().default("tenant_default"),
  role: z.string().default("client"),
  consentSettings: z.object({
    analytics: z.boolean(),
    marketing: z.boolean(),
    thirdParty: z.boolean()
  }).default({ analytics: true, marketing: false, thirdParty: false }),
  mfaEnabled: z.boolean().default(false),
  mfaSecret: z.string().nullable().optional(),
  createdAt: z.date().optional(),
});

export const auditLogsSchema = z.object({
  id: z.string().optional(),
  tenantId: z.string(),
  userId: z.string().nullable().optional(),
  action: z.string(),
  resource: z.string(),
  details: z.string(),
  severity: z.string(),
  ipAddress: z.string().nullable().optional(),
  createdAt: z.date().optional(),
});

export const demoRequestsSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  email: z.string().email(),
  company: z.string(),
  role: z.string(),
  tools: z.array(z.string()),
  message: z.string().nullable().optional(),
  createdAt: z.date().optional(),
});

export const contactSubmissionsSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  email: z.string().email(),
  company: z.string().nullable().optional(),
  subject: z.string(),
  message: z.string(),
  createdAt: z.date().optional(),
});

export const taxQueriesSchema = z.object({
  id: z.string().optional(),
  tenantId: z.string().default("tenant_default"),
  query: z.string(),
  jurisdiction: z.string(),
  response: z.any(),
  confidence: z.string(),
  createdAt: z.date().optional(),
});

export const sqlQueriesSchema = z.object({
  id: z.string().optional(),
  tenantId: z.string().default("tenant_default"),
  type: z.string(),
  input: z.string(),
  output: z.string(),
  metadata: z.any().nullable().optional(),
  createdAt: z.date().optional(),
});

export const documentAnalysisSchema = z.object({
  id: z.string().optional(),
  tenantId: z.string().default("tenant_default"),
  filename: z.string(),
  extractedData: z.any(),
  anomalies: z.any(),
  decision: z.string(),
  confidence: z.string(),
  createdAt: z.date().optional(),
});

export const waitlistSchema = z.object({
  id: z.string().optional(),
  email: z.string().email(),
  name: z.string().nullable().optional(),
  createdAt: z.date().optional(),
});

export const ordersSchema = z.object({
  id: z.string().optional(),
  tenantId: z.string().default("tenant_default"),
  planId: z.string(),
  planName: z.string(),
  amount: z.string(),
  status: z.string(),
  customerEmail: z.string().email(),
  paymentMethod: z.string(),
  createdAt: z.date().optional(),
});

export const kycRecordsSchema = z.object({
  id: z.string().optional(),
  tenantId: z.string(),
  userId: z.string(),
  status: z.string(),
  documentType: z.string(),
  extractedInfo: z.any(),
  notes: z.string().nullable().optional(),
  createdAt: z.date().optional(),
});

export const creditAssessmentsSchema = z.object({
  id: z.string().optional(),
  tenantId: z.string(),
  userId: z.string(),
  score: z.string(),
  riskLevel: z.string(),
  recommendation: z.string(),
  metadata: z.any().nullable().optional(),
  createdAt: z.date().optional(),
});

// Zod insertion schemas (omit id and createdAt for inserts)
export const insertUserSchema = usersSchema.omit({ id: true, createdAt: true, consentSettings: true, mfaEnabled: true, mfaSecret: true });
export const insertTenantSchema = tenantsSchema.omit({ id: true, createdAt: true });
export const insertAuditLogSchema = auditLogsSchema.omit({ id: true, createdAt: true });
export const insertDemoRequestSchema = demoRequestsSchema.omit({ id: true, createdAt: true });
export const insertContactSubmissionSchema = contactSubmissionsSchema.omit({ id: true, createdAt: true });
export const insertTaxQuerySchema = taxQueriesSchema.omit({ id: true, createdAt: true });
export const insertSqlQuerySchema = sqlQueriesSchema.omit({ id: true, createdAt: true });
export const insertDocumentAnalysisSchema = documentAnalysisSchema.omit({ id: true, createdAt: true });
export const insertWaitlistSchema = waitlistSchema.omit({ id: true, createdAt: true });
export const insertOrderSchema = ordersSchema.omit({ id: true, createdAt: true });
export const insertKycRecordSchema = kycRecordsSchema.omit({ id: true, createdAt: true });
export const insertCreditAssessmentSchema = creditAssessmentsSchema.omit({ id: true, createdAt: true });

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = z.infer<typeof usersSchema>;

export type InsertAuditLog = z.infer<typeof insertAuditLogSchema>;
export type AuditLog = z.infer<typeof auditLogsSchema>;

export type InsertDemoRequest = z.infer<typeof insertDemoRequestSchema>;
export type DemoRequest = z.infer<typeof demoRequestsSchema>;

export type InsertContactSubmission = z.infer<typeof insertContactSubmissionSchema>;
export type ContactSubmission = z.infer<typeof contactSubmissionsSchema>;

export type InsertTaxQuery = z.infer<typeof insertTaxQuerySchema>;
export type TaxQuery = z.infer<typeof taxQueriesSchema>;

export type InsertSqlQuery = z.infer<typeof insertSqlQuerySchema>;
export type SqlQuery = z.infer<typeof sqlQueriesSchema>;

export type InsertDocumentAnalysis = z.infer<typeof insertDocumentAnalysisSchema>;
export type DocumentAnalysis = z.infer<typeof documentAnalysisSchema>;

export type InsertWaitlist = z.infer<typeof insertWaitlistSchema>;
export type Waitlist = z.infer<typeof waitlistSchema>;

export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = z.infer<typeof ordersSchema>;

export type InsertKycRecord = z.infer<typeof insertKycRecordSchema>;
export type KycRecord = z.infer<typeof kycRecordsSchema>;

export type InsertCreditAssessment = z.infer<typeof insertCreditAssessmentSchema>;
export type CreditAssessment = z.infer<typeof creditAssessmentsSchema>;

export type InsertTenant = z.infer<typeof insertTenantSchema>;
export type Tenant = z.infer<typeof tenantsSchema>;
