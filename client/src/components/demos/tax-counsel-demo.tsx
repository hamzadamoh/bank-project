import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function TaxCounselDemo() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [response, setResponse] = useState<any>(null);
  const { toast } = useToast();

  const handleQuery = async () => {
    setIsProcessing(true);
    setResponse(null);

    try {
      const res = await apiRequest("POST", "/api/demo/tax-queries", {
        query: "What are the VAT implications for a Moroccan company providing SaaS services to EU clients?",
        jurisdiction: "MA-EU"
      });
      const data = await res.json();
      setResponse(data);
    } catch (error) {
      console.error("Tax query failed:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleExport = () => {
    toast({
      title: "Memo Exported",
      description: "The tax analysis memo has been exported as a PDF.",
    });
  };

  return (
    <div className="bg-white rounded-2xl p-6">
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
          <span className="text-sm font-medium text-slate-600">Live Tax Query</span>
        </div>
        <div className="bg-alabaster-50 rounded-xl p-4 text-sm">
          "What are the VAT implications for a Moroccan company providing SaaS services to EU clients?"
        </div>
      </div>

      {isProcessing && (
        <div className="text-center mb-4">
          <div className="inline-flex items-center bg-champagne-200 rounded-full px-4 py-2">
            <span className="text-sm font-medium text-ink-950">AI Processing</span>
            <div className="ml-2 w-4 h-4">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-ink-950 border-t-transparent"></div>
            </div>
          </div>
        </div>
      )}

      {response && !isProcessing && (
        <div className="border-l-4 border-champagne-200 pl-4">
          <h4 className="font-semibold text-ink-950 mb-2">Tax Analysis</h4>
          <p className="text-sm text-slate-700 mb-3 whitespace-pre-line">
            {response.response.analysis}
          </p>
          <div className="flex flex-wrap gap-2">
            {response.response.citations.map((cite: string, i: number) => (
              <Badge key={i} variant="secondary" className="bg-champagne-200 text-ink-950">{cite}</Badge>
            ))}
          </div>
        </div>
      )}

      {!isProcessing && (
        <div className="mt-4 flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleQuery}
            className="text-xs"
          >
            New Query
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            className="text-xs"
          >
            Export Memo
          </Button>
        </div>
      )}
    </div>
  );
}
