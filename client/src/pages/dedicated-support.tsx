import Navigation from "@/components/layout/navigation";
import Footer from "@/components/layout/footer";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Phone, MessageCircle, Clock, Shield, Users, Zap, CheckCircle, ArrowRight } from "lucide-react";
import { Link } from "wouter";

export default function DedicatedSupport() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-alabaster-50 via-white to-champagne-100">
      <Navigation />

      <div className="pt-32 pb-20 px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-champagne-200/30 px-4 py-2 rounded-full text-sm font-medium text-ink-950 mb-6">
              <Phone className="h-4 w-4" />
              Enterprise Support Services
            </div>
            <h1 className="font-display font-bold text-5xl lg:text-6xl text-ink-950 mb-6">
              Dedicated Support
            </h1>
            <p className="text-xl text-slate-700 max-w-3xl mx-auto leading-relaxed">
              Get white-glove support with dedicated customer success and technical account managers.
              Available for Morocco and worldwide enterprise customers.
            </p>
          </div>

          {/* Support Tiers */}
          <div className="grid lg:grid-cols-3 gap-8 mb-20">
            <GlassCard className="p-8 relative">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-champagne-200 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                  <MessageCircle className="h-8 w-8 text-ink-950" />
                </div>
                <h3 className="font-display font-bold text-2xl text-ink-950 mb-2">Standard Support</h3>
                <p className="text-slate-700 text-sm">Included with all plans</p>
              </div>

              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-sm text-slate-700">24/7 help center access</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-sm text-slate-700">Email support (24h response)</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-sm text-slate-700">Community forum</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-sm text-slate-700">Video tutorials</span>
                </li>
              </ul>

              <p className="text-center font-semibold text-ink-950">Included</p>
            </GlassCard>

            <GlassCard className="p-8 relative border-2 border-ink-950">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-ink-950 text-white px-4 py-1 rounded-full text-sm font-medium">
                Most Popular
              </div>

              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-champagne-200 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                  <Users className="h-8 w-8 text-ink-950" />
                </div>
                <h3 className="font-display font-bold text-2xl text-ink-950 mb-2">Premium Support</h3>
                <p className="text-slate-700 text-sm">For growing businesses</p>
              </div>

              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-sm text-slate-700">Everything in Standard</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-sm text-slate-700">Priority email (4h response)</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-sm text-slate-700">Live chat support</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-sm text-slate-700">Phone support (business hours)</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-sm text-slate-700">Screen sharing assistance</span>
                </li>
              </ul>

              <p className="text-center font-semibold text-ink-950">$299/month</p>
            </GlassCard>

            <GlassCard className="p-8 relative bg-gradient-to-br from-ink-950 to-ink-900 text-white">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-champagne-200 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                  <Shield className="h-8 w-8 text-ink-950" />
                </div>
                <h3 className="font-display font-bold text-2xl mb-2">Enterprise Support</h3>
                <p className="text-alabaster-300 text-sm">White-glove service</p>
              </div>

              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <span className="text-sm text-alabaster-200">Everything in Premium</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <span className="text-sm text-alabaster-200">Dedicated customer success manager</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <span className="text-sm text-alabaster-200">Technical account manager</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <span className="text-sm text-alabaster-200">24/7 priority phone support</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <span className="text-sm text-alabaster-200">Custom SLA agreements</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <span className="text-sm text-alabaster-200">Quarterly business reviews</span>
                </li>
              </ul>

              <p className="text-center font-semibold">Contact Sales</p>
            </GlassCard>
          </div>

          {/* What's Included */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="font-display font-bold text-4xl text-ink-950 mb-4">
                What Enterprise Support Includes
              </h2>
              <p className="text-xl text-slate-700 max-w-3xl mx-auto">
                Comprehensive support designed for mission-critical financial operations
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <GlassCard className="p-6 text-center">
                <div className="w-12 h-12 bg-champagne-200 rounded-xl mx-auto mb-4 flex items-center justify-center">
                  <Users className="h-6 w-6 text-ink-950" />
                </div>
                <h4 className="font-semibold text-ink-950 mb-2">Dedicated Team</h4>
                <p className="text-sm text-slate-700">
                  Your own customer success and technical account managers who know your business
                </p>
              </GlassCard>

              <GlassCard className="p-6 text-center">
                <div className="w-12 h-12 bg-champagne-200 rounded-xl mx-auto mb-4 flex items-center justify-center">
                  <Clock className="h-6 w-6 text-ink-950" />
                </div>
                <h4 className="font-semibold text-ink-950 mb-2">24/7 Availability</h4>
                <p className="text-sm text-slate-700">
                  Round-the-clock support across all time zones including Morocco and MENA
                </p>
              </GlassCard>

              <GlassCard className="p-6 text-center">
                <div className="w-12 h-12 bg-champagne-200 rounded-xl mx-auto mb-4 flex items-center justify-center">
                  <Zap className="h-6 w-6 text-ink-950" />
                </div>
                <h4 className="font-semibold text-ink-950 mb-2">Priority Response</h4>
                <p className="text-sm text-slate-700">
                  15-minute response time for critical issues, 1-hour for standard requests
                </p>
              </GlassCard>

              <GlassCard className="p-6 text-center">
                <div className="w-12 h-12 bg-champagne-200 rounded-xl mx-auto mb-4 flex items-center justify-center">
                  <Shield className="h-6 w-6 text-ink-950" />
                </div>
                <h4 className="font-semibold text-ink-950 mb-2">Custom SLAs</h4>
                <p className="text-sm text-slate-700">
                  Tailored service level agreements with guaranteed uptime and response metrics
                </p>
              </GlassCard>
            </div>
          </div>

          {/* Support Channels */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="font-display font-bold text-4xl text-ink-950 mb-4">
                Multiple Ways to Get Help
              </h2>
              <p className="text-xl text-slate-700">
                Choose the channel that works best for your team
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <GlassCard className="p-8 text-center">
                <div className="w-16 h-16 bg-champagne-200 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                  <Phone className="h-8 w-8 text-ink-950" />
                </div>
                <h3 className="font-semibold text-xl text-ink-950 mb-3">Phone Support</h3>
                <p className="text-slate-700 mb-4">
                  Direct access to technical experts for urgent issues and complex troubleshooting
                </p>
                <div className="text-sm text-slate-600">
                  Morocco: +212 5xx-xxx-xxx<br />
                  International: +1-xxx-xxx-xxxx
                </div>
              </GlassCard>

              <GlassCard className="p-8 text-center">
                <div className="w-16 h-16 bg-champagne-200 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                  <MessageCircle className="h-8 w-8 text-ink-950" />
                </div>
                <h3 className="font-semibold text-xl text-ink-950 mb-3">Live Chat</h3>
                <p className="text-slate-700 mb-4">
                  Real-time assistance for quick questions and guided walkthroughs
                </p>
                <div className="text-sm text-slate-600">
                  Available 24/7<br />
                  Average response: 2 minutes
                </div>
              </GlassCard>

              <GlassCard className="p-8 text-center">
                <div className="w-16 h-16 bg-champagne-200 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                  <Users className="h-8 w-8 text-ink-950" />
                </div>
                <h3 className="font-semibold text-xl text-ink-950 mb-3">Dedicated Portal</h3>
                <p className="text-slate-700 mb-4">
                  Private support portal with case tracking and knowledge base access
                </p>
                <div className="text-sm text-slate-600">
                  Enterprise customers only<br />
                  Integrated with your workflow
                </div>
              </GlassCard>
            </div>
          </div>

          {/* Global Coverage */}
          <GlassCard className="p-12 text-center mb-20">
            <h2 className="font-display font-bold text-3xl text-ink-950 mb-6">
              Global Support, Local Expertise
            </h2>
            <p className="text-lg text-slate-700 max-w-2xl mx-auto mb-8">
              Our support team understands both Moroccan financial regulations and international best practices,
              providing context-aware assistance for your specific market needs.
            </p>
            <div className="grid md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="font-bold text-2xl text-ink-950">Arabic</div>
                <div className="text-sm text-slate-600">Native language support</div>
              </div>
              <div>
                <div className="font-bold text-2xl text-ink-950">French</div>
                <div className="text-sm text-slate-600">Business language fluency</div>
              </div>
              <div>
                <div className="font-bold text-2xl text-ink-950">English</div>
                <div className="text-sm text-slate-600">Global business standard</div>
              </div>
              <div>
                <div className="font-bold text-2xl text-ink-950">24/7</div>
                <div className="text-sm text-slate-600">All time zones covered</div>
              </div>
            </div>
          </GlassCard>

          {/* CTA Section */}
          <div className="text-center">
            <h2 className="font-display font-bold text-4xl text-ink-950 mb-6">
              Ready for Premium Support?
            </h2>
            <p className="text-xl text-slate-700 mb-8 max-w-2xl mx-auto">
              Upgrade your support experience and get the dedicated attention your business deserves.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button className="bg-ink-950 text-alabaster-50 hover:bg-ink-900 px-8 py-4 text-lg font-semibold">
                  Contact Sales
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/pricing">
                <Button variant="outline" className="px-8 py-4 text-lg font-semibold">
                  View Support Plans
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}