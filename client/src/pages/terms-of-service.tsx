import Navigation from "@/components/layout/navigation";
import Footer from "@/components/layout/footer";
import { GlassCard } from "@/components/ui/glass-card";
import { FileText, Scale, AlertCircle } from "lucide-react";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-alabaster-50 via-white to-champagne-100">
      <Navigation />

      <div className="pt-32 pb-20 px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-champagne-200/30 px-4 py-2 rounded-full text-sm font-medium text-ink-950 mb-6">
              <Scale className="h-4 w-4" />
              Legal Terms & Conditions
            </div>
            <h1 className="font-display font-bold text-5xl lg:text-6xl text-ink-950 mb-6">
              Terms of Service
            </h1>
            <p className="text-xl text-slate-700 max-w-3xl mx-auto leading-relaxed">
              These terms govern your use of FiscAI's AI-powered financial services platform.
            </p>
            <p className="text-sm text-slate-600 mt-4">
              Last updated: January 15, 2025
            </p>
          </div>

          <GlassCard className="p-8 lg:p-12 prose prose-lg max-w-none">
            {/* Acceptance */}
            <section className="mb-8">
              <h2 className="font-display font-bold text-2xl text-ink-950 mb-4">1. Acceptance of Terms</h2>
              <p className="text-slate-700 leading-relaxed">
                By accessing or using FiscAI's services ("Services"), you agree to be bound by these Terms of Service ("Terms").
                If you disagree with any part of these terms, you may not access the Services. These terms apply to all users
                worldwide, with specific provisions for Moroccan and international regulatory compliance.
              </p>
            </section>

            {/* Services Description */}
            <section className="mb-8">
              <h2 className="font-display font-bold text-2xl text-ink-950 mb-4">2. Description of Services</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                FiscAI provides AI-powered financial and tax advisory tools including:
              </p>
              <ul className="list-disc list-inside text-slate-700 space-y-2">
                <li>Tax Counsel: Multi-jurisdiction tax advisory and compliance guidance</li>
                <li>Query Architect: Natural language to SQL conversion and data analysis</li>
                <li>Factoring Guardian: Document fraud detection and invoice analysis</li>
                <li>Additional AI tools for financial operations and compliance</li>
              </ul>
            </section>

            {/* Professional Disclaimer */}
            <section className="mb-8">
              <div className="bg-amber-50 border border-amber-200 p-6 rounded-2xl">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-6 w-6 text-amber-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-amber-800 mb-2">Important Professional Disclaimer</h3>
                    <p className="text-amber-700 text-sm leading-relaxed">
                      FiscAI provides AI-assisted analysis and recommendations. Our services do not constitute professional
                      tax, legal, or financial advice. Always consult qualified professionals for specific situations.
                      We are not a licensed tax advisory firm or accounting practice.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* User Obligations */}
            <section className="mb-8">
              <h2 className="font-display font-bold text-2xl text-ink-950 mb-4">3. User Obligations</h2>
              <h3 className="font-semibold text-xl text-ink-950 mb-3">You agree to:</h3>
              <ul className="list-disc list-inside text-slate-700 space-y-2 mb-6">
                <li>Provide accurate and complete information</li>
                <li>Maintain the security of your account credentials</li>
                <li>Use the Services only for lawful business purposes</li>
                <li>Comply with all applicable laws and regulations</li>
                <li>Respect intellectual property rights</li>
              </ul>

              <h3 className="font-semibold text-xl text-ink-950 mb-3">You agree NOT to:</h3>
              <ul className="list-disc list-inside text-slate-700 space-y-2">
                <li>Upload malicious content or attempt to compromise security</li>
                <li>Reverse engineer or copy our AI models and algorithms</li>
                <li>Use the Services for illegal activities or money laundering</li>
                <li>Share access credentials with unauthorized parties</li>
                <li>Violate any applicable financial regulations</li>
              </ul>
            </section>

            {/* Data and Privacy */}
            <section className="mb-8">
              <h2 className="font-display font-bold text-2xl text-ink-950 mb-4">4. Data and Privacy</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                Your privacy is essential to our service delivery:
              </p>
              <ul className="list-disc list-inside text-slate-700 space-y-2">
                <li>We process your data in accordance with our Privacy Policy</li>
                <li>Financial data is encrypted and stored securely</li>
                <li>You retain ownership of your uploaded documents and data</li>
                <li>We may use anonymized data to improve our AI models</li>
                <li>Data processing complies with Moroccan and international regulations</li>
              </ul>
            </section>

            {/* Intellectual Property */}
            <section className="mb-8">
              <h2 className="font-display font-bold text-2xl text-ink-950 mb-4">5. Intellectual Property</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-lg text-ink-950 mb-3">Our Rights</h4>
                  <ul className="list-disc list-inside text-slate-700 space-y-1 text-sm">
                    <li>AI models and algorithms</li>
                    <li>Software and platform technology</li>
                    <li>FiscAI brand and trademarks</li>
                    <li>Service documentation</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-lg text-ink-950 mb-3">Your Rights</h4>
                  <ul className="list-disc list-inside text-slate-700 space-y-1 text-sm">
                    <li>Your uploaded documents</li>
                    <li>Your company data and information</li>
                    <li>Results generated from your queries</li>
                    <li>Your account and usage data</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Service Availability */}
            <section className="mb-8">
              <h2 className="font-display font-bold text-2xl text-ink-950 mb-4">6. Service Availability</h2>
              <p className="text-slate-700 leading-relaxed">
                We strive for high availability but do not guarantee uninterrupted service. Planned maintenance,
                updates, and unforeseen technical issues may cause temporary service interruptions. We provide
                99.9% uptime SLA for Enterprise customers with appropriate service credits for extended outages.
              </p>
            </section>

            {/* Billing & Payments */}
            <section className="mb-8">
              <h2 className="font-display font-bold text-2xl text-ink-950 mb-4">7. Billing & Payments</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                Paid subscriptions are billed in advance on a monthly or annual basis. By subscribing, you agree to the following:
              </p>
              <ul className="list-disc list-inside text-slate-700 space-y-2 mb-4">
                <li><strong>Payment Methods:</strong> We accept credit/debit cards (via Stripe) and PayPal</li>
                <li><strong>Auto-Renewal:</strong> Subscriptions automatically renew at the end of each billing period unless cancelled</li>
                <li><strong>Price Changes:</strong> We will provide at least 30 days' notice before any price changes take effect</li>
                <li><strong>Failed Payments:</strong> If payment fails, we may attempt to charge again or suspend access after a grace period</li>
                <li><strong>Taxes:</strong> Prices are exclusive of applicable taxes, which will be added at checkout</li>
              </ul>
              <p className="text-slate-700 leading-relaxed">
                All payments are processed securely by our third-party payment processors (Stripe and PayPal).
                FiscAI does not store your complete payment credentials.
              </p>
            </section>

            {/* Refunds & Cancellations */}
            <section className="mb-8">
              <h2 className="font-display font-bold text-2xl text-ink-950 mb-4">8. Refunds & Cancellations</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                All new subscriptions are covered by a 30-day money-back guarantee. You may cancel your subscription
                at any time; access continues until the end of the current billing period. For full details on
                refund eligibility, prorated refunds for annual plans, and the refund request process, please refer
                to our <a href="/refund-policy" className="text-ink-950 underline hover:text-slate-700">Refund Policy</a>.
              </p>
            </section>

            {/* Limitation of Liability */}
            <section className="mb-8">
              <h2 className="font-display font-bold text-2xl text-ink-950 mb-4">9. Limitation of Liability</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                To the maximum extent permitted by law, FiscAI's liability is limited as follows:
              </p>
              <ul className="list-disc list-inside text-slate-700 space-y-2">
                <li>We are not liable for indirect, consequential, or punitive damages</li>
                <li>Our maximum liability is limited to the fees paid in the 12 months prior to the claim</li>
                <li>We do not guarantee the accuracy of AI-generated analysis or recommendations</li>
                <li>Users are responsible for validating all outputs with qualified professionals</li>
              </ul>
            </section>

            {/* Governing Law */}
            <section className="mb-8">
              <h2 className="font-display font-bold text-2xl text-ink-950 mb-4">10. Governing Law</h2>
              <p className="text-slate-700 leading-relaxed">
                These Terms are governed by the laws of the Kingdom of Morocco. For international customers,
                disputes will be resolved through binding arbitration in accordance with ICC rules, with
                proceedings conducted in English in Casablanca, Morocco.
              </p>
            </section>

            {/* Changes to Terms */}
            <section className="mb-8">
              <h2 className="font-display font-bold text-2xl text-ink-950 mb-4">11. Changes to Terms</h2>
              <p className="text-slate-700 leading-relaxed">
                We may modify these Terms at any time. Material changes will be communicated via email and
                posted on our website 30 days before taking effect. Continued use of the Services after
                changes constitutes acceptance of the modified Terms.
              </p>
            </section>

            {/* Contact Information */}
            <section className="mb-8">
              <h2 className="font-display font-bold text-2xl text-ink-950 mb-4">12. Contact Information</h2>
              <div className="bg-champagne-200/20 p-6 rounded-2xl">
                <div className="flex items-start gap-3">
                  <FileText className="h-6 w-6 text-ink-950 mt-1" />
                  <div>
                    <h4 className="font-semibold text-ink-950 mb-2">Legal Department</h4>
                    <p className="text-slate-700 text-sm">
                      For questions about these Terms of Service:<br />
                      Email: legal@fiscai.co<br />
                      Address: FiscAI Legal Department, Casablanca, Morocco<br />
                      Phone: +212 5xx-xxx-xxx
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