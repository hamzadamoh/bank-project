import Navigation from "@/components/layout/navigation";
import Footer from "@/components/layout/footer";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Shield, Lock, Database, FileText, Users, Globe, CheckCircle, Clock, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";

export default function Security() {
  const { toast } = useToast();

  const handleDownload = () => {
    toast({
      title: "Download Started",
      description: "FiscAI Security Datasheet v2.4 (PDF) is being generated...",
    });
  };

  const securityFeatures = [
    {
      icon: Lock,
      title: "End-to-End Encryption",
      description: "AES-256 encryption at rest, TLS 1.3 in transit",
      details: "All data encrypted with customer-managed keys. Zero-knowledge architecture ensures FiscAI cannot access your sensitive information."
    },
    {
      icon: Database,
      title: "Data Residency Control",
      description: "Choose where your data lives: EU, Morocco, or US",
      details: "Full compliance with local data protection laws. Data never crosses regional boundaries without explicit consent."
    },
    {
      icon: Users,
      title: "Multi-Tenant Isolation",
      description: "Complete tenant separation with dedicated resources",
      details: "Each organization operates in an isolated environment with dedicated encryption keys and access controls."
    },
    {
      icon: Shield,
      title: "Zero Data Egress",
      description: "All AI models run on-premises or in your VPC",
      details: "Your data never leaves your infrastructure. Models are deployed locally for maximum security and compliance."
    },
    {
      icon: FileText,
      title: "Immutable Audit Trails",
      description: "Complete logging of all system interactions",
      details: "Append-only audit logs track every query, file access, and administrative action for compliance and forensics."
    },
    {
      icon: Globe,
      title: "Compliance Framework",
      description: "GDPR, SOC 2, ISO 27001 ready architecture",
      details: "Built-in privacy controls, consent management, and regulatory reporting capabilities."
    }
  ];

  const complianceStandards = [
    {
      standard: "GDPR",
      status: "Compliant",
      description: "Data minimization, consent management, right to erasure",
      color: "bg-emerald-400"
    },
    {
      standard: "SOC 2 Type II",
      status: "In Progress",
      description: "Security, availability, processing integrity controls",
      color: "bg-amber-400"
    },
    {
      standard: "ISO 27001",
      status: "In Progress",
      description: "Information security management system certification",
      color: "bg-amber-400"
    },
    {
      standard: "AICPA SOC",
      status: "Planned",
      description: "Service organization control framework",
      color: "bg-slate-400"
    }
  ];

  const securityMetrics = [
    { metric: "99.9%", label: "Uptime SLA", description: "Enterprise-grade availability" },
    { metric: "< 2s", label: "Incident Response", description: "Automated threat detection" },
    { metric: "256-bit", label: "Encryption Standard", description: "Military-grade security" },
    { metric: "0", label: "Data Breaches", description: "Perfect security record" }
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
                Enterprise Security & Compliance
              </h1>
              <p className="text-xl text-slate-700 max-w-3xl mx-auto">
                Bank-grade security architecture with privacy-by-design principles. Your data remains under your complete control at all times.
              </p>
            </div>

            {/* Security Metrics */}
            <div className="grid md:grid-cols-4 gap-6 mb-16">
              {securityMetrics.map((item, index) => (
                <GlassCard key={index} className="p-6 text-center">
                  <div className="font-display font-bold text-3xl text-emerald-400 mb-2">
                    {item.metric}
                  </div>
                  <div className="font-semibold text-ink-950 mb-1">{item.label}</div>
                  <div className="text-sm text-slate-600">{item.description}</div>
                </GlassCard>
              ))}
            </div>

            {/* Security Features Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {securityFeatures.map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <GlassCard key={index} className="p-8 hover:scale-[1.02] transition-all duration-300">
                    <div className="w-12 h-12 bg-champagne-200 rounded-2xl flex items-center justify-center mb-6">
                      <IconComponent className="h-6 w-6 text-ink-950" />
                    </div>
                    <h3 className="font-display font-bold text-xl text-ink-950 mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-slate-700 mb-4">{feature.description}</p>
                    <p className="text-sm text-slate-600">{feature.details}</p>
                  </GlassCard>
                );
              })}
            </div>
          </div>
        </section>

        {/* Compliance Section */}
        <section className="py-24 px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="font-display font-bold text-4xl text-ink-950 mb-6">
                Compliance & Certifications
              </h2>
              <p className="text-xl text-slate-700 max-w-3xl mx-auto">
                We maintain the highest standards for data protection and regulatory compliance across multiple frameworks.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-16">
              <div>
                <h3 className="font-display font-bold text-2xl text-ink-950 mb-8">Certification Roadmap</h3>
                <div className="space-y-6">
                  {complianceStandards.map((standard, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        {standard.status === 'Compliant' ? (
                          <CheckCircle className="h-6 w-6 text-emerald-400 mt-1" />
                        ) : (
                          <Clock className="h-6 w-6 text-amber-400 mt-1" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-semibold text-ink-950">{standard.standard}</h4>
                          <Badge className={`${standard.color} text-ink-950 text-xs`}>
                            {standard.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-700">{standard.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <GlassCard className="p-8">
                  <h3 className="font-display font-bold text-2xl text-ink-950 mb-6">
                    Privacy by Design
                  </h3>
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold text-ink-950 mb-2">Data Minimization</h4>
                      <p className="text-sm text-slate-700">
                        We collect only the data necessary for service delivery and automatically purge information according to retention policies.
                      </p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-ink-950 mb-2">Consent Management</h4>
                      <p className="text-sm text-slate-700">
                        Granular consent controls allow users to specify exactly how their data can be used, with easy withdrawal mechanisms.
                      </p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-ink-950 mb-2">Right to Erasure</h4>
                      <p className="text-sm text-slate-700">
                        Complete data deletion capabilities ensure compliance with GDPR Article 17 and other privacy regulations.
                      </p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-ink-950 mb-2">Cross-Border Transfers</h4>
                      <p className="text-sm text-slate-700">
                        All data transfers utilize Standard Contractual Clauses (SCCs) and adequacy decisions where applicable.
                      </p>
                    </div>
                  </div>
                </GlassCard>
              </div>
            </div>
          </div>
        </section>

        {/* Architecture Section */}
        <section className="py-24 px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="font-display font-bold text-4xl text-ink-950 mb-6">
                Security Architecture
              </h2>
              <p className="text-xl text-slate-700 max-w-3xl mx-auto">
                Multi-layered defense strategy with zero-trust principles and comprehensive monitoring.
              </p>
            </div>

            <GlassCard className="p-8 mb-12">
              <div className="grid lg:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-champagne-200 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                    <Shield className="h-8 w-8 text-ink-950" />
                  </div>
                  <h3 className="font-semibold text-ink-950 mb-2">Perimeter Security</h3>
                  <p className="text-sm text-slate-700">
                    WAF, DDoS protection, and intrusion detection systems protect against external threats.
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-champagne-200 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                    <Users className="h-8 w-8 text-ink-950" />
                  </div>
                  <h3 className="font-semibold text-ink-950 mb-2">Identity & Access</h3>
                  <p className="text-sm text-slate-700">
                    SAML/OIDC SSO, MFA, and RBAC ensure only authorized users access appropriate resources.
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-champagne-200 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                    <Database className="h-8 w-8 text-ink-950" />
                  </div>
                  <h3 className="font-semibold text-ink-950 mb-2">Data Protection</h3>
                  <p className="text-sm text-slate-700">
                    Encryption, tokenization, and data loss prevention protect information at every layer.
                  </p>
                </div>
              </div>
            </GlassCard>

            {/* Deployment Options */}
            <div className="grid lg:grid-cols-2 gap-12">
              <div>
                <h3 className="font-display font-bold text-2xl text-ink-950 mb-6">Deployment Options</h3>
                <div className="space-y-4">
                  <div className="border border-champagne-200 rounded-xl p-6">
                    <h4 className="font-semibold text-ink-950 mb-2">Cloud SaaS</h4>
                    <p className="text-sm text-slate-700 mb-3">
                      Multi-tenant cloud deployment with enterprise isolation and regional data residency.
                    </p>
                    <Badge className="bg-emerald-400 text-ink-950">Available Now</Badge>
                  </div>

                  <div className="border border-champagne-200 rounded-xl p-6">
                    <h4 className="font-semibold text-ink-950 mb-2">Private Cloud</h4>
                    <p className="text-sm text-slate-700 mb-3">
                      Dedicated cloud instances with customer-controlled encryption keys and network isolation.
                    </p>
                    <Badge className="bg-emerald-400 text-ink-950">Available Now</Badge>
                  </div>

                  <div className="border border-champagne-200 rounded-xl p-6">
                    <h4 className="font-semibold text-ink-950 mb-2">On-Premises</h4>
                    <p className="text-sm text-slate-700 mb-3">
                      Complete on-premises deployment for maximum control and air-gapped environments.
                    </p>
                    <Badge className="bg-amber-400 text-ink-950">Enterprise Only</Badge>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-display font-bold text-2xl text-ink-950 mb-6">Security Monitoring</h3>
                <GlassCard className="p-6">
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold text-ink-950 mb-2">24/7 SOC Monitoring</h4>
                      <p className="text-sm text-slate-700">
                        Security operations center with real-time threat detection and incident response capabilities.
                      </p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-ink-950 mb-2">Vulnerability Management</h4>
                      <p className="text-sm text-slate-700">
                        Continuous security scanning, patch management, and penetration testing by certified experts.
                      </p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-ink-950 mb-2">Compliance Reporting</h4>
                      <p className="text-sm text-slate-700">
                        Automated compliance reporting and audit trail generation for regulatory requirements.
                      </p>
                    </div>

                    <div className="bg-champagne-200 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                        <span className="font-semibold text-ink-950 text-sm">Security Status</span>
                      </div>
                      <div className="text-sm text-slate-700">
                        All systems operational. Last security assessment: January 2024
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </div>
            </div>
          </div>
        </section>

        {/* Trust Center CTA */}
        <section className="py-24 px-6 lg:px-8 bg-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-display font-bold text-4xl text-ink-950 mb-6">
              Need More Security Information?
            </h2>
            <p className="text-xl text-slate-700 mb-12">
              Access detailed security documentation, compliance reports, and technical specifications in our Trust Center.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/trust-center">
                <button className="w-full sm:w-auto bg-ink-950 text-alabaster-50 px-8 py-4 rounded-2xl text-lg font-semibold hover:bg-ink-900 transition-all duration-200">
                  Visit Trust Center
                </button>
              </Link>
              <button
                onClick={handleDownload}
                className="border-2 border-ink-950 text-ink-950 px-8 py-4 rounded-2xl text-lg font-semibold hover:bg-ink-950 hover:text-alabaster-50 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <Download className="h-5 w-5" />
                Download Security Datasheet
              </button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
