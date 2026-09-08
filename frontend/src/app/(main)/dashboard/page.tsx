"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Activity, ShieldAlert, Zap, Clock, TrendingUp, ArrowUpRight, Sparkles, BarChart3, RefreshCw } from "lucide-react";

export default function Dashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [appName, setAppName] = useState("");
  const [appUrl, setAppUrl] = useState("");
  const router = useRouter();

  const [activities, setActivities] = useState<any[]>([]);
  const [metrics, setMetrics] = useState<any[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/dashboard/stats", {
          credentials: "include" 
        });

        if (res.status === 401) {
          router.push("/login");
          return;
        }

        const data = await res.json();
        setStats(data);
        
        if (data.has_app) {
          const actRes = await fetch("http://localhost:5000/api/dashboard/activity?limit=5", { credentials: "include" });
          if (actRes.ok) {
            const actData = await actRes.json();
            setActivities(actData.activities || []);
          }

          const metRes = await fetch("http://localhost:5000/api/server/metrics?period=24h", { credentials: "include" });
          if (metRes.ok) {
            const metData = await metRes.json();
            setMetrics(metData.metrics || []);
          }
        }
      } catch (err) {
        console.error("Failed to fetch dashboard stats", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [router]);

  const createApp = async () => {
    if (!appName.trim()) return;
    try {
      const res = await fetch("http://localhost:5000/api/apps", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name: appName, url: appUrl, workspace_id: "personal" })
      });
      if (res.ok) {
        window.location.reload();
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 border-4 border-blue-500/20 rounded-full" />
            <div className="absolute inset-0 border-4 border-blue-500 rounded-full border-t-transparent animate-spin" />
          </div>
          <p className="text-zinc-500 text-sm animate-pulse">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!stats || !stats.has_app) {
    return (
      <div className="flex flex-col items-center justify-center h-full max-w-lg mx-auto text-center space-y-6 animate-in fade-in duration-500">
        <div className="relative">
          <div className="w-24 h-24 bg-white/[0.02] rounded-full flex items-center justify-center border border-white/10 shadow-[0_0_30px_rgba(255,255,255,0.05)]">
            <Sparkles size={40} className="text-white" />
          </div>
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center animate-bounce shadow-md shadow-white/10">
            <ArrowUpRight size={14} className="text-black font-bold" />
          </div>
        </div>
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight mb-2">Welcome to BNexora</h2>
          <p className="text-zinc-400 text-lg leading-relaxed">Create your first application to start monitoring bugs, server health, and AI analytics.</p>
        </div>
        
        {showCreate ? (
          <div className="w-full max-w-sm p-6 bg-white/[0.02] backdrop-blur-2xl border border-white/10 rounded-2xl animate-in zoom-in-95 duration-200 space-y-4">
             <input 
                type="text"
                placeholder="App Name (e.g. Bharti AI)"
                value={appName}
                onChange={(e) => setAppName(e.target.value)}
                className="w-full bg-white/[0.02] border border-white/10 text-white rounded-xl py-3 px-4 outline-none focus:border-white/30 focus:ring-1 focus:ring-white/20 transition-all placeholder:text-zinc-600 font-light"
                autoFocus
             />
             <input 
                type="url"
                placeholder="App URL (optional)"
                value={appUrl}
                onChange={(e) => setAppUrl(e.target.value)}
                className="w-full bg-white/[0.02] border border-white/10 text-white rounded-xl py-3 px-4 outline-none focus:border-white/30 focus:ring-1 focus:ring-white/20 transition-all placeholder:text-zinc-600 font-light"
             />
             <div className="flex gap-3 justify-end pt-2">
                <button onClick={() => { setShowCreate(false); setAppUrl(""); }} className="px-4 py-2.5 text-zinc-400 hover:text-white transition rounded-xl hover:bg-white/5 font-medium">Cancel</button>
                <button onClick={createApp} className="px-5 py-2.5 bg-white hover:bg-zinc-200 text-black rounded-xl font-medium transition shadow-lg shadow-white/10">Create App</button>
             </div>
          </div>
        ) : (
          <button 
            onClick={() => setShowCreate(true)}
            className="bg-white hover:bg-zinc-200 text-black px-8 py-3.5 rounded-xl font-semibold transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] flex items-center gap-2 group"
          >
            <Sparkles size={18} />
            Create Your First App
            <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform opacity-70" />
          </button>
        )}
      </div>
    );
  }

  const metricCards = [
    {
      icon: Activity,
      label: "Health Score",
      value: stats.health_score?.total || 100,
      suffix: "/100",
      color: "blue",
      trend: null
    },
    {
      icon: ShieldAlert,
      label: "Active Issues",
      value: stats.bugs?.active || 0,
      suffix: "",
      color: "red",
      trend: (stats.bugs?.active || 0) > 0 ? "Needs Attention" : "All Clear"
    },
    {
      icon: Zap,
      label: "Uptime (24h)",
      value: stats.uptime?.percentage_24h || 100,
      suffix: "%",
      color: "emerald",
      trend: null
    },
    {
      icon: Clock,
      label: "Maintenance",
      value: stats.maintenance?.total_tasks || 0,
      suffix: " Tasks",
      color: "amber",
      trend: null
    }
  ];

  const colorMap: any = {
    blue: { bg: "bg-white/10", text: "text-zinc-300", border: "hover:border-white/20", glow: "text-white" },
    red: { bg: "bg-red-500/10", text: "text-red-400", border: "hover:border-red-500/30", glow: "text-red-500" },
    emerald: { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "hover:border-emerald-500/30", glow: "text-emerald-500" },
    amber: { bg: "bg-amber-500/10", text: "text-amber-400", border: "hover:border-amber-500/30", glow: "text-amber-500" },
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/10 text-white rounded-xl border border-white/10">
            <BarChart3 size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white mb-1">Overview</h1>
            <p className="text-zinc-400">Monitor the health and performance of <span className="text-zinc-200 font-medium">{stats.app.name}</span></p>
          </div>
        </div>
        <div className="flex gap-3">
            <button onClick={() => router.push('/infrastructure')} className="px-4 py-2.5 rounded-xl bg-white/[0.02] border border-white/5 text-zinc-300 font-medium hover:bg-white/[0.05] hover:border-white/10 hover:text-white transition-all">View Logs</button>
            <button onClick={() => router.push('/ai-dashboard')} className="px-4 py-2.5 rounded-xl bg-white text-black font-medium hover:bg-zinc-200 transition-all shadow-[0_0_15px_rgba(255,255,255,0.1)] flex items-center gap-2">
              <Sparkles size={16} />
              AI Copilot
            </button>
        </div>
      </div>
      
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {metricCards.map((card, idx) => {
          const colors = colorMap[card.color];
          return (
            <div key={idx} className={`bg-white/[0.02] backdrop-blur-2xl p-6 rounded-2xl border border-white/5 relative overflow-hidden group ${colors.border} transition-all duration-300`}>
              <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity">
                <card.icon size={80} className={colors.glow} />
              </div>
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-2.5 ${colors.bg} ${colors.text} rounded-xl`}>
                  <card.icon size={20} />
                </div>
                <h3 className="text-zinc-400 font-medium text-sm">{card.label}</h3>
              </div>
              <div className="flex items-end gap-2">
                <p className="text-4xl font-bold text-white tracking-tighter">{card.value}</p>
                <span className="text-zinc-500 font-medium mb-1 text-sm">{card.suffix}</span>
              </div>
              {card.trend && (
                <p className={`text-xs mt-2 flex items-center gap-1 ${card.value > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                  <TrendingUp size={12} /> {card.trend}
                </p>
              )}
            </div>
          );
        })}
      </div>
      
      {/* Charts / Activity Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white/[0.02] backdrop-blur-2xl border border-white/5 rounded-2xl p-6 h-[400px] flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Activity size={18} className="text-white opacity-80" />
              System Performance
            </h3>
            <span className="text-xs text-zinc-500 bg-zinc-800/50 px-3 py-1.5 rounded-lg">Last 24h</span>
          </div>
          <div className="flex-1 flex items-center justify-center text-zinc-500">
              {metrics.length === 0 ? (
                  <div className="text-center space-y-3">
                      <div className="w-16 h-16 bg-white/[0.02] rounded-2xl flex items-center justify-center mx-auto border border-white/5">
                        <Activity className="opacity-30 text-white" size={32} />
                      </div>
                      <div>
                        <p className="text-zinc-400 font-medium">No metrics data yet</p>
                        <p className="text-sm text-zinc-600 mt-1">Integrate the infrastructure agent to see live performance data.</p>
                      </div>
                  </div>
              ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-4">
                      <div className="flex items-center gap-2 text-emerald-400">
                        <RefreshCw size={16} className="animate-spin" style={{ animationDuration: '3s' }} />
                        <span className="font-medium">Live data streaming</span>
                      </div>
                      <p className="text-zinc-400">{metrics.length} data points collected in the last 24h</p>
                  </div>
              )}
          </div>
        </div>
        <div className="bg-white/[0.02] backdrop-blur-2xl border border-white/5 rounded-2xl p-6 h-[400px] flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Clock size={18} className="text-white opacity-80" />
              Recent Activity
            </h3>
            <span className="bg-white/10 text-zinc-300 text-xs px-2.5 py-1 rounded-full font-medium">{activities.length}</span>
          </div>
          <div className="flex-1 overflow-y-auto pr-2 space-y-1">
              {activities.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-3">
                      <div className="w-12 h-12 bg-white/[0.02] rounded-xl flex items-center justify-center border border-white/5">
                        <Clock className="opacity-30 text-white" size={24} />
                      </div>
                      <p className="text-zinc-500 text-sm">No recent activity</p>
                  </div>
              ) : (
                  activities.map((act) => (
                      <div key={act.id} className="flex gap-3 p-3 rounded-xl hover:bg-white/[0.02] transition group border border-transparent hover:border-white/5">
                          <div className="flex flex-col items-center pt-0.5">
                              <div className="w-2 h-2 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.4)]" />
                              <div className="w-[1px] flex-1 bg-white/10 my-1 group-last:hidden" />
                          </div>
                          <div className="flex-1 min-w-0">
                              <p className="text-sm text-zinc-300 leading-snug">{act.action}</p>
                              <div className="flex justify-between items-center mt-1.5">
                                  <p className="text-xs text-zinc-500">{act.user_name || "System"}</p>
                                  <p className="text-xs text-zinc-600">{new Date(act.created_at).toLocaleDateString()}</p>
                              </div>
                          </div>
                      </div>
                  ))
              )}
          </div>
        </div>
      </div>
    </div>
  );
}
