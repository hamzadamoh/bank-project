import {
  type User,
  type InsertUser,
  type DemoRequest,
  type InsertDemoRequest,
  type ContactSubmission,
  type InsertContactSubmission,
  type TaxQuery,
  type InsertTaxQuery,
  type SqlQuery,
  type InsertSqlQuery,
  type DocumentAnalysis,
  type InsertDocumentAnalysis,
  type Waitlist,
  type InsertWaitlist,
  type Order,
  type InsertOrder,
  type AuditLog,
  type InsertAuditLog,
  type KycRecord,
  type InsertKycRecord,
  type CreditAssessment,
  type InsertCreditAssessment,
  type Tenant,
  type InsertTenant
} from "../shared/schema.js";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Audit Logs (New)
  createAuditLog(log: InsertAuditLog): Promise<AuditLog>;
  getAuditLogsByTenant(tenantId: string): Promise<AuditLog[]>;

  // Tenants
  createTenant(tenant: InsertTenant): Promise<Tenant>;
  getTenant(id: string): Promise<Tenant | undefined>;
  getTenantByName(name: string): Promise<Tenant | undefined>;

  // Analytics
  getUsageStats(tenantId: string): Promise<{
    analytics: { label: string; value: number; color: string }[];
    spend: number[];
    efficiency: number;
  }>;

  // Demo requests (Tenant independent for now)
  createDemoRequest(demoRequest: InsertDemoRequest): Promise<DemoRequest>;
  getAllDemoRequests(): Promise<DemoRequest[]>;
  getDemoRequest(id: string): Promise<DemoRequest | undefined>;

  // Contact submissions
  createContactSubmission(contact: InsertContactSubmission): Promise<ContactSubmission>;
  getAllContactSubmissions(): Promise<ContactSubmission[]>;
  getContactSubmission(id: string): Promise<ContactSubmission | undefined>;

  // Tax queries (Tenant isolated)
  createTaxQuery(taxQuery: InsertTaxQuery): Promise<TaxQuery>;
  getTaxQueriesByTenant(tenantId: string): Promise<TaxQuery[]>;
  getTaxQuery(id: string): Promise<TaxQuery | undefined>;

  // SQL queries (Tenant isolated)
  createSqlQuery(sqlQuery: InsertSqlQuery): Promise<SqlQuery>;
  getSqlQueriesByTenant(tenantId: string): Promise<SqlQuery[]>;
  getSqlQuery(id: string): Promise<SqlQuery | undefined>;

  // Document analysis (Tenant isolated)
  createDocumentAnalysis(analysis: InsertDocumentAnalysis): Promise<DocumentAnalysis>;
  getDocumentAnalysisByTenant(tenantId: string): Promise<DocumentAnalysis[]>;
  getDocumentAnalysis(id: string): Promise<DocumentAnalysis | undefined>;

  // Waitlist
  createWaitlistEntry(waitlist: InsertWaitlist): Promise<Waitlist>;
  getAllWaitlistEntries(): Promise<Waitlist[]>;
  getWaitlistEntry(id: string): Promise<Waitlist | undefined>;
  getWaitlistEntryByEmail(email: string): Promise<Waitlist | undefined>;

  // Orders (Tenant isolated)
  createOrder(order: InsertOrder): Promise<Order>;
  getOrdersByTenant(tenantId: string): Promise<Order[]>;
  getOrder(id: string): Promise<Order | undefined>;

  // KYC (Tenant isolated)
  createKycRecord(record: InsertKycRecord): Promise<KycRecord>;
  getKycRecordsByTenant(tenantId: string): Promise<KycRecord[]>;
  getKycRecord(id: string): Promise<KycRecord | undefined>;

  // Credit Assessments (Tenant isolated)
  createCreditAssessment(assessment: InsertCreditAssessment): Promise<CreditAssessment>;
  getCreditAssessmentsByTenant(tenantId: string): Promise<CreditAssessment[]>;
  getCreditAssessment(id: string): Promise<CreditAssessment | undefined>;

  // Privacy & Data (New)
  deleteUserAccount(userId: string): Promise<void>;
  updateUserConsent(userId: string, settings: any): Promise<void>;
  applyRetentionPolicy(tenantId: string): Promise<void>;


  // Tokenization Vault (New)
  createToken(token: string, encryptedData: string): Promise<void>;
  getToken(token: string): Promise<string | undefined>;

  // MFA Management
  updateUserMfa(userId: string, data: { secret?: string, enabled: boolean }): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private demoRequests: Map<string, DemoRequest>;
  private contactSubmissions: Map<string, ContactSubmission>;
  private taxQueries: Map<string, TaxQuery>;
  private sqlQueries: Map<string, SqlQuery>;
  private documentAnalysis: Map<string, DocumentAnalysis>;
  private waitlist: Map<string, Waitlist>;
  private orders: Map<string, Order>;
  private auditLogs: Map<string, AuditLog>;
  private kycRecords: Map<string, KycRecord>;
  private creditAssessments: Map<string, CreditAssessment>;
  private tenants: Map<string, Tenant>;
  private tokens: Map<string, string>; // Tokenization vault

  constructor() {
    this.users = new Map();
    this.demoRequests = new Map();
    this.contactSubmissions = new Map();
    this.taxQueries = new Map();
    this.sqlQueries = new Map();
    this.documentAnalysis = new Map();
    this.waitlist = new Map();
    this.orders = new Map();
    this.auditLogs = new Map();
    this.kycRecords = new Map();
    this.creditAssessments = new Map();
    this.tenants = new Map();
    this.tokens = new Map();

    // Seed default tenant
    this.createTenant({
      name: "Default Tenant",
      region: "Morocco",
      tier: "Starter",
      queryLimit: "100",
      ssoConfig: { enabled: false, provider: "local", domain: "" }
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = {
      ...insertUser,
      id,
      tenantId: insertUser.tenantId || "tenant_default",
      role: insertUser.role || "client",
      consentSettings: {
        analytics: true,
        marketing: false,
        thirdParty: false
      },
      mfaEnabled: false,
      mfaSecret: null
    };
    this.users.set(id, user);
    return user;
  }

  // Audit Logs
  async createAuditLog(insertLog: InsertAuditLog): Promise<AuditLog> {
    const id = randomUUID();
    const log: AuditLog = {
      ...insertLog,
      id,
      userId: insertLog.userId ?? null,
      ipAddress: insertLog.ipAddress ?? null,
      createdAt: new Date()
    };
    this.auditLogs.set(id, log);
    return log;
  }

  async getAuditLogsByTenant(tenantId: string): Promise<AuditLog[]> {
    if (!tenantId) return [];
    return Array.from(this.auditLogs.values())
      .filter(log => log.tenantId === tenantId)
      .sort((a, b) => {
        const timeA = a.createdAt instanceof Date ? a.createdAt.getTime() : 0;
        const timeB = b.createdAt instanceof Date ? b.createdAt.getTime() : 0;
        return timeB - timeA;
      });
  }

  // Tenants
  async createTenant(insertTenant: InsertTenant): Promise<Tenant> {
    const id = insertTenant.name === "Default Tenant" ? "tenant_default" : randomUUID();
    const tenant: Tenant = {
      ...insertTenant,
      id,
      createdAt: new Date(),
      region: insertTenant.region || "Morocco",
      tier: insertTenant.tier || "Starter",
      queryLimit: insertTenant.queryLimit || "100",
      retentionDays: insertTenant.retentionDays || "30",
      mfaEnforced: insertTenant.mfaEnforced || false,
      ssoConfig: insertTenant.ssoConfig || { enabled: false, provider: "local", domain: "" },

    };
    this.tenants.set(id, tenant);
    return tenant;
  }

  async getTenant(id: string): Promise<Tenant | undefined> {
    return this.tenants.get(id);
  }

  async getTenantByName(name: string): Promise<Tenant | undefined> {
    return Array.from(this.tenants.values()).find(t => t.name === name);
  }

  // Analytics
  async getUsageStats(tenantId: string): Promise<{
    analytics: { label: string; value: number; color: string }[];
    spend: number[];
    efficiency: number;
  }> {
    const logs = Array.from(this.auditLogs.values()).filter(l => l.tenantId === tenantId);

    // Calculate module distribution
    const counts: Record<string, number> = {
      "TAX_COUNSEL": logs.filter(l => l.resource === "TAX_COUNSEL").length,
      "QUERY_ARCHITECT": logs.filter(l => l.resource === "QUERY_ARCHITECT").length,
      "polyglot": logs.filter(l => l.resource === "polyglot").length,
    };

    const total = Object.values(counts).reduce((a, b) => a + b, 0) || 1;

    const analytics = [
      { label: "TaxWise", value: Math.round((counts.TAX_COUNSEL / total) * 100), color: "bg-emerald-400" },
      { label: "QueryForge", value: Math.round((counts.QUERY_ARCHITECT / total) * 100), color: "bg-blue-400" },
      { label: "PolyGlot", value: Math.round((counts.polyglot / total) * 100), color: "bg-slate-400" },
    ];

    // Mock spend (for now, based on query volume)
    const spend = [30, 45, 25, 60, 80, 55, logs.length % 100];

    return {
      analytics,
      spend,
      efficiency: 92 // Logic for efficiency could be more complex
    };
  }

  // Demo requests
  async createDemoRequest(insertDemoRequest: InsertDemoRequest): Promise<DemoRequest> {
    const id = randomUUID();
    const demoRequest: DemoRequest = {
      ...insertDemoRequest,
      message: insertDemoRequest.message ?? null,
      id,
      createdAt: new Date()
    };
    this.demoRequests.set(id, demoRequest);
    return demoRequest;
  }

  async getAllDemoRequests(): Promise<DemoRequest[]> {
    return Array.from(this.demoRequests.values())
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }

  async getDemoRequest(id: string): Promise<DemoRequest | undefined> {
    return this.demoRequests.get(id);
  }

  // Contact submissions
  async createContactSubmission(insertContact: InsertContactSubmission): Promise<ContactSubmission> {
    const id = randomUUID();
    const contact: ContactSubmission = {
      ...insertContact,
      company: insertContact.company ?? null,
      id,
      createdAt: new Date()
    };
    this.contactSubmissions.set(id, contact);
    return contact;
  }

  async getAllContactSubmissions(): Promise<ContactSubmission[]> {
    return Array.from(this.contactSubmissions.values())
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }

  async getContactSubmission(id: string): Promise<ContactSubmission | undefined> {
    return this.contactSubmissions.get(id);
  }

  // Tax queries
  async createTaxQuery(insertTaxQuery: InsertTaxQuery): Promise<TaxQuery> {
    const id = randomUUID();
    const taxQuery: TaxQuery = {
      ...insertTaxQuery,
      id,
      tenantId: insertTaxQuery.tenantId ?? "tenant_default",
      createdAt: new Date()
    };
    this.taxQueries.set(id, taxQuery);
    return taxQuery;
  }

  async getTaxQueriesByTenant(tenantId: string): Promise<TaxQuery[]> {
    return Array.from(this.taxQueries.values())
      .filter(q => q.tenantId === tenantId)
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }

  async getTaxQuery(id: string): Promise<TaxQuery | undefined> {
    return this.taxQueries.get(id);
  }

  // SQL queries
  async createSqlQuery(insertSqlQuery: InsertSqlQuery): Promise<SqlQuery> {
    const id = randomUUID();
    const sqlQuery: SqlQuery = {
      ...insertSqlQuery,
      metadata: insertSqlQuery.metadata ?? null,
      id,
      tenantId: insertSqlQuery.tenantId ?? "tenant_default",
      createdAt: new Date()
    };
    this.sqlQueries.set(id, sqlQuery);
    return sqlQuery;
  }

  async getSqlQueriesByTenant(tenantId: string): Promise<SqlQuery[]> {
    return Array.from(this.sqlQueries.values())
      .filter(q => q.tenantId === tenantId)
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }

  async getSqlQuery(id: string): Promise<SqlQuery | undefined> {
    return this.sqlQueries.get(id);
  }

  // Document analysis
  async createDocumentAnalysis(insertAnalysis: InsertDocumentAnalysis): Promise<DocumentAnalysis> {
    const id = randomUUID();
    const analysis: DocumentAnalysis = {
      ...insertAnalysis,
      id,
      tenantId: insertAnalysis.tenantId ?? "tenant_default",
      createdAt: new Date()
    };
    this.documentAnalysis.set(id, analysis);
    return analysis;
  }

  async getDocumentAnalysisByTenant(tenantId: string): Promise<DocumentAnalysis[]> {
    return Array.from(this.documentAnalysis.values())
      .filter(a => a.tenantId === tenantId)
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }

  async getDocumentAnalysis(id: string): Promise<DocumentAnalysis | undefined> {
    return this.documentAnalysis.get(id);
  }

  // Waitlist
  async createWaitlistEntry(insertWaitlist: InsertWaitlist): Promise<Waitlist> {
    const existing = await this.getWaitlistEntryByEmail(insertWaitlist.email);
    if (existing) throw new Error('Email already registered on waitlist');

    const id = randomUUID();
    const waitlistEntry: Waitlist = {
      ...insertWaitlist,
      name: insertWaitlist.name ?? null,
      id,
      createdAt: new Date()
    };
    this.waitlist.set(id, waitlistEntry);
    return waitlistEntry;
  }

  async getAllWaitlistEntries(): Promise<Waitlist[]> {
    return Array.from(this.waitlist.values())
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }

  async getWaitlistEntry(id: string): Promise<Waitlist | undefined> {
    return this.waitlist.get(id);
  }

  async getWaitlistEntryByEmail(email: string): Promise<Waitlist | undefined> {
    return Array.from(this.waitlist.values()).find(
      (entry) => entry.email.toLowerCase() === email.toLowerCase()
    );
  }

  // Orders
  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const id = randomUUID();
    const order: Order = {
      ...insertOrder,
      id,
      tenantId: insertOrder.tenantId ?? "tenant_default",
      createdAt: new Date()
    };
    this.orders.set(id, order);
    return order;
  }

  async getOrdersByTenant(tenantId: string): Promise<Order[]> {
    if (!tenantId) return [];
    return Array.from(this.orders.values())
      .filter(o => o.tenantId === tenantId)
      .sort((a, b) => {
        const timeA = a.createdAt instanceof Date ? a.createdAt.getTime() : 0;
        const timeB = b.createdAt instanceof Date ? b.createdAt.getTime() : 0;
        return timeB - timeA;
      });
  }

  async getOrder(id: string): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  // KYC
  async createKycRecord(insertRecord: InsertKycRecord): Promise<KycRecord> {
    const id = randomUUID();
    const record: KycRecord = {
      ...insertRecord,
      tenantId: insertRecord.tenantId || "tenant_default",
      notes: insertRecord.notes ?? null,
      id,
      createdAt: new Date()
    };
    this.kycRecords.set(id, record);
    return record;
  }

  async getKycRecordsByTenant(tenantId: string): Promise<KycRecord[]> {
    return Array.from(this.kycRecords.values())
      .filter(r => r.tenantId === tenantId)
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }

  async getKycRecord(id: string): Promise<KycRecord | undefined> {
    return this.kycRecords.get(id);
  }

  // Credit Assessments
  async createCreditAssessment(insertAssessment: InsertCreditAssessment): Promise<CreditAssessment> {
    const id = randomUUID();
    const assessment: CreditAssessment = {
      ...insertAssessment,
      tenantId: insertAssessment.tenantId || "tenant_default",
      metadata: insertAssessment.metadata ?? null,
      id,
      createdAt: new Date()
    };
    this.creditAssessments.set(id, assessment);
    return assessment;
  }

  async getCreditAssessmentsByTenant(tenantId: string): Promise<CreditAssessment[]> {
    return Array.from(this.creditAssessments.values())
      .filter(a => a.tenantId === tenantId)
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }

  async getCreditAssessment(id: string): Promise<CreditAssessment | undefined> {
    return this.creditAssessments.get(id);
  }

  // Privacy & Data
  async deleteUserAccount(userId: string): Promise<void> {
    const user = this.users.get(userId);
    if (!user) return;

    // 1. Delete all audit logs for this user
    for (const [id, log] of Array.from(this.auditLogs.entries())) {
      if (log.userId === userId) this.auditLogs.delete(id);
    }

    // 2. Delete all KYC records for this user
    for (const [id, record] of Array.from(this.kycRecords.entries())) {
      if (record.userId === userId) this.kycRecords.delete(id);
    }

    // 3. Delete all Credit Assessments for this user
    for (const [id, assessment] of Array.from(this.creditAssessments.entries())) {
      if (assessment.userId === userId) this.creditAssessments.delete(id);
    }

    // 4. Finally, delete the user
    this.users.delete(userId);
  }

  async updateUserConsent(userId: string, settings: any): Promise<void> {
    const user = this.users.get(userId);
    if (!user) throw new Error("User not found");

    this.users.set(userId, { ...user, consentSettings: settings });
  }

  async applyRetentionPolicy(tenantId: string): Promise<void> {
    const tenant = await this.getTenant(tenantId);
    if (!tenant) return;

    const days = parseInt(tenant.retentionDays || "30");
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);

    // Filter and delete old records across all tenant-isolated tables
    const purgeMap = (map: Map<string, any>) => {
      for (const [id, record] of Array.from(map.entries())) {
        const createdAt = record.createdAt;
        if (record.tenantId === tenantId && createdAt && createdAt < cutoff) {
          map.delete(id);
        }
      }
    };

    purgeMap(this.taxQueries);
    purgeMap(this.sqlQueries);
    purgeMap(this.documentAnalysis);
    purgeMap(this.orders);
    purgeMap(this.auditLogs);
  }

  // Tokenization Vault
  async createToken(token: string, encryptedData: string): Promise<void> {
    this.tokens.set(token, encryptedData);
  }

  async getToken(token: string): Promise<string | undefined> {
    return this.tokens.get(token);
  }

  async updateUserMfa(userId: string, data: { secret?: string, enabled: boolean }): Promise<void> {
    const user = this.users.get(userId);
    if (!user) throw new Error("User not found");

    if (data.secret !== undefined) user.mfaSecret = data.secret;
    user.mfaEnabled = data.enabled;
    this.users.set(userId, user);
  }


}

export const storage = new MemStorage();
