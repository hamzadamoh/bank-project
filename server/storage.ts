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
import { db } from "./db.js";

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

export class FirestoreStorage implements IStorage {
  constructor() {
    this.seedDefaultTenant();
  }

  private async seedDefaultTenant() {
    try {
      const doc = await db.collection("tenants").doc("tenant_default").get();
      if (!doc.exists) {
        await db.collection("tenants").doc("tenant_default").set({
          id: "tenant_default",
          name: "Default Tenant",
          region: "Morocco",
          tier: "Starter",
          queryLimit: "100",
          retentionDays: "30",
          mfaEnforced: false,
          ssoConfig: { enabled: false, provider: "local", domain: "" },
          createdAt: new Date()
        });
      }
    } catch (e) {
      console.error("Failed to seed default tenant:", e);
    }
  }

  async getUser(id: string): Promise<User | undefined> {
    try {
      console.log(`[STORAGE] Fetching user profile for UID: ${id}`);
      const doc = await db.collection("users").doc(id).get();
      if (!doc.exists) {
        console.log(`[STORAGE] User profile not found for UID: ${id}`);
        return undefined;
      }

      const data = doc.data() as User;
      if (data.createdAt && (data.createdAt as any).toDate) {
        data.createdAt = (data.createdAt as any).toDate();
      }
      console.log(`[STORAGE] User profile retrieved for: ${data.username} (UID: ${id})`);
      return { ...data, id };
    } catch (error: any) {
      console.error(`[STORAGE] Error fetching user profile for UID ${id}:`, error.message);
      throw error;
    }
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const snapshot = await db.collection("users").where("username", "==", username).limit(1).get();
    if (snapshot.empty) return undefined;

    const data = snapshot.docs[0].data() as User;
    if (data.createdAt && (data.createdAt as any).toDate) {
      data.createdAt = (data.createdAt as any).toDate();
    }
    return data;
  }

  async createUser(insertUser: InsertUser & { id?: string }): Promise<User> {
    const id = insertUser.id || randomUUID();
    const user: User = {
      ...(insertUser as any),
      id,
      tenantId: (insertUser as any).tenantId || "tenant_default",
      role: (insertUser as any).role || "client",
      consentSettings: {
        analytics: true,
        marketing: false,
        thirdParty: false
      },
      mfaEnabled: false,
      mfaSecret: null
    };
    await db.collection("users").doc(id).set(user);
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
    await db.collection("auditLogs").doc(id).set(log);
    return log;
  }

