// Mock data for demonstration purposes - this file provides realistic sample data
// for development and demo environments. In production, this data would come from APIs.

export const mockTaxResponses = {
  morocco_vat_saas: {
    shortAnswer: "Moroccan SaaS companies serving EU clients must apply 20% VAT domestically and trigger EU OSS registration above $10,000 annual sales.",
    explanation: "For Moroccan SaaS providers serving EU clients, the VAT treatment involves both domestic Moroccan obligations and potential EU compliance requirements.",
    details: [
      {
        title: "Moroccan VAT Application",
        content: "Under Article 87 of the General Tax Code (CGI), SaaS services are subject to 20% VAT when provided from Morocco, regardless of client location."
      },
      {
        title: "EU VAT Obligations",
        content: "For B2B clients in the EU, the reverse charge mechanism applies under EU Directive 2006/112/EC. EU businesses account for VAT in their member state."
      },
      {
        title: "OSS Registration Threshold",
        content: "Once annual EU B2C sales exceed $10,000, registration for the One-Stop Shop (OSS) system becomes mandatory per Note 728/2023."
      }
    ],
    checklist: [
      "Register for Moroccan VAT if not already done",
      "Implement reverse charge invoicing for EU B2B clients",
      "Monitor annual EU B2C sales threshold",
      "Consider OSS registration preparation",
      "Maintain proper documentation for cross-border services"
    ],
    citations: [
      { code: "Art. 87 CGI", description: "Morocco General Tax Code - Digital Services VAT" },
      { code: "EU Dir. 2006/112", description: "EU VAT Directive - Reverse Charge Mechanism" },
      { code: "Note 728/2023", description: "Morocco Tax Authority - Digital Services Clarification" }
    ],
    confidence: 95
  }
};

export const mockSQLQueries = {
  revenue_by_region: {
    input: "Show me total revenue by region for the last quarter, excluding refunds",
    output: `SELECT 
    r.region_name,
    SUM(o.total_amount) as total_revenue,
    COUNT(o.id) as order_count,
    AVG(o.total_amount) as avg_order_value
FROM orders o
JOIN customers c ON o.customer_id = c.id
JOIN regions r ON c.region_id = r.id
WHERE o.created_at >= DATE_TRUNC('quarter', 
    CURRENT_DATE - INTERVAL '3 months')
    AND o.status != 'refunded'
GROUP BY r.region_name, r.id
ORDER BY total_revenue DESC
LIMIT 100;`,
    performance: {
      executionTime: "~2.3s",
      rowsScanned: 45231,
      optimization: "Query uses proper indexing and includes LIMIT for safety"
    }
  },
  high_value_customers: {
    input: "SELECT customer_id, COUNT(*) FROM transactions WHERE amount > 1000 GROUP BY customer_id HAVING COUNT(*) > 5;",
    output: "This query identifies high-value customers by finding customer IDs that have made more than 5 transactions with individual amounts exceeding $1,000. It groups all transactions by customer_id, counts the number of transactions per customer, and then filters to only show customers who meet both criteria (>5 transactions AND each transaction >$1,000). The result shows customer IDs and their qualifying transaction counts.",
    performance: {
      executionTime: "~1.8s",
      rowsScanned: 28450,
      optimization: "Consider adding index on (customer_id, amount) for better performance"
    }
  }
};

export const mockFactoringAnalysis = {
  documentInfo: {
    filename: "Invoice_ABC_Corp_INV-2024-001.pdf",
    pages: 2,
    confidence: 98.5,
    processingTime: "2.3 seconds"
  },
  extractedData: {
    supplier: {
      name: "ABC Construction SARL",
      taxId: "123456789",
      address: "123 Rue Mohammed V, Casablanca",
      iban: "MA64011090000001234567890"
    },
    invoice: {
      number: "INV-2024-001",
      date: "2024-01-15",
      dueDate: "2024-02-15",
      currency: "MAD",
      totalHT: 104542.00,
      totalTVA: 20908.40,
      totalTTC: 125450.40
    },
    lineItems: [
      { description: "Construction Materials", quantity: 100, unitPrice: 524.21, total: 52421.00 },
      { description: "Labor Services", quantity: 40, unitPrice: 1303.03, total: 52121.00 }
    ]
  },
  anomalies: [
    {
      type: "IBAN_MISMATCH",
      severity: "HIGH",
      message: "IBAN differs from supplier master record",
      expected: "MA64011090000001234567123",
      found: "MA64011090000001234567890"
    },
    {
      type: "AMOUNT_VARIANCE",
      severity: "MEDIUM",
      message: "Line total variance exceeds threshold",
      variance: "0.02%"
    }
  ],
  poMatching: {
    poNumber: "PO-2024-0156",
    matchAccuracy: 98.5,
    lineItemMatches: [
      { matched: true, description: "Construction Materials", variance: 0 },
      { matched: true, description: "Labor Services", variance: 0.02 }
    ]
  },
  decision: {
    status: "ALERT",
    confidence: 85,
    recommendation: "Review IBAN change with supplier before processing"
  }
};

export const mockCompanyData = {
  trustPartners: [
    "Bank Al-Maghrib",
    "BMCE Group",
    "Attijariwafa",
    "CFG Bank",
    "Société Générale",
    "Credit Agricole"
  ],
  testimonials: [
    {
      quote: "FiscAI Tax Counsel has transformed our advisory practice. Multi-jurisdiction support and citation accuracy are exceptional.",
      author: "Sarah Benali",
      role: "Partner, KPMG Morocco",
      rating: 5
    },
    {
      quote: "Factoring Guardian caught fraudulent invoices our manual process missed. ROI was immediate.",
      author: "Ahmed Tazi",
      role: "Risk Director, Al Barid Bank",
      rating: 5
    },
    {
      quote: "Query Architect democratized data access across our organization. Non-technical teams now run complex analyses.",
      author: "Marie Dubois",
      role: "CFO, Société Générale Maroc",
      rating: 5
    }
  ]
};
