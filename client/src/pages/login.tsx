import Navigation from "@/components/layout/navigation";
import Footer from "@/components/layout/footer";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Link, useLocation } from "wouter";
import { Lock, Mail, Eye, EyeOff, Shield, User, Settings } from "lucide-react";

type UserRole = "client" | "admin";

import { useAuth } from "@/hooks/use-auth";

export default function Login() {
    const { toast } = useToast();
    const [, setLocation] = useLocation();
    const { loginMutation } = useAuth();
    const [role, setRole] = useState<UserRole>("client");
    const [showPassword, setShowPassword] = useState(false);
    const [form, setForm] = useState({
        email: "",
        password: "",
        rememberMe: false,
    });

    const isLoading = loginMutation.isPending;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!form.email || !form.password) {
            toast({
                title: "Missing Credentials",
                description: "Please enter your email and password.",
                variant: "destructive",
            });
            return;
        }

        try {
            await loginMutation.mutateAsync({
                username: form.email,
                password: form.password,
            });

            toast({
                title: `Welcome back! 👋`,
                description: `Signed in successfully. Redirecting to dashboard...`,
            });

            setLocation("/dashboard");
        } catch (error) {
            // Error is handled by the mutation's onError
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-alabaster-50 via-white to-champagne-100">
            <Navigation />

            <div className="pt-28 pb-20 px-6 lg:px-8">
                <div className="max-w-md mx-auto">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-ink-950 rounded-2xl mb-6">
                            <Lock className="h-8 w-8 text-alabaster-50" />
                        </div>
                        <h1 className="font-display font-bold text-3xl text-ink-950 mb-2">
                            Sign in to FiscAI
                        </h1>
                        <p className="text-slate-600">
                            Access your AI-powered finance tools
                        </p>
                    </div>

                    {/* Role Selector */}
                    <div className="bg-alabaster-100 rounded-2xl p-1.5 flex mb-6">
                        <button
                            onClick={() => setRole("client")}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all ${role === "client"
                                ? "bg-white shadow-sm text-ink-950"
                                : "text-slate-500 hover:text-ink-950"
                                }`}
                        >
                            <User className="h-4 w-4" />
                            Client
                        </button>
                        <button
                            onClick={() => setRole("admin")}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all ${role === "admin"
                                ? "bg-white shadow-sm text-ink-950"
                                : "text-slate-500 hover:text-ink-950"
                                }`}
                        >
                            <Settings className="h-4 w-4" />
                            Admin
                        </button>
                    </div>

                    {/* Login Form */}
                    <GlassCard className="p-8">
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <Label htmlFor="email" className="text-sm font-medium text-ink-950">
                                    Email Address
                                </Label>
                                <div className="relative mt-1">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder={role === "admin" ? "admin@fiscai.co" : "you@company.com"}
                                        value={form.email}
                                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                                        className="pl-10"
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-1">
                                    <Label htmlFor="password" className="text-sm font-medium text-ink-950">
                                        Password
                                    </Label>
                                    <button
                                        type="button"
                                        className="text-xs text-ink-950 hover:text-slate-700 font-medium"
                                        onClick={() => {
                                            toast({
                                                title: "Password Reset",
                                                description: "Check your email for a password reset link.",
                                            });
                                        }}
                                    >
                                        Forgot password?
                                    </button>
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        value={form.password}
                                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                                        className="pl-10 pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-ink-950"
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="remember"
                                    checked={form.rememberMe}
                                    onCheckedChange={(checked) =>
                                        setForm({ ...form, rememberMe: checked as boolean })
                                    }
                                />
                                <Label htmlFor="remember" className="text-sm text-slate-600 cursor-pointer">
                                    Remember me for 30 days
                                </Label>
                            </div>

                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-ink-950 text-alabaster-50 hover:bg-ink-900 py-6 text-base font-semibold"
                            >
                                {isLoading ? (
                                    <span className="flex items-center gap-2">
                                        <div className="w-5 h-5 border-2 border-alabaster-50/30 border-t-alabaster-50 rounded-full animate-spin" />
                                        Signing in...
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-2">
                                        Sign in as {role === "admin" ? "Admin" : "Client"}
                                    </span>
                                )}
                            </Button>
                        </form>

                        {/* Divider */}
                        <div className="flex items-center gap-3 my-6">
                            <div className="h-px flex-1 bg-alabaster-200" />
                            <span className="text-xs text-slate-500 font-medium">OR CONTINUE WITH</span>
                            <div className="h-px flex-1 bg-alabaster-200" />
                        </div>

                        {/* Social Login */}
                        <div className="grid grid-cols-2 gap-3">
                            <Button
                                variant="outline"
                                className="py-5"
                                onClick={() =>
                                    toast({
                                        title: "Google SSO",
                                        description: "Google Sign-In will be available once OAuth is configured.",
                                    })
                                }
                            >
                                <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                                    <path
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                                        fill="#4285F4"
                                    />
                                    <path
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                        fill="#34A853"
                                    />
                                    <path
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                        fill="#FBBC05"
                                    />
                                    <path
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                        fill="#EA4335"
                                    />
                                </svg>
                                Google
                            </Button>
                            <Button
                                variant="outline"
                                className="py-5"
                                onClick={() =>
                                    toast({
                                        title: "Microsoft SSO",
                                        description: "Microsoft Sign-In will be available once OAuth is configured.",
                                    })
                                }
                            >
                                <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                                    <rect x="1" y="1" width="10" height="10" fill="#F25022" />
                                    <rect x="13" y="1" width="10" height="10" fill="#7FBA00" />
                                    <rect x="1" y="13" width="10" height="10" fill="#00A4EF" />
                                    <rect x="13" y="13" width="10" height="10" fill="#FFB900" />
                                </svg>
                                Microsoft
                            </Button>
                        </div>

                        {/* Sign Up Link */}
                        <p className="text-center text-sm text-slate-600 mt-6">
                            Don't have an account?{" "}
                            <Link href="/request-access" className="text-ink-950 font-semibold hover:underline">
                                Request Access
                            </Link>
                        </p>
                    </GlassCard>

                    {/* Security Note */}
                    <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-500">
                        <Shield className="h-4 w-4" />
                        <span>Protected by 256-bit SSL encryption and SOC 2 Type II compliance</span>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
