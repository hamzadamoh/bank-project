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
    Zap
} from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { Order } from "@shared/schema";

export default function Dashboard() {
    const [location, setLocation] = useLocation();
    const [activeTab, setActiveTab] = useState("overview");

    const { data: orders, isLoading } = useQuery<{ success: boolean; data: Order[] }>({
        queryKey: ["/api/orders"],
    });

    const handleLogout = () => {
        setLocation("/login");
    };

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
                            <span className="font-display font-bold text-xl tracking-tight">FiscAI</span>
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
                    <button
                        onClick={() => setActiveTab("users")}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'users' ? 'bg-emerald-400 text-ink-950 font-semibold' : 'hover:bg-ink-900 text-alabaster-200'}`}
                    >
                        <Users className="w-5 h-5" />
                        Users
                    </button>
                    <div className="pt-8 pb-4">
                        <span className="px-4 text-xs font-semibold uppercase tracking-widest opacity-40">Account</span>
                    </div>
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-ink-900 text-alabaster-200 transition-colors">
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
                            placeholder="Search analytics, orders, or users..."
                            className="border-none focus-visible:ring-0 text-slate-600 bg-transparent h-12"
                        />
                    </div>
                    <div className="flex items-center gap-6">
                        <button className="relative p-2 text-slate-600 hover:bg-alabaster-50 rounded-xl transition-colors">
                            <Bell className="w-6 h-6" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-400 rounded-full border-2 border-white"></span>
                        </button>
                        <div className="flex items-center gap-3 pl-6 border-l border-alabaster-100">
                            <div className="text-right">
                                <p className="text-sm font-bold text-ink-950 leading-none">Admin User</p>
                                <p className="text-xs text-slate-500 mt-1">Global Admin</p>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-ink-950 flex items-center justify-center text-alabaster-50 font-bold">
                                AU
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
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {[
                                        { label: "Total Revenue", value: "$124,592", icon: CreditCard, color: "text-emerald-500", trend: "+12.5%" },
                                        { label: "Active Orders", value: "84", icon: Package, color: "text-blue-500", trend: "+5.2%" },
                                        { label: "AI Requests", value: "2,401", icon: Zap, color: "text-amber-500", trend: "+25.1%" },
                                        { label: "User Growth", value: "+12%", icon: TrendingUp, color: "text-purple-500", trend: "+2.3%" },
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
                                                    <h3 className="text-lg font-bold text-ink-950">Revenue Analytics</h3>
                                                    <p className="text-sm text-slate-500">Performance over the last 30 days</p>
                                                </div>
                                                <Button variant="outline" size="sm">Export Data</Button>
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
                                            <Button variant="outline" size="sm">Filter</Button>
                                            <Button size="sm">New Order</Button>
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
                                                {isLoading ? (
                                                    <tr>
                                                        <td colSpan={6} className="px-8 py-12 text-center text-slate-400 italic">Loading orders...</td>
                                                    </tr>
                                                ) : orders?.data?.length ? (
                                                    orders.data.map((order) => (
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
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
}
