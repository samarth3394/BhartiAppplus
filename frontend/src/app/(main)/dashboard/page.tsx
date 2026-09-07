"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Activity, ShieldAlert, Zap, Clock, TrendingUp } from "lucide-react";

export default function Dashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [appName, setAppName] = useState("");
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
        
        // Fetch activity feed
        if (data.has_app) {
          const actRes = await fetch("http://localhost:5000/api/dashboard/activity?limit=5", { credentials: "include" });
          if (actRes.ok) {
            const actData = await actRes.json();
            setActivities(actData.activities || []);
          }

          // Fetch metrics for performance graph
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
        body: JSON.stringify({ name: appName, workspace_id: "personal" })
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
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!stats || !stats.has_app) {
    return (
      <div className="flex flex-col items-center justify-center h-full max-w-lg mx-auto text-center space-y-6">
        <div className="w-24 h-24 bg-zinc-900 rounded-full flex items-center justify-center border border-white/10 mb-4 shadow-[0_0_50px_rgba(59,130,246,0.1)]">
          <Activity size={40} className="text-blue-500" />
        </div>
        <h2 className="text-3xl font-bold text-white tracking-tight">Welcome to BNexora</h2>
        <p className="text-zinc-400 text-lg">Create your first application to start monitoring bugs, server health, and AI analytics.</p>
        
        {showCreate ? (
          <div className="w-full max-w-sm mt-4 p-6 bg-zinc-900 border border-white/10 rounded-2xl animate-in zoom-in-95">
             <input 
                type="text"
                placeholder="My Awesome App"
                value={appName}
                onChange={(e) => setAppName(e.target.value)}
                className="w-full bg-black/50 border border-white/10 text-white rounded-xl py-3 px-4 mb-4 outline-none focus:border-blue-500"
                autoFocus
             />
             <div className="flex gap-3 justify-end">
                <button onClick={() => setShowCreate(false)} className="px-4 py-2 text-zinc-400 hover:text-white transition">Cancel</button>
                <button onClick={createApp} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium transition">Create App</button>
             </div>
          </div>
        ) : (
          <button 
            onClick={() => setShowCreate(true)}
            className="bg-white text-black px-8 py-3 rounded-full font-bold hover:scale-105 transition-transform"
          >
            Create Application
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
            <h1 className="text-3xl font-bold tracking-tight text-white mb-1">Overview</h1>
            <p className="text-zinc-400">Monitor the health and performance of {stats.app.name}</p>
        </div>
        <div className="flex gap-3">
            <button className="px-4 py-2 rounded-lg bg-zinc-900 border border-white/10 text-white font-medium hover:bg-zinc-800 transition">View Logs</button>
            <button className="px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-500 transition shadow-[0_0_20px_rgba(37,99,235,0.4)]">Analyze with AI</button>
        </div>
      </div>
      
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Health Score */}
        <div className="bg-zinc-900/40 backdrop-blur-xl p-6 rounded-2xl border border-white/10 relative overflow-hidden group hover:border-blue-500/30 transition-colors">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Activity size={60} className="text-blue-500" />
          </div>
          <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-500/20 text-blue-400 rounded-lg">
                  <Activity size={20} />
              </div>
              <h3 className="text-zinc-300 font-medium">Health Score</h3>
          </div>
          <div className="flex items-end gap-2">
              <p className="text-5xl font-bold text-white tracking-tighter">{stats.health_score?.total || 100}</p>
              <span className="text-zinc-500 font-medium mb-1">/100</span>
          </div>
        </div>

        {/* Active Bugs */}
        <div className="bg-zinc-900/40 backdrop-blur-xl p-6 rounded-2xl border border-white/10 relative overflow-hidden group hover:border-red-500/30 transition-colors">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <ShieldAlert size={60} className="text-red-500" />
          </div>
          <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-500/20 text-red-400 rounded-lg">
                  <ShieldAlert size={20} />
              </div>
              <h3 className="text-zinc-300 font-medium">Active Issues</h3>
          </div>
          <div className="flex items-end gap-2">
              <p className="text-5xl font-bold text-white tracking-tighter">{stats.bugs?.active || 0}</p>
              <span className="text-red-400 font-medium mb-2 text-sm flex items-center gap-1">
                  <TrendingUp size={14}/> Needs Attention
              </span>
          </div>
        </div>

        {/* Uptime */}
        <div className="bg-zinc-900/40 backdrop-blur-xl p-6 rounded-2xl border border-white/10 relative overflow-hidden group hover:border-emerald-500/30 transition-colors">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Zap size={60} className="text-emerald-500" />
          </div>
          <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg">
                  <Zap size={20} />
              </div>
              <h3 className="text-zinc-300 font-medium">Uptime (24h)</h3>
          </div>
          <div className="flex items-end gap-2">
              <p className="text-5xl font-bold text-white tracking-tighter">{stats.uptime?.percentage_24h || 100}</p>
              <span className="text-zinc-500 font-medium mb-1">%</span>
          </div>
        </div>

        {/* Maintenance */}
        <div className="bg-zinc-900/40 backdrop-blur-xl p-6 rounded-2xl border border-white/10 relative overflow-hidden group hover:border-amber-500/30 transition-colors">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Clock size={60} className="text-amber-500" />
          </div>
          <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-amber-500/20 text-amber-400 rounded-lg">
                  <Clock size={20} />
              </div>
              <h3 className="text-zinc-300 font-medium">Maintenance</h3>
          </div>
          <div className="flex items-end gap-2">
              <p className="text-5xl font-bold text-white tracking-tighter">{stats.maintenance?.total_tasks || 0}</p>
              <span className="text-zinc-500 font-medium mb-1">Tasks</span>
          </div>
        </div>
      </div>
      
      {/* Charts / Activity Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-zinc-900/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 h-[400px] flex flex-col">
            <h3 className="text-lg font-semibold text-white mb-4">System Performance</h3>
            <div className="flex-1 flex items-center justify-center text-zinc-500">
                {metrics.length === 0 ? (
                    <div className="text-center">
                        <Activity className="mx-auto mb-3 opacity-20" size={48} />
                        <p>Waiting for metrics data...</p>
                        <p className="text-sm mt-2 opacity-50">Integrate the infrastructure agent to see live data.</p>
                    </div>
                ) : (
                    <div className="w-full h-full text-blue-400 flex items-center justify-center border border-white/5 rounded-xl border-dashed">
                        {/* We'll use Recharts here in future, for now show stats */}
                        <p>Data received! {metrics.length} data points collected in the last 24h.</p>
                    </div>
                )}
            </div>
        </div>
        <div className="bg-zinc-900/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 h-[400px] flex flex-col">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                Recent Activity
                <span className="bg-white/10 text-xs px-2 py-1 rounded-full">{activities.length}</span>
            </h3>
            <div className="flex-1 overflow-y-auto pr-2 space-y-4">
                {activities.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-zinc-600 text-sm">
                        <Clock className="mb-2 opacity-20" size={32} />
                        No recent activity
                    </div>
                ) : (
                    activities.map((act) => (
                        <div key={act.id} className="flex gap-4 group">
                            <div className="flex flex-col items-center">
                                <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shadow-[0_0_10px_rgba(59,130,246,0.8)]"></div>
                                <div className="w-[1px] h-full bg-white/10 my-1 group-last:hidden"></div>
                            </div>
                            <div className="flex-1 pb-4">
                                <p className="text-sm text-zinc-200">{act.action}</p>
                                <div className="flex justify-between items-center mt-1">
                                    <p className="text-xs text-zinc-500">{act.user_name || "System"}</p>
                                    <p className="text-xs text-zinc-600">
                                        {new Date(act.created_at).toLocaleDateString()}
                                    </p>
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
