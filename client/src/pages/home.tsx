import Navigation from "@/components/layout/navigation";
import Footer from "@/components/layout/footer";
import Hero from "@/components/sections/hero";
import TrustIndicators from "@/components/sections/trust-indicators";
import ProductsShowcase from "@/components/sections/products-showcase";
import Testimonials from "@/components/sections/testimonials";
import { useEffect } from "react";
import { useLocation, Link } from "wouter";

export default function Home() {
  const [location] = useLocation();

  // Handle hash navigation on mount and hash change
  useEffect(() => {
    const handleHashScroll = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash) {
        setTimeout(() => {
          const element = document.getElementById(hash);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 100);
      }
    };

    // Handle initial hash
    handleHashScroll();

    // Handle hash changes
    window.addEventListener('hashchange', handleHashScroll);
    return () => window.removeEventListener('hashchange', handleHashScroll);
  }, [location]);

  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        <Hero />
        <TrustIndicators />
        <ProductsShowcase />
        <section id="solutions" className="py-24 px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="font-display font-bold text-4xl md:text-5xl text-ink-950 mb-6">
                Industry Solutions
              </h2>
              <p className="text-xl text-slate-700 max-w-3xl mx-auto">
                Vertical presets and configurable workflows for different financial sectors.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="gradient-border bg-alabaster-50 rounded-2xl p-8 text-center hover:scale-[1.02] transition-all duration-300">
                <div className="w-16 h-16 bg-champagne-200 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                  <div className="w-8 h-8 bg-ink-950 rounded"></div>
                </div>
                <h3 className="font-display font-bold text-xl text-ink-950 mb-3">Banking</h3>
                <p className="text-slate-700 text-sm mb-4">
                  Risk assessment, regulatory reporting, and compliance automation for traditional banks.
                </p>
                <Link href="/solutions#banking" className="text-ink-950 font-semibold text-sm hover:text-slate-700 transition-colors">
                  Explore Banking →
                </Link>
              </div>

              <div className="gradient-border bg-alabaster-50 rounded-2xl p-8 text-center hover:scale-[1.02] transition-all duration-300">
                <div className="w-16 h-16 bg-champagne-200 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                  <div className="w-8 h-8 bg-ink-950 rounded-full"></div>
                </div>
                <h3 className="font-display font-bold text-xl text-ink-950 mb-3">Fintech</h3>
                <p className="text-slate-700 text-sm mb-4">
                  Rapid deployment for digital-first financial services and embedded finance platforms.
                </p>
                <Link href="/solutions#fintech" className="text-ink-950 font-semibold text-sm hover:text-slate-700 transition-colors">
                  Explore Fintech →
                </Link>
              </div>

              <div className="gradient-border bg-alabaster-50 rounded-2xl p-8 text-center hover:scale-[1.02] transition-all duration-300">
                <div className="w-16 h-16 bg-champagne-200 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                  <div className="w-8 h-8 bg-ink-950 rounded-lg transform rotate-45"></div>
                </div>
                <h3 className="font-display font-bold text-xl text-ink-950 mb-3">Audit</h3>
                <p className="text-slate-700 text-sm mb-4">
                  Document analysis, anomaly detection, and audit trail automation for accounting firms.
                </p>
                <Link href="/solutions#audit" className="text-ink-950 font-semibold text-sm hover:text-slate-700 transition-colors">
                  Explore Audit →
                </Link>
              </div>

              <div className="gradient-border bg-alabaster-50 rounded-2xl p-8 text-center hover:scale-[1.02] transition-all duration-300">
                <div className="w-16 h-16 bg-champagne-200 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                  <div className="grid grid-cols-2 gap-1">
                    <div className="w-3 h-3 bg-ink-950 rounded-sm"></div>
                    <div className="w-3 h-3 bg-ink-950 rounded-sm"></div>
                    <div className="w-3 h-3 bg-ink-950 rounded-sm"></div>
                    <div className="w-3 h-3 bg-ink-950 rounded-sm"></div>
                  </div>
                </div>
                <h3 className="font-display font-bold text-xl text-ink-950 mb-3">SMB Accounting</h3>
                <p className="text-slate-700 text-sm mb-4">
                  Simplified workflows and automated bookkeeping for small and medium businesses.
                </p>
                <Link href="/solutions#smb" className="text-ink-950 font-semibold text-sm hover:text-slate-700 transition-colors">
                  Explore SMB →
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section id="security" className="py-24 px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="font-display font-bold text-4xl md:text-5xl text-ink-950 mb-6">
                  Enterprise Security First
                </h2>
                <p className="text-xl text-slate-700 mb-8">
                  Built with bank-grade security and compliance from day one. Your data never leaves your infrastructure.
                </p>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-6 h-6 bg-emerald-400 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <div className="w-3 h-3 bg-white rounded-full"></div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-ink-950 mb-1">On-Premises Deployment</h3>
                      <p className="text-slate-700 text-sm">All AI models run within your VPC. Zero data egress to external services.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-6 h-6 bg-emerald-400 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <div className="w-3 h-3 bg-white rounded-full"></div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-ink-950 mb-1">Multi-Tenant Isolation</h3>
                      <p className="text-slate-700 text-sm">Per-tenant encryption keys and data residency selection (EU/MA/US).</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-6 h-6 bg-amber-400 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <div className="w-3 h-3 bg-white rounded-full"></div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-ink-950 mb-1">Compliance Ready</h3>
                      <p className="text-slate-700 text-sm">GDPR, SOC 2, and audit trail features. Certifications in progress.</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="glass-card rounded-3xl p-8 bg-white/60 backdrop-blur-md border border-champagne-200/50">
                <h3 className="font-display font-bold text-2xl text-ink-950 mb-6">Security Features</h3>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-white rounded-xl p-4 text-center">
                    <div className="font-bold text-2xl text-emerald-400 mb-1">AES-256</div>
                    <div className="text-xs text-slate-600">Encryption at Rest</div>
                  </div>
                  <div className="bg-white rounded-xl p-4 text-center">
                    <div className="font-bold text-2xl text-emerald-400 mb-1">TLS 1.3</div>
                    <div className="text-xs text-slate-600">In Transit</div>
                  </div>
                  <div className="bg-white rounded-xl p-4 text-center">
                    <div className="font-bold text-2xl text-emerald-400 mb-1">SAML</div>
                    <div className="text-xs text-slate-600">SSO Integration</div>
                  </div>
                  <div className="bg-white rounded-xl p-4 text-center">
                    <div className="font-bold text-2xl text-emerald-400 mb-1">RBAC</div>
                    <div className="text-xs text-slate-600">Access Control</div>
                  </div>
                </div>
                
                <div className="bg-champagne-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
                    <span className="font-semibold text-ink-950 text-sm">Compliance Status</span>
                  </div>
                  <div className="text-sm text-slate-700">
                    SOC 2 Type II and ISO 27001 certifications currently in progress. GDPR compliant by design.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Testimonials />

        <section className="py-24 px-6 lg:px-8 bg-ink-950">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-display font-bold text-4xl md:text-5xl text-alabaster-50 mb-6">
              Ready to Transform Your Financial Operations?
            </h2>
            <p className="text-xl text-alabaster-200 mb-12">
              Join leading financial institutions already using FiscAI to make smarter decisions faster.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" className="bg-alabaster-50 text-ink-950 px-8 py-4 rounded-2xl text-lg font-semibold hover:bg-alabaster-100 transition-all duration-200 transform hover:scale-105">
                Start Free Trial
              </Link>
              <Link href="/contact" className="border-2 border-alabaster-50 text-alabaster-50 px-8 py-4 rounded-2xl text-lg font-semibold hover:bg-alabaster-50 hover:text-ink-950 transition-all duration-200">
                Schedule Demo
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
