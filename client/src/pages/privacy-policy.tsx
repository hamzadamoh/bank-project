import Navigation from "@/components/layout/navigation";
import Footer from "@/components/layout/footer";
import { GlassCard } from "@/components/ui/glass-card";
import { Shield, Mail, Lock, Eye } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-alabaster-50 via-white to-champagne-100">
      <Navigation />

      <div className="pt-32 pb-20 px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-champagne-200/30 px-4 py-2 rounded-full text-sm font-medium text-ink-950 mb-6">
              <Shield className="h-4 w-4" />
              Privacy & Data Protection
            </div>
            <h1 className="font-display font-bold text-5xl lg:text-6xl text-ink-950 mb-6">
              Privacy Policy
            </h1>
            <p className="text-xl text-slate-700 max-w-3xl mx-auto leading-relaxed">
              Your privacy is fundamental to our mission. Learn how we collect, use, and protect your information.
            </p>
            <p className="text-sm text-slate-600 mt-4">
              Last updated: January 15, 2025
            </p>
          </div>

          <GlassCard className="p-8 lg:p-12 prose prose-lg max-w-none">
            {/* Introduction */}
            <section className="mb-8">
              <h2 className="font-display font-bold text-2xl text-ink-950 mb-4">Introduction</h2>
              <p className="text-slate-700 leading-relaxed">
                FiscAI ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website, applications, and services (collectively, the "Services"). This policy applies to users worldwide, with specific attention to Moroccan and international data protection regulations.
              </p>
            </section>

            {/* Information We Collect */}
            <section className="mb-8">
              <h2 className="font-display font-bold text-2xl text-ink-950 mb-4">Information We Collect</h2>

              <h3 className="font-semibold text-xl text-ink-950 mb-3">Information You Provide</h3>
              <ul className="list-disc list-inside text-slate-700 space-y-2 mb-6">
                <li>Account registration information (name, email, company details)</li>
                <li>Demo requests and contact form submissions</li>
                <li>Tax queries and document uploads for AI analysis</li>
                <li>Communication preferences and newsletter subscriptions</li>
                <li>Support requests and feedback</li>
              </ul>

              <h3 className="font-semibold text-xl text-ink-950 mb-3">Information Collected Automatically</h3>
              <ul className="list-disc list-inside text-slate-700 space-y-2">
                <li>Usage data and analytics (pages visited, features used)</li>
                <li>Device information (browser type, operating system)</li>
                <li>IP address and location data (for security and localization)</li>
                <li>Cookies and similar tracking technologies</li>
              </ul>
            </section>

            {/* How We Use Information */}
            <section className="mb-8">
              <h2 className="font-display font-bold text-2xl text-ink-950 mb-4">How We Use Your Information</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-lg text-ink-950 mb-3">Service Delivery</h4>
                  <ul className="list-disc list-inside text-slate-700 space-y-1 text-sm">
                    <li>Process tax advisory requests</li>
                    <li>Provide AI-powered document analysis</li>
                    <li>Generate SQL queries and explanations</li>
                    <li>Deliver customer support</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-lg text-ink-950 mb-3">Communication</h4>
                  <ul className="list-disc list-inside text-slate-700 space-y-1 text-sm">
                    <li>Send newsletters and updates</li>
                    <li>Respond to inquiries and requests</li>
                    <li>Notify about service changes</li>
                    <li>Marketing communications (with consent)</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Data Processing Legal Basis */}
            <section className="mb-8">
              <h2 className="font-display font-bold text-2xl text-ink-950 mb-4">Legal Basis for Processing</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                We process your personal data based on the following legal grounds:
              </p>
              <ul className="list-disc list-inside text-slate-700 space-y-2">
                <li><strong>Contract:</strong> To provide services you've requested</li>
                <li><strong>Consent:</strong> For marketing communications and optional features</li>
                <li><strong>Legitimate Interest:</strong> For security, analytics, and service improvement</li>
                <li><strong>Legal Obligation:</strong> To comply with applicable laws and regulations</li>
              </ul>
            </section>

            {/* Data Sharing */}
            <section className="mb-8">
              <h2 className="font-display font-bold text-2xl text-ink-950 mb-4">Information Sharing</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                We do not sell your personal information. We may share information in these limited circumstances:
              </p>
              <ul className="list-disc list-inside text-slate-700 space-y-2">
                <li><strong>Service Providers:</strong> Trusted partners who assist in service delivery</li>
                <li><strong>Payment Processors:</strong> Stripe and PayPal process payments on our behalf. They receive only the payment data necessary to complete transactions and are governed by their own privacy policies</li>
                <li><strong>Legal Requirements:</strong> When required by law or legal process</li>
                <li><strong>Business Transfers:</strong> In case of merger, acquisition, or asset sale</li>
                <li><strong>Consent:</strong> When you explicitly authorize sharing</li>
              </ul>
            </section>

            {/* Payment Information */}
            <section className="mb-8">
              <h2 className="font-display font-bold text-2xl text-ink-950 mb-4">Payment Information</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                When you subscribe to a paid plan, payment processing is handled by our third-party payment processors:
              </p>
              <ul className="list-disc list-inside text-slate-700 space-y-2 mb-4">
                <li><strong>Stripe:</strong> Processes credit and debit card payments. Stripe collects card numbers, expiration dates, and CVC codes directly — FiscAI never stores your full card details. See <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer" className="text-ink-950 underline hover:text-slate-700">Stripe's Privacy Policy</a></li>
                <li><strong>PayPal:</strong> Processes PayPal account payments. PayPal may collect your email, billing address, and transaction history. See <a href="https://www.paypal.com/privacy" target="_blank" rel="noopener noreferrer" className="text-ink-950 underline hover:text-slate-700">PayPal's Privacy Policy</a></li>
              </ul>
              <p className="text-slate-700 leading-relaxed">
                We retain billing records (transaction amounts, dates, and subscription status) for accounting and regulatory compliance, but we do not store sensitive payment credentials on our servers.
              </p>
            </section>

            {/* Data Security */}
            <section className="mb-8">
              <h2 className="font-display font-bold text-2xl text-ink-950 mb-4">Data Security</h2>
              <div className="bg-champagne-200/20 p-6 rounded-2xl">
                <div className="flex items-start gap-3">
                  <Lock className="h-6 w-6 text-ink-950 mt-1" />
                  <div>
                    <h4 className="font-semibold text-ink-950 mb-2">Enterprise-Grade Security</h4>
                    <p className="text-slate-700 text-sm leading-relaxed">
                      We implement industry-standard security measures including AES-256 encryption,
                      SOC 2 Type II compliance, regular security audits, and secure data centers.
                      All financial data is encrypted both in transit and at rest.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* International Transfers */}
            <section className="mb-8">
              <h2 className="font-display font-bold text-2xl text-ink-950 mb-4">International Data Transfers</h2>
              <p className="text-slate-700 leading-relaxed">
                As a global service provider based in Morocco, we may transfer your data internationally.
                We ensure adequate protection through Standard Contractual Clauses (SCCs) and other
                appropriate safeguards recognized by international data protection authorities.
              </p>
            </section>

            {/* Your Rights */}
            <section className="mb-8">
              <h2 className="font-display font-bold text-2xl text-ink-950 mb-4">Your Rights</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                Depending on your location, you may have the following rights:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4 text-ink-950" />
                    <span className="text-sm font-medium text-ink-950">Access your data</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4 text-ink-950" />
                    <span className="text-sm font-medium text-ink-950">Rectify inaccurate data</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4 text-ink-950" />
                    <span className="text-sm font-medium text-ink-950">Erase your data</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4 text-ink-950" />
                    <span className="text-sm font-medium text-ink-950">Port your data</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4 text-ink-950" />
                    <span className="text-sm font-medium text-ink-950">Object to processing</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4 text-ink-950" />
                    <span className="text-sm font-medium text-ink-950">Withdraw consent</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Retention */}
            <section className="mb-8">
              <h2 className="font-display font-bold text-2xl text-ink-950 mb-4">Data Retention</h2>
              <p className="text-slate-700 leading-relaxed">
                We retain your information only as long as necessary to provide services and comply with legal obligations.
                Account data is typically retained for 7 years after account closure for regulatory compliance in the financial sector.
              </p>
            </section>

            {/* Contact */}
            <section className="mb-8">
              <h2 className="font-display font-bold text-2xl text-ink-950 mb-4">Contact Us</h2>
              <div className="bg-champagne-200/20 p-6 rounded-2xl">
                <div className="flex items-start gap-3">
                  <Mail className="h-6 w-6 text-ink-950 mt-1" />
                  <div>
                    <h4 className="font-semibold text-ink-950 mb-2">Data Protection Officer</h4>
                    <p className="text-slate-700 text-sm">
                      For questions about this Privacy Policy or your data rights:<br />
                      Email: privacy@fiscai.co<br />
                      Address: FiscAI Data Protection, Casablanca, Morocco
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </GlassCard>
        </div>
      </div>

      <Footer />
    </div>
  );
}