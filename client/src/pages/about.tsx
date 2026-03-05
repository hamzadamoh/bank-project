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
              A Moroccan AI Startup
            </div>
            <h1 className="font-display font-bold text-5xl lg:text-6xl text-ink-950 mb-6">
              Disrupting Global Finance from Morocco
            </h1>
            <p className="text-xl text-slate-700 max-w-3xl mx-auto leading-relaxed">
              FiscAI is a Moroccan-founded startup building a scalable suite of 7 specialized AI tools.
              We are transforming how the world handles financial workflows, taxation, and compliance through disruptive innovation.
            </p>
          </div>

          {/* Morocco 300 Criteria - Innovation & Scalability */}
          <div className="grid lg:grid-cols-2 gap-12 mb-20">
            <GlassCard className="p-8">
              <div className="w-16 h-16 bg-champagne-200 rounded-2xl mb-6 flex items-center justify-center">
                <Target className="h-8 w-8 text-ink-950" />
              </div>
              <h2 className="font-display font-bold text-3xl text-ink-950 mb-4">Innovation & Technology</h2>
              <p className="text-slate-700 leading-relaxed mb-6">
                FiscAI leverages state-of-the-art Large Language Models (LLMs) to automate complex financial analysis.
                Instead of a generic chatbot, our product integrates 7 distinct, highly-tuned AI workflows addressing
                specific industry pain points—from multi-lingual SQL generation to predictive risk assessment.
              </p>
            </GlassCard>

            <GlassCard className="p-8">
              <div className="w-16 h-16 bg-champagne-200 rounded-2xl mb-6 flex items-center justify-center">
                <Zap className="h-8 w-8 text-ink-950" />
              </div>
              <h2 className="font-display font-bold text-3xl text-ink-950 mb-4">Scalability & Model</h2>
              <p className="text-slate-700 leading-relaxed mb-6">
                Our economic model is built for rapid, global scaling. The FiscAI platform operates entirely in the cloud,
                offering instantaneous deployment to financial professionals worldwide. By abstracting the complexity of AI
                infrastructure, we provide an immediate ROI through a frictionless SaaS model.
              </p>
            </GlassCard>
          </div>

          {/* The 7 Tools Showcase */}
          <GlassCard className="p-12 mb-20">
            <div className="text-center mb-12">
              <h2 className="font-display font-bold text-4xl text-ink-950 mb-4">
                7 Specialized AI Tools
              </h2>
              <p className="text-xl text-slate-700 max-w-3xl mx-auto">
                One unified platform powering the future of financial services.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
              <div className="p-4 bg-alabaster-50 rounded-xl">
                <div className="font-bold text-ink-950 mb-2">TaxWise</div>
                <div className="text-sm text-slate-600">Cross-border tax regulation intelligence.</div>
              </div>
              <div className="p-4 bg-alabaster-50 rounded-xl">
                <div className="font-bold text-ink-950 mb-2">DocuGuard</div>
                <div className="text-sm text-slate-600">Automated commercial document factoring.</div>
              </div>
              <div className="p-4 bg-alabaster-50 rounded-xl">
                <div className="font-bold text-ink-950 mb-2">QueryForge</div>
                <div className="text-sm text-slate-600">Natural language to SQL BI generation.</div>
              </div>
              <div className="p-4 bg-alabaster-50 rounded-xl">
                <div className="font-bold text-ink-950 mb-2">SkillForge</div>
                <div className="text-sm text-slate-600">AI-driven financial training scenarios.</div>
              </div>
              <div className="p-4 bg-alabaster-50 rounded-xl">
                <div className="font-bold text-ink-950 mb-2">PolyGlot</div>
                <div className="text-sm text-slate-600">Real-time voice localization for finance.</div>
              </div>
              <div className="p-4 bg-alabaster-50 rounded-xl">
                <div className="font-bold text-ink-950 mb-2">WellPulse</div>
                <div className="text-sm text-slate-600">Market health predictive indices.</div>
              </div>
              <div className="p-4 bg-alabaster-50 rounded-xl">
                <div className="font-bold text-ink-950 mb-2">FeedbackIQ</div>
                <div className="text-sm text-slate-600">Sentiment analysis for market data.</div>
              </div>
            </div>
          </GlassCard>

          {/* Leadership Team */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="font-display font-bold text-4xl text-ink-950 mb-4">
                Moroccan Founding Team
              </h2>
              <p className="text-xl text-slate-700 max-w-2xl mx-auto">
                Driven by local talent executing a global vision for the finance sector.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <GlassCard className="p-8 text-center">
                <div className="w-24 h-24 bg-champagne-200 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                  <span className="font-display font-bold text-2xl text-ink-950">SA</span>
                </div>
                <h3 className="font-display font-bold text-xl text-ink-950 mb-2">Sarah Alami</h3>
                <p className="text-sm text-slate-600 mb-3">Founder & CEO</p>
                <p className="text-slate-700 text-sm leading-relaxed">
                  Moroccan national with a vision to build globally competitive AI software from Casablanca to the world.
                </p>
              </GlassCard>

              <GlassCard className="p-8 text-center">
                <div className="w-24 h-24 bg-champagne-200 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                  <span className="font-display font-bold text-2xl text-ink-950">YB</span>
                </div>
                <h3 className="font-display font-bold text-xl text-ink-950 mb-2">Youssef Benali</h3>
                <p className="text-sm text-slate-600 mb-3">Co-Founder & CTO</p>
                <p className="text-slate-700 text-sm leading-relaxed">
                  Machine learning architect driving the development and orchestration of our 7 specialized LLM products.
                </p>
              </GlassCard>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <h2 className="font-display font-bold text-4xl text-ink-950 mb-6">
              Experience the Platform
            </h2>
            <p className="text-xl text-slate-700 mb-8 max-w-2xl mx-auto">
              Ready to see Moroccan innovation in action? Test drive the FiscAI suite today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/checkout?plan=starter" className="bg-ink-950 text-alabaster-50 hover:bg-ink-900 px-8 py-4 text-lg font-semibold rounded-xl inline-flex items-center justify-center transition-colors">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link href="/pricing" className="border border-ink-950 bg-alabaster-50 text-ink-950 hover:bg-alabaster-100 px-8 py-4 text-lg font-semibold rounded-xl inline-flex items-center justify-center transition-colors">
                View Pricing
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}