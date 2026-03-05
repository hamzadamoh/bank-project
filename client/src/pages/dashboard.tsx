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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { apiRequest } from "@/lib/queryClient";



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




    const queryClient = useQueryClient();


    const { mutate: updatePrivacy, isPending: isUpdatingPrivacy } = useMutation({
        mutationFn: async (settings: any) => {
            const res = await apiRequest("PUT", "/api/user/me/privacy", settings);
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
            toast({ title: "Privacy Updated ✅", description: "Your data consumption preferences are now active." });
        }
    });

    const { mutate: deleteAccount, isPending: isDeletingAccount } = useMutation({
        mutationFn: async () => {
            const res = await apiRequest("DELETE", "/api/user/me");
            return res.json();
        },
        onSuccess: () => {
            toast({ title: "Account Erased 🛡️", description: "Right to Erasure fulfilled. All data has been permanently deleted." });
            setLocation("/login");
        }
    });

    const { mutate: purgeOldData, isPending: isPurging } = useMutation({
        mutationFn: async () => {
            const res = await apiRequest("POST", "/api/admin/purge-old-data");
            return res.json();
        },
        onSuccess: () => {
            toast({ title: "Data Retention Applied", description: "Old records have been manually purged from the system." });
        }
    });

    const { data: usersData, isLoading: isLoadingUsers } = useQuery<{ success: boolean; data: any[] }>({
        queryKey: ["/api/admin/users"],
        enabled: userRole === "admin" && activeTab === "users",
    });

    const { mutate: updateRole, isPending: isUpdatingRole } = useMutation({
        mutationFn: async ({ userId, role }: { userId: string; role: string }) => {
            const res = await apiRequest("PATCH", `/api/admin/users/${userId}/role`, { role });
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
            toast({ title: "Role Updated ✅", description: "User permissions have been modified successfully." });
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
        order.id?.toLowerCase().includes(searchQuery.toLowerCase())
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
                </nav>
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
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {[
                                        { name: "TaxWise", route: "/products/taxwise", color: "bg-emerald-400", desc: "Automate tax rules" },
                                        { name: "QueryForge", route: "/products/queryforge", color: "bg-blue-400", desc: "Natural language SQL" },
                                        { name: "PolyGlot Chat", route: "/products/polyglot", color: "bg-amber-400", desc: "Multilingual advisory" },
                                        { name: "SkillForge", route: "/products/skillforge", color: "bg-purple-400", desc: "Team training platform" },
                                        { name: "ContractMind", route: "/products/contractmind", color: "bg-indigo-400", desc: "Legal document review" },
                                        { name: "AutoRecon", route: "/products/autorecon", color: "bg-rose-400", desc: "Smart reconciliation" },
                                        { name: "ComplianceGuard", route: "/products/complianceguard", color: "bg-teal-400", desc: "Regulatory monitoring" },
                                    ].map((tool, i) => (
                                        <Link href={tool.route} key={i}>
                                            <GlassCard className="p-6 hover:ring-2 ring-ink-950 transition-all cursor-pointer group h-full flex flex-col justify-between bg-white/50 hover:bg-white">
                                                <div>
                                                    <div className="flex items-center gap-3 mb-4">
                                                        <div className={`w-3 h-3 rounded-full ${tool.color}`}></div>
                                                        <span className="text-lg font-bold text-ink-950">{tool.name}</span>
                                                    </div>
                                                    <p className="text-sm text-slate-600 mb-6">{tool.desc}</p>
                                                </div>
                                                <div className="flex items-center text-sm font-semibold text-slate-500 group-hover:text-ink-950 transition-colors">
                                                    Launch Tool
                                                    <ExternalLink className="w-4 h-4 ml-2" />
                                                </div>
                                            </GlassCard>
                                        </Link>
                                    ))}
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
                                                        <tr key={order.id || Math.random().toString()} className="hover:bg-alabaster-50 transition-colors">
                                                            <td className="px-8 py-4 font-mono text-xs text-slate-600">#{order.id?.slice(0, 8)}</td>
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
                                                {isLoadingUsers ? (
                                                    <tr>
                                                        <td colSpan={5} className="px-8 py-12 text-center text-slate-400 italic">Loading user directory...</td>
                                                    </tr>
                                                ) : (usersData?.data || []).map((u, i) => (
                                                    <tr key={u.id || i} className="hover:bg-alabaster-50 transition-colors">
                                                        <td className="px-8 py-4">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-8 h-8 rounded-full bg-alabaster-200 flex items-center justify-center text-xs font-bold text-ink-950">
                                                                    {(u.username || "U").charAt(0).toUpperCase()}
                                                                </div>
                                                                <div>
                                                                    <p className="text-sm font-bold text-ink-950 leading-none">{u.username}</p>
                                                                    <p className="text-xs text-slate-500 mt-1">{u.username.includes('@') ? u.username : 'FiscAI Identity'}</p>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-8 py-4 text-sm font-medium">
                                                            <Badge variant="outline" className={u.role === 'admin' ? 'border-emerald-200 text-emerald-700 bg-emerald-50' : ''}>
                                                                {u.role.toUpperCase()}
                                                            </Badge>
                                                        </td>
                                                        <td className="px-8 py-4">
                                                            <Badge className="bg-emerald-50 text-emerald-600 border-none">Active</Badge>
                                                        </td>
                                                        <td className="px-8 py-4 text-xs text-slate-500">
                                                            {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'Instant Profile'}
                                                        </td>
                                                        <td className="px-8 py-4">
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                disabled={isUpdatingRole || (u.id === user?.id)}
                                                                onClick={() => updateRole({ userId: u.id, role: u.role === 'admin' ? 'client' : 'admin' })}
                                                            >
                                                                {u.role === 'admin' ? 'Demote' : 'Promote'}
                                                            </Button>
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
                                        <p className="text-sm text-slate-500">Manage your access keys for PolyGlot and Custom Training integration.</p>
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
