import { useState } from "react";
import { motion } from "framer-motion";
import Navigation from "@/components/layout/navigation";
import Footer from "@/components/layout/footer";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { KeyRound, ShieldCheck, Zap, Mail } from "lucide-react";

export default function RequestAccessPage() {
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setTimeout(() => {
            setIsSubmitting(false);
            toast({
                title: "Access Requested",
                description: "Our security team is verifying your details. We will contact you shortly.",
            });
            (e.target as HTMLFormElement).reset();
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-alabaster-50">
            <Navigation />

            <main className="pt-24 pb-16 px-6 lg:px-8">
                <div className="max-w-5xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                        >
                            <div className="inline-flex p-4 rounded-3xl bg-white shadow-xl mb-6">
                                <KeyRound className="w-12 h-12 text-ink-950" />
                            </div>
                            <h1 className="font-display font-bold text-4xl text-ink-950 mb-6 leading-tight">
                                Get Exclusive Access to the FiscAI Ecosystem
                            </h1>
                            <p className="text-xl text-slate-700 mb-10">
                                Join our beta program or request an enterprise integration deployment.
                            </p>

                            <div className="space-y-6">
                                <div className="flex gap-4">
                                    <div className="bg-emerald-100 p-2 h-fit rounded-lg">
                                        <ShieldCheck className="w-5 h-5 text-emerald-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-ink-950">Enterprise Verified</h3>
                                        <p className="text-sm text-slate-600">Full compliance with SOC2 Type II and GDPR standards.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="bg-blue-100 p-2 h-fit rounded-lg">
                                        <Zap className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-ink-950">Priority Onboarding</h3>
                                        <p className="text-sm text-slate-600">Dedicated sandbox environment within 48 hours for approved partners.</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <GlassCard className="p-8 border-2 border-ink-950/5">
                                <h3 className="text-2xl font-bold text-ink-950 mb-8">Access Request Form</h3>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Full Name</Label>
                                        <Input id="name" placeholder="Marcus Aurelius" required className="rounded-xl h-12" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Work Email</Label>
                                        <Input id="email" type="email" placeholder="marcus@institution.com" required className="rounded-xl h-12" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="org">Organization</Label>
                                        <Input id="org" placeholder="Imperial Trust" required className="rounded-xl h-12" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="reason">Primary Use Case</Label>
                                        <select id="reason" className="w-full h-12 rounded-xl border border-alabaster-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ink-950 transition-all">
                                            <option>Enterprise Integration</option>
                                            <option>Beta Program Access</option>
                                            <option>Professional Training</option>
                                            <option>Other</option>
                                        </select>
                                    </div>

                                    <Button
                                        type="submit"
                                        className="w-full bg-ink-950 text-alabaster-50 py-6 rounded-xl text-lg hover:bg-ink-900 flex items-center justify-center gap-2"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? "Submitting..." : "Apply for Access"} <Mail className="w-5 h-5" />
                                    </Button>
                                </form>
                            </GlassCard>
                        </motion.div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
