import { Link } from "wouter";
import TaxWiseDemo from "@/components/demos/taxwise-demo";
import QueryForgeDemo from "@/components/demos/queryforge-demo";
import FactoringGuardianDemo from "@/components/demos/docuguard-demo";
import { GlassCard } from "@/components/ui/glass-card";

export default function ProductsShowcase() {
  return (
    <section id="products" className="py-24 px-6 lg:px-8 scroll-mt-20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-display font-bold text-4xl md:text-5xl text-ink-950 mb-6">
            Seven AI Tools, One Platform
          </h2>
          <p className="text-xl text-slate-700 max-w-3xl mx-auto">
            Each tool is purpose-built for specific financial workflows, with enterprise-grade security and compliance built-in.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {/* FiscAI TaxWise */}
          <div className="lg:col-span-2">
            <GlassCard className="p-8 hover:scale-[1.02] transition-all duration-300">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="font-display font-bold text-2xl text-ink-950 mb-2">FiscAI TaxWise</h3>
                  <p className="text-slate-700">Premium tax advisory with multi-jurisdiction support</p>
                </div>
                <div className="bg-emerald-400 text-ink-950 px-3 py-1 rounded-xl text-sm font-semibold">FLAGSHIP</div>
              </div>

              <TaxWiseDemo />

              <div className="flex items-center justify-between mt-6">
                <div className="text-sm text-slate-600">
                  <span className="font-medium">Features:</span> Multi-jurisdiction • Citations • Export memos
                </div>
                <Link href="/products/taxwise" className="text-ink-950 font-semibold text-sm hover:text-slate-700 transition-colors">
                  Try Demo →
                </Link>
              </div>
            </GlassCard>
          </div>

          {/* DocuGuard */}
          <div>
            <GlassCard className="p-8 hover:scale-[1.02] transition-all duration-300 h-full">
              <h3 className="font-display font-bold text-2xl text-ink-950 mb-2">DocuGuard</h3>
              <p className="text-slate-700 mb-6">Intelligent fraud detection for factoring operations</p>

              <FactoringGuardianDemo />

              <Link href="/products/docuguard">
                <button className="w-full bg-ink-950 text-alabaster-50 py-3 rounded-xl font-semibold hover:bg-ink-900 transition-colors mt-6">
                  View Dashboard
                </button>
              </Link>
            </GlassCard>
          </div>
        </div>

        {/* QueryForge Demo */}
        <GlassCard className="p-8 mb-8">
          <div className="grid lg:grid-cols-2 gap-8">
            <div>
              <h3 className="font-display font-bold text-2xl text-ink-950 mb-2">QueryForge</h3>
              <p className="text-slate-700 mb-6">Bidirectional NL ⇄ SQL conversion with expert guidance</p>
            </div>
            <div>
              <Link href="/products/queryforge" className="text-ink-950 font-semibold text-sm hover:text-slate-700 transition-colors">
                Try Full Demo →
              </Link>
            </div>
          </div>

          <QueryForgeDemo />
        </GlassCard>

        {/* Other Tools Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link href="/products/skillforge">
            <GlassCard className="p-6 hover:scale-[1.02] transition-all duration-300 cursor-pointer">
              <h4 className="font-display font-bold text-lg text-ink-950 mb-2">SkillForge</h4>
              <p className="text-sm text-slate-700 mb-4">Gamified skills assessment with AI insights</p>
              <div className="bg-white rounded-xl p-3 mb-4">
                <div className="flex justify-between text-xs mb-1">
                  <span>Technical Skills</span>
                  <span>87%</span>
                </div>
                <div className="w-full bg-alabaster-200 rounded-full h-2">
                  <div className="bg-emerald-400 h-2 rounded-full" style={{ width: '87%' }}></div>
                </div>
              </div>
              <span className="text-ink-950 font-semibold text-sm hover:text-slate-700 transition-colors">
                Try Demo →
              </span>
            </GlassCard>
          </Link>

          <Link href="/products/polyglot">
            <GlassCard className="p-6 hover:scale-[1.02] transition-all duration-300 cursor-pointer">
              <h4 className="font-display font-bold text-lg text-ink-950 mb-2">PolyGlot</h4>
              <p className="text-sm text-slate-700 mb-4">Multilingual AI chatbot (FR/AR/Darija)</p>
              <div className="bg-white rounded-xl p-3 mb-4">
                <div className="text-xs text-slate-600 mb-2">Active Languages:</div>
                <div className="flex gap-1">
                  <span className="bg-champagne-200 px-2 py-1 rounded text-xs">FR</span>
                  <span className="bg-champagne-200 px-2 py-1 rounded text-xs">AR</span>
                  <span className="bg-champagne-200 px-2 py-1 rounded text-xs">Darija</span>
                </div>
              </div>
              <span className="text-ink-950 font-semibold text-sm hover:text-slate-700 transition-colors">
                Try Demo →
              </span>
            </GlassCard>
          </Link>

          <Link href="/products/wellpulse">
            <GlassCard className="p-6 hover:scale-[1.02] transition-all duration-300 cursor-pointer">
              <h4 className="font-display font-bold text-lg text-ink-950 mb-2">WellPulse</h4>
              <p className="text-sm text-slate-700 mb-4">Holistic well-being analytics platform</p>
              <div className="bg-white rounded-xl p-3 mb-4">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="text-center">
                    <div className="font-semibold text-emerald-400">Physical</div>
                    <div className="text-slate-600">85%</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-blue-400">Mental</div>
                    <div className="text-slate-600">78%</div>
                  </div>
                </div>
              </div>
              <span className="text-ink-950 font-semibold text-sm hover:text-slate-700 transition-colors">
                Try Demo →
              </span>
            </GlassCard>
          </Link>

          <Link href="/products/feedbackiq">
            <GlassCard className="p-6 hover:scale-[1.02] transition-all duration-300 cursor-pointer">
              <h4 className="font-display font-bold text-lg text-ink-950 mb-2">FeedbackIQ</h4>
              <p className="text-sm text-slate-700 mb-4">Emotional satisfaction measurement</p>
              <div className="bg-white rounded-xl p-3 mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald-400 mb-1">8.7</div>
                  <div className="text-xs text-slate-600">Customer Satisfaction</div>
                </div>
              </div>
              <span className="text-ink-950 font-semibold text-sm hover:text-slate-700 transition-colors">
                Try Demo →
              </span>
            </GlassCard>
          </Link>
        </div>
      </div>
    </section>
  );
}
