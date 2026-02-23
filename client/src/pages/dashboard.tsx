import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
    BarChart3,
    ShoppingBag,
    Users,
    Settings,
    LogOut,
    Search,
    Bell,
    CreditCard,
    Package,
    TrendingUp,
    ExternalLink,
    Zap,
    X,
    Shield,
    User,
    Check,
    Info,
    Key,
    Activity,
    PieChart,
    Server,
    ShieldCheck
} from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { Order } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { Sun, Moon, ShieldOff, Trash2, Lock, RefreshCw } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Switch } from "@/components/ui/switch";

interface UsageStats {
    totalRevenue: string;
    activeOrders: number;
    aiRequests: number;
    tokensSaved: string;
    distribution: Array<{ label: string; value: number; color: string }>;
    revenueTrend: number[];
}

const AIInsightsPanel = ({ userRole }: { userRole: string }) => {
    const adminInsights = [
        { title: "Security Health", content: "All 24/7 monitors active. No abnormal ingress detected in the last 72 hours.", icon: Shield, color: "text-emerald-500" },
        { title: "Revenue Forecast", content: "AI predicts a 14% growth in Enterprise expansions for Q2 based on current trial volumes.", icon: TrendingUp, color: "text-blue-500" },
        { title: "Compute Efficiency", content: "SQL processing is 12% more efficient after last week's model fine-tuning.", icon: Zap, color: "text-amber-500" }
    ];

    const clientInsights = [
        { title: "Spend Optimization", content: "AI detected $450 in redundant cloud compute tokens. Switch to Tier 2 to save $120/mo.", icon: ShoppingBag, color: "text-emerald-500" },
        { title: "Query Prediction", content: "Most of your team's queries happen between 9-11 AM. Pre-warming models could save 2s latency.", icon: Zap, color: "text-blue-500" },
        { title: "Tax Alert", content: "New regional regulation (v4.2) may affect your Q3 filing. Tax Counsel is ready to review.", icon: Info, color: "text-amber-500" }
    ];

    const insights = userRole === "admin" ? adminInsights : clientInsights;

    return (
        <GlassCard className="p-6 bg-gradient-to-r from-emerald-500/5 to-blue-500/5 border-emerald-400/20">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-emerald-400 rounded-xl flex items-center justify-center text-ink-950">
                    <Zap className="h-6 w-6" />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-ink-950">FiscAI Insights</h3>
                    <p className="text-xs text-slate-500 font-medium uppercase tracking-widest">Real-time Intelligent Analysis</p>
                </div>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
                {insights.map((insight, i) => (
                    <div key={i} className="space-y-2">
                        <div className="flex items-center gap-2">
                            <insight.icon className={`h-4 w-4 ${insight.color}`} />
                            <h4 className="font-bold text-sm text-ink-950">{insight.title}</h4>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">{insight.content}</p>
                    </div>
                ))}
            </div>
        </GlassCard>
    );
};

