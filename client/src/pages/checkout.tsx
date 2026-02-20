import Navigation from "@/components/layout/navigation";
import Footer from "@/components/layout/footer";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { CreditCard, Shield, Lock, Check, ArrowLeft, Plus } from "lucide-react";
import { FaCcVisa, FaCcMastercard, FaCcAmex, FaCcPaypal, FaStripe } from "react-icons/fa6";

type PaymentMethod = "stripe" | "paypal";

const plans: Record<string, { name: string; price: string; period: string; features: string[] }> = {
    starter: {
        name: "Starter",
        price: "Free",
        period: "14-day trial",
        features: [
            "3 AI tools included",
            "100 queries per month",
            "Email support",
            "Basic document processing",
        ],
    },
    professional: {
        name: "Professional",
        price: "€2,500",
        period: "per month",
        features: [
            "All 7 AI tools included",
            "10,000 queries per month",
            "Priority support (24/5)",
            "Advanced document processing",
            "Custom templates & workflows",
            "SSO integration",
            "Multi-jurisdiction support",
            "API access",
        ],
    },
};

export default function Checkout() {
    const { toast } = useToast();
    const params = new URLSearchParams(window.location.search);
    const planKey = params.get("plan") || "professional";
    const plan = plans[planKey] || plans.professional;

    // Parse add-on from URL
    const addonName = params.get("addon");
    const addonPrice = params.get("addonPrice");
    const addonPeriod = params.get("addonPeriod");

    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("stripe");
    const [isProcessing, setIsProcessing] = useState(false);
    const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly");

    const [cardForm, setCardForm] = useState({
        name: "",
        email: "",
        cardNumber: "",
        expiry: "",
        cvc: "",
        company: "",
    });

    const annualPrice = plan.price !== "Free"
        ? `€${(2500 * 12 * 0.8).toLocaleString()}`
        : "Free";

    const displayPrice = billingCycle === "annual" && plan.price !== "Free"
        ? annualPrice
        : plan.price;

    const displayPeriod = plan.price === "Free"
        ? plan.period
        : billingCycle === "annual"
            ? "per year (save 20%)"
            : plan.period;

    const handleStripeSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!cardForm.name || !cardForm.email || !cardForm.cardNumber || !cardForm.expiry || !cardForm.cvc) {
            toast({ title: "Missing Information", description: "Please fill in all card details.", variant: "destructive" });
            return;
        }

        setIsProcessing(true);

        // Simulate Stripe payment processing
        await new Promise((resolve) => setTimeout(resolve, 2000));

        toast({
            title: "Payment Successful! 🎉",
            description: `Your ${plan.name} plan is now active. Welcome to FiscAI!`,
        });
        setIsProcessing(false);
    };

    const handlePayPalSubmit = async () => {
        setIsProcessing(true);

        // Simulate PayPal redirect
        await new Promise((resolve) => setTimeout(resolve, 1500));

        toast({
            title: "Redirecting to PayPal...",
            description: "You will be redirected to PayPal to complete your payment.",
        });

        // In production, this would redirect to PayPal checkout
        setTimeout(() => {
            toast({
                title: "PayPal Payment Simulated ✓",
                description: `Your ${plan.name} plan is now active. Welcome to FiscAI!`,
            });
            setIsProcessing(false);
        }, 2000);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-alabaster-50 via-white to-champagne-100">
            <Navigation />

            <div className="pt-32 pb-20 px-6 lg:px-8">
                <div className="max-w-6xl mx-auto">
                    {/* Back Link */}
                    <Link href="/pricing" className="inline-flex items-center gap-2 text-slate-600 hover:text-ink-950 transition-colors mb-8">
                        <ArrowLeft className="h-4 w-4" />
                        Back to Pricing
                    </Link>

                    <div className="grid lg:grid-cols-5 gap-8">
                        {/* Payment Form - Left */}
                        <div className="lg:col-span-3">
                            <GlassCard className="p-8">
                                <h1 className="font-display font-bold text-3xl text-ink-950 mb-2">
                                    Complete Your Purchase
                                </h1>
                                <p className="text-slate-600 mb-8">
                                    Choose your preferred payment method to subscribe to the {plan.name} plan.
                                </p>

                                {/* Payment Method Tabs */}
                                <div className="flex gap-3 mb-8">
                                    <button
                                        onClick={() => setPaymentMethod("stripe")}
                                        className={`flex-1 flex items-center justify-center gap-3 p-4 rounded-xl border-2 transition-all ${paymentMethod === "stripe"
                                            ? "border-ink-950 bg-ink-950/5"
                                            : "border-alabaster-200 hover:border-alabaster-300"
                                            }`}
                                    >
                                        <FaStripe className="h-8 w-8 text-[#635bff]" />
                                        <div className="text-left">
                                            <p className="font-semibold text-ink-950 text-sm">Credit / Debit Card</p>
                                            <p className="text-xs text-slate-500">Powered by Stripe</p>
                                        </div>
                                    </button>

                                    <button
                                        onClick={() => setPaymentMethod("paypal")}
                                        className={`flex-1 flex items-center justify-center gap-3 p-4 rounded-xl border-2 transition-all ${paymentMethod === "paypal"
                                            ? "border-ink-950 bg-ink-950/5"
                                            : "border-alabaster-200 hover:border-alabaster-300"
                                            }`}
                                    >
                                        <FaCcPaypal className="h-8 w-8 text-[#003087]" />
                                        <div className="text-left">
                                            <p className="font-semibold text-ink-950 text-sm">PayPal</p>
                                            <p className="text-xs text-slate-500">Pay with your account</p>
                                        </div>
                                    </button>
                                </div>

                                {/* Stripe Card Form */}
                                {paymentMethod === "stripe" && (
                                    <form onSubmit={handleStripeSubmit} className="space-y-5">
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div>
                                                <Label htmlFor="name" className="text-sm font-medium text-ink-950">
                                                    Full Name
                                                </Label>
                                                <Input
                                                    id="name"
                                                    placeholder="John Doe"
                                                    value={cardForm.name}
                                                    onChange={(e) => setCardForm({ ...cardForm, name: e.target.value })}
                                                    className="mt-1"
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor="email" className="text-sm font-medium text-ink-950">
                                                    Email Address
                                                </Label>
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    placeholder="john@company.com"
                                                    value={cardForm.email}
                                                    onChange={(e) => setCardForm({ ...cardForm, email: e.target.value })}
                                                    className="mt-1"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <Label htmlFor="company" className="text-sm font-medium text-ink-950">
                                                Company Name <span className="text-slate-400">(optional)</span>
                                            </Label>
                                            <Input
                                                id="company"
                                                placeholder="Acme Inc."
                                                value={cardForm.company}
                                                onChange={(e) => setCardForm({ ...cardForm, company: e.target.value })}
                                                className="mt-1"
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="cardNumber" className="text-sm font-medium text-ink-950">
                                                Card Number
                                            </Label>
                                            <div className="relative mt-1">
                                                <Input
                                                    id="cardNumber"
                                                    placeholder="4242 4242 4242 4242"
                                                    value={cardForm.cardNumber}
                                                    onChange={(e) => {
                                                        const val = e.target.value.replace(/\D/g, "").slice(0, 16);
                                                        const formatted = val.replace(/(\d{4})/g, "$1 ").trim();
                                                        setCardForm({ ...cardForm, cardNumber: formatted });
                                                    }}
                                                    className="pr-20"
                                                />
                                                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
                                                    <FaCcVisa className="h-6 w-6 text-slate-300" />
                                                    <FaCcMastercard className="h-6 w-6 text-slate-300" />
                                                    <FaCcAmex className="h-6 w-6 text-slate-300" />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <Label htmlFor="expiry" className="text-sm font-medium text-ink-950">
                                                    Expiry Date
                                                </Label>
                                                <Input
                                                    id="expiry"
                                                    placeholder="MM / YY"
                                                    value={cardForm.expiry}
                                                    onChange={(e) => {
                                                        let val = e.target.value.replace(/\D/g, "").slice(0, 4);
                                                        if (val.length >= 3) val = val.slice(0, 2) + " / " + val.slice(2);
                                                        setCardForm({ ...cardForm, expiry: val });
                                                    }}
                                                    className="mt-1"
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor="cvc" className="text-sm font-medium text-ink-950">
                                                    CVC
                                                </Label>
                                                <Input
                                                    id="cvc"
                                                    placeholder="123"
                                                    value={cardForm.cvc}
                                                    onChange={(e) => {
                                                        const val = e.target.value.replace(/\D/g, "").slice(0, 4);
                                                        setCardForm({ ...cardForm, cvc: val });
                                                    }}
                                                    className="mt-1"
                                                />
                                            </div>
                                        </div>

                                        <Button
                                            type="submit"
                                            disabled={isProcessing}
                                            className="w-full bg-ink-950 text-alabaster-50 hover:bg-ink-900 py-6 text-lg font-semibold"
                                        >
                                            {isProcessing ? (
                                                <span className="flex items-center gap-2">
                                                    <div className="w-5 h-5 border-2 border-alabaster-50/30 border-t-alabaster-50 rounded-full animate-spin" />
                                                    Processing...
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-2">
                                                    <Lock className="h-5 w-5" />
                                                    Pay {displayPrice === "Free" ? "— Start Free Trial" : displayPrice}
                                                </span>
                                            )}
                                        </Button>
                                    </form>
                                )}

                                {/* PayPal Form */}
                                {paymentMethod === "paypal" && (
                                    <div className="space-y-6">
                                        <div className="bg-[#ffc43a]/10 border border-[#ffc43a]/30 rounded-2xl p-6 text-center">
                                            <FaCcPaypal className="h-16 w-16 text-[#003087] mx-auto mb-4" />
                                            <h3 className="font-semibold text-ink-950 mb-2">Pay with PayPal</h3>
                                            <p className="text-sm text-slate-600 mb-6">
                                                You'll be redirected to PayPal to securely complete your payment.
                                                Log in with your PayPal account or pay with a card through PayPal.
                                            </p>

                                            <div className="space-y-3 mb-6">
                                                <div>
                                                    <Label htmlFor="paypal-email" className="text-sm font-medium text-ink-950">
                                                        Email Address
                                                    </Label>
                                                    <Input
                                                        id="paypal-email"
                                                        type="email"
                                                        placeholder="your@email.com"
                                                        className="mt-1 max-w-sm mx-auto"
                                                    />
                                                </div>
                                            </div>

                                            <Button
                                                onClick={handlePayPalSubmit}
                                                disabled={isProcessing}
                                                className="w-full max-w-sm bg-[#0070ba] hover:bg-[#005ea6] text-white py-6 text-lg font-semibold"
                                            >
                                                {isProcessing ? (
                                                    <span className="flex items-center justify-center gap-2">
                                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                        Connecting to PayPal...
                                                    </span>
                                                ) : (
                                                    <span className="flex items-center justify-center gap-2">
                                                        <FaCcPaypal className="h-5 w-5" />
                                                        Continue with PayPal
                                                    </span>
                                                )}
                                            </Button>
                                        </div>
                                    </div>
                                )}

                                {/* Security Footer */}
                                <div className="mt-6 flex items-center justify-center gap-6 text-xs text-slate-500">
                                    <div className="flex items-center gap-1">
                                        <Lock className="h-3 w-3" />
                                        <span>SSL Encrypted</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Shield className="h-3 w-3" />
                                        <span>PCI DSS Compliant</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <CreditCard className="h-3 w-3" />
                                        <span>30-day money-back guarantee</span>
                                    </div>
                                </div>
                            </GlassCard>
                        </div>

                        {/* Order Summary - Right */}
                        <div className="lg:col-span-2 space-y-6">
                            <GlassCard className="p-6">
                                <h2 className="font-display font-bold text-xl text-ink-950 mb-4">
                                    Order Summary
                                </h2>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-semibold text-ink-950">{plan.name} Plan</p>
                                            <p className="text-sm text-slate-600">{displayPeriod}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-display font-bold text-2xl text-ink-950">{displayPrice}</p>
                                        </div>
                                    </div>

                                    {/* Add-on */}
                                    {addonName && (
                                        <div className="bg-champagne-200/20 rounded-xl p-4">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Plus className="h-4 w-4 text-ink-950" />
                                                <span className="text-xs font-semibold text-ink-950 uppercase tracking-wide">Add-on</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="font-semibold text-ink-950 text-sm">{addonName}</p>
                                                    {addonPeriod && <p className="text-xs text-slate-600">{addonPeriod}</p>}
                                                </div>
                                                {addonPrice && (
                                                    <p className="font-display font-bold text-lg text-ink-950">{addonPrice}</p>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Billing Cycle Toggle */}
                                    {plan.price !== "Free" && (
                                        <div className="bg-alabaster-100 rounded-xl p-1 flex">
                                            <button
                                                onClick={() => setBillingCycle("monthly")}
                                                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${billingCycle === "monthly"
                                                    ? "bg-white shadow-sm text-ink-950"
                                                    : "text-slate-600 hover:text-ink-950"
                                                    }`}
                                            >
                                                Monthly
                                            </button>
                                            <button
                                                onClick={() => setBillingCycle("annual")}
                                                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${billingCycle === "annual"
                                                    ? "bg-white shadow-sm text-ink-950"
                                                    : "text-slate-600 hover:text-ink-950"
                                                    }`}
                                            >
                                                Annual
                                                <Badge className="ml-2 bg-emerald-100 text-emerald-700 text-xs">-20%</Badge>
                                            </button>
                                        </div>
                                    )}

                                    <div className="border-t border-alabaster-200 pt-4">
                                        <h4 className="text-sm font-semibold text-ink-950 mb-3">What's included:</h4>
                                        <ul className="space-y-2">
                                            {plan.features.map((feature, i) => (
                                                <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                                                    <Check className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                                                    {feature}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </GlassCard>

                            {/* Trust Badges */}
                            <GlassCard className="p-6">
                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <Shield className="h-5 w-5 text-emerald-500 mt-0.5" />
                                        <div>
                                            <p className="font-semibold text-ink-950 text-sm">30-Day Money-Back Guarantee</p>
                                            <p className="text-xs text-slate-600">Not satisfied? Get a full refund within 30 days.</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <Lock className="h-5 w-5 text-emerald-500 mt-0.5" />
                                        <div>
                                            <p className="font-semibold text-ink-950 text-sm">Secure Payment</p>
                                            <p className="text-xs text-slate-600">256-bit SSL encryption. Your data is safe.</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <CreditCard className="h-5 w-5 text-emerald-500 mt-0.5" />
                                        <div>
                                            <p className="font-semibold text-ink-950 text-sm">Cancel Anytime</p>
                                            <p className="text-xs text-slate-600">No lock-in contracts. Cancel whenever you want.</p>
                                        </div>
                                    </div>
                                </div>
                            </GlassCard>

                            {/* Accepted Cards */}
                            <div className="flex items-center justify-center gap-4 text-slate-400">
                                <FaCcVisa className="h-10 w-10" />
                                <FaCcMastercard className="h-10 w-10" />
                                <FaCcAmex className="h-10 w-10" />
                                <FaCcPaypal className="h-10 w-10" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
