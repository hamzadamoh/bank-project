import Navigation from "@/components/layout/navigation";
import Footer from "@/components/layout/footer";
import { GlassCard } from "@/components/ui/glass-card";
import { RefreshCw, Mail, Clock, CreditCard } from "lucide-react";
import { Link } from "wouter";

export default function RefundPolicy() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-alabaster-50 via-white to-champagne-100">
            <Navigation />

            <div className="pt-32 pb-20 px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 bg-champagne-200/30 px-4 py-2 rounded-full text-sm font-medium text-ink-950 mb-6">
                            <RefreshCw className="h-4 w-4" />
                            Refund &amp; Cancellation Policy
                        </div>
                        <h1 className="font-display font-bold text-5xl lg:text-6xl text-ink-950 mb-6">
                            Refund Policy
                        </h1>
                        <p className="text-xl text-slate-700 max-w-3xl mx-auto leading-relaxed">
                            We stand behind our products with a fair and transparent refund policy.
                        </p>
                        <p className="text-sm text-slate-600 mt-4">
                            Last updated: February 20, 2026
                        </p>
                    </div>

                    <GlassCard className="p-8 lg:p-12 prose prose-lg max-w-none">
                        {/* Money-Back Guarantee */}
                        <section className="mb-8">
                            <h2 className="font-display font-bold text-2xl text-ink-950 mb-4">30-Day Money-Back Guarantee</h2>
                            <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-2xl mb-6">
                                <div className="flex items-start gap-3">
                                    <CreditCard className="h-6 w-6 text-emerald-600 mt-1" />
                                    <div>
                                        <h4 className="font-semibold text-emerald-800 mb-2">Risk-Free Trial</h4>
                                        <p className="text-emerald-700 text-sm leading-relaxed">
                                            All new subscriptions come with a 30-day money-back guarantee. If you're not satisfied
                                            with FiscAI within the first 30 days of your purchase, we'll issue a full refund — no questions asked.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <p className="text-slate-700 leading-relaxed">
                                This guarantee applies to all plan types (Starter, Professional, and Enterprise) and covers the
                                first billing period only. To request a refund during this period, simply contact our support team.
                            </p>
                        </section>

                        {/* Subscription Cancellation */}
                        <section className="mb-8">
                            <h2 className="font-display font-bold text-2xl text-ink-950 mb-4">Subscription Cancellation</h2>
                            <p className="text-slate-700 leading-relaxed mb-4">
                                You may cancel your subscription at any time. Here's what happens when you cancel:
                            </p>
                            <ul className="list-disc list-inside text-slate-700 space-y-2 mb-4">
                                <li><strong>Monthly plans:</strong> Your access continues until the end of the current billing period. No further charges will be made.</li>
                                <li><strong>Annual plans:</strong> You will receive a prorated refund for the remaining unused months, minus a 10% early termination fee.</li>
                                <li><strong>Enterprise contracts:</strong> Custom cancellation terms apply as specified in your service agreement.</li>
                            </ul>
                            <p className="text-slate-700 leading-relaxed">
                                After cancellation, your data will remain accessible for 30 days, after which it will be securely deleted
                                unless you request an export.
                            </p>
                        </section>

                        {/* Refund Eligibility */}
                        <section className="mb-8">
                            <h2 className="font-display font-bold text-2xl text-ink-950 mb-4">Refund Eligibility</h2>

                            <h3 className="font-semibold text-xl text-ink-950 mb-3">Eligible for Refund</h3>
                            <ul className="list-disc list-inside text-slate-700 space-y-2 mb-6">
                                <li>Service outages exceeding the guaranteed uptime SLA</li>
                                <li>Billing errors or duplicate charges</li>
                                <li>Cancellation within the 30-day money-back guarantee period</li>
                                <li>Feature unavailability not disclosed at the time of purchase</li>
                                <li>Prorated refunds for annual plan cancellations</li>
                            </ul>

                            <h3 className="font-semibold text-xl text-ink-950 mb-3">Not Eligible for Refund</h3>
                            <ul className="list-disc list-inside text-slate-700 space-y-2">
                                <li>Subscriptions cancelled after the 30-day money-back guarantee period (monthly plans)</li>
                                <li>Add-ons and one-time professional services already delivered</li>
                                <li>Account suspensions due to Terms of Service violations</li>
                                <li>Dissatisfaction with AI output quality (results may vary based on input data)</li>
                            </ul>
                        </section>

                        {/* How to Request */}
                        <section className="mb-8">
                            <h2 className="font-display font-bold text-2xl text-ink-950 mb-4">How to Request a Refund</h2>
                            <div className="grid md:grid-cols-3 gap-6">
                                <div className="bg-champagne-200/20 p-6 rounded-2xl text-center">
                                    <div className="text-2xl font-bold text-ink-950 mb-2">1</div>
                                    <h4 className="font-semibold text-ink-950 mb-2">Contact Us</h4>
                                    <p className="text-slate-700 text-sm">
                                        Email billing@fiscai.co or use the contact form with subject "Refund Request"
                                    </p>
                                </div>
                                <div className="bg-champagne-200/20 p-6 rounded-2xl text-center">
                                    <div className="text-2xl font-bold text-ink-950 mb-2">2</div>
                                    <h4 className="font-semibold text-ink-950 mb-2">Provide Details</h4>
                                    <p className="text-slate-700 text-sm">
                                        Include your account email, subscription ID, and reason for the refund
                                    </p>
                                </div>
                                <div className="bg-champagne-200/20 p-6 rounded-2xl text-center">
                                    <div className="text-2xl font-bold text-ink-950 mb-2">3</div>
                                    <h4 className="font-semibold text-ink-950 mb-2">Receive Refund</h4>
                                    <p className="text-slate-700 text-sm">
                                        Approved refunds are processed within 5-10 business days to your original payment method
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Processing Timeline */}
                        <section className="mb-8">
                            <h2 className="font-display font-bold text-2xl text-ink-950 mb-4">Processing Timeline</h2>
                            <div className="bg-champagne-200/20 p-6 rounded-2xl">
                                <div className="flex items-start gap-3">
                                    <Clock className="h-6 w-6 text-ink-950 mt-1" />
                                    <div>
                                        <h4 className="font-semibold text-ink-950 mb-2">Refund Processing Times</h4>
                                        <ul className="text-slate-700 text-sm space-y-2">
                                            <li><strong>Credit/Debit Card (Stripe):</strong> 5-10 business days</li>
                                            <li><strong>PayPal:</strong> 3-5 business days</li>
                                            <li><strong>Bank Transfer:</strong> 10-15 business days</li>
                                            <li><strong>Enterprise Invoicing:</strong> As per contract terms, typically 30 days</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Payment Disputes */}
                        <section className="mb-8">
                            <h2 className="font-display font-bold text-2xl text-ink-950 mb-4">Payment Disputes</h2>
                            <p className="text-slate-700 leading-relaxed mb-4">
                                If you notice an unauthorized or incorrect charge, please contact us before initiating a chargeback
                                or dispute with your bank or payment provider. We are committed to resolving billing issues promptly
                                and fairly.
                            </p>
                            <p className="text-slate-700 leading-relaxed">
                                Initiating a chargeback without contacting us first may result in account suspension while the
                                dispute is under review.
                            </p>
                        </section>

                        {/* Changes */}
                        <section className="mb-8">
                            <h2 className="font-display font-bold text-2xl text-ink-950 mb-4">Changes to This Policy</h2>
                            <p className="text-slate-700 leading-relaxed">
                                We may update this Refund Policy from time to time. Material changes will be communicated via email
                                and posted on our website at least 30 days before taking effect. The updated policy will apply to
                                all new purchases and renewals made after the effective date.
                            </p>
                        </section>

                        {/* Contact */}
                        <section className="mb-8">
                            <h2 className="font-display font-bold text-2xl text-ink-950 mb-4">Questions?</h2>
                            <div className="bg-champagne-200/20 p-6 rounded-2xl">
                                <div className="flex items-start gap-3">
                                    <Mail className="h-6 w-6 text-ink-950 mt-1" />
                                    <div>
                                        <h4 className="font-semibold text-ink-950 mb-2">Billing Support</h4>
                                        <p className="text-slate-700 text-sm">
                                            For refund requests or billing questions:<br />
                                            Email: billing@fiscai.co<br />
                                            Or visit our <Link href="/contact" className="text-ink-950 underline hover:text-slate-700">Contact page</Link>
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
