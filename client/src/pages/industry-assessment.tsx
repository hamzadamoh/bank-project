import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navigation from "@/components/layout/navigation";
import Footer from "@/components/layout/footer";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { ClipboardCheck, ArrowRight, ArrowLeft, BarChart3, Globe2, ShieldAlert } from "lucide-react";

const steps = [
    {
        title: "Organization Size",
        icon: <Globe2 className="w-8 h-8 text-emerald-400" />,
        question: "How many cross-border transactions does your institution process monthly?",
        options: ["Less than 1,000", "1,000 - 10,000", "10,000 - 100,000", "100,000+"]
    },
    {
        title: "Legacy Systems",
        icon: <ShieldAlert className="w-8 h-8 text-amber-400" />,
        question: "How many different legacy software systems are currently used for compliance?",
        options: ["1-2 integrated systems", "3-5 disparate systems", "5+ disconnected systems", "Mostly manual spreadsheets"]
    },
    {
        title: "Risk Profile",
        icon: <BarChart3 className="w-8 h-8 text-blue-400" />,
        question: "What is your primary concern regarding current auditing processes?",
        options: ["Speed of delivery", "Detection of complex fraud", "Regulatory citation accuracy", "Cost of manual labor"]
    }
];

export default function IndustryAssessment() {
    const { toast } = useToast();
    const [currentStep, setCurrentStep] = useState(0);
    const [isFinishing, setIsFinishing] = useState(false);

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            setIsFinishing(true);
            setTimeout(() => {
                toast({
                    title: "Assessment Submitted",
                    description: "Our advisors are reviewing your results. Expected follow-up: 24h.",
                });
            }, 2000);
        }
    };

    const handlePrev = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
        }
    };

    return (
        <div className="min-h-screen bg-alabaster-50">
            <Navigation />

            <main className="pt-24 pb-16 px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    {!isFinishing ? (
                        <>
                            <div className="text-center mb-12">
                                <motion.div
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="inline-flex p-4 rounded-3xl bg-white shadow-xl mb-6"
                                >
                                    <ClipboardCheck className="w-12 h-12 text-ink-950" />
                                </motion.div>
                                <h1 className="font-display font-bold text-4xl text-ink-950 mb-4">Financial Industry Readiness Assessment</h1>
                                <p className="text-slate-600">Determine your institution's AI integration maturity in less than 3 minutes.</p>
                            </div>

                            <div className="mb-8 overflow-hidden h-2 bg-alabaster-200 rounded-full">
                                <motion.div
                                    className="h-full bg-emerald-400"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                                />
                            </div>

                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentStep}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <GlassCard className="p-8">
                                        <div className="flex items-center gap-4 mb-8">
                                            {steps[currentStep].icon}
                                            <div>
                                                <p className="text-sm font-semibold uppercase tracking-widest text-slate-500">Step {currentStep + 1} of {steps.length}</p>
                                                <h2 className="text-2xl font-bold text-ink-950">{steps[currentStep].title}</h2>
                                            </div>
                                        </div>

                                        <div className="space-y-8">
                                            <p className="text-xl font-medium text-ink-950">{steps[currentStep].question}</p>

                                            <RadioGroup className="grid gap-4">
                                                {steps[currentStep].options.map((option, idx) => (
                                                    <div key={idx} className="relative">
                                                        <RadioGroupItem value={option} id={`opt-${idx}`} className="peer sr-only" />
                                                        <Label
                                                            htmlFor={`opt-${idx}`}
                                                            className="flex items-center p-4 rounded-2xl border-2 border-alabaster-100 hover:border-emerald-400/50 cursor-pointer peer-aria-checked:border-emerald-400 peer-aria-checked:bg-emerald-50/50 transition-all font-medium text-lg"
                                                        >
                                                            {option}
                                                        </Label>
                                                    </div>
                                                ))}
                                            </RadioGroup>
                                        </div>

                                        <div className="flex justify-between mt-12 pt-8 border-t border-alabaster-100">
                                            <Button
                                                variant="outline"
                                                onClick={handlePrev}
                                                disabled={currentStep === 0}
                                                className="rounded-xl px-8"
                                            >
                                                <ArrowLeft className="w-4 h-4 mr-2" /> Back
                                            </Button>
                                            <Button
                                                onClick={handleNext}
                                                className="bg-ink-950 text-alabaster-50 rounded-xl px-8 hover:bg-ink-900"
                                            >
                                                {currentStep === steps.length - 1 ? "Complete Assessment" : "Next Step"} <ArrowRight className="w-4 h-4 ml-2" />
                                            </Button>
                                        </div>
                                    </GlassCard>
                                </motion.div>
                            </AnimatePresence>
                        </>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center"
                        >
                            <GlassCard className="p-12">
                                <div className="flex justify-center mb-8">
                                    <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center animate-bounce">
                                        <ClipboardCheck className="w-10 h-10 text-emerald-500" />
                                    </div>
                                </div>
                                <h2 className="text-3xl font-bold text-ink-950 mb-4">Assessment Complete!</h2>
                                <p className="text-lg text-slate-600 mb-8 max-w-lg mx-auto">
                                    Based on your responses, your institution is in the **Optimized Foundation** category.
                                    Our specialists have prepared a custom integration roadmap for you.
                                </p>
                                <div className="p-6 bg-alabaster-50 rounded-2xl mb-8 border border-alabaster-200">
                                    <h4 className="font-bold text-ink-950 mb-2">Next Steps</h4>
                                    <p className="text-sm text-slate-600">Check your inbox for the "FiscAI Readiness PDF" and an invitation for a tailored walkthrough.</p>
                                </div>
                                <Button
                                    onClick={() => (window.location.href = "/")}
                                    className="bg-ink-950 text-alabaster-50 rounded-xl px-12 py-6 text-lg hover:bg-ink-900"
                                >
                                    Return Home
                                </Button>
                            </GlassCard>
                        </motion.div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}
