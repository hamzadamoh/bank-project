import Navigation from "@/components/layout/navigation";
import Footer from "@/components/layout/footer";
import { GlassCard } from "@/components/ui/glass-card";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Upload, FileText, AlertTriangle, CheckCircle, X } from "lucide-react";

export default function FactoringGuardian() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const simulateAnalysis = () => {
    setIsAnalyzing(true);
    setAnalysisComplete(false);
    setUploadProgress(0);

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsAnalyzing(false);
            setAnalysisComplete(true);
          }, 1000);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const mockAnalysisResults = {
    documentInfo: {
      filename: "Invoice_ABC_Corp_INV-2024-001.pdf",
      pages: 2,
      confidence: 98.5
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

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-16 px-6 lg:px-8 bg-gradient-to-br from-alabaster-50 to-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="font-display font-bold text-4xl md:text-5xl text-ink-950 mb-6">
                Factoring Guardian
              </h1>
              <p className="text-xl text-slate-700 max-w-3xl mx-auto">
                Intelligent fraud detection and document analysis for factoring operations. Catch anomalies before they become losses.
              </p>
            </div>

            {/* Document Upload Demo */}
            <GlassCard className="max-w-4xl mx-auto p-8">
              <div className="text-center mb-8">
                <h3 className="font-display font-bold text-2xl text-ink-950 mb-4">Document Analysis Demo</h3>
                
                {!isAnalyzing && !analysisComplete && (
                  <div 
                    className="border-2 border-dashed border-champagne-200 rounded-2xl p-12 hover:border-champagne-300 transition-colors cursor-pointer"
                    onClick={simulateAnalysis}
                  >
                    <Upload className="h-12 w-12 text-slate-500 mx-auto mb-4" />
                    <p className="text-slate-700 mb-2">Click to simulate document upload</p>
                    <p className="text-sm text-slate-500">Supports PDF, JPG, PNG (Max 10MB)</p>
                  </div>
                )}

                {isAnalyzing && (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-2 border-ink-950 border-t-transparent mx-auto mb-6"></div>
                    <h4 className="font-semibold text-ink-950 mb-2">Analyzing Document</h4>
                    <p className="text-slate-600 mb-4">Processing invoice data...</p>
                    <div className="max-w-md mx-auto">
                      <Progress value={uploadProgress} className="mb-2" />
                      <p className="text-sm text-slate-500">{uploadProgress}% complete</p>
                    </div>
                  </div>
                )}
              </div>

              {analysisComplete && (
                <div className="space-y-6">
                  {/* Document Info */}
                  <div className="bg-white rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold text-ink-950">Document Processed</h4>
                      <Badge className="bg-emerald-400 text-ink-950">
                        {mockAnalysisResults.documentInfo.confidence}% Confidence
                      </Badge>
                    </div>
                    <div className="grid md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-slate-600">Filename:</span>
                        <p className="text-ink-950">{mockAnalysisResults.documentInfo.filename}</p>
                      </div>
                      <div>
                        <span className="font-medium text-slate-600">Pages:</span>
                        <p className="text-ink-950">{mockAnalysisResults.documentInfo.pages}</p>
                      </div>
                      <div>
                        <span className="font-medium text-slate-600">Processing Time:</span>
                        <p className="text-ink-950">2.3 seconds</p>
                      </div>
                    </div>
                  </div>

                  {/* Extracted Data */}
                  <div className="bg-white rounded-xl p-6">
                    <h4 className="font-semibold text-ink-950 mb-4">Extracted Invoice Data</h4>
                    <div className="grid lg:grid-cols-2 gap-6">
                      <div>
                        <h5 className="font-medium text-slate-700 mb-3">Supplier Information</h5>
                        <div className="space-y-2 text-sm">
                          <div><span className="font-medium">Name:</span> {mockAnalysisResults.extractedData.supplier.name}</div>
                          <div><span className="font-medium">Tax ID:</span> {mockAnalysisResults.extractedData.supplier.taxId}</div>
                          <div><span className="font-medium">IBAN:</span> {mockAnalysisResults.extractedData.supplier.iban}</div>
                        </div>
                      </div>
                      <div>
                        <h5 className="font-medium text-slate-700 mb-3">Invoice Details</h5>
                        <div className="space-y-2 text-sm">
                          <div><span className="font-medium">Number:</span> {mockAnalysisResults.extractedData.invoice.number}</div>
                          <div><span className="font-medium">Date:</span> {mockAnalysisResults.extractedData.invoice.date}</div>
                          <div><span className="font-medium">Total TTC:</span> {mockAnalysisResults.extractedData.invoice.totalTTC.toLocaleString()} {mockAnalysisResults.extractedData.invoice.currency}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Anomaly Detection */}
                  <div className="bg-white rounded-xl p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <AlertTriangle className="h-5 w-5 text-amber-400" />
                      <h4 className="font-semibold text-ink-950">Anomalies Detected</h4>
                    </div>
                    <div className="space-y-3">
                      {mockAnalysisResults.anomalies.map((anomaly, index) => (
                        <div key={index} className={`border-l-4 pl-4 ${
                          anomaly.severity === 'HIGH' ? 'border-rose-400' : 'border-amber-400'
                        }`}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-ink-950">{anomaly.type.replace('_', ' ')}</span>
                            <Badge className={`text-xs ${
                              anomaly.severity === 'HIGH' ? 'bg-rose-400' : 'bg-amber-400'
                            } text-ink-950`}>
                              {anomaly.severity}
                            </Badge>
                          </div>
                          <p className="text-sm text-slate-700">{anomaly.message}</p>
                          {anomaly.expected && (
                            <div className="text-xs text-slate-600 mt-1">
                              <div>Expected: {anomaly.expected}</div>
                              <div>Found: {anomaly.found}</div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* PO Matching */}
                  <div className="bg-white rounded-xl p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <CheckCircle className="h-5 w-5 text-emerald-400" />
                      <h4 className="font-semibold text-ink-950">Purchase Order Matching</h4>
                    </div>
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">PO #{mockAnalysisResults.poMatching.poNumber}</span>
                        <Badge className="bg-emerald-400 text-ink-950">
                          {mockAnalysisResults.poMatching.matchAccuracy}% Match
                        </Badge>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {mockAnalysisResults.poMatching.lineItemMatches.map((item, index) => (
                        <div key={index} className="flex items-center justify-between text-sm">
                          <span className="text-slate-700">{item.description}</span>
                          <div className="flex items-center gap-2">
                            {item.matched ? (
                              <CheckCircle className="h-4 w-4 text-emerald-400" />
                            ) : (
                              <X className="h-4 w-4 text-rose-400" />
                            )}
                            <span className="text-xs text-slate-500">
                              {item.variance > 0 ? `+${item.variance}%` : 'Match'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Decision */}
                  <div className={`rounded-xl p-6 ${
                    mockAnalysisResults.decision.status === 'ALERT' ? 'bg-amber-50' : 'bg-emerald-50'
                  }`}>
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold text-ink-950">Processing Decision</h4>
                      <Badge className={`${
                        mockAnalysisResults.decision.status === 'ALERT' ? 'bg-amber-400' : 'bg-emerald-400'
                      } text-ink-950`}>
                        {mockAnalysisResults.decision.status}
                      </Badge>
                    </div>
                    <p className="text-slate-700 mb-4">{mockAnalysisResults.decision.recommendation}</p>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">Approve with Review</Button>
                      <Button variant="outline" size="sm">Request Clarification</Button>
                      <Button variant="outline" size="sm">Reject</Button>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-center gap-4">
                    <Button onClick={() => {
                      setAnalysisComplete(false);
                      setUploadProgress(0);
                    }}>
                      Analyze Another Document
                    </Button>
                    <Button variant="outline">
                      <FileText className="h-4 w-4 mr-2" />
                      Export Report
                    </Button>
                  </div>
                </div>
              )}
            </GlassCard>
          </div>
        </section>

        {/* Features */}
        <section className="py-24 px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="font-display font-bold text-4xl text-ink-950 mb-6">
                Advanced Document Intelligence
              </h2>
              <p className="text-xl text-slate-700 max-w-3xl mx-auto">
                Powered by NuMarkdown-8B-Thinking for layout-aware extraction and ML-based anomaly detection.
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-champagne-200 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                  <FileText className="h-8 w-8 text-ink-950" />
                </div>
                <h3 className="font-display font-bold text-xl text-ink-950 mb-3">Layout-Aware Extraction</h3>
                <p className="text-slate-700">
                  Handles complex invoice layouts, tables, and multi-language documents with 98%+ accuracy.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-champagne-200 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                  <AlertTriangle className="h-8 w-8 text-ink-950" />
                </div>
                <h3 className="font-display font-bold text-xl text-ink-950 mb-3">Fraud Detection</h3>
                <p className="text-slate-700">
                  ML-powered anomaly detection catches duplicates, amount mismatches, and suspicious patterns.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-champagne-200 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                  <CheckCircle className="h-8 w-8 text-ink-950" />
                </div>
                <h3 className="font-display font-bold text-xl text-ink-950 mb-3">3-Way Matching</h3>
                <p className="text-slate-700">
                  Automatically cross-reference invoices, purchase orders, and receipts with configurable tolerances.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
