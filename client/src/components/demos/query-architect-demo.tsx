import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { apiRequest } from "@/lib/queryClient";

export default function QueryArchitectDemo() {
  const [mode, setMode] = useState<"nl_to_sql" | "sql_to_nl">("nl_to_sql");
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleGenerate = async () => {
    setIsProcessing(true);
    setResult(null);

    try {
      const input = mode === "nl_to_sql"
        ? "Show me total revenue by region for the last quarter, excluding refunds"
        : "SELECT customer_id, COUNT(*) FROM transactions WHERE amount > 1000 GROUP BY customer_id HAVING COUNT(*) > 5;";

      const res = await apiRequest("POST", "/api/demo/sql-queries", {
        type: mode,
        input
      });
      const data = await res.json();
      setResult(data);
    } catch (error) {
      console.error("SQL query failed:", error);
    } finally {
      setIsProcessing(false);
    }
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
                  <div className="bg-alabaster-50 rounded-xl p-4 flex items-center justify-center min-h-[100px]">
                    <div className="animate-spin rounded-full h-6 w-6 border-2 border-ink-950 border-t-transparent"></div>
                  </div>
                ) : result?.output ? (
                  <div className="bg-ink-950 rounded-xl p-4 text-sm font-mono text-emerald-400 overflow-x-auto min-h-[100px]">
                    <pre>{result.output}</pre>
                  </div>
                ) : (
                  <div className="bg-alabaster-50 rounded-xl p-4 text-slate-400 text-sm italic min-h-[100px] flex items-center justify-center">
                    SQL will appear here...
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
                  <div className="bg-alabaster-50 rounded-xl p-4 flex items-center justify-center min-h-[80px]">
                    <div className="animate-spin rounded-full h-6 w-6 border-2 border-ink-950 border-t-transparent"></div>
                  </div>
                ) : result?.output ? (
                  <div className="bg-alabaster-50 rounded-xl p-4 text-sm min-h-[80px]">
                    {result.output}
                  </div>
                ) : (
                  <div className="bg-alabaster-50 rounded-xl p-4 text-slate-400 text-sm italic min-h-[80px] flex items-center justify-center">
                    Explanation will appear here...
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
