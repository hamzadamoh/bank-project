import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function QueryArchitectDemo() {
  const [mode, setMode] = useState<"nl_to_sql" | "sql_to_nl">("nl_to_sql");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleGenerate = async () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
    }, 1500);
  };

  return (
    <div className="mt-6">
      <Tabs value={mode} onValueChange={(value) => setMode(value as any)} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="nl_to_sql">NL → SQL</TabsTrigger>
          <TabsTrigger value="sql_to_nl">SQL → NL</TabsTrigger>
        </TabsList>
        
        <TabsContent value="nl_to_sql">
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-6">
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span className="text-sm font-medium text-slate-600">Natural Language Query</span>
                </div>
                <div className="bg-alabaster-50 rounded-xl p-4 text-sm font-mono">
                  "Show me total revenue by region for the last quarter, excluding refunds"
                </div>
              </div>
              
              <Button onClick={handleGenerate} disabled={isProcessing} size="sm">
                {isProcessing ? "Processing..." : "Generate SQL"}
              </Button>
            </div>
            
            <div className="bg-white rounded-2xl p-6">
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                  <span className="text-sm font-medium text-slate-600">Generated SQL</span>
                </div>
                {isProcessing ? (
                  <div className="bg-alabaster-50 rounded-xl p-4 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-2 border-ink-950 border-t-transparent"></div>
                  </div>
                ) : (
                  <div className="bg-ink-950 rounded-xl p-4 text-sm font-mono text-emerald-400 overflow-x-auto">
                    <pre>{`SELECT 
    r.region_name,
    SUM(o.total_amount) as revenue
FROM orders o
JOIN customers c ON o.customer_id = c.id
JOIN regions r ON c.region_id = r.id
WHERE o.created_at >= DATE_TRUNC('quarter', 
    CURRENT_DATE - INTERVAL '3 months')
    AND o.status != 'refunded'
GROUP BY r.region_name
ORDER BY revenue DESC;`}</pre>
                  </div>
                )}
              </div>
              
              {!isProcessing && (
                <div className="text-xs text-slate-600">
                  <span className="font-medium">Performance:</span> ~2.3s execution • 45,231 rows scanned
                </div>
              )}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="sql_to_nl">
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-6">
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 bg-slate-600 rounded-full"></div>
                  <span className="text-sm font-medium text-slate-600">SQL Query</span>
                </div>
                <div className="bg-ink-950 rounded-xl p-4 text-sm font-mono text-emerald-400 overflow-x-auto">
                  <pre>{`SELECT customer_id, COUNT(*) 
FROM transactions 
WHERE amount > 1000 
GROUP BY customer_id 
HAVING COUNT(*) > 5;`}</pre>
                </div>
              </div>
              
              <Button onClick={handleGenerate} disabled={isProcessing} size="sm">
                {isProcessing ? "Processing..." : "Explain Query"}
              </Button>
            </div>
            
            <div className="bg-white rounded-2xl p-6">
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span className="text-sm font-medium text-slate-600">Natural Language Explanation</span>
                </div>
                {isProcessing ? (
                  <div className="bg-alabaster-50 rounded-xl p-4 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-2 border-ink-950 border-t-transparent"></div>
                  </div>
                ) : (
                  <div className="bg-alabaster-50 rounded-xl p-4 text-sm">
                    This query identifies high-value customers by finding customer IDs that have more than 5 transactions above $1,000. It groups transactions by customer and counts them, then filters for customers exceeding the threshold.
                  </div>
                )}
              </div>
              
              {!isProcessing && (
                <div className="text-xs text-slate-600">
                  <span className="font-medium">Optimization:</span> Consider adding index on (customer_id, amount)
                </div>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
