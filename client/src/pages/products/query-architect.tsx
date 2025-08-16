import Navigation from "@/components/layout/navigation";
import Footer from "@/components/layout/footer";
import { GlassCard } from "@/components/ui/glass-card";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Database, Zap, Shield } from "lucide-react";

export default function QueryArchitect() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<"nl_to_sql" | "sql_to_nl">("nl_to_sql");

  const sampleQueries = {
    nl_to_sql: [
      "Show me total revenue by region for Q4 2024",
      "Find customers with more than 5 transactions over $1000",
      "Calculate monthly recurring revenue growth rate"
    ],
    sql_to_nl: [
      "SELECT customer_id, COUNT(*) FROM orders WHERE amount > 1000 GROUP BY customer_id HAVING COUNT(*) > 5;",
      "SELECT DATE_TRUNC('month', created_at), SUM(amount) FROM transactions WHERE status = 'completed' GROUP BY 1;",
      "SELECT p.name, SUM(oi.quantity * oi.price) FROM products p JOIN order_items oi ON p.id = oi.product_id GROUP BY p.name;"
    ]
  };

  const handleGenerate = async () => {
    setIsLoading(true);
    
    setTimeout(() => {
      if (mode === "nl_to_sql") {
        setOutput(`SELECT 
    r.region_name,
    SUM(o.total_amount) as total_revenue,
    COUNT(o.id) as order_count,
    AVG(o.total_amount) as avg_order_value
FROM orders o
JOIN customers c ON o.customer_id = c.id
JOIN regions r ON c.region_id = r.id
WHERE o.created_at >= '2024-10-01'
    AND o.created_at < '2025-01-01'
    AND o.status = 'completed'
GROUP BY r.region_name, r.id
ORDER BY total_revenue DESC
LIMIT 100;`);
      } else {
        setOutput("This query identifies high-value customers by finding customer IDs that have made more than 5 transactions with individual amounts exceeding $1,000. It groups all transactions by customer_id, counts the number of transactions per customer, and then filters to only show customers who meet both criteria (>5 transactions AND each transaction >$1,000). The result shows customer IDs and their qualifying transaction counts.");
      }
      setIsLoading(false);
    }, 1500);
  };

  const handleSampleClick = (sample: string) => {
    setInput(sample);
    setOutput("");
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-16 px-6 lg:px-8 bg-gradient-to-br from-alabaster-50 to-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="font-display font-bold text-4xl md:text-5xl text-ink-950 mb-6">
                Query Architect
              </h1>
              <p className="text-xl text-slate-700 max-w-3xl mx-auto">
                Bidirectional NL ⇄ SQL conversion with expert guidance. Transform business questions into optimized queries and complex SQL into plain English explanations.
              </p>
            </div>

            {/* Interactive Demo */}
            <GlassCard className="max-w-6xl mx-auto p-8">
              <div className="mb-6">
                <h3 className="font-display font-bold text-2xl text-ink-950 mb-4">Live Demo</h3>
                
                <Tabs value={mode} onValueChange={(value) => setMode(value as any)} className="mb-6">
                  <TabsList className="grid w-full max-w-md grid-cols-2">
                    <TabsTrigger value="nl_to_sql">Natural Language → SQL</TabsTrigger>
                    <TabsTrigger value="sql_to_nl">SQL → Natural Language</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              <div className="grid lg:grid-cols-2 gap-8">
                {/* Input Side */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span className="text-sm font-medium text-slate-600">
                      {mode === "nl_to_sql" ? "Natural Language Query" : "SQL Query"}
                    </span>
                  </div>
                  
                  <Textarea
                    placeholder={mode === "nl_to_sql" 
                      ? "Describe what you want to know in plain English..."
                      : "Paste your SQL query here..."
                    }
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="h-32 mb-4 font-mono text-sm"
                  />
                  
                  <Button onClick={handleGenerate} disabled={!input.trim() || isLoading} className="mb-4">
                    {isLoading ? "Processing..." : (mode === "nl_to_sql" ? "Generate SQL" : "Explain Query")}
                  </Button>

                  {/* Sample Queries */}
                  <div>
                    <p className="text-sm text-slate-600 mb-2">Sample {mode === "nl_to_sql" ? "questions" : "queries"}:</p>
                    <div className="space-y-2">
                      {sampleQueries[mode].map((sample, index) => (
                        <button
                          key={index}
                          onClick={() => handleSampleClick(sample)}
                          className="block w-full text-left text-xs bg-alabaster-50 hover:bg-alabaster-100 rounded-lg p-3 transition-colors"
                        >
                          {sample}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Output Side */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                    <span className="text-sm font-medium text-slate-600">
                      {mode === "nl_to_sql" ? "Generated SQL" : "Natural Language Explanation"}
                    </span>
                  </div>
                  
                  {isLoading ? (
                    <div className="bg-alabaster-50 rounded-xl p-8 flex items-center justify-center h-32">
                      <div className="animate-spin rounded-full h-6 w-6 border-2 border-ink-950 border-t-transparent"></div>
                    </div>
                  ) : output ? (
                    <div className={`rounded-xl p-4 h-64 overflow-y-auto ${
                      mode === "nl_to_sql" 
                        ? "bg-ink-950 text-emerald-400" 
                        : "bg-alabaster-50 text-slate-700"
                    }`}>
                      <pre className="text-sm font-mono whitespace-pre-wrap">{output}</pre>
                    </div>
                  ) : (
                    <div className="bg-alabaster-50 rounded-xl p-8 h-32 flex items-center justify-center text-slate-500 text-sm">
                      {mode === "nl_to_sql" ? "Generated SQL will appear here" : "Explanation will appear here"}
                    </div>
                  )}

                  {output && !isLoading && (
                    <div className="mt-4 space-y-2">
                      <div className="flex gap-2 text-xs">
                        <Badge variant="outline">Performance: ~1.2s execution</Badge>
                        <Badge variant="outline">Rows: 12,450 scanned</Badge>
                      </div>
                      
                      {mode === "nl_to_sql" && (
                        <div className="text-xs text-slate-600">
                          <span className="font-medium">Optimization tips:</span> Query uses proper indexing and includes LIMIT for safety
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </GlassCard>
          </div>
        </section>

        {/* Features */}
        <section className="py-24 px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="font-display font-bold text-4xl text-ink-950 mb-6">
                Powerful Query Intelligence
              </h2>
              <p className="text-xl text-slate-700 max-w-3xl mx-auto">
                Built on Arctic-Text2SQL-R1-7B with advanced RAG architecture for enterprise data workflows.
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-champagne-200 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                  <Database className="h-8 w-8 text-ink-950" />
                </div>
                <h3 className="font-display font-bold text-xl text-ink-950 mb-3">Multi-Dialect Support</h3>
                <p className="text-slate-700">
                  Works with Snowflake, PostgreSQL, and ANSI SQL with intelligent dialect detection and optimization.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-champagne-200 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                  <Zap className="h-8 w-8 text-ink-950" />
                </div>
                <h3 className="font-display font-bold text-xl text-ink-950 mb-3">Performance Insights</h3>
                <p className="text-slate-700">
                  Get execution estimates, optimization hints, and performance recommendations for every query.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-champagne-200 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                  <Shield className="h-8 w-8 text-ink-950" />
                </div>
                <h3 className="font-display font-bold text-xl text-ink-950 mb-3">Security Guardrails</h3>
                <p className="text-slate-700">
                  Built-in row-level security, data masking, and access controls protect sensitive information.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Schema Preview */}
        <section className="py-24 px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="font-display font-bold text-4xl text-ink-950 mb-6">
                Smart Schema Understanding
              </h2>
              <p className="text-xl text-slate-700 max-w-3xl mx-auto">
                Query Architect learns your database structure and business logic to generate contextually aware SQL.
              </p>
            </div>

            <GlassCard className="p-8">
              <div className="grid lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-semibold text-ink-950 mb-4">Detected Schema</h3>
                  <div className="bg-ink-950 rounded-xl p-4 text-emerald-400 font-mono text-sm overflow-x-auto">
                    <pre>{`Tables:
├── customers (id, name, email, region_id)
├── orders (id, customer_id, total_amount, status)
├── regions (id, region_name, country)
├── products (id, name, category, price)
└── order_items (order_id, product_id, quantity)

Relationships:
customers.region_id → regions.id
orders.customer_id → customers.id
order_items.order_id → orders.id
order_items.product_id → products.id`}</pre>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-ink-950 mb-4">Business Rules</h3>
                  <div className="space-y-4">
                    <div className="bg-white rounded-xl p-4 border border-alabaster-200">
                      <div className="font-medium text-ink-950 mb-2">Revenue Calculations</div>
                      <div className="text-sm text-slate-700">Always exclude refunded orders when calculating revenue metrics</div>
                    </div>
                    <div className="bg-white rounded-xl p-4 border border-alabaster-200">
                      <div className="font-medium text-ink-950 mb-2">Date Filtering</div>
                      <div className="text-sm text-slate-700">Use created_at for time-based queries unless specified otherwise</div>
                    </div>
                    <div className="bg-white rounded-xl p-4 border border-alabaster-200">
                      <div className="font-medium text-ink-950 mb-2">Performance Limits</div>
                      <div className="text-sm text-slate-700">Auto-add LIMIT 100 to prevent runaway queries</div>
                    </div>
                  </div>
                </div>
              </div>
            </GlassCard>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
