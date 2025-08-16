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
  type InsertDocumentAnalysis
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Demo requests
  createDemoRequest(demoRequest: InsertDemoRequest): Promise<DemoRequest>;
  getAllDemoRequests(): Promise<DemoRequest[]>;
  getDemoRequest(id: string): Promise<DemoRequest | undefined>;
  
  // Contact submissions
  createContactSubmission(contact: InsertContactSubmission): Promise<ContactSubmission>;
  getAllContactSubmissions(): Promise<ContactSubmission[]>;
  getContactSubmission(id: string): Promise<ContactSubmission | undefined>;
  
  // Tax queries
  createTaxQuery(taxQuery: InsertTaxQuery): Promise<TaxQuery>;
  getAllTaxQueries(): Promise<TaxQuery[]>;
  getTaxQuery(id: string): Promise<TaxQuery | undefined>;
  
  // SQL queries
  createSqlQuery(sqlQuery: InsertSqlQuery): Promise<SqlQuery>;
  getAllSqlQueries(): Promise<SqlQuery[]>;
  getSqlQuery(id: string): Promise<SqlQuery | undefined>;
  
  // Document analysis
  createDocumentAnalysis(analysis: InsertDocumentAnalysis): Promise<DocumentAnalysis>;
  getAllDocumentAnalysis(): Promise<DocumentAnalysis[]>;
  getDocumentAnalysis(id: string): Promise<DocumentAnalysis | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private demoRequests: Map<string, DemoRequest>;
  private contactSubmissions: Map<string, ContactSubmission>;
  private taxQueries: Map<string, TaxQuery>;
  private sqlQueries: Map<string, SqlQuery>;
  private documentAnalysis: Map<string, DocumentAnalysis>;

  constructor() {
    this.users = new Map();
    this.demoRequests = new Map();
    this.contactSubmissions = new Map();
    this.taxQueries = new Map();
    this.sqlQueries = new Map();
    this.documentAnalysis = new Map();
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
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
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
      createdAt: new Date()
    };
    this.taxQueries.set(id, taxQuery);
    return taxQuery;
  }

  async getAllTaxQueries(): Promise<TaxQuery[]> {
    return Array.from(this.taxQueries.values())
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
      createdAt: new Date()
    };
    this.sqlQueries.set(id, sqlQuery);
    return sqlQuery;
  }

  async getAllSqlQueries(): Promise<SqlQuery[]> {
    return Array.from(this.sqlQueries.values())
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
      createdAt: new Date()
    };
    this.documentAnalysis.set(id, analysis);
    return analysis;
  }

  async getAllDocumentAnalysis(): Promise<DocumentAnalysis[]> {
    return Array.from(this.documentAnalysis.values())
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }

  async getDocumentAnalysis(id: string): Promise<DocumentAnalysis | undefined> {
    return this.documentAnalysis.get(id);
  }
}

export const storage = new MemStorage();
