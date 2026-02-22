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
    Key
} from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { Order } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { Sun, Moon } from "lucide-react";

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

export default function Dashboard() {
    const { toast } = useToast();
    const [location, setLocation] = useLocation();
    const [userRole, setUserRole] = useState("client");
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("overview");
    const [searchQuery, setSearchQuery] = useState("");
    const [showNotifications, setShowNotifications] = useState(false);
    const [theme, setTheme] = useState(() => localStorage.getItem("fiscai_theme") || "light");

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

    useEffect(() => {
        const savedRole = localStorage.getItem("fiscai_user_role");
        if (savedRole) {
            setUserRole(savedRole);
            // Non-admins shouldn't stay on users tab if they somehow got there
            if (savedRole === "client" && activeTab === "users") {
                setActiveTab("overview");
            }
        }
        setIsLoading(false);
    }, [activeTab]);

    const { data: orders, isLoading: isLoadingOrders } = useQuery<{ success: boolean; data: Order[] }>({
        queryKey: ["/api/orders"],
    });

    const handleLogout = () => {
        localStorage.removeItem("fiscai_user_role");
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
                                            <button className="text-xs font-bold text-ink-950 hover:underline">View all notifications</button>
                                        </div>
                                    </motion.div>
                                </>
                            )}
                        </AnimatePresence>
                        <div className="flex items-center gap-3 pl-6 border-l border-alabaster-100">
                            <div className="text-right">
                                <p className="text-sm font-bold text-ink-950 leading-none">
                                    {userRole === "admin" ? "Admin User" : "Client User"}
                                </p>
                                <p className="text-xs text-slate-500 mt-1">
                                    {userRole === "admin" ? "Global Admin" : "Standard access"}
                                </p>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-ink-950 flex items-center justify-center text-alabaster-50 font-bold">
                                {userRole === "admin" ? "AU" : "CU"}
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
                                        { label: "Total Revenue", value: userRole === "admin" ? "$124,592" : "$4,250", icon: CreditCard, color: "text-emerald-500", trend: "+12.5%" },
                                        { label: "Active Orders", value: userRole === "admin" ? "84" : "12", icon: Package, color: "text-blue-500", trend: "+5.2%" },
                                        { label: "AI Requests", value: userRole === "admin" ? "2,401" : "342", icon: Zap, color: "text-amber-500", trend: "+25.1%" },
                                        { label: userRole === "admin" ? "User Growth" : "Tokens Saved", value: userRole === "admin" ? "+12%" : "45k", icon: TrendingUp, color: "text-purple-500", trend: "+2.3%" },
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
                                        <Button size="sm">Invite User</Button>
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
                                                            <Button variant="ghost" size="sm">Edit</Button>
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
                                                    <Button variant="outline" size="sm" className="mb-2">Change Avatar</Button>
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
                                            <Button className="bg-ink-950 text-alabaster-50">Save Changes</Button>
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
                                                <Button variant="outline">Change Password</Button>
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
                                                    <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600">Revoke</Button>
                                                </div>
                                            </div>
                                            <Button className="w-full bg-ink-950 text-alabaster-50 py-6">Generate New API Key</Button>
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
