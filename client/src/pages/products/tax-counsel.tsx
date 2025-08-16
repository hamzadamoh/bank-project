import Navigation from "@/components/layout/navigation";
import Footer from "@/components/layout/footer";
import { GlassCard } from "@/components/ui/glass-card";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Search } from "lucide-react";

export default function TaxCounsel() {
  const [query, setQuery] = useState("");
  const [jurisdiction, setJurisdiction] = useState("morocco");
  const [confidence, setConfidence] = useState("high");
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);

  const handleQuery = async () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setResponse({
        shortAnswer: "Moroccan SaaS companies serving EU clients must apply 20% VAT domestically and trigger EU OSS registration above €10,000 annual sales.",
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
            content: "Once annual EU B2C sales exceed €10,000, registration for the One-Stop Shop (OSS) system becomes mandatory per Note 728/2023."
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
      });
      setIsLoading(false);
    }, 2000);
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
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Export PDF
                      </Button>
                      <Button variant="outline" size="sm">
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
