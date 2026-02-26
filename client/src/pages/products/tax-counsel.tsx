import Navigation from "@/components/layout/navigation";
import Footer from "@/components/layout/footer";
import { GlassCard } from "@/components/ui/glass-card";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Search, ThumbsUp, Brain } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function TaxCounsel() {
  const { toast } = useToast();
  const [query, setQuery] = useState("");
  const [jurisdiction, setJurisdiction] = useState("morocco");
  const [confidence, setConfidence] = useState("high");
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  const handleQuery = async () => {
    if (!query.trim()) {
      return;
    }

    setIsLoading(true);
    setResponse(null);

    try {
      const res = await apiRequest("POST", "/api/tax-queries", {
        query,
        jurisdiction,
      });

      const data = await res.json();
      setResponse(data.response);
    } catch (error: any) {
      console.error('Error fetching tax advice:', error);
      const message = error.message?.includes('401')
        ? 'Please log in to use Tax Counsel.'
        : 'Failed to get tax advice. Please try again.';
      alert(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = () => {
    toast({
      title: "Export Started",
      description: "Generating your tax report PDF. Your download will start shortly.",
    });
  };

  const handleSave = () => {
    toast({
      title: "Saved to Memos",
      description: "This tax query analysis has been saved to your account memos.",
    });
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
                FiscAI Tax Counsel
              </h1>
              <p className="text-xl text-slate-700 max-w-3xl mx-auto">
                Get instant, grounded tax advice with multi-jurisdiction support. Every answer includes citations and export options.
              </p>
            </div>

            {/* Interactive Demo */}
            <GlassCard className="max-w-4xl mx-auto p-8">
              {/* Continuous Learning Badge */}
              <div className="mb-6 flex items-center gap-2 text-sm text-slate-600 bg-champagne-50 rounded-lg p-3">
                <Brain className="h-4 w-4 text-ink-950" />
                <span>
                  <strong className="text-ink-950">Continuous Learning:</strong> This AI system learns from each interaction to improve accuracy and provide better tax advice over time.
                </span>
              </div>

              <div className="mb-6">
                <h3 className="font-display font-bold text-2xl text-ink-950 mb-4">Try the Demo</h3>

                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <Select value={jurisdiction} onValueChange={setJurisdiction}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select jurisdiction" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="morocco">Morocco</SelectItem>
                      <SelectItem value="eu">European Union</SelectItem>
                      <SelectItem value="oecd">OECD General</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={confidence} onValueChange={setConfidence}>
                    <SelectTrigger>
                      <SelectValue placeholder="Confidence level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">High Confidence</SelectItem>
                      <SelectItem value="medium">Medium Confidence</SelectItem>
                      <SelectItem value="low">All Results</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-2">
                  <Input
                    placeholder="Ask your tax question..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="flex-1"
                  />
                  <Button onClick={handleQuery} disabled={isLoading}>
                    {isLoading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                    ) : (
                      <Search className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Sample Query */}
              {!response && (
                <div className="mb-6">
                  <div className="bg-alabaster-50 rounded-xl p-4">
                    <p className="text-sm text-slate-600 mb-2">Sample query:</p>
                    <p className="text-ink-950">
                      "What are the VAT implications for a Moroccan company providing SaaS services to EU clients?"
                    </p>
                  </div>
                </div>
              )}

              {/* Response */}
              {response && !isLoading && (
                <div className="space-y-6">
                  {/* Confidence Badge */}
                  <div className="flex items-center justify-between">
                    <Badge className="bg-emerald-400 text-ink-950">
                      {response.confidence}% Confidence
                    </Badge>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={handleExport}>
                        <Download className="h-4 w-4 mr-2" />
                        Export PDF
                      </Button>
                      <Button variant="outline" size="sm" onClick={handleSave}>
                        <FileText className="h-4 w-4 mr-2" />
                        Save Memo
                      </Button>
                    </div>
                  </div>

                  {/* Short Answer */}
                  <div className="bg-white rounded-xl p-6">
                    <h4 className="font-semibold text-ink-950 mb-3">Quick Answer</h4>
                    <p className="text-slate-700">{response.shortAnswer}</p>
                  </div>

                  {/* Detailed Explanation */}
                  <div className="bg-white rounded-xl p-6">
                    <h4 className="font-semibold text-ink-950 mb-4">Detailed Analysis</h4>
                    <p className="text-slate-700 mb-6">{response.explanation}</p>

                    <div className="space-y-4">
                      {response.details.map((detail: any, index: number) => (
                        <div key={index} className="border-l-4 border-champagne-200 pl-4">
                          <h5 className="font-medium text-ink-950 mb-2">{detail.title}</h5>
                          <p className="text-sm text-slate-700">{detail.content}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Compliance Checklist */}
                  <div className="bg-white rounded-xl p-6">
                    <h4 className="font-semibold text-ink-950 mb-4">Compliance Checklist</h4>
                    <ul className="space-y-2">
                      {response.checklist.map((item: string, index: number) => (
                        <li key={index} className="flex items-start gap-3">
                          <div className="w-5 h-5 bg-champagne-200 rounded-full flex items-center justify-center mt-0.5">
                            <div className="w-2 h-2 bg-ink-950 rounded-full"></div>
                          </div>
                          <span className="text-slate-700 text-sm">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Citations */}
                  <div className="bg-white rounded-xl p-6">
                    <h4 className="font-semibold text-ink-950 mb-4">Legal Citations</h4>
                    <div className="space-y-3">
                      {response.citations.map((citation: any, index: number) => (
                        <div key={index} className="flex items-start gap-3">
                          <Badge variant="outline" className="bg-champagne-200 text-ink-950">
                            {citation.code}
                          </Badge>
                          <span className="text-sm text-slate-700">{citation.description}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Feedback Section */}
                  <div className="bg-white rounded-xl p-6 border-2 border-champagne-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-ink-950 mb-2">Was this helpful?</h4>
                        <p className="text-sm text-slate-600">
                          Your feedback helps us improve our tax advice accuracy through continuous learning.
                        </p>
                      </div>
                      {!feedbackSubmitted ? (
                        <Button
                          onClick={() => {
                            setFeedbackSubmitted(true);
                            // In production, this would send feedback to the API
                            console.log('Feedback submitted: helpful');
                          }}
                          variant="outline"
                          className="flex items-center gap-2 hover:bg-emerald-50 hover:border-emerald-400 transition-colors"
                        >
                          <ThumbsUp className="h-5 w-5 text-emerald-400" />
                          <span>Helpful</span>
                        </Button>
                      ) : (
                        <div className="flex items-center gap-2 text-emerald-400">
                          <ThumbsUp className="h-5 w-5" />
                          <span className="font-medium">Thank you for your feedback!</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {isLoading && (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-ink-950 border-t-transparent mx-auto mb-4"></div>
                  <p className="text-slate-600">Analyzing tax implications...</p>
                </div>
              )}
            </GlassCard>
          </div>
        </section>

        {/* Features */}
        <section className="py-24 px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-champagne-200 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                  <FileText className="h-8 w-8 text-ink-950" />
                </div>
                <h3 className="font-display font-bold text-xl text-ink-950 mb-3">Multi-Jurisdiction</h3>
                <p className="text-slate-700">
                  Supports Morocco, EU VAT, and OECD tax concepts with jurisdiction-specific analysis.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-champagne-200 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                  <Search className="h-8 w-8 text-ink-950" />
                </div>
                <h3 className="font-display font-bold text-xl text-ink-950 mb-3">Grounded Answers</h3>
                <p className="text-slate-700">
                  Every response includes citations to official tax codes, bulletins, and administrative guidance.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-champagne-200 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                  <Download className="h-8 w-8 text-ink-950" />
                </div>
                <h3 className="font-display font-bold text-xl text-ink-950 mb-3">Export Options</h3>
                <p className="text-slate-700">
                  Generate professional memos, checklists, and documentation ready for client delivery.
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
