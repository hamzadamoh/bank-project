import Navigation from "@/components/layout/navigation";
import Footer from "@/components/layout/footer";
import { GlassCard } from "@/components/ui/glass-card";
import { Link } from "wouter";
import { Building, Zap, Shield, Calculator } from "lucide-react";

export default function Solutions() {
  const solutions = [
    {
      id: "banking",
      title: "Banking",
      icon: Building,
      description: "Traditional banks leveraging AI for risk assessment, regulatory compliance, and customer service automation",
      features: [
        "Real-time fraud detection and AML compliance",
        "Automated regulatory reporting and audit trails",
        "Customer onboarding and KYC automation",
        "Credit risk assessment and loan processing",
        "Tax advisory for complex financial products"
      ],
      benefits: [
        "65% reduction in compliance costs",
        "Real-time risk monitoring",
        "Automated audit preparation",
        "Enhanced customer experience"
      ],
      caseStudy: {
        client: "Al Barid Bank",
        challenge: "Manual invoice processing led to 15% fraud losses and 3-day processing delays",
        solution: "Deployed Factoring Guardian for automated document analysis and anomaly detection",
        results: "99.2% fraud detection accuracy, 90% processing time reduction, €2M annual savings"
      }
    },
    {
      id: "fintech",
      title: "Fintech",
      icon: Zap,
      description: "Digital-first financial services requiring rapid deployment and scalable AI infrastructure",
      features: [
        "API-first integration with existing platforms",
        "Scalable document processing pipelines",
        "Multi-language support for global markets",
        "Real-time transaction monitoring",
        "Embedded AI capabilities for customer apps"
      ],
      benefits: [
        "2-week deployment timeline",
        "99.9% API uptime guarantee",
        "Horizontal scaling capability",
        "Developer-friendly integration"
      ],
      caseStudy: {
        client: "PayTech Morocco",
        challenge: "Needed multilingual chatbot supporting French, Arabic, and Darija for customer service",
        solution: "Implemented OmniServe with custom training data for financial services",
        results: "78% automation rate, 45% reduction in support costs, 4.8/5 customer satisfaction"
      }
    },
    {
      id: "audit",
      title: "Audit & Advisory",
      icon: Shield,
      description: "Accounting firms and auditors enhancing service delivery with AI-powered analysis",
      features: [
        "Multi-jurisdiction tax research and analysis",
        "Automated document review and anomaly detection",
        "Client memo generation with legal citations",
        "Risk assessment and compliance checking",
        "Audit trail generation and documentation"
      ],
      benefits: [
        "50% faster client deliverables",
        "Comprehensive citation accuracy",
        "Risk-based audit approach",
        "Professional memo formatting"
      ],
      caseStudy: {
        client: "KPMG Morocco",
        challenge: "Tax research across multiple jurisdictions taking 4-6 hours per complex query",
        solution: "Deployed FiscAI Tax Counsel with Morocco, EU, and OECD tax databases",
        results: "85% time reduction, 100% citation accuracy, 300% increase in client capacity"
      }
    },
    {
      id: "smb",
      title: "SMB Accounting",
      icon: Calculator,
      description: "Small and medium businesses streamlining financial operations with accessible AI tools",
      features: [
        "Simplified invoice processing and matching",
        "Automated bookkeeping and reconciliation",
        "Tax compliance assistance and filing",
        "Financial reporting and insights",
        "Expense management and categorization"
      ],
      benefits: [
        "80% reduction in manual data entry",
        "Real-time financial visibility",
        "Simplified tax compliance",
        "Cost-effective automation"
      ],
      caseStudy: {
        client: "Morocco SME Collective",
        challenge: "200+ small businesses struggling with manual invoice processing and tax compliance",
        solution: "Rolled out simplified Factoring Guardian and Tax Counsel interfaces",
        results: "90% adoption rate, 60% time savings, 95% tax filing accuracy improvement"
      }
    }
  ];

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-16 px-6 lg:px-8 bg-gradient-to-br from-alabaster-50 to-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h1 className="font-display font-bold text-4xl md:text-5xl text-ink-950 mb-6">
                Industry Solutions
              </h1>
              <p className="text-xl text-slate-700 max-w-3xl mx-auto">
                Vertical presets and configurable workflows designed for specific financial sectors. Each solution combines multiple AI tools for comprehensive coverage.
              </p>
            </div>

            {/* Solutions Grid */}
            <div className="grid md:grid-cols-2 gap-8">
              {solutions.map((solution) => {
                const IconComponent = solution.icon;
                return (
                  <GlassCard key={solution.id} className="p-8 hover:scale-[1.02] transition-all duration-300">
                    <div className="flex items-start gap-4 mb-6">
                      <div className="w-16 h-16 bg-champagne-200 rounded-2xl flex items-center justify-center">
                        <IconComponent className="h-8 w-8 text-ink-950" />
                      </div>
                      <div>
                        <h3 className="font-display font-bold text-2xl text-ink-950 mb-2">{solution.title}</h3>
                        <p className="text-slate-700">{solution.description}</p>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <h4 className="font-semibold text-ink-950 mb-3">Key Features</h4>
                        <ul className="space-y-2">
                          {solution.features.slice(0, 3).map((feature, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 bg-champagne-200 rounded-full mt-2"></div>
                              <span className="text-sm text-slate-700">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-semibold text-ink-950 mb-3">Business Impact</h4>
                        <div className="grid grid-cols-2 gap-4">
                          {solution.benefits.slice(0, 2).map((benefit, index) => (
                            <div key={index} className="bg-white rounded-xl p-3">
                              <span className="text-sm font-medium text-emerald-400">{benefit}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <Link href={`#${solution.id}`}>
                      <button className="w-full mt-6 bg-ink-950 text-alabaster-50 py-3 rounded-xl font-semibold hover:bg-ink-900 transition-colors">
                        Explore {solution.title}
                      </button>
                    </Link>
                  </GlassCard>
                );
              })}
            </div>
          </div>
        </section>

        {/* Detailed Solution Sections */}
        {solutions.map((solution, index) => {
          const IconComponent = solution.icon;
          return (
            <section 
              key={solution.id} 
              id={solution.id}
              className={`py-24 px-6 lg:px-8 ${index % 2 === 0 ? 'bg-white' : 'bg-alabaster-50'}`}
            >
              <div className="max-w-7xl mx-auto">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                  <div>
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-16 h-16 bg-champagne-200 rounded-2xl flex items-center justify-center">
                        <IconComponent className="h-8 w-8 text-ink-950" />
                      </div>
                      <h2 className="font-display font-bold text-4xl text-ink-950">{solution.title}</h2>
                    </div>

                    <p className="text-xl text-slate-700 mb-8">{solution.description}</p>

                    <div className="space-y-6">
                      <div>
                        <h3 className="font-semibold text-ink-950 mb-4">Complete Feature Set</h3>
                        <ul className="space-y-3">
                          {solution.features.map((feature, featureIndex) => (
                            <li key={featureIndex} className="flex items-start gap-3">
                              <div className="w-5 h-5 bg-champagne-200 rounded-full flex items-center justify-center mt-0.5">
                                <div className="w-2 h-2 bg-ink-950 rounded-full"></div>
                              </div>
                              <span className="text-slate-700">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h3 className="font-semibold text-ink-950 mb-4">Proven Benefits</h3>
                        <div className="grid grid-cols-2 gap-4">
                          {solution.benefits.map((benefit, benefitIndex) => (
                            <div key={benefitIndex} className="bg-white rounded-xl p-4 text-center">
                              <div className="font-semibold text-emerald-400 text-sm">{benefit}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Case Study */}
                  <div>
                    <GlassCard className="p-8">
                      <div className="mb-6">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                          <span className="text-sm font-medium text-slate-600">Success Story</span>
                        </div>
                        <h3 className="font-display font-bold text-2xl text-ink-950 mb-2">
                          {solution.caseStudy.client}
                        </h3>
                      </div>

                      <div className="space-y-6">
                        <div>
                          <h4 className="font-semibold text-ink-950 mb-2">Challenge</h4>
                          <p className="text-sm text-slate-700">{solution.caseStudy.challenge}</p>
                        </div>

                        <div>
                          <h4 className="font-semibold text-ink-950 mb-2">Solution</h4>
                          <p className="text-sm text-slate-700">{solution.caseStudy.solution}</p>
                        </div>

                        <div>
                          <h4 className="font-semibold text-ink-950 mb-2">Results</h4>
                          <p className="text-sm text-slate-700">{solution.caseStudy.results}</p>
                        </div>
                      </div>

                      <div className="mt-6 pt-6 border-t border-champagne-200">
                        <Link href="/contact">
                          <button className="w-full bg-ink-950 text-alabaster-50 py-3 rounded-xl font-semibold hover:bg-ink-900 transition-colors">
                            Discuss Your Use Case
                          </button>
                        </Link>
                      </div>
                    </GlassCard>
                  </div>
                </div>
              </div>
            </section>
          );
        })}

        {/* CTA Section */}
        <section className="py-24 px-6 lg:px-8 bg-ink-950">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-display font-bold text-4xl md:text-5xl text-alabaster-50 mb-6">
              Ready to Transform Your Industry?
            </h2>
            <p className="text-xl text-alabaster-200 mb-12">
              Join industry leaders who've already deployed FiscAI solutions for measurable business impact.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <button className="bg-alabaster-50 text-ink-950 px-8 py-4 rounded-2xl text-lg font-semibold hover:bg-alabaster-100 transition-all duration-200 transform hover:scale-105">
                  Get Industry Assessment
                </button>
              </Link>
              <Link href="/pricing">
                <button className="border-2 border-alabaster-50 text-alabaster-50 px-8 py-4 rounded-2xl text-lg font-semibold hover:bg-alabaster-50 hover:text-ink-950 transition-all duration-200">
                  View Pricing
                </button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
