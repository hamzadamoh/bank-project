import Navigation from "@/components/layout/navigation";
import Footer from "@/components/layout/footer";
import { GlassCard } from "@/components/ui/glass-card";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Upload, FileText, AlertTriangle, CheckCircle, X } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

export default function FactoringGuardian() {
  const { toast } = useToast();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>('');

  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const fileInputRef = useState<HTMLInputElement | null>(null)[0];

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
      if (!validTypes.includes(file.type)) {
        alert('Please upload a PDF, JPG, or PNG file');
        return;
      }

      // Validate file size (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB');
        return;
      }

      setSelectedFile(file);
      setFileName(file.name);
    }
  };

  const handleUploadClick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf,.jpg,.jpeg,.png';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        handleFileSelect({ target: { files: [file] } } as any);
      }
    };
    input.click();
  };

  const analyzeDocument = async () => {
    if (!selectedFile) {
      alert('Please select a file first');
      return;
    }

    setIsAnalyzing(true);
    setAnalysisComplete(false);
    setUploadProgress(0);
    setAnalysisResult(null);

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);

    try {
      // Convert file to base64
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Data = reader.result as string;
        const base64Content = base64Data.split(',')[1]; // Remove data:image/png;base64, prefix

        try {
          // Call the actual API with file data
          const res = await apiRequest("POST", "/api/document-analysis", {
            filename: selectedFile.name,
            fileContent: base64Content,
            fileType: selectedFile.type,
          });

          const data = await res.json();
          setUploadProgress(100);
          setTimeout(() => {
            setIsAnalyzing(false);
            setAnalysisComplete(true);
            setAnalysisResult(data);
            clearInterval(progressInterval);
          }, 500);
        } catch (error: any) {
          console.error('Error analyzing document:', error);
          clearInterval(progressInterval);
          setIsAnalyzing(false);
          const message = error.message?.includes('401')
            ? 'Please log in to use FactoringGuardian.'
            : (error.message || 'Failed to analyze document. Please try again.');
          alert(message);
        }
      };

      reader.onerror = () => {
        clearInterval(progressInterval);
        setIsAnalyzing(false);
        alert('Failed to read file');
      };

      reader.readAsDataURL(selectedFile);
    } catch (error) {
      console.error('Error reading file:', error);
      clearInterval(progressInterval);
      setIsAnalyzing(false);
      alert('Failed to process file. Please try again.');
    }
  };

  // Keep mock data structure for reference but use actual API response
  const getDocumentInfo = () => {
    if (analysisResult) {
      return {
        filename: "Invoice_ABC_Corp_INV-2024-001.pdf",
        pages: 2,
        confidence: analysisResult.confidence
      };
    }
    return {
      filename: "Invoice_ABC_Corp_INV-2024-001.pdf",
      pages: 2,
      confidence: 98.5
    };
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
                DocuGuard
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
                  <div>
                    {!selectedFile ? (
                      <div
                        className="border-2 border-dashed border-champagne-200 rounded-2xl p-12 hover:border-champagne-300 transition-colors cursor-pointer"
                        onClick={handleUploadClick}
                      >
                        <Upload className="h-12 w-12 text-slate-500 mx-auto mb-4" />
                        <p className="text-slate-700 mb-2">Click to upload document</p>
                        <p className="text-sm text-slate-500">Supports PDF, JPG, PNG (Max 10MB)</p>
                      </div>
                    ) : (
                      <div className="border-2 border-champagne-200 rounded-2xl p-6 bg-alabaster-50">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <FileText className="h-8 w-8 text-ink-950" />
                            <div>
                              <p className="font-medium text-ink-950">{fileName}</p>
                              <p className="text-sm text-slate-500">
                                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                              </p>
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedFile(null);
                              setFileName('');
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        <Button onClick={analyzeDocument} className="w-full">
                          Analyze Document
                        </Button>
                      </div>
                    )}
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

              {analysisComplete && analysisResult && (
                <div className="space-y-6">
                  {/* Document Info */}
                  <div className="bg-white rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold text-ink-950">Document Processed</h4>
                      <Badge className="bg-emerald-400 text-ink-950">
                        {analysisResult.confidence}% Confidence
                      </Badge>
                    </div>
                    <div className="grid md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-slate-600">Filename:</span>
                        <p className="text-ink-950">{fileName || analysisResult.extractedData?.invoice?.number || 'N/A'}</p>
                      </div>
                      <div>
                        <span className="font-medium text-slate-600">Decision:</span>
                        <p className="text-ink-950">{analysisResult.decision}</p>
                      </div>
                      <div>
                        <span className="font-medium text-slate-600">Confidence:</span>
                        <p className="text-ink-950">{analysisResult.confidence}%</p>
                      </div>
                    </div>
                  </div>

                  {/* Extracted Data */}
                  {analysisResult.extractedData && (
                    <div className="bg-white rounded-xl p-6">
                      <h4 className="font-semibold text-ink-950 mb-4">Extracted Invoice Data</h4>
                      <div className="grid lg:grid-cols-2 gap-6">
                        <div>
                          <h5 className="font-medium text-slate-700 mb-3">Supplier Information</h5>
                          <div className="space-y-2 text-sm">
                            <div><span className="font-medium">Name:</span> {analysisResult.extractedData.supplier?.name || 'N/A'}</div>
                            <div><span className="font-medium">Tax ID:</span> {analysisResult.extractedData.supplier?.taxId || 'N/A'}</div>
                            <div><span className="font-medium">IBAN:</span> {analysisResult.extractedData.supplier?.iban || 'N/A'}</div>
                          </div>
                        </div>
                        <div>
                          <h5 className="font-medium text-slate-700 mb-3">Invoice Details</h5>
                          <div className="space-y-2 text-sm">
                            <div><span className="font-medium">Number:</span> {analysisResult.extractedData.invoice?.number || 'N/A'}</div>
                            <div><span className="font-medium">Date:</span> {analysisResult.extractedData.invoice?.date || 'N/A'}</div>
                            <div><span className="font-medium">Total TTC:</span> {analysisResult.extractedData.invoice?.totalTTC?.toLocaleString() || '0'} {analysisResult.extractedData.invoice?.currency || ''}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Anomaly Detection */}
                  {analysisResult.anomalies && analysisResult.anomalies.length > 0 && (
                    <div className="bg-white rounded-xl p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <AlertTriangle className="h-5 w-5 text-amber-400" />
                        <h4 className="font-semibold text-ink-950">Anomalies Detected</h4>
                      </div>
                      <div className="space-y-3">
                        {analysisResult.anomalies.map((anomaly: any, index: number) => (
                          <div key={index} className={`border-l-4 pl-4 ${anomaly.severity === 'HIGH' ? 'border-rose-400' : 'border-amber-400'
                            }`}>
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-medium text-ink-950">{anomaly.type.replace('_', ' ')}</span>
                              <Badge className={`text-xs ${anomaly.severity === 'HIGH' ? 'bg-rose-400' : 'bg-amber-400'
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
                  )}

                  {/* Decision */}
                  <div className={`rounded-xl p-6 ${analysisResult.decision === 'ALERT' ? 'bg-amber-50' : analysisResult.decision === 'REJECTED' ? 'bg-rose-50' : 'bg-emerald-50'
                    }`}>
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold text-ink-950">Processing Decision</h4>
                      <Badge className={`${analysisResult.decision === 'ALERT' ? 'bg-amber-400' : analysisResult.decision === 'REJECTED' ? 'bg-rose-400' : 'bg-emerald-400'
                        } text-ink-950`}>
                        {analysisResult.decision}
                      </Badge>
                    </div>
                    <p className="text-slate-700 mb-4">
                      {analysisResult.decision === 'VALIDATED'
                        ? 'Document validated successfully. No anomalies detected.'
                        : analysisResult.decision === 'ALERT'
                          ? 'Review recommended due to detected anomalies.'
                          : 'Document rejected due to critical anomalies.'}
                    </p>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => toast({ title: "Approved with Review", description: "Document has been approved and flagged for manual review." })}>Approve with Review</Button>
                      <Button variant="outline" size="sm" onClick={() => toast({ title: "Clarification Requested", description: "A clarification request has been sent to the supplier." })}>Request Clarification</Button>
                      <Button variant="outline" size="sm" onClick={() => toast({ title: "Document Rejected", description: "The document has been rejected due to detected anomalies.", variant: "destructive" })}>Reject</Button>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-center gap-4">
                    <Button onClick={() => {
                      setAnalysisComplete(false);
                      setUploadProgress(0);
                      setAnalysisResult(null);
                      setSelectedFile(null);
                      setFileName('');
                    }}>
                      Analyze Another Document
                    </Button>
                    <Button variant="outline" onClick={() => {
                      const blob = new Blob([JSON.stringify(analysisResult, null, 2)], { type: 'application/json' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `analysis-report-${new Date().toISOString().slice(0, 10)}.json`;
                      a.click();
                      URL.revokeObjectURL(url);
                      toast({ title: "Report Exported", description: "Analysis report has been downloaded." });
                    }}>
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
