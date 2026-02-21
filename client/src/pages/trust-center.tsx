import Navigation from "@/components/layout/navigation";
import Footer from "@/components/layout/footer";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Shield, Lock, FileText, CheckCircle, Globe, Download, ExternalLink, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TrustCenter() {
    const documents = [
        { title: "Privacy Policy", version: "2024.1", size: "1.2 MB", type: "PDF" },
        { title: "Terms of Service", version: "2024.1", size: "0.8 MB", type: "PDF" },
        { title: "SOC 2 Type II Report", version: "DRAFT", size: "4.5 MB", type: "PDF", restricted: true },
        { title: "Data Processing Agreement", version: "2023.4", size: "2.1 MB", type: "PDF" },
        { title: "Security Whitepaper", version: "2024.2", size: "3.2 MB", type: "PDF" },
    ];

    return (
        <div className="min-h-screen">
            <Navigation />
            <main className="pt-20">
                <section className="py-20 px-6 lg:px-8 bg-gradient-to-br from-alabaster-50 to-white">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex flex-col md:flex-row items-center gap-12 mb-16">
                            <div className="flex-1">
                                <Badge className="bg-emerald-400 text-ink-950 mb-4 font-bold tracking-widest uppercase text-[10px]">
                                    Transparency First
                                </Badge>
                                <h1 className="font-display font-bold text-5xl text-ink-950 mb-6">
                                    FiscAI Trust Center
                                </h1>
                                <p className="text-xl text-slate-700">
                                    Our commitment to security, privacy, and compliance. Access the reports and documentation that define our enterprise standard.
                                </p>
                            </div>
                            <div className="w-full max-w-sm">
                                <GlassCard className="p-8 border-emerald-400/20">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600">
                                            <Shield className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-ink-950">Security Status</h3>
                                            <p className="text-sm text-emerald-600 font-bold">ALL SYSTEMS SECURE</p>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-500">Last External Audit</span>
                                            <span className="text-ink-950 font-bold">Jan 2024</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-500">Security Team</span>
                                            <span className="text-ink-950 font-bold underline cursor-pointer">Contact Page</span>
                                        </div>
                                    </div>
                                </GlassCard>
                            </div>
                        </div>

                        <div className="grid lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2">
                                <h2 className="font-display font-bold text-2xl text-ink-950 mb-8 flex items-center gap-3">
                                    <FileText className="h-6 w-6" />
                                    Compliance Documentation
                                </h2>
                                <div className="space-y-4">
                                    {documents.map((doc, i) => (
                                        <GlassCard key={i} className="p-6 flex items-center justify-between group hover:border-emerald-400/50 transition-all">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-alabaster-100 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-emerald-500 transition-colors">
                                                    <FileText className="h-5 w-5" />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-ink-950">{doc.title}</h4>
                                                    <p className="text-xs text-slate-500">v{doc.version} • {doc.size} • {doc.type}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                {doc.restricted ? (
                                                    <Badge variant="outline" className="text-amber-600 border-amber-600 gap-1">
                                                        <Lock className="h-3 w-3" />
                                                        Request Access
                                                    </Badge>
                                                ) : (
                                                    <Button variant="ghost" size="sm" className="gap-2 text-slate-600 group-hover:text-ink-950">
                                                        <Download className="h-4 w-4" />
                                                        Download
                                                    </Button>
                                                )}
                                            </div>
                                        </GlassCard>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-8">
                                <div>
                                    <h2 className="font-display font-bold text-2xl text-ink-950 mb-6">Security Principles</h2>
                                    <div className="space-y-4">
                                        {[
                                            { title: "Zero Trust", icon: Globe, desc: "We never trust, always verify every request." },
                                            { title: "Encryption", icon: Lock, desc: "AES-256 for all data at rest and in transit." },
                                            { title: "Isolation", icon: ShieldAlert, iconColor: "text-amber-500", desc: "Complete tenant isolation for all AI compute." },
                                        ].map((p, i) => (
                                            <div key={i} className="flex gap-4 p-4 rounded-2xl bg-white border border-alabaster-100">
                                                <div className={`mt-1 ${p.iconColor || "text-emerald-500"}`}>
                                                    <p.icon className="h-5 w-5" />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-sm text-ink-950">{p.title}</h4>
                                                    <p className="text-xs text-slate-600 mt-1">{p.desc}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <GlassCard className="p-8 bg-ink-950 text-alabaster-50">
                                    <h3 className="font-bold text-xl mb-4">Request Data Protection Agreement</h3>
                                    <p className="text-sm text-alabaster-200 mb-6 leading-relaxed">
                                        Need a custom DPA for your organization? Our legal team can provide a tailored agreement to meet your specific regional compliance needs.
                                    </p>
                                    <Button className="w-full bg-emerald-400 text-ink-950 font-bold hover:bg-emerald-300">
                                        Submit Request
                                    </Button>
                                </GlassCard>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}
