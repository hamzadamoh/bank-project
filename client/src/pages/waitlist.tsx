import Navigation from "@/components/layout/navigation";
import Footer from "@/components/layout/footer";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Mail, CheckCircle, Sparkles } from "lucide-react";

export default function Waitlist() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const { toast } = useToast();

  const submitMutation = useMutation({
    mutationFn: async (data: { email: string; name?: string }) => {
      return apiRequest("POST", "/api/waitlist", data);
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "You've been added to the waitlist. We'll notify you when FiscAI launches!",
      });
      setEmail("");
      setName("");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast({
        title: "Email required",
        description: "Please enter your email address.",
        variant: "destructive",
      });
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    submitMutation.mutate({
      email: email.trim(),
      name: name.trim() || undefined,
    });
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-24 px-6 lg:px-8 bg-gradient-to-br from-alabaster-50 to-white">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-champagne-200 rounded-2xl mb-6">
                <Sparkles className="h-10 w-10 text-ink-950" />
              </div>
              <h1 className="font-display font-bold text-4xl md:text-5xl text-ink-950 mb-6">
                Join the Waitlist
              </h1>
              <p className="text-xl text-slate-700 max-w-2xl mx-auto mb-4">
                Be among the first to experience FiscAI's enterprise AI suite for financial services.
              </p>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Get early access to all seven AI tools and exclusive launch benefits.
              </p>
            </div>

            {/* Waitlist Form */}
            <GlassCard className="p-8 md:p-12 mb-12">
              {submitMutation.isSuccess ? (
                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-400 rounded-full mb-6">
                    <CheckCircle className="h-8 w-8 text-white" />
                  </div>
                  <h2 className="font-display font-bold text-2xl text-ink-950 mb-4">
                    You're on the list!
                  </h2>
                  <p className="text-slate-700 mb-6">
                    We've added you to our waitlist. You'll be notified as soon as FiscAI launches.
                  </p>
                  <Button 
                    onClick={() => submitMutation.reset()}
                    variant="outline"
                  >
                    Add Another Email
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="email" className="text-base font-semibold text-ink-950 mb-2 block">
                      Email Address <span className="text-rose-400">*</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-12 text-base"
                      required
                      disabled={submitMutation.isPending}
                    />
                    <p className="text-sm text-slate-500 mt-2">
                      We'll only use this to notify you about FiscAI's launch.
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="name" className="text-base font-semibold text-ink-950 mb-2 block">
                      Name (Optional)
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="h-12 text-base"
                      disabled={submitMutation.isPending}
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 text-base font-semibold"
                    disabled={submitMutation.isPending || !email.trim()}
                  >
                    {submitMutation.isPending ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                        Joining...
                      </>
                    ) : (
                      <>
                        <Mail className="h-5 w-5 mr-2" />
                        Join Waitlist
                      </>
                    )}
                  </Button>
                </form>
              )}
            </GlassCard>

            {/* Benefits Section */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <div className="text-center p-6 bg-white rounded-xl">
                <div className="w-12 h-12 bg-champagne-200 rounded-xl mx-auto mb-4 flex items-center justify-center">
                  <Sparkles className="h-6 w-6 text-ink-950" />
                </div>
                <h3 className="font-semibold text-ink-950 mb-2">Early Access</h3>
                <p className="text-sm text-slate-600">
                  Be among the first to use all seven AI tools before public launch.
                </p>
              </div>

              <div className="text-center p-6 bg-white rounded-xl">
                <div className="w-12 h-12 bg-champagne-200 rounded-xl mx-auto mb-4 flex items-center justify-center">
                  <Mail className="h-6 w-6 text-ink-950" />
                </div>
                <h3 className="font-semibold text-ink-950 mb-2">Exclusive Updates</h3>
                <p className="text-sm text-slate-600">
                  Get notified about new features, product updates, and special offers.
                </p>
              </div>

              <div className="text-center p-6 bg-white rounded-xl">
                <div className="w-12 h-12 bg-champagne-200 rounded-xl mx-auto mb-4 flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-ink-950" />
                </div>
                <h3 className="font-semibold text-ink-950 mb-2">Launch Benefits</h3>
                <p className="text-sm text-slate-600">
                  Receive exclusive launch pricing and priority support when we go live.
                </p>
              </div>
            </div>

            {/* What to Expect */}
            <GlassCard className="p-8">
              <h2 className="font-display font-bold text-2xl text-ink-950 mb-6 text-center">
                What to Expect
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-6 h-6 bg-emerald-400 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-ink-950 mb-1">Seven AI Tools</h3>
                    <p className="text-slate-700 text-sm">
                      Access to TaxWise, DocuGuard, QueryForge, SkillForge, PolyGlot, WellPulse, and FeedbackIQ.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-6 h-6 bg-emerald-400 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-ink-950 mb-1">Enterprise Security</h3>
                    <p className="text-slate-700 text-sm">
                      Bank-grade security, GDPR compliance, and multi-tenant isolation from day one.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-6 h-6 bg-emerald-400 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-ink-950 mb-1">Dedicated Support</h3>
                    <p className="text-slate-700 text-sm">
                      Priority onboarding assistance and dedicated support channels for early adopters.
                    </p>
                  </div>
                </div>
              </div>
            </GlassCard>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
