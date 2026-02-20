import Navigation from "@/components/layout/navigation";
import Footer from "@/components/layout/footer";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Check, Star, Shield, CreditCard } from "lucide-react";
import { FaCcVisa, FaCcMastercard, FaCcAmex, FaCcPaypal, FaStripe } from "react-icons/fa6";

export default function Pricing() {
  const plans = [
    {
      name: "Starter",
      description: "Perfect for small teams getting started with AI-powered finance",
      price: "Free",
      period: "14 days trial",
      popular: false,
      features: [
        "3 AI tools included (Tax Counsel, Query Architect, Basic Analytics)",
        "100 queries per month",
        "Email support",
        "Basic document processing",
        "Standard templates",
        "Community access"
      ],
      limitations: [
        "Single jurisdiction (Morocco)",
        "Basic security features",
        "Email-only support"
      ],
      cta: "Start Free Trial",
      ctaVariant: "outline" as const
    },
    {
      name: "Professional",
      description: "For growing teams that need advanced AI capabilities",
      price: "€2,500",
      period: "per month",
      popular: true,
      features: [
        "All 7 AI tools included",
        "10,000 queries per month",
        "Priority support (24/5)",
        "Advanced document processing",
        "Custom templates and workflows",
        "SSO integration (SAML/OIDC)",
        "Multi-jurisdiction support",
        "API access",
        "Advanced analytics dashboard",
        "Data export capabilities"
      ],
      limitations: [],
      cta: "Get Started",
      ctaVariant: "default" as const
    },
    {
      name: "Enterprise",
      description: "Custom solutions for large organizations with specific needs",
      price: "Custom",
      period: "contact sales",
      popular: false,
      features: [
        "Unlimited usage across all tools",
        "On-premises or private cloud deployment",
        "Custom integrations and workflows",
        "24/7 dedicated support with SLA",
        "Custom model training",
        "Advanced security and compliance",
        "Multi-tenant management",
        "Custom reporting and analytics",
        "Professional services and training",
        "Regulatory compliance assistance"
      ],
      limitations: [],
      cta: "Contact Sales",
      ctaVariant: "outline" as const,
      stripeLink: "",
      paypalLink: ""
    }
  ];

  const addOns = [
    {
      name: "Additional Jurisdictions",
      description: "Extend tax counsel to additional countries and regions",
      price: "€500",
      period: "per jurisdiction/month"
    },
    {
      name: "Premium Support",
      description: "24/7 phone and chat support with 1-hour response SLA",
      price: "€1,200",
      period: "per month"
    },
    {
      name: "Professional Services",
      description: "Implementation, training, and custom workflow development",
      price: "€2,000",
      period: "per day"
    },
    {
      name: "Advanced Analytics",
      description: "Custom dashboards, reporting, and business intelligence",
      price: "€800",
      period: "per month"
    }
  ];

  const faqs = [
    {
      question: "What's included in the free trial?",
      answer: "The 14-day free trial includes access to FiscAI Tax Counsel, Query Architect, and basic analytics with up to 100 queries. No credit card required."
    },
    {
      question: "Can I change plans anytime?",
      answer: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect at the next billing cycle, and we'll prorate any differences."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards, bank transfers, and can arrange annual invoicing for Enterprise customers."
    },
    {
      question: "Is there a setup fee?",
      answer: "No setup fees for Starter and Professional plans. Enterprise deployments may have implementation costs depending on complexity."
    },
    {
      question: "What happens if I exceed my query limit?",
      answer: "You'll be notified when approaching limits. Overage charges apply at €0.05 per additional query, or you can upgrade to a higher plan."
    },
    {
      question: "Do you offer discounts for non-profits or education?",
      answer: "Yes, we offer 50% discounts for qualified educational institutions and registered non-profit organizations. Contact sales for verification."
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
                Simple, Transparent Pricing
              </h1>
              <p className="text-xl text-slate-700 max-w-3xl mx-auto">
                Choose the plan that fits your organization. All plans include enterprise security and compliance features.
              </p>
            </div>

            {/* Pricing Cards */}
            <div className="grid lg:grid-cols-3 gap-8 mb-16">
              {plans.map((plan, index) => (
                <GlassCard
                  key={index}
                  className={`p-8 relative ${plan.popular ? 'ring-2 ring-ink-950' : ''}`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-ink-950 text-alabaster-50 px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-1">
                      <Star className="h-4 w-4" />
                      Most Popular
                    </div>
                  )}

                  <div className="text-center mb-8">
                    <h3 className="font-display font-bold text-2xl text-ink-950 mb-2">{plan.name}</h3>
                    <p className="text-slate-700 mb-6">{plan.description}</p>
                    <div className="mb-6">
                      <span className="font-display font-bold text-4xl text-ink-950">{plan.price}</span>
                      <span className="text-slate-600 ml-2">/ {plan.period}</span>
                    </div>
                  </div>

                  <div className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                        <span className="text-slate-700 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {plan.limitations.length > 0 && (
                    <div className="mb-8">
                      <h4 className="font-semibold text-ink-950 mb-3 text-sm">Limitations:</h4>
                      <ul className="space-y-2">
                        {plan.limitations.map((limitation, limitIndex) => (
                          <li key={limitIndex} className="text-slate-600 text-sm">
                            • {limitation}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <Link
                    href={plan.name === 'Enterprise' ? '/contact' : `/checkout?plan=${plan.name.toLowerCase()}`}
                    className={`w-full block text-center px-6 py-3 rounded-xl font-semibold transition-colors ${plan.ctaVariant === 'default'
                      ? 'bg-ink-950 text-alabaster-50 hover:bg-ink-900'
                      : 'bg-alabaster-50 border border-ink-950 text-ink-950 hover:bg-alabaster-100'
                      }`}
                  >
                    {plan.cta}
                  </Link>

                  {/* Payment Methods */}
                  {plan.name !== 'Enterprise' && (
                    <div className="mt-4 space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="h-px flex-1 bg-alabaster-200" />
                        <span className="text-xs text-slate-500">Pay with</span>
                        <div className="h-px flex-1 bg-alabaster-200" />
                      </div>
                      <div className="flex items-center justify-center gap-3 text-slate-400">
                        <FaCcVisa className="h-8 w-8 hover:text-[#1a1f71] transition-colors" />
                        <FaCcMastercard className="h-8 w-8 hover:text-[#eb001b] transition-colors" />
                        <FaCcAmex className="h-8 w-8 hover:text-[#006fcf] transition-colors" />
                        <FaCcPaypal className="h-8 w-8 hover:text-[#003087] transition-colors" />
                      </div>
                    </div>
                  )}
                </GlassCard>
              ))}
            </div>

            {/* Enterprise Features */}
            <div className="text-center">
              <p className="text-slate-600 mb-4">
                All plans include: End-to-end encryption • GDPR compliance • Audit trails • API access
              </p>
              <Badge className="bg-champagne-200 text-ink-950">
                30-day money-back guarantee
              </Badge>
            </div>

            {/* Payment Trust Indicators */}
            <div className="mt-12">
              <GlassCard className="p-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex items-center gap-3">
                    <Shield className="h-6 w-6 text-emerald-400" />
                    <div>
                      <p className="font-semibold text-ink-950 text-sm">Secure Payments</p>
                      <p className="text-xs text-slate-600">256-bit SSL encryption</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <FaStripe className="h-10 w-10 text-[#635bff]" />
                      <span className="text-xs text-slate-600 font-medium">Powered by Stripe</span>
                    </div>
                    <div className="h-6 w-px bg-alabaster-200" />
                    <div className="flex items-center gap-2">
                      <FaCcPaypal className="h-10 w-10 text-[#003087]" />
                      <span className="text-xs text-slate-600 font-medium">PayPal Accepted</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-6 w-6 text-ink-950" />
                    <div>
                      <p className="font-semibold text-ink-950 text-sm">Flexible Billing</p>
                      <p className="text-xs text-slate-600">Monthly or annual plans</p>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </div>
          </div>
        </section>

        {/* Add-ons Section */}
        <section className="py-24 px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="font-display font-bold text-4xl text-ink-950 mb-6">
                Add-ons & Extensions
              </h2>
              <p className="text-xl text-slate-700 max-w-3xl mx-auto">
                Enhance your FiscAI experience with specialized modules and premium support options.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {addOns.map((addon, index) => (
                <GlassCard key={index} className="p-8">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-display font-bold text-xl text-ink-950 mb-2">{addon.name}</h3>
                      <p className="text-slate-700 text-sm">{addon.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-display font-bold text-2xl text-ink-950">{addon.price}</span>
                      <span className="text-slate-600 text-sm ml-2">{addon.period}</span>
                    </div>
                    <Link href="/contact">
                      <Button variant="outline" size="sm">
                        Add to Plan
                      </Button>
                    </Link>
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>
        </section>

        {/* Calculator Section */}
        <section className="py-24 px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="font-display font-bold text-4xl text-ink-950 mb-6">
                ROI Calculator
              </h2>
              <p className="text-xl text-slate-700">
                See how FiscAI can impact your bottom line
              </p>
            </div>

            <GlassCard className="p-8">
              <div className="grid lg:grid-cols-2 gap-12">
                <div>
                  <h3 className="font-semibold text-ink-950 mb-6">Average Customer Savings</h3>
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-700">Manual tax research reduction</span>
                      <span className="font-semibold text-emerald-400">85% time saved</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-700">Document processing efficiency</span>
                      <span className="font-semibold text-emerald-400">90% faster</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-700">Fraud detection improvement</span>
                      <span className="font-semibold text-emerald-400">99.2% accuracy</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-700">Compliance cost reduction</span>
                      <span className="font-semibold text-emerald-400">65% savings</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-ink-950 mb-6">Typical 12-Month ROI</h3>
                  <div className="bg-champagne-200 rounded-2xl p-6 text-center">
                    <div className="font-display font-bold text-4xl text-ink-950 mb-2">320%</div>
                    <div className="text-slate-700 mb-4">Return on Investment</div>
                    <div className="text-sm text-slate-600">
                      Based on average customer savings across tax advisory, document processing, and fraud prevention.
                    </div>
                  </div>
                  <div className="mt-6 text-center">
                    <Link href="/contact">
                      <Button>Calculate Your ROI</Button>
                    </Link>
                  </div>
                </div>
              </div>
            </GlassCard>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-24 px-6 lg:px-8 bg-white">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="font-display font-bold text-4xl text-ink-950 mb-6">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <GlassCard key={index} className="p-6">
                  <h3 className="font-semibold text-ink-950 mb-3">{faq.question}</h3>
                  <p className="text-slate-700 text-sm">{faq.answer}</p>
                </GlassCard>
              ))}
            </div>

            <div className="text-center mt-12">
              <p className="text-slate-600 mb-6">Still have questions?</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/contact">
                  <Button>Contact Sales</Button>
                </Link>
                <Link href="/contact">
                  <Button variant="outline">Schedule Demo</Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-6 lg:px-8 bg-ink-950">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-display font-bold text-4xl md:text-5xl text-alabaster-50 mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-alabaster-200 mb-12">
              Join thousands of finance professionals already using FiscAI to work smarter, not harder.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/checkout?plan=starter">
                <Button className="bg-alabaster-50 text-ink-950 hover:bg-alabaster-100 px-8 py-4 text-lg">
                  Start Free Trial
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" className="border-2 border-alabaster-50 text-alabaster-50 hover:bg-alabaster-50 hover:text-ink-950 px-8 py-4 text-lg">
                  Schedule Demo
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