const AuditLogTab = () => {
    const logs = [
        { event: "Admin Login", user: "Admin User", ip: "192.168.1.1", time: "Now", status: "Success" },
        { event: "API Key Generated", user: "Client User", ip: "45.12.89.22", time: "12m ago", status: "Success" },
        { event: "Sensitive Data Export", user: "John Doe", ip: "10.0.0.4", time: "1h ago", status: "Warning" },
        { event: "Role Changed: 'Client' -> 'Admin'", user: "Admin User", ip: "192.168.1.1", time: "3h ago", status: "Critical" },
        { event: "DPA Request Submitted", user: "Sarah Smith", ip: "172.16.0.5", time: "5h ago", status: "Success" },
    ];

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <GlassCard className="overflow-hidden">
                <div className="p-8 border-b border-alabaster-100 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-ink-950">System Audit Logs</h2>
                        <p className="text-slate-500 text-sm">Real-time security and governance event trail.</p>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-alabaster-50 text-xs font-bold uppercase tracking-wider text-slate-500">
                            <tr>
                                <th className="px-8 py-4">Event</th>
                                <th className="px-8 py-4">Initiator</th>
                                <th className="px-8 py-4">IP Address</th>
                                <th className="px-8 py-4">Time</th>
                                <th className="px-8 py-4">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-alabaster-100">
                            {logs.map((log, i) => (
                                <tr key={i} className="hover:bg-alabaster-50 transition-colors">
                                    <td className="px-8 py-4 text-sm font-bold text-ink-950">{log.event}</td>
                                    <td className="px-8 py-4 text-sm text-slate-600">{log.user}</td>
                                    <td className="px-8 py-4 text-xs font-mono text-slate-400">{log.ip}</td>
                                    <td className="px-8 py-4 text-xs text-slate-500">{log.time}</td>
                                    <td className="px-8 py-4">
                                        <Badge className={`${log.status === 'Critical' ? 'bg-red-50 text-red-600' :
                                            log.status === 'Warning' ? 'bg-amber-50 text-amber-600' :
                                                'bg-emerald-50 text-emerald-600'
                                            }`}>
                                            {log.status}
                                        </Badge>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </GlassCard>
        </motion.div>
    );
};

const UsageAnalyticsTab = ({ stats }: { stats?: UsageStats }) => {
    const displayStats = stats || {
        distribution: [
            { label: "Tax Counsel", value: 65, color: "bg-emerald-400" },
            { label: "Query Architect", value: 20, color: "bg-blue-400" },
            { label: "OmniServe", value: 15, color: "bg-slate-400" },
        ],
        revenueTrend: [30, 45, 25, 60, 80, 55, 90]
    };

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
                <GlassCard className="p-8">
                    <h3 className="text-lg font-bold text-ink-950 mb-6 flex items-center gap-2">
                        <Zap className="h-5 w-5 text-amber-500" />
                        AI Token Distribution
                    </h3>
                    <div className="space-y-4">
                        {displayStats.distribution.map((item, i) => (
                            <div key={i}>
                                <div className="flex justify-between text-xs font-bold mb-2">
                                    <span>{item.label}</span>
                                    <span>{item.value}%</span>
                                </div>
                                <div className="w-full bg-alabaster-100 h-2 rounded-full">
                                    <div className={`${item.color} h-2 rounded-full`} style={{ width: `${item.value}%` }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </GlassCard>
                <GlassCard className="p-8">
                    <h3 className="text-lg font-bold text-ink-950 mb-6 flex items-center gap-2">
                        <ShoppingBag className="h-5 w-5 text-emerald-500" />
                        Spend Analytics (Monthly)
                    </h3>
                    <div className="flex items-end justify-between h-32 gap-2">
                        {displayStats.revenueTrend.map((h, i) => (
                            <div key={i} className="flex-1 bg-ink-950/10 rounded-t-lg relative group">
                                <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: `${h}%` }}
                                    className="absolute bottom-0 left-0 right-0 bg-emerald-400 rounded-t-lg group-hover:bg-emerald-500 transition-colors"
                                />
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-4 text-[10px] text-slate-400 font-bold">
                        <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                    </div>
                </GlassCard>
            </div>
            <GlassCard className="p-8 bg-ink-950 text-alabaster-50 overflow-hidden relative">
                <div className="relative z-10">
                    <h3 className="text-xl font-bold mb-2">Resource Efficiency Score</h3>
                    <p className="text-alabaster-400 text-sm mb-6">Your current AI usage is 14% more efficient than the industry average.</p>
                    <div className="text-4xl font-bold text-emerald-400">92/100</div>
                </div>
                <TrendingUp className="absolute -bottom-4 -right-4 w-32 h-32 text-emerald-400 opacity-10" />
            </GlassCard>
        </motion.div>
    );
};

const SystemHealth = () => {
    return (
        <div className="p-4 mt-auto border-t border-ink-900 bg-ink-950/50">
            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Server className="h-3 w-3" />
                Infrastructure Status
            </h4>
            <div className="space-y-3">
                {[
                    { label: "Global API", status: "Healthy" },
                    { label: "AI Models", status: "Healthy" },
                    { label: "Database", status: "Optimal" },
                ].map((s, i) => (
                    <div key={i} className="flex items-center justify-between text-[10px]">
                        <span className="text-alabaster-200">{s.label}</span>
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]"></div>
                            <span className="text-emerald-400 font-bold uppercase">{s.status}</span>
                        </div>
                    </div>
                ))}
            </div>
            <div className="mt-4 pt-4 border-t border-ink-900">
                <p className="text-[10px] text-slate-500">Last health check: <span className="text-alabaster-50 font-medium ml-1">Just now</span></p>
            </div>
        </div>
    );
};

export default function Dashboard() {
    const { toast } = useToast();
    const [location, setLocation] = useLocation();
    const { user, logoutMutation } = useAuth();
    const [activeTab, setActiveTab] = useState("overview");
    const [searchQuery, setSearchQuery] = useState("");
    const [showNotifications, setShowNotifications] = useState(false);
    const [theme, setTheme] = useState(() => localStorage.getItem("fiscai_theme") || "light");

    const userRole = user?.role || "client";

    useEffect(() => {
        const root = window.document.documentElement;
        if (theme === "dark") {
            root.classList.add("dark");
        } else {
            root.classList.remove("dark");
        }
        localStorage.setItem("fiscai_theme", theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => prev === "light" ? "dark" : "light");
        toast({
            title: `Theme Switched`,
            description: `Dashboard is now in ${theme === 'light' ? 'dark' : 'light'} mode.`,
        });
    };

    const { data: orders, isLoading: isLoadingOrders } = useQuery<{ success: boolean; data: Order[] }>({
        queryKey: ["/api/orders"],
    });

    const { data: stats } = useQuery<UsageStats>({
        queryKey: ["/api/analytics/usage"],
        enabled: !!user,
    });

    const queryClient = useQueryClient();

    const { mutate: updatePrivacy, isPending: isUpdatingPrivacy } = useMutation({
        mutationFn: async (settings: any) => {
            const res = await fetch("/api/user/me/privacy", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(settings),
            });
            if (!res.ok) throw new Error("Failed to update privacy settings");
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
            toast({ title: "Privacy Updated ✅", description: "Your data consumption preferences are now active." });
        }
    });

    const { mutate: deleteAccount, isPending: isDeletingAccount } = useMutation({
        mutationFn: async () => {
            const res = await fetch("/api/user/me", { method: "DELETE" });
            if (!res.ok) throw new Error("Failed to delete account");
            return res.json();
        },
        onSuccess: () => {
            toast({ title: "Account Erased 🛡️", description: "Right to Erasure fulfilled. All data has been permanently deleted." });
            setLocation("/login");
        }
    });

    const { mutate: purgeOldData, isPending: isPurging } = useMutation({
        mutationFn: async () => {
            const res = await fetch("/api/admin/purge-old-data", { method: "POST" });
            if (!res.ok) throw new Error("Purge failed");
            return res.json();
        },
        onSuccess: () => {
            toast({ title: "Data Retention Applied", description: "Old records have been manually purged from the system." });
        }
    });

    const handleLogout = async () => {
        await logoutMutation.mutateAsync();
        setLocation("/login");
    };

    const handleAction = (action: string) => {
        toast({
            title: "Action Triggered",
            description: `${action} feature is coming soon in the Enterprise release.`,
        });
    };

    const allOrders = orders?.data || [];

    // Simulate "My Orders" for clients by filtering
    const roleFilteredOrders = userRole === "admin"
        ? allOrders
        : allOrders.filter(o => o.customerEmail === "client@fiscai.co" || o.customerEmail.includes("user"));

    const filteredOrders = roleFilteredOrders.filter(order =>
        order.customerEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.planName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.id.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex h-screen bg-alabaster-50">
            {/* Sidebar */}
            <aside className="w-64 bg-ink-950 text-alabaster-50 flex flex-col">
                <div className="p-8">
                    <Link href="/">
                        <div className="flex items-center gap-2 cursor-pointer">
                            <div className="w-8 h-8 bg-emerald-400 rounded-lg flex items-center justify-center">
                                <div className="w-4 h-4 bg-ink-950 rounded-sm transform rotate-45"></div>
                            </div>
                            <div className="flex flex-col">
                                <span className="font-display font-bold text-xl tracking-tight leading-none">FiscAI</span>
                                <span className={`text-[10px] font-bold mt-1 tracking-widest ${userRole === 'admin' ? 'text-emerald-400' : 'text-blue-400 opacity-60'}`}>
                                    {userRole === 'admin' ? 'ADMIN CONSOLE' : 'CLIENT PORTAL'}
                                </span>
                            </div>
                        </div>
                    </Link>
                </div>

                <nav className="flex-1 px-4 space-y-2">
                    <button
                        onClick={() => setActiveTab("overview")}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'overview' ? 'bg-emerald-400 text-ink-950 font-semibold' : 'hover:bg-ink-900 text-alabaster-200'}`}
                    >
                        <BarChart3 className="w-5 h-5" />
                        Overview
                    </button>
                    <button
                        onClick={() => setActiveTab("orders")}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'orders' ? 'bg-emerald-400 text-ink-950 font-semibold' : 'hover:bg-ink-900 text-alabaster-200'}`}
                    >
                        <ShoppingBag className="w-5 h-5" />
                        Orders
                    </button>
                    {userRole === "admin" ? (
                        <button
                            onClick={() => setActiveTab("activity")}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'activity' ? 'bg-emerald-400 text-ink-950 font-semibold' : 'hover:bg-ink-900 text-alabaster-200'}`}
                        >
                            <Activity className="w-5 h-5" />
                            Audit Logs
                        </button>
                    ) : (
                        <button
                            onClick={() => setActiveTab("analytics")}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'analytics' ? 'bg-emerald-400 text-ink-950 font-semibold' : 'hover:bg-ink-900 text-alabaster-200'}`}
                        >
                            <PieChart className="w-5 h-5" />
                            Analytics
                        </button>
                    )}
                    {userRole === "admin" && (
                        <button
                            onClick={() => setActiveTab("users")}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'users' ? 'bg-emerald-400 text-ink-950 font-semibold' : 'hover:bg-ink-900 text-alabaster-200'}`}
                        >
                            <Users className="w-5 h-5" />
                            Users
                        </button>
                    )}
                    <div className="pt-8 pb-4">
                        <span className="px-4 text-xs font-semibold uppercase tracking-widest opacity-40">Account</span>
                    </div>
                    <button
                        onClick={() => setActiveTab("settings")}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'settings' ? 'bg-emerald-400 text-ink-950 font-semibold' : 'hover:bg-ink-900 text-alabaster-200'}`}
                    >
                        <Settings className="w-5 h-5" />
                        Settings
                    </button>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-900/40 text-red-200 transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                        Logout
                    </button>
                </nav>

                <div className="p-4">
                    <div className="bg-ink-900 p-4 rounded-2xl border border-ink-800">
                        <p className="text-xs font-medium text-emerald-400 mb-1">PRO PLAN</p>
                        <p className="text-sm font-semibold mb-2">Enterprise Plus</p>
                        <div className="w-full bg-ink-800 rounded-full h-1.5 mb-2">
                            <div className="bg-emerald-400 h-1.5 rounded-full" style={{ width: '75%' }}></div>
                        </div>
                        <p className="text-[10px] opacity-60">75% of compute used</p>
                    </div>
                </div>

                <SystemHealth />
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                <header className="h-20 bg-white border-b border-alabaster-100 flex items-center justify-between px-8 sticky top-0 z-10">
                    <div className="flex items-center gap-4 flex-1 max-w-xl">
                        <Search className="w-5 h-5 text-slate-400" />
                        <Input
                            placeholder="Search orders, plans, or IDs..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="border-none focus-visible:ring-0 text-slate-600 bg-transparent h-12"
                        />
                    </div>
                    <div className="flex items-center gap-6">
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-xl text-slate-600 hover:bg-alabaster-50 transition-colors"
                            title="Toggle Theme"
                        >
                            {theme === "light" ? <Moon className="w-6 h-6" /> : <Sun className="w-6 h-6" />}
                        </button>

                        <button
                            onClick={() => setShowNotifications(!showNotifications)}
                            className={`relative p-2 rounded-xl transition-colors ${showNotifications ? 'bg-emerald-50 text-emerald-600' : 'text-slate-600 hover:bg-alabaster-50'}`}
                        >
                            <Bell className="w-6 h-6" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-400 rounded-full border-2 border-white"></span>
                        </button>

                        {/* Notifications Panel */}
                        <AnimatePresence>
                            {showNotifications && (
                                <>
                                    <div
                                        className="fixed inset-0 z-40"
                                        onClick={() => setShowNotifications(false)}
                                    />
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        className="absolute top-16 right-0 w-80 bg-white shadow-2xl rounded-2xl border border-alabaster-100 z-50 overflow-hidden"
                                    >
                                        <div className="p-4 border-b border-alabaster-100 flex items-center justify-between">
                                            <h3 className="font-bold text-ink-950">Notifications</h3>
                                            <button onClick={() => setShowNotifications(false)}>
                                                <X className="w-4 h-4 text-slate-400 hover:text-ink-950" />
                                            </button>
                                        </div>
                                        <div className="max-h-96 overflow-y-auto">
                                            {[
                                                { title: "System Update", desc: "Enterprise AI models have been updated to v2.4", time: "2h ago", icon: Zap, color: "text-amber-500" },
                                                { title: "New Order", desc: "A new Pro Plan subscription has been initiated", time: "5h ago", icon: ShoppingBag, color: "text-emerald-500" },
                                                { title: "Security Alert", desc: "New login detected from Casablanca, Morocco", time: "1d ago", icon: Shield, color: "text-blue-500" },
                                            ].map((n, i) => (
                                                <div key={i} className="p-4 hover:bg-alabaster-50 transition-colors cursor-pointer border-b border-alabaster-50 last:border-0">
                                                    <div className="flex gap-3">
                                                        <div className={`mt-1 ${n.color}`}><n.icon className="w-4 h-4" /></div>
                                                        <div>
                                                            <p className="text-sm font-bold text-ink-950 leading-tight">{n.title}</p>
                                                            <p className="text-xs text-slate-500 mt-1">{n.desc}</p>
                                                            <p className="text-[10px] text-slate-400 mt-2 font-medium uppercase">{n.time}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="p-3 bg-alabaster-50 text-center">
                                            <button
                                                className="text-xs font-bold text-ink-950 hover:underline"
                                                onClick={() => handleAction("View All Notifications")}
                                            >
                                                View all notifications
                                            </button>
                                        </div>
                                    </motion.div>
                                </>
                            )}
                        </AnimatePresence>
                        <div className="flex items-center gap-3 pl-6 border-l border-alabaster-100">
                            <div className="text-right">
                                <p className="text-sm font-bold text-ink-950 leading-none">
                                    {user?.username || "Guest"}
                                </p>
                                <p className="text-xs text-slate-500 mt-1 uppercase">
                                    {userRole}
                                </p>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-ink-950 flex items-center justify-center text-alabaster-50 font-bold">
                                {(user?.username || "G").charAt(0).toUpperCase()}
                            </div>
                        </div>
                    </div>
                </header>

                <div className="p-8">
                    <AnimatePresence mode="wait">
                        {activeTab === "overview" && (
                            <motion.div
                                key="overview"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-8"
                            >
                                <AIInsightsPanel userRole={userRole} />

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {[
                                        { label: "Total Revenue", value: stats?.totalRevenue || "$0", icon: CreditCard, color: "text-emerald-500", trend: "+12.5%" },
                                        { label: "Active Orders", value: stats?.activeOrders || 0, icon: Package, color: "text-blue-500", trend: "+5.2%" },
                                        { label: "AI Requests", value: stats?.aiRequests || 0, icon: Zap, color: "text-amber-500", trend: "+25.1%" },
                                        { label: userRole === "admin" ? "User Growth" : "Tokens Saved", value: userRole === "admin" ? "+12%" : (stats?.tokensSaved || "0"), icon: TrendingUp, color: "text-purple-500", trend: "+2.3%" },
                                    ].map((stat, i) => (
                                        <GlassCard key={i} className="p-6">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className={`p-3 rounded-xl bg-white shadow-sm ${stat.color}`}>
                                                    <stat.icon className="w-6 h-6" />
                                                </div>
                                                <span className="text-emerald-500 text-xs font-bold leading-none py-1 px-2 bg-emerald-50 rounded-lg">{stat.trend}</span>
                                            </div>
                                            <p className="text-slate-500 text-sm font-medium mb-1">{stat.label}</p>
                                            <p className="text-2xl font-bold text-ink-950">{stat.value}</p>
                                        </GlassCard>
                                    ))}
                                </div>

                                <div className="grid lg:grid-cols-3 gap-8">
                                    <div className="lg:col-span-2">
                                        <GlassCard className="p-8">
                                            <div className="flex items-center justify-between mb-8">
                                                <div>
                                                    <h3 className="text-lg font-bold text-ink-950">
                                                        {userRole === "admin" ? "Revenue Analytics" : "Spend Analytics"}
                                                    </h3>
                                                    <p className="text-sm text-slate-500">Performance over the last 30 days</p>
                                                </div>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleAction("Export")}
                                                >
                                                    Export Data
                                                </Button>
                                            </div>
                                            <div className="h-[300px] w-full bg-alabaster-50 rounded-2xl flex items-end justify-between p-6 gap-2">
                                                {[40, 65, 45, 90, 85, 55, 75, 95, 80, 60, 70, 45].map((h, i) => (
                                                    <motion.div
                                                        key={i}
                                                        initial={{ height: 0 }}
                                                        animate={{ height: `${h}%` }}
                                                        transition={{ delay: i * 0.05 }}
                                                        className="flex-1 bg-ink-950 rounded-t-lg group relative"
                                                    >
                                                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-ink-950 text-alabaster-50 text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                                            ${h}k
                                                        </div>
                                                    </motion.div>
                                                ))}
                                            </div>
                                            <div className="flex justify-between mt-4 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                                                <span>Jan 01</span>
                                                <span>Jan 15</span>
                                                <span>Jan 30</span>
                                            </div>
                                        </GlassCard>
                                    </div>

                                    <div>
                                        <GlassCard className="p-8 h-full">
                                            <h3 className="text-lg font-bold text-ink-950 mb-6">Quick Tools</h3>
                                            <div className="space-y-4">
                                                {[
                                                    { name: "Tax Counsel", route: "/products/tax-counsel", color: "bg-emerald-400" },
                                                    { name: "Query Architect", route: "/products/query-architect", color: "bg-blue-400" },
                                                    { name: "OmniServe Chat", route: "/products/omniserve", color: "bg-amber-400" },
                                                    { name: "SkillArcade", route: "/products/skillarcade", color: "bg-purple-400" },
                                                ].map((tool, i) => (
                                                    <Link href={tool.route} key={i}>
                                                        <div className="p-4 rounded-xl border border-alabaster-200 hover:border-ink-950/20 transition-all cursor-pointer group bg-white shadow-sm flex items-center justify-between">
                                                            <div className="flex items-center gap-3">
                                                                <div className={`w-2 h-2 rounded-full ${tool.color}`}></div>
                                                                <span className="text-sm font-semibold text-slate-700">{tool.name}</span>
                                                            </div>
                                                            <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-ink-950" />
                                                        </div>
                                                    </Link>
                                                ))}
                                            </div>
                                        </GlassCard>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === "orders" && (
                            <motion.div
                                key="orders"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                            >
                                <GlassCard className="overflow-hidden">
                                    <div className="p-8 border-b border-alabaster-100 flex items-center justify-between">
                                        <div>
                                            <h2 className="text-2xl font-bold text-ink-950">Recent Orders</h2>
                                            <p className="text-slate-500">Track and manage your subscription orders.</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleAction("Filter")}
                                            >
                                                Filter
                                            </Button>
                                            <Button
                                                size="sm"
                                                onClick={() => handleAction("New Order")}
                                            >
                                                New Order
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left">
                                            <thead className="bg-alabaster-50 text-xs font-bold uppercase tracking-wider text-slate-500">
                                                <tr>
                                                    <th className="px-8 py-4">Order ID</th>
                                                    <th className="px-8 py-4">Customer</th>
                                                    <th className="px-8 py-4">Plan</th>
                                                    <th className="px-8 py-4">Amount</th>
                                                    <th className="px-8 py-4">Status</th>
                                                    <th className="px-8 py-4">Date</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-alabaster-100">
                                                {isLoadingOrders ? (
                                                    <tr>
                                                        <td colSpan={6} className="px-8 py-12 text-center text-slate-400 italic">Loading orders...</td>
                                                    </tr>
                                                ) : filteredOrders.length ? (
                                                    filteredOrders.map((order) => (
                                                        <tr key={order.id} className="hover:bg-alabaster-50 transition-colors">
                                                            <td className="px-8 py-4 font-mono text-xs text-slate-600">#{order.id.slice(0, 8)}</td>
                                                            <td className="px-8 py-4 font-medium text-ink-950">{order.customerEmail}</td>
                                                            <td className="px-8 py-4">
                                                                <Badge variant="outline" className="text-xs">{order.planName}</Badge>
                                                            </td>
                                                            <td className="px-8 py-4 font-bold text-ink-950">USD {order.amount}</td>
                                                            <td className="px-8 py-4">
                                                                <Badge className={order.status === 'completed' ? 'bg-emerald-400 text-ink-950' : 'bg-amber-400 text-ink-950'}>
                                                                    {order.status.toUpperCase()}
                                                                </Badge>
                                                            </td>
                                                            <td className="px-8 py-4 text-sm text-slate-500">
                                                                {new Date(order.createdAt!).toLocaleDateString()}
                                                            </td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan={6} className="px-8 py-12 text-center">
                                                            <div className="max-w-xs mx-auto">
                                                                <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                                                                <h3 className="font-bold text-ink-950 mb-2">No orders yet</h3>
                                                                <p className="text-sm text-slate-500">When you process transactions, they will appear here in real-time.</p>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </GlassCard>
                            </motion.div>
                        )}

                        {activeTab === "activity" && userRole === "admin" && (
                            <AuditLogTab />
                        )}

                        {activeTab === "analytics" && userRole === "client" && (
                            <UsageAnalyticsTab stats={stats} />
                        )}

                        {activeTab === "users" && userRole === "admin" && (
                            <motion.div
                                key="users"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                            >
                                <GlassCard className="overflow-hidden">
                                    <div className="p-8 border-b border-alabaster-100 flex items-center justify-between">
                                        <div>
                                            <h2 className="text-2xl font-bold text-ink-950">User Management</h2>
                                            <p className="text-slate-500">Manage organizational members and their permissions.</p>
                                        </div>
                                        <Button size="sm" onClick={() => handleAction("Invite User")}>Invite User</Button>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left">
                                            <thead className="bg-alabaster-50 text-xs font-bold uppercase tracking-wider text-slate-500">
                                                <tr>
                                                    <th className="px-8 py-4">Name</th>
                                                    <th className="px-8 py-4">Role</th>
                                                    <th className="px-8 py-4">Status</th>
                                                    <th className="px-8 py-4">Last Active</th>
                                                    <th className="px-8 py-4">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-alabaster-100">
                                                {[
                                                    { name: "Admin User", email: "admin@fiscai.co", role: "Super Admin", status: "Active", last: "Now" },
                                                    { name: "John Doe", email: "john@client.com", role: "Technical Lead", status: "Active", last: "2h ago" },
                                                    { name: "Sarah Smith", email: "sarah@enterprise.io", role: "Contributor", status: "Inactive", last: "3d ago" },
                                                ].map((u, i) => (
                                                    <tr key={i} className="hover:bg-alabaster-50 transition-colors">
                                                        <td className="px-8 py-4">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-8 h-8 rounded-full bg-alabaster-200 flex items-center justify-center text-xs font-bold">{u.name.charAt(0)}</div>
                                                                <div>
                                                                    <p className="text-sm font-bold text-ink-950 leading-none">{u.name}</p>
                                                                    <p className="text-xs text-slate-500 mt-1">{u.email}</p>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-8 py-4 text-sm font-medium">{u.role}</td>
                                                        <td className="px-8 py-4">
                                                            <Badge className={u.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400'}>
                                                                {u.status}
                                                            </Badge>
                                                        </td>
                                                        <td className="px-8 py-4 text-xs text-slate-500">{u.last}</td>
                                                        <td className="px-8 py-4">
                                                            <Button variant="ghost" size="sm" onClick={() => handleAction("Edit User")}>Edit</Button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </GlassCard>
                            </motion.div>
                        )}

                        {activeTab === "settings" && (
                            <motion.div
                                key="settings"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="max-w-4xl space-y-8"
                            >
                                <div className="mb-8">
                                    <h2 className="text-3xl font-bold text-ink-950 mb-2">Account Settings</h2>
                                    <p className="text-slate-500 text-lg">Manage your profile, security, and preferences.</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                    <div className="md:col-span-1">
                                        <h3 className="font-bold text-ink-950 mb-2">Profile Information</h3>
                                        <p className="text-sm text-slate-500">Update your account details and profile picture.</p>
                                    </div>
                                    <div className="md:col-span-2">
                                        <GlassCard className="p-8 space-y-6">
                                            <div className="flex items-center gap-6 pb-6 border-b border-alabaster-100">
                                                <div className="w-20 h-20 rounded-2xl bg-ink-950 flex items-center justify-center text-alabaster-50 text-2xl font-bold">
                                                    {userRole === "admin" ? "AU" : "CU"}
                                                </div>
                                                <div>
                                                    <Button variant="outline" size="sm" className="mb-2" onClick={() => handleAction("Change Avatar")}>Change Avatar</Button>
                                                    <p className="text-xs text-slate-400">JPG, GIF or PNG. Max size of 800K</p>
                                                </div>
                                            </div>
                                            <div className="grid md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-sm font-bold text-ink-950">Username</label>
                                                    <Input defaultValue={userRole === "admin" ? "admin_user" : "client_user"} disabled />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-sm font-bold text-ink-950">Role</label>
                                                    <Input defaultValue={userRole.toUpperCase()} disabled />
                                                </div>
                                                <div className="md:col-span-2 space-y-2">
                                                    <label className="text-sm font-bold text-ink-950">Email Address</label>
                                                    <Input defaultValue={userRole === "admin" ? "admin@fiscai.co" : "user@company.com"} />
                                                </div>
                                            </div>
                                            <Button className="bg-ink-950 text-alabaster-50" onClick={() => handleAction("Save Changes")}>Save Changes</Button>
                                        </GlassCard>
                                    </div>

                                    <div className="md:col-span-1">
                                        <h3 className="font-bold text-ink-950 mb-2">Security</h3>
                                        <p className="text-sm text-slate-500">Manage your password and authentication methods.</p>
                                    </div>
                                    <div className="md:col-span-2">
                                        <GlassCard className="p-8 space-y-6">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <Shield className="w-5 h-5 text-emerald-500" />
                                                    <div>
                                                        <p className="text-sm font-bold text-ink-950">Two-Factor Authentication</p>
                                                        <p className="text-xs text-slate-500">Secure your account with 2FA.</p>
                                                    </div>
                                                </div>
                                                <Badge className="bg-emerald-50 text-emerald-600 border-none">Enabled</Badge>
                                            </div>
                                            <div className="pt-6 border-t border-alabaster-100">
                                                <Button variant="outline" onClick={() => handleAction("Change Password")}>Change Password</Button>
                                            </div>
                                        </GlassCard>
                                    </div>

                                    <div className="md:col-span-1">
                                        <h3 className="font-bold text-ink-950 mb-2">API Management</h3>
                                        <p className="text-sm text-slate-500">Manage your access keys for OmniServe and Custom Training integration.</p>
                                    </div>
                                    <div className="md:col-span-2">
                                        <GlassCard className="p-8 space-y-6">
                                            <div className="p-4 bg-alabaster-50 rounded-xl border border-alabaster-100 flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 bg-ink-950 rounded-lg flex items-center justify-center text-alabaster-50">
                                                        <Key className="w-4 h-4" />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-bold text-ink-950">LIVE_KEY_8293...</p>
                                                        <p className="text-[10px] text-slate-500">Created Jan 12, 2024</p>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <Button variant="ghost" size="sm" onClick={() => toast({ title: "Copied", description: "API Key copied to clipboard" })}>Copy</Button>
                                                    <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600" onClick={() => handleAction("Revoke API Key")}>Revoke</Button>
                                                </div>
                                            </div>
                                            <Button className="w-full bg-ink-950 text-alabaster-50 py-6" onClick={() => handleAction("Generate API Key")}>Generate New API Key</Button>
                                        </GlassCard>
                                    </div>

                                    <div className="md:col-span-1">
                                        <h3 className="font-bold text-ink-950 mb-2">Resource Alerts</h3>
                                        <p className="text-sm text-slate-500">Configure notifications for AI token thresholds and spend limits.</p>
                                    </div>
                                    <div className="md:col-span-2">
                                        <GlassCard className="p-8 space-y-6">
                                            {[
                                                { label: "Token Threshold", desc: "Notify when compute reaches 80% usage.", status: "Active" },
                                                { label: "Daily Spend Limit", desc: "Alert when daily spend exceeds $50.00.", status: "Inactive" },
                                            ].map((alert, i) => (
                                                <div key={i} className="flex items-center justify-between pb-4 last:pb-0 last:border-0 border-b border-alabaster-100">
                                                    <div>
                                                        <p className="text-sm font-bold text-ink-950">{alert.label}</p>
                                                        <p className="text-xs text-slate-500">{alert.desc}</p>
                                                    </div>
                                                    <Button variant="ghost" size="sm" className={alert.status === 'Active' ? 'text-emerald-600' : 'text-slate-400'}>
                                                        {alert.status}
                                                    </Button>
                                                </div>
                                            ))}
                                            <Button variant="outline" className="w-full" onClick={() => handleAction("Configure Advanced Alerts")}>Configure Advanced Alerts</Button>
                                        </GlassCard>
                                    </div>

                                    <div className="md:col-span-1">
                                        <h3 className="font-bold text-ink-950 mb-2">Privacy & Data</h3>
                                        <p className="text-sm text-slate-500">Exercise your GDPR rights including Erasure and Portability.</p>
                                    </div>
                                    <div className="md:col-span-2">
                                        <GlassCard className="p-8 space-y-8">
                                            <div className="space-y-6">
                                                <h4 className="text-sm font-bold text-ink-950 uppercase tracking-widest flex items-center gap-2">
                                                    <Lock className="w-4 h-4 text-emerald-500" />
                                                    Consent Management
                                                </h4>

                                                <div className="space-y-4">
                                                    {[
                                                        { id: "analytics", label: "Analytics Tracking", desc: "Allow FiscAI to use your anonymized data to improve AI models." },
                                                        { id: "marketing", label: "Product Marketing", desc: "Receive updates about new Enterprise features and tax regulations." },
                                                        { id: "thirdParty", label: "Third-Party Integration", desc: "Share relevant data with authorized tax advisory partners." },
                                                    ].map((pref) => (
                                                        <div key={pref.id} className="flex items-center justify-between">
                                                            <div>
                                                                <p className="text-sm font-bold text-ink-950">{pref.label}</p>
                                                                <p className="text-xs text-slate-500">{pref.desc}</p>
                                                            </div>
                                                            <Switch
                                                                defaultChecked={(user?.consentSettings as any)?.[pref.id]}
                                                                onCheckedChange={(checked) => {
                                                                    const newSettings = { ...(user?.consentSettings as any || {}), [pref.id]: checked };
                                                                    updatePrivacy(newSettings);
                                                                }}
                                                                disabled={isUpdatingPrivacy}
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="pt-8 border-t border-alabaster-100 space-y-6">
                                                <h4 className="text-sm font-bold text-ink-950 uppercase tracking-widest flex items-center gap-2">
                                                    <RefreshCw className="w-4 h-4 text-blue-500" />
                                                    Data Retention
                                                </h4>
                                                <div className="p-4 bg-alabaster-50 rounded-xl border border-alabaster-100">
                                                    <p className="text-sm text-slate-600 leading-relaxed">
                                                        Your organization follows a <span className="font-bold text-ink-950">30-day retention policy</span>.
                                                        Transaction logs and query histories older than 30 days are automatically purged from our production clusters.
                                                    </p>
                                                    {userRole === "admin" && (
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="mt-4 border-slate-200 hover:bg-white"
                                                            onClick={() => purgeOldData()}
                                                            disabled={isPurging}
                                                        >
                                                            <RefreshCw className={`w-4 h-4 mr-2 ${isPurging ? 'animate-spin' : ''}`} />
                                                            Apply Retention Policy Now
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="pt-8 border-t border-red-100 space-y-6">
                                                <h4 className="text-sm font-bold text-red-600 uppercase tracking-widest flex items-center gap-2">
                                                    <ShieldOff className="w-4 h-4" />
                                                    Right to Erasure
                                                </h4>
                                                <div className="space-y-4">
                                                    <p className="text-sm text-slate-500">
                                                        Deleting your account will permanently erase all associated data, including query history,
                                                        compliance records, and identity verification data. <span className="font-bold text-red-600">This action is irreversible.</span>
                                                    </p>
                                                    <Button
                                                        variant="ghost"
                                                        className="text-red-600 hover:bg-red-50 hover:text-red-700 p-0 h-auto font-bold flex items-center gap-2"
                                                        onClick={() => {
                                                            if (confirm("Are you absolutely sure? This will delete all your data permanently.")) {
                                                                deleteAccount();
                                                            }
                                                        }}
                                                        disabled={isDeletingAccount}
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                        Delete Account and All Data
                                                    </Button>
                                                </div>
                                            </div>
                                        </GlassCard>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
}
