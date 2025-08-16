import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function TaxCounselDemo() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showResponse, setShowResponse] = useState(true);

  const handleQuery = async () => {
    setIsProcessing(true);
    setShowResponse(false);
    
    // Simulate AI processing
    setTimeout(() => {
      setIsProcessing(false);
      setShowResponse(true);
    }, 2000);
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
      
      {showResponse && !isProcessing && (
        <div className="border-l-4 border-champagne-200 pl-4">
          <h4 className="font-semibold text-ink-950 mb-2">Tax Analysis</h4>
          <p className="text-sm text-slate-700 mb-3">
            For Moroccan SaaS providers serving EU clients, the following VAT treatment applies:
          </p>
          <ul className="text-sm text-slate-700 space-y-1 mb-3">
            <li>• <strong>Morocco VAT:</strong> 20% applies to domestic supplies</li>
            <li>• <strong>EU VAT:</strong> Reverse charge mechanism for B2B clients</li>
            <li>• <strong>Threshold:</strong> €10,000 annual EU sales trigger OSS registration</li>
          </ul>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="bg-champagne-200 text-ink-950">Art. 87 CGI</Badge>
            <Badge variant="secondary" className="bg-champagne-200 text-ink-950">EU Dir. 2006/112</Badge>
            <Badge variant="secondary" className="bg-champagne-200 text-ink-950">Note 728/2023</Badge>
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
            className="text-xs"
          >
            Export Memo
          </Button>
        </div>
      )}
    </div>
  );
}
