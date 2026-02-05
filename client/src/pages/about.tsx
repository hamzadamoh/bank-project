import Navigation from "@/components/layout/navigation";
import Footer from "@/components/layout/footer";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { MapPin, Users, Target, Award, ArrowRight, Globe, Zap, Shield } from "lucide-react";
import { Link } from "wouter";

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-alabaster-50 via-white to-champagne-100">
      <Navigation />
      
      <div className="pt-32 pb-20 px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-champagne-200/30 px-4 py-2 rounded-full text-sm font-medium text-ink-950 mb-6">
              <Globe className="h-4 w-4" />
              About FiscAI
            </div>
            <h1 className="font-display font-bold text-5xl lg:text-6xl text-ink-950 mb-6">
              Pioneering AI for Finance
            </h1>
            <p className="text-xl text-slate-700 max-w-3xl mx-auto leading-relaxed">
              From Morocco to the world, we're building the future of financial intelligence with 
              AI-powered solutions that understand both local regulations and global best practices.
            </p>
          </div>

          {/* Mission & Vision */}
          <div className="grid lg:grid-cols-2 gap-12 mb-20">
            <GlassCard className="p-8">
              <div className="w-16 h-16 bg-champagne-200 rounded-2xl mb-6 flex items-center justify-center">
                <Target className="h-8 w-8 text-ink-950" />
              </div>
              <h2 className="font-display font-bold text-3xl text-ink-950 mb-4">Our Mission</h2>
              <p className="text-slate-700 leading-relaxed mb-6">
                To democratize advanced financial intelligence by making sophisticated AI tools accessible 
                to financial institutions across Morocco, MENA, and beyond. We believe every organization, 
                from small accounting firms to major banks, deserves access to world-class AI capabilities.
              </p>
              <p className="text-slate-700 leading-relaxed">
                Our focus on regulatory compliance, multi-language support, and cultural understanding 
                ensures that global AI advances serve local market needs effectively.
              </p>
            </GlassCard>

            <GlassCard className="p-8">
              <div className="w-16 h-16 bg-champagne-200 rounded-2xl mb-6 flex items-center justify-center">
                <Zap className="h-8 w-8 text-ink-950" />
              </div>
              <h2 className="font-display font-bold text-3xl text-ink-950 mb-4">Our Vision</h2>
              <p className="text-slate-700 leading-relaxed mb-6">
                To become the leading AI platform for financial services across emerging markets, 
                setting the standard for ethical AI deployment, regulatory compliance, and 
                cross-cultural financial intelligence.
              </p>
              <p className="text-slate-700 leading-relaxed">
                We envision a future where language barriers, regulatory complexity, and technical 
                limitations no longer prevent financial professionals from making data-driven decisions 
                with confidence and precision.
              </p>
            </GlassCard>
          </div>

          {/* Company Stats */}
          <GlassCard className="p-12 mb-20 text-center">
            <h2 className="font-display font-bold text-3xl text-ink-950 mb-8">
              Growing Across Morocco & The World
            </h2>
            <div className="grid md:grid-cols-4 gap-8">
              <div>
                <div className="font-display font-bold text-4xl text-ink-950 mb-2">50+</div>
                <div className="text-slate-700">Financial Institutions</div>
                <div className="text-sm text-slate-600">Active clients</div>
              </div>
              <div>
                <div className="font-display font-bold text-4xl text-ink-950 mb-2">15</div>
                <div className="text-slate-700">Countries Served</div>
                <div className="text-sm text-slate-600">Morocco, MENA, Europe</div>
              </div>
              <div>
                <div className="font-display font-bold text-4xl text-ink-950 mb-2">99.9%</div>
                <div className="text-slate-700">Uptime SLA</div>
                <div className="text-sm text-slate-600">Enterprise reliability</div>
              </div>
              <div>
                <div className="font-display font-bold text-4xl text-ink-950 mb-2">24/7</div>
                <div className="text-slate-700">Global Support</div>
                <div className="text-sm text-slate-600">Multi-language assistance</div>
              </div>
            </div>
          </GlassCard>

          {/* Our Story */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="font-display font-bold text-4xl text-ink-950 mb-4">
                Our Story
              </h2>
              <p className="text-xl text-slate-700 max-w-3xl mx-auto">
                Born from the need to bridge global AI innovation with local financial expertise
              </p>
            </div>

            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-champagne-300 hidden md:block"></div>
              
              <div className="space-y-8">
                <div className="flex gap-6">
                  <div className="w-16 h-16 bg-ink-950 rounded-2xl flex items-center justify-center text-white font-bold text-lg">
                    '22
                  </div>
                  <div className="flex-1">
                    <h3 className="font-display font-bold text-xl text-ink-950 mb-2">Foundation</h3>
                    <p className="text-slate-700 leading-relaxed">
                      Founded in Casablanca with a vision to make AI accessible to Moroccan financial 
                      institutions. Started with a small team of AI researchers and financial experts 
                      who understood both technology and local market needs.
                    </p>
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="w-16 h-16 bg-ink-950 rounded-2xl flex items-center justify-center text-white font-bold text-lg">
                    '23
                  </div>
                  <div className="flex-1">
                    <h3 className="font-display font-bold text-xl text-ink-950 mb-2">First Product Launch</h3>
                    <p className="text-slate-700 leading-relaxed">
                      Launched Tax Counsel, our flagship AI tax advisory tool, specifically designed for 
                      Moroccan tax law with multi-jurisdiction capabilities. Gained our first enterprise 
                      customers in banking and accounting sectors.
                    </p>
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="w-16 h-16 bg-ink-950 rounded-2xl flex items-center justify-center text-white font-bold text-lg">
                    '24
                  </div>
                  <div className="flex-1">
                    <h3 className="font-display font-bold text-xl text-ink-950 mb-2">Platform Expansion</h3>
                    <p className="text-slate-700 leading-relaxed">
                      Expanded to a full AI suite with Query Architect and Factoring Guardian. 
                      Established partnerships with major Moroccan banks and international expansion 
                      into MENA markets. Achieved SOC 2 certification.
                    </p>
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="w-16 h-16 bg-champagne-200 rounded-2xl flex items-center justify-center text-ink-950 font-bold text-lg">
                    '25
                  </div>
                  <div className="flex-1">
                    <h3 className="font-display font-bold text-xl text-ink-950 mb-2">Global Reach</h3>
                    <p className="text-slate-700 leading-relaxed">
                      Serving clients across 15 countries with localized AI models for different 
                      regulatory environments. Launched enterprise deployment services and 
                      comprehensive training programs. Looking toward European market expansion.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Values */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="font-display font-bold text-4xl text-ink-950 mb-4">
                Our Values
              </h2>
              <p className="text-xl text-slate-700">
                Principles that guide everything we do
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <GlassCard className="p-8 text-center">
                <div className="w-16 h-16 bg-champagne-200 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                  <Shield className="h-8 w-8 text-ink-950" />
                </div>
                <h3 className="font-display font-bold text-xl text-ink-950 mb-4">Trust & Security</h3>
                <p className="text-slate-700 leading-relaxed">
                  Financial data requires the highest levels of security. We implement bank-grade 
                  security measures and maintain transparent practices in everything we do.
                </p>
              </GlassCard>

              <GlassCard className="p-8 text-center">
                <div className="w-16 h-16 bg-champagne-200 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                  <Users className="h-8 w-8 text-ink-950" />
                </div>
                <h3 className="font-display font-bold text-xl text-ink-950 mb-4">Local Expertise</h3>
                <p className="text-slate-700 leading-relaxed">
                  We understand that global technology must serve local needs. Our AI models are 
                  trained on local regulations, languages, and business practices.
                </p>
              </GlassCard>

              <GlassCard className="p-8 text-center">
                <div className="w-16 h-16 bg-champagne-200 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                  <Zap className="h-8 w-8 text-ink-950" />
                </div>
                <h3 className="font-display font-bold text-xl text-ink-950 mb-4">Innovation</h3>
                <p className="text-slate-700 leading-relaxed">
                  We push the boundaries of what's possible with AI in finance, while maintaining 
                  the reliability and accuracy that financial professionals demand.
                </p>
              </GlassCard>
            </div>
          </div>

          {/* Leadership Team */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="font-display font-bold text-4xl text-ink-950 mb-4">
                Leadership Team
              </h2>
              <p className="text-xl text-slate-700">
                Experienced professionals combining AI expertise with deep financial industry knowledge
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <GlassCard className="p-8 text-center">
                <div className="w-24 h-24 bg-champagne-200 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                  <span className="font-display font-bold text-2xl text-ink-950">SA</span>
                </div>
                <h3 className="font-display font-bold text-xl text-ink-950 mb-2">Sarah Alami</h3>
                <p className="text-sm text-slate-600 mb-3">Chief Executive Officer</p>
                <p className="text-slate-700 text-sm leading-relaxed">
                  Former banking executive with 15 years in Moroccan financial services. 
                  Led digital transformation initiatives at major banks before founding FiscAI.
                </p>
              </GlassCard>

              <GlassCard className="p-8 text-center">
                <div className="w-24 h-24 bg-champagne-200 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                  <span className="font-display font-bold text-2xl text-ink-950">YB</span>
                </div>
                <h3 className="font-display font-bold text-xl text-ink-950 mb-2">Youssef Benali</h3>
                <p className="text-sm text-slate-600 mb-3">Chief Technology Officer</p>
                <p className="text-slate-700 text-sm leading-relaxed">
                  AI researcher with PhD from École Polytechnique. Previously led machine learning 
                  teams at European fintech companies with focus on NLP and financial applications.
                </p>
              </GlassCard>

              <GlassCard className="p-8 text-center">
                <div className="w-24 h-24 bg-champagne-200 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                  <span className="font-display font-bold text-2xl text-ink-950">LM</span>
                </div>
                <h3 className="font-display font-bold text-xl text-ink-950 mb-2">Laila Mansouri</h3>
                <p className="text-sm text-slate-600 mb-3">Chief Compliance Officer</p>
                <p className="text-slate-700 text-sm leading-relaxed">
                  International tax law expert and former partner at Big Four accounting firm. 
                  Specializes in MENA regulatory frameworks and cross-border compliance.
                </p>
              </GlassCard>
            </div>
          </div>

          {/* Offices & Presence */}
          <GlassCard className="p-12 mb-20">
            <div className="text-center mb-8">
              <h2 className="font-display font-bold text-3xl text-ink-950 mb-4">
                Global Presence, Local Expertise
              </h2>
              <p className="text-lg text-slate-700 mb-8">
                Headquartered in Morocco with a growing international footprint
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-champagne-200 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                  <MapPin className="h-8 w-8 text-ink-950" />
                </div>
                <h3 className="font-semibold text-xl text-ink-950 mb-2">Morocco HQ</h3>
                <p className="text-slate-700 mb-2">Casablanca Financial City</p>
                <p className="text-sm text-slate-600">
                  Main development center and regional headquarters serving MENA markets
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-champagne-200 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                  <Globe className="h-8 w-8 text-ink-950" />
                </div>
                <h3 className="font-semibold text-xl text-ink-950 mb-2">Global Operations</h3>
                <p className="text-slate-700 mb-2">Remote-first international team</p>
                <p className="text-sm text-slate-600">
                  Engineers and specialists across Europe, Middle East, and Africa
                </p>
              </div>
            </div>
          </GlassCard>

          {/* Awards & Recognition */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="font-display font-bold text-4xl text-ink-950 mb-4">
                Recognition & Awards
              </h2>
              <p className="text-xl text-slate-700">
                Industry recognition for innovation and impact
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-6">
              <GlassCard className="p-6 text-center">
                <div className="w-12 h-12 bg-champagne-200 rounded-xl mx-auto mb-4 flex items-center justify-center">
                  <Award className="h-6 w-6 text-ink-950" />
                </div>
                <div className="font-semibold text-ink-950 mb-1">Fintech Morocco</div>
                <div className="text-sm text-slate-700">AI Innovation Award</div>
                <div className="text-xs text-slate-600">2024</div>
              </GlassCard>

              <GlassCard className="p-6 text-center">
                <div className="w-12 h-12 bg-champagne-200 rounded-xl mx-auto mb-4 flex items-center justify-center">
                  <Award className="h-6 w-6 text-ink-950" />
                </div>
                <div className="font-semibold text-ink-950 mb-1">MENA Tech</div>
                <div className="text-sm text-slate-700">Best B2B Solution</div>
                <div className="text-xs text-slate-600">2024</div>
              </GlassCard>

              <GlassCard className="p-6 text-center">
                <div className="w-12 h-12 bg-champagne-200 rounded-xl mx-auto mb-4 flex items-center justify-center">
                  <Award className="h-6 w-6 text-ink-950" />
                </div>
                <div className="font-semibold text-ink-950 mb-1">SOC 2</div>
                <div className="text-sm text-slate-700">Type II Certified</div>
                <div className="text-xs text-slate-600">2024</div>
              </GlassCard>

              <GlassCard className="p-6 text-center">
                <div className="w-12 h-12 bg-champagne-200 rounded-xl mx-auto mb-4 flex items-center justify-center">
                  <Award className="h-6 w-6 text-ink-950" />
                </div>
                <div className="font-semibold text-ink-950 mb-1">ISO 27001</div>
                <div className="text-sm text-slate-700">Certified</div>
                <div className="text-xs text-slate-600">2023</div>
              </GlassCard>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <h2 className="font-display font-bold text-4xl text-ink-950 mb-6">
              Join Our Mission
            </h2>
            <p className="text-xl text-slate-700 mb-8 max-w-2xl mx-auto">
              Be part of the AI revolution in finance. Whether you're a customer, partner, or future team member, 
              we'd love to hear from you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" className="bg-ink-950 text-alabaster-50 hover:bg-ink-900 px-8 py-4 text-lg font-semibold rounded-xl inline-flex items-center justify-center transition-colors">
                Get in Touch
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link href="/careers" className="border border-ink-950 bg-alabaster-50 text-ink-950 hover:bg-alabaster-100 px-8 py-4 text-lg font-semibold rounded-xl inline-flex items-center justify-center transition-colors">
                View Careers
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}