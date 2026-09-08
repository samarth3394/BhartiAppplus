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
          <div className="w-5 h-5 border-2 border-[#333] border-t-[#EDEDED] rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (!stats || !stats.has_app) {
    return (
      <div className="flex flex-col items-center justify-center h-full max-w-lg mx-auto text-center space-y-6">
        <div className="w-16 h-16 bg-[#111] rounded-xl flex items-center justify-center border border-white/[0.08] shadow-sm">
          <Sparkles size={28} className="text-[#EDEDED]" />
        </div>
        <div>
          <h2 className="text-xl font-medium text-[#EDEDED] mb-2 tracking-tight">Create your first app</h2>
          <p className="text-[#888] text-sm">Start monitoring bugs, server health, and AI analytics.</p>
        </div>
        
        {showCreate ? (
          <div className="w-full max-w-sm p-5 bg-[#111] border border-white/[0.08] rounded-xl space-y-4 text-left">
             <input 
                type="text"
                placeholder="App Name (e.g. Bharti AI)"
                value={appName}
                onChange={(e) => setAppName(e.target.value)}
                className="w-full bg-[#0a0a0a] border border-white/[0.08] text-white rounded-lg py-2.5 px-3 outline-none focus:border-white/20 transition-all placeholder:text-[#555] text-sm"
                autoFocus
             />
             <input 
                type="url"
                placeholder="App URL (optional)"
                value={appUrl}
                onChange={(e) => setAppUrl(e.target.value)}
                className="w-full bg-[#0a0a0a] border border-white/[0.08] text-white rounded-lg py-2.5 px-3 outline-none focus:border-white/20 transition-all placeholder:text-[#555] text-sm"
             />
             <div className="flex gap-2 justify-end pt-2">
                <button onClick={() => { setShowCreate(false); setAppUrl(""); }} className="px-3 py-1.5 text-xs text-[#888] hover:text-white transition">Cancel</button>
                <button onClick={createApp} className="px-3 py-1.5 bg-white hover:bg-[#e5e5e5] text-black rounded-md text-xs font-medium transition">Create App</button>
             </div>
          </div>
        ) : (
          <button 
            onClick={() => setShowCreate(true)}
            className="bg-white hover:bg-[#e5e5e5] text-black px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2"
          >
            Create App
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
      suffix: "",
      color: "amber",
      trend: null
    }
  ];

  const colorMap: any = {
    blue: { text: "text-[#EDEDED]" },
    red: { text: "text-red-400" },
    emerald: { text: "text-emerald-400" },
    amber: { text: "text-amber-400" },
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/[0.04]">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-[#EDEDED]">Overview</h1>
          <p className="text-[13px] text-[#888] mt-1">Metrics and activity for {stats.app.name}</p>
        </div>
        <div className="flex gap-2">
            <button onClick={() => router.push('/infrastructure')} className="px-3 py-1.5 rounded-md bg-[#111] border border-white/[0.08] text-[#EDEDED] text-[13px] font-medium hover:bg-white/[0.05] transition-all">View Logs</button>
            <button onClick={() => router.push('/ai-dashboard')} className="px-3 py-1.5 rounded-md bg-white text-black text-[13px] font-medium hover:bg-[#e5e5e5] transition-all flex items-center gap-1.5">
              <Sparkles size={14} />
              Ask AI
            </button>
        </div>
      </div>
      
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {metricCards.map((card, idx) => {
          const colors = colorMap[card.color];
          return (
            <div key={idx} className="bg-[#111] p-5 rounded-xl border border-white/[0.06] flex flex-col justify-between">
              <div className="flex items-center gap-2 mb-4">
                <card.icon size={16} className="text-[#666]" />
                <h3 className="text-[#888] font-medium text-[13px] tracking-wide">{card.label}</h3>
              </div>
              <div>
                <div className="flex items-baseline gap-1">
                  <p className="text-3xl font-semibold text-[#EDEDED] tracking-tight">{card.value}</p>
                  <span className="text-[#666] font-medium text-xs">{card.suffix}</span>
                </div>
                {card.trend && (
                  <p className={`text-[11px] mt-2 flex items-center gap-1 ${card.value > 0 ? 'text-red-400' : 'text-[#666]'}`}>
                    {card.trend}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Charts / Activity Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-[#111] border border-white/[0.06] rounded-xl p-5 h-[360px] flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[14px] font-semibold text-[#EDEDED] flex items-center gap-2">
              System Performance
            </h3>
            <span className="text-[11px] text-[#666] bg-[#1a1a1a] px-2 py-1 rounded">Last 24h</span>
          </div>
          <div className="flex-1 flex items-center justify-center text-[#555]">
              {metrics.length === 0 ? (
                  <div className="text-center space-y-2">
                      <Activity className="opacity-20 text-white mx-auto mb-2" size={24} />
                      <p className="text-[#888] text-[13px] font-medium">No metrics data</p>
                      <p className="text-[11px] text-[#555]">Integrate the agent to see live data.</p>
                  </div>
              ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-3">
                      <div className="flex items-center gap-2 text-emerald-400/80 text-sm">
                        <RefreshCw size={14} className="animate-spin" style={{ animationDuration: '3s' }} />
                        <span className="font-medium text-[13px]">Live stream active</span>
                      </div>
                      <p className="text-[12px] text-[#666]">{metrics.length} points collected</p>
                  </div>
              )}
          </div>
        </div>
        
        <div className="bg-[#111] border border-white/[0.06] rounded-xl p-5 h-[360px] flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[14px] font-semibold text-[#EDEDED]">
              Activity
            </h3>
            <span className="text-[#666] text-[11px] font-mono">{activities.length} events</span>
          </div>
          <div className="flex-1 overflow-y-auto pr-1 space-y-3">
              {activities.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center">
                      <p className="text-[#555] text-[13px]">No recent activity</p>
                  </div>
              ) : (
                  activities.map((act) => (
                      <div key={act.id} className="flex gap-3 text-sm">
                          <div className="flex flex-col items-center pt-1.5">
                              <div className="w-1.5 h-1.5 rounded-full bg-[#444]" />
                              <div className="w-[1px] flex-1 bg-white/[0.04] my-1" />
                          </div>
                          <div className="flex-1 pb-3">
                              <p className="text-[13px] text-[#EDEDED] leading-snug">{act.action}</p>
                              <div className="flex justify-between items-center mt-1">
                                  <p className="text-[11px] text-[#666]">{act.user_name || "System"}</p>
                                  <p className="text-[11px] text-[#555]">{new Date(act.created_at).toLocaleDateString()}</p>
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
