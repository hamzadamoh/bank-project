import { useState } from "react";
import { motion } from "framer-motion";
import Navigation from "@/components/layout/navigation";
import Footer from "@/components/layout/footer";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle2, TrendingUp, ShieldCheck, Zap } from "lucide-react";

export default function ROICalculator() {
    const { toast } = useToast();
    const [employees, setEmployees] = useState(50);
    const [hoursSaved, setHoursSaved] = useState(10);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const annualSavings = employees * hoursSaved * 52 * 45; // $45 average hourly rate

    const handleGetReport = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setTimeout(() => {
            setIsSubmitting(false);
            toast({
                title: "ROI Report Requested",
                description: "A detailed analysis will be sent to your email within minutes.",
            });
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-alabaster-50">
            <Navigation />

            <main className="pt-24 pb-16 px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="font-display font-bold text-4xl md:text-6xl text-ink-950 mb-6"
                        >
                            Calculate Your AI Efficiency ROI
                        </motion.h1>
                        <p className="text-xl text-slate-700 max-w-3xl mx-auto">
                            Discover how much your institution could save by automating compliance and tax advisory with FiscAI.
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-12 items-start">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <GlassCard className="p-8">
                                <h2 className="text-2xl font-bold text-ink-950 mb-8 flex items-center gap-2">
                                    <TrendingUp className="text-emerald-400" />
                                    Efficiency Parameters
                                </h2>

                                <div className="space-y-10">
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <Label className="text-lg font-medium">Number of Employees Using Tools</Label>
                                            <span className="text-2xl font-bold text-ink-950">{employees}</span>
                                        </div>
                                        <Slider
                                            value={[employees]}
                                            onValueChange={(v) => setEmployees(v[0])}
                                            max={500}
                                            step={10}
                                            className="py-4"
                                        />
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <Label className="text-lg font-medium">Avg. Hours Saved Per Week / Employee</Label>
                                            <span className="text-2xl font-bold text-ink-950">{hoursSaved}h</span>
                                        </div>
                                        <Slider
                                            value={[hoursSaved]}
                                            onValueChange={(v) => setHoursSaved(v[0])}
                                            max={40}
                                            step={1}
                                            className="py-4"
                                        />
                                    </div>
                                </div>

                                <div className="mt-12 p-6 bg-ink-950 rounded-2xl text-alabaster-50">
                                    <p className="text-sm opacity-70 mb-2 uppercase tracking-wider font-semibold">Estimated Annual Productivity Gain</p>
                                    <div className="text-4xl md:text-5xl font-bold text-emerald-400">
                                        ${annualSavings.toLocaleString()}
                                    </div>
                                    <p className="text-xs opacity-60 mt-4">
                                        *Based on average operational costs and efficiency benchmarks for financial institutions.
                                    </p>
                                </div>
                            </GlassCard>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="space-y-8"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <GlassCard className="p-6">
                                    <CheckCircle2 className="text-emerald-400 mb-3" />
                                    <h3 className="font-bold text-ink-950 mb-2">Automated Compliance</h3>
                                    <p className="text-sm text-slate-600">Reduce manual audit time by up to 75%.</p>
                                </GlassCard>
                                <GlassCard className="p-6">
                                    <ShieldCheck className="text-emerald-400 mb-3" />
                                    <h3 className="font-bold text-ink-950 mb-2">Risk Mitigation</h3>
                                    <p className="text-sm text-slate-600">Prevent fraudulent factoring with real-time detection.</p>
                                </GlassCard>
                            </div>

                            <GlassCard className="p-8 border-2 border-emerald-400/20">
                                <h3 className="text-2xl font-bold text-ink-950 mb-6">Get Full ROI Analysis</h3>
                                <form onSubmit={handleGetReport} className="space-y-4">
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="name">Name</Label>
                                            <Input id="name" placeholder="John Doe" required className="rounded-xl" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="email">Work Email</Label>
                                            <Input id="email" type="email" placeholder="john@company.com" required className="rounded-xl" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="company">Institution Name</Label>
                                        <Input id="company" placeholder="FiscBank Corp" required className="rounded-xl" />
                                    </div>
                                    <Button type="submit" className="w-full bg-ink-950 text-alabaster-50 py-6 rounded-xl text-lg hover:bg-ink-900" disabled={isSubmitting}>
                                        {isSubmitting ? "Generating Report..." : "Receive Detailed Report PDF"}
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
