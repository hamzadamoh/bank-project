import { useState } from "react";
import { motion } from "framer-motion";
import Navigation from "@/components/layout/navigation";
import Footer from "@/components/layout/footer";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { UserPlus, Upload, Send } from "lucide-react";

export default function ApplyPage() {
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setTimeout(() => {
            setIsSubmitting(false);
            toast({
                title: "Application Received",
                description: "Thank you for your interest! Our Talent team will reach out within 5-7 business days.",
            });
            (e.target as HTMLFormElement).reset();
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-alabaster-50">
            <Navigation />

            <main className="pt-24 pb-16 px-6 lg:px-8">
                <div className="max-w-3xl mx-auto">
                    <div className="text-center mb-12">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="inline-flex p-4 rounded-3xl bg-white shadow-xl mb-6"
                        >
                            <UserPlus className="w-12 h-12 text-ink-950" />
                        </motion.div>
                        <h1 className="font-display font-bold text-4xl text-ink-950 mb-4">Join the FiscAI Team</h1>
                        <p className="text-slate-600">Help us build the next generation of AI tools for the financial world.</p>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <GlassCard className="p-8">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Full Name</Label>
                                        <Input id="name" placeholder="Sarah Connor" required className="rounded-xl h-12" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email Address</Label>
                                        <Input id="email" type="email" placeholder="sarah@example.com" required className="rounded-xl h-12" />
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Phone Number</Label>
                                        <Input id="phone" type="tel" placeholder="+212 600-000000" className="rounded-xl h-12" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="role">Position of Interest</Label>
                                        <Input id="role" placeholder="AI Engineer / Product Designer" required className="rounded-xl h-12" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="linkedin">LinkedIn URL / Portfolio</Label>
                                    <Input id="linkedin" type="url" placeholder="https://linkedin.com/in/..." className="rounded-xl h-12" />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="resume">Resume / CV</Label>
                                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-alabaster-200 border-dashed rounded-2xl hover:border-ink-950 transition-colors cursor-pointer group">
                                        <div className="space-y-1 text-center">
                                            <Upload className="mx-auto h-12 w-12 text-slate-400 group-hover:text-ink-950 transition-colors" />
                                            <div className="flex text-sm text-slate-600">
                                                <span className="relative cursor-pointer font-medium text-ink-950 hover:text-ink-900 focus-within:outline-none underline">
                                                    Upload a file
                                                </span>
                                                <p className="pl-1 text-slate-500">or drag and drop</p>
                                            </div>
                                            <p className="text-xs text-slate-500">PDF, DOCX up to 10MB</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="message">Cover Letter / Additional Info</Label>
                                    <Textarea
                                        id="message"
                                        placeholder="Tell us why you're a good fit for FiscAI..."
                                        className="rounded-xl min-h-[120px]"
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full bg-ink-950 text-alabaster-50 py-6 rounded-xl text-lg hover:bg-ink-900 flex items-center justify-center gap-2"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? "Sending..." : "Submit Application"} <Send className="w-5 h-5" />
                                </Button>
                            </form>
                        </GlassCard>
                        <p className="text-center text-xs text-slate-500 mt-6 italic">
                            *By submitting this form, you agree to our recruitment privacy terms.
                        </p>
                    </motion.div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