  async getAuditLogsByTenant(tenantId: string): Promise<AuditLog[]> {
    if (!tenantId) return [];
    const snapshot = await db.collection("auditLogs")
      .where("tenantId", "==", tenantId)
      .orderBy("createdAt", "desc")
      .get();

    return snapshot.docs.map(doc => {
      const data = doc.data() as AuditLog;
      if (data.createdAt && (data.createdAt as any).toDate) data.createdAt = (data.createdAt as any).toDate();
      return data;
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
      ssoConfig: insertTenant.ssoConfig || { enabled: false, provider: "local", domain: "" }
    };
    await db.collection("tenants").doc(id).set(tenant);
    return tenant;
  }

  async getTenant(id: string): Promise<Tenant | undefined> {
    const doc = await db.collection("tenants").doc(id).get();
    if (!doc.exists) return undefined;

    const data = doc.data() as Tenant;
    if (data.createdAt && (data.createdAt as any).toDate) data.createdAt = (data.createdAt as any).toDate();
    return data;
  }

  async getTenantByName(name: string): Promise<Tenant | undefined> {
    const snapshot = await db.collection("tenants").where("name", "==", name).limit(1).get();
    if (snapshot.empty) return undefined;

    const data = snapshot.docs[0].data() as Tenant;
    if (data.createdAt && (data.createdAt as any).toDate) data.createdAt = (data.createdAt as any).toDate();
    return data;
  }

  // Analytics
  async getUsageStats(tenantId: string): Promise<{
    analytics: { label: string; value: number; color: string }[];
    spend: number[];
    efficiency: number;
  }> {
    const logs = await this.getAuditLogsByTenant(tenantId);

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
      efficiency: 92
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
    await db.collection("demoRequests").doc(id).set(demoRequest);
    return demoRequest;
  }

  async getAllDemoRequests(): Promise<DemoRequest[]> {
    const snapshot = await db.collection("demoRequests").orderBy("createdAt", "desc").get();
    return snapshot.docs.map(doc => {
      const data = doc.data() as DemoRequest;
      if (data.createdAt && (data.createdAt as any).toDate) data.createdAt = (data.createdAt as any).toDate();
      return data;
    });
  }

  async getDemoRequest(id: string): Promise<DemoRequest | undefined> {
    const doc = await db.collection("demoRequests").doc(id).get();
    if (!doc.exists) return undefined;

    const data = doc.data() as DemoRequest;
    if (data.createdAt && (data.createdAt as any).toDate) data.createdAt = (data.createdAt as any).toDate();
    return data;
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
    await db.collection("contactSubmissions").doc(id).set(contact);
    return contact;
  }

  async getAllContactSubmissions(): Promise<ContactSubmission[]> {
    const snapshot = await db.collection("contactSubmissions").orderBy("createdAt", "desc").get();
    return snapshot.docs.map(doc => {
      const data = doc.data() as ContactSubmission;
      if (data.createdAt && (data.createdAt as any).toDate) data.createdAt = (data.createdAt as any).toDate();
      return data;
    });
  }

  async getContactSubmission(id: string): Promise<ContactSubmission | undefined> {
    const doc = await db.collection("contactSubmissions").doc(id).get();
    if (!doc.exists) return undefined;

    const data = doc.data() as ContactSubmission;
    if (data.createdAt && (data.createdAt as any).toDate) data.createdAt = (data.createdAt as any).toDate();
    return data;
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
    await db.collection("taxQueries").doc(id).set(taxQuery);
    return taxQuery;
  }

  async getTaxQueriesByTenant(tenantId: string): Promise<TaxQuery[]> {
    const snapshot = await db.collection("taxQueries")
      .where("tenantId", "==", tenantId)
      .orderBy("createdAt", "desc")
      .get();

    return snapshot.docs.map(doc => {
      const data = doc.data() as TaxQuery;
      if (data.createdAt && (data.createdAt as any).toDate) data.createdAt = (data.createdAt as any).toDate();
      return data;
    });
  }

  async getTaxQuery(id: string): Promise<TaxQuery | undefined> {
    const doc = await db.collection("taxQueries").doc(id).get();
    if (!doc.exists) return undefined;

    const data = doc.data() as TaxQuery;
    if (data.createdAt && (data.createdAt as any).toDate) data.createdAt = (data.createdAt as any).toDate();
    return data;
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
    await db.collection("sqlQueries").doc(id).set(sqlQuery);
    return sqlQuery;
  }

  async getSqlQueriesByTenant(tenantId: string): Promise<SqlQuery[]> {
    const snapshot = await db.collection("sqlQueries")
      .where("tenantId", "==", tenantId)
      .orderBy("createdAt", "desc")
      .get();

    return snapshot.docs.map(doc => {
      const data = doc.data() as SqlQuery;
      if (data.createdAt && (data.createdAt as any).toDate) data.createdAt = (data.createdAt as any).toDate();
      return data;
    });
  }

  async getSqlQuery(id: string): Promise<SqlQuery | undefined> {
    const doc = await db.collection("sqlQueries").doc(id).get();
    if (!doc.exists) return undefined;

    const data = doc.data() as SqlQuery;
    if (data.createdAt && (data.createdAt as any).toDate) data.createdAt = (data.createdAt as any).toDate();
    return data;
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
    await db.collection("documentAnalysis").doc(id).set(analysis);
    return analysis;
  }

  async getDocumentAnalysisByTenant(tenantId: string): Promise<DocumentAnalysis[]> {
    const snapshot = await db.collection("documentAnalysis")
      .where("tenantId", "==", tenantId)
      .orderBy("createdAt", "desc")
      .get();

    return snapshot.docs.map(doc => {
      const data = doc.data() as DocumentAnalysis;
      if (data.createdAt && (data.createdAt as any).toDate) data.createdAt = (data.createdAt as any).toDate();
      return data;
    });
  }

  async getDocumentAnalysis(id: string): Promise<DocumentAnalysis | undefined> {
    const doc = await db.collection("documentAnalysis").doc(id).get();
    if (!doc.exists) return undefined;

    const data = doc.data() as DocumentAnalysis;
    if (data.createdAt && (data.createdAt as any).toDate) data.createdAt = (data.createdAt as any).toDate();
    return data;
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
    await db.collection("waitlist").doc(id).set(waitlistEntry);
    return waitlistEntry;
  }

  async getAllWaitlistEntries(): Promise<Waitlist[]> {
    const snapshot = await db.collection("waitlist").orderBy("createdAt", "desc").get();
    return snapshot.docs.map(doc => {
      const data = doc.data() as Waitlist;
      if (data.createdAt && (data.createdAt as any).toDate) data.createdAt = (data.createdAt as any).toDate();
      return data;
    });
  }

  async getWaitlistEntry(id: string): Promise<Waitlist | undefined> {
    const doc = await db.collection("waitlist").doc(id).get();
    if (!doc.exists) return undefined;

    const data = doc.data() as Waitlist;
    if (data.createdAt && (data.createdAt as any).toDate) data.createdAt = (data.createdAt as any).toDate();
    return data;
  }

  async getWaitlistEntryByEmail(email: string): Promise<Waitlist | undefined> {
    const snapshot = await db.collection("waitlist").where("email", "==", email.toLowerCase()).limit(1).get();
    if (snapshot.empty) return undefined;

    const data = snapshot.docs[0].data() as Waitlist;
    if (data.createdAt && (data.createdAt as any).toDate) data.createdAt = (data.createdAt as any).toDate();
    return data;
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
    await db.collection("orders").doc(id).set(order);
    return order;
  }

  async getOrdersByTenant(tenantId: string): Promise<Order[]> {
    if (!tenantId) return [];
    const snapshot = await db.collection("orders")
      .where("tenantId", "==", tenantId)
      .orderBy("createdAt", "desc")
      .get();

    return snapshot.docs.map(doc => {
      const data = doc.data() as Order;
      if (data.createdAt && (data.createdAt as any).toDate) data.createdAt = (data.createdAt as any).toDate();
      return data;
    });
  }

  async getOrder(id: string): Promise<Order | undefined> {
    const doc = await db.collection("orders").doc(id).get();
    if (!doc.exists) return undefined;

    const data = doc.data() as Order;
    if (data.createdAt && (data.createdAt as any).toDate) data.createdAt = (data.createdAt as any).toDate();
    return data;
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
    await db.collection("kycRecords").doc(id).set(record);
    return record;
  }

  async getKycRecordsByTenant(tenantId: string): Promise<KycRecord[]> {
    const snapshot = await db.collection("kycRecords")
      .where("tenantId", "==", tenantId)
      .orderBy("createdAt", "desc")
      .get();

    return snapshot.docs.map(doc => {
      const data = doc.data() as KycRecord;
      if (data.createdAt && (data.createdAt as any).toDate) data.createdAt = (data.createdAt as any).toDate();
      return data;
    });
  }

  async getKycRecord(id: string): Promise<KycRecord | undefined> {
    const doc = await db.collection("kycRecords").doc(id).get();
    if (!doc.exists) return undefined;

    const data = doc.data() as KycRecord;
    if (data.createdAt && (data.createdAt as any).toDate) data.createdAt = (data.createdAt as any).toDate();
    return data;
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
    await db.collection("creditAssessments").doc(id).set(assessment);
    return assessment;
  }

  async getCreditAssessmentsByTenant(tenantId: string): Promise<CreditAssessment[]> {
    const snapshot = await db.collection("creditAssessments")
      .where("tenantId", "==", tenantId)
      .orderBy("createdAt", "desc")
      .get();

    return snapshot.docs.map(doc => {
      const data = doc.data() as CreditAssessment;
      if (data.createdAt && (data.createdAt as any).toDate) data.createdAt = (data.createdAt as any).toDate();
      return data;
    });
  }

  async getCreditAssessment(id: string): Promise<CreditAssessment | undefined> {
    const doc = await db.collection("creditAssessments").doc(id).get();
    if (!doc.exists) return undefined;

    const data = doc.data() as CreditAssessment;
    if (data.createdAt && (data.createdAt as any).toDate) data.createdAt = (data.createdAt as any).toDate();
    return data;
  }

  // Privacy & Data
  async deleteUserAccount(userId: string): Promise<void> {
    const userRef = db.collection("users").doc(userId);
    const userDoc = await userRef.get();
    if (!userDoc.exists) return;

    // We can't do cascading deletes easily without multiple queries
    // 1. Delete all audit logs for this user
    const logsSnap = await db.collection("auditLogs").where("userId", "==", userId).get();
    const batchDelete = async (snapshot: any) => {
      const b = db.batch();
      snapshot.forEach((doc: any) => b.delete(doc.ref));
      if (!snapshot.empty) await b.commit();
    };

    await batchDelete(logsSnap);

    // 2. Delete all KYC records for this user
    const kycSnap = await db.collection("kycRecords").where("userId", "==", userId).get();
    await batchDelete(kycSnap);

    // 3. Delete all Credit Assessments for this user
    const creditSnap = await db.collection("creditAssessments").where("userId", "==", userId).get();
    await batchDelete(creditSnap);

    // 4. Finally, delete the user
    await userRef.delete();
  }

  async updateUserConsent(userId: string, settings: any): Promise<void> {
    await db.collection("users").doc(userId).update({
      consentSettings: settings
    });
  }

  async applyRetentionPolicy(tenantId: string): Promise<void> {
    const tenant = await this.getTenant(tenantId);
    if (!tenant) return;

    const days = parseInt(tenant.retentionDays || "30");
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    // Using Firestore batch deletes for older documents
    const collectionsToPurge = ["taxQueries", "sqlQueries", "documentAnalysis", "orders", "auditLogs"];

    for (const col of collectionsToPurge) {
      try {
        const snapshot = await db.collection(col)
          .where("tenantId", "==", tenantId)
          .where("createdAt", "<", cutoffDate)
          .get();

        if (!snapshot.empty) {
          const b = db.batch();
          snapshot.forEach(doc => b.delete(doc.ref));
          await b.commit();
        }
      } catch (e) {
        console.error(`Error purging ${col}:`, e);
      }
    }
  }

  // Tokenization Vault
  async createToken(token: string, encryptedData: string): Promise<void> {
    await db.collection("vault").doc(token).set({ encryptedData });
  }

  async getToken(token: string): Promise<string | undefined> {
    const doc = await db.collection("vault").doc(token).get();
    if (!doc.exists) return undefined;
    return doc.data()?.encryptedData;
  }

  async updateUserMfa(userId: string, data: { secret?: string, enabled: boolean }): Promise<void> {
    const updateData: any = { mfaEnabled: data.enabled };
    if (data.secret !== undefined) {
      updateData.mfaSecret = data.secret;
    }
    await db.collection("users").doc(userId).update(updateData);
  }
}

export const storage = new FirestoreStorage();
