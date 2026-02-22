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
  type InsertCreditAssessment
} from "../shared/schema.js";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Audit Logs (New)
  createAuditLog(log: InsertAuditLog): Promise<AuditLog>;
  getAuditLogsByTenant(tenantId: string): Promise<AuditLog[]>;

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
    const user: User = { ...insertUser, id, tenantId: insertUser.tenantId || "tenant_default" };
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
    return Array.from(this.auditLogs.values())
      .filter(log => log.tenantId === tenantId)
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
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
    return Array.from(this.orders.values())
      .filter(o => o.tenantId === tenantId)
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }

  async getOrder(id: string): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  // KYC
  async createKycRecord(insertRecord: InsertKycRecord): Promise<KycRecord> {
    const id = randomUUID();
    const record: KycRecord = {
      ...insertRecord,
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
}

export const storage = new MemStorage();
