"use client";

import React, { useEffect, useState } from "react";
import { CheckCircle2, XCircle, AlertTriangle, Clock, Server, RefreshCw } from "lucide-react";
import { useParams } from "next/navigation";

export default function PublicStatusPage() {
  const params = useParams();
  const client_key = params?.client_key as string;

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchStatus = async () => {
      if (!client_key) return;
      try {
        const res = await fetch(`http://localhost:5000/api/public/status/${client_key}`);
        if (!res.ok) {
          setError(true);
          return;
        }
        const json = await res.json();
        setData(json);
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchStatus();
    
    // Auto refresh every 60s
    const interval = setInterval(fetchStatus, 60000);
    return () => clearInterval(interval);
  }, [client_key]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-4">
          <RefreshCw className="text-[#555] animate-spin" size={24} />
          <p className="text-[#888] text-sm">Loading status...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center font-sans">
        <div className="text-center space-y-3">
          <XCircle className="text-red-500 mx-auto" size={48} />
          <h1 className="text-xl font-semibold text-white">Status Page Not Found</h1>
          <p className="text-[#888] text-sm">The application you are looking for does not exist or is disabled.</p>
        </div>
      </div>
    );
  }

  const { app_name, is_operational, last_checked_at, active_incidents, history } = data;

  return (
    <div className="min-h-screen bg-[#050505] text-[#EDEDED] font-sans selection:bg-white/20">
      <div className="max-w-4xl mx-auto px-6 py-12 md:py-20 space-y-12">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-white/[0.08]">
          <div>
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-white mb-2">{app_name}</h1>
            <p className="text-[#888] text-[15px] flex items-center gap-2">
              <Server size={16} /> Public Status Page
            </p>
          </div>
          <div className="text-[#666] text-[13px] flex items-center gap-2 bg-[#111] border border-white/[0.04] px-3 py-1.5 rounded-full">
            <Clock size={14} /> Last updated: {last_checked_at ? new Date(last_checked_at).toLocaleTimeString() : "Just now"}
          </div>
        </header>

        {/* Global Status Banner */}
        <div className={`p-6 md:p-8 rounded-2xl border flex items-center gap-5 transition-all ${is_operational ? 'bg-emerald-500/10 border-emerald-500/20 shadow-[0_0_40px_-15px_rgba(16,185,129,0.15)]' : 'bg-red-500/10 border-red-500/20 shadow-[0_0_40px_-15px_rgba(239,68,68,0.15)]'}`}>
          {is_operational ? (
            <CheckCircle2 size={36} className="text-emerald-500 shrink-0" />
          ) : (
            <AlertTriangle size={36} className="text-red-500 shrink-0" />
          )}
          <div>
            <h2 className={`text-xl md:text-2xl font-semibold tracking-tight ${is_operational ? 'text-emerald-400' : 'text-red-400'}`}>
              {is_operational ? 'All Systems Operational' : 'We are experiencing issues'}
            </h2>
            <p className="text-[#888] text-[14px] mt-1">
              {is_operational ? 'No active incidents reported.' : 'Our team is actively investigating an outage.'}
            </p>
          </div>
        </div>

        {/* Uptime History Chart */}
        <section className="bg-[#111] border border-white/[0.08] rounded-2xl p-6 md:p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-medium tracking-tight">Uptime History</h3>
            <span className="text-[13px] text-[#888] bg-[#1a1a1a] px-3 py-1 rounded-full">Last 30 Days</span>
          </div>

          <div className="flex items-end gap-1 md:gap-2 h-20 w-full mb-3">
            {history.map((day: any, idx: number) => {
              // Determine color based on uptime
              let bgColor = "bg-emerald-500";
              let height = "h-full";
              if (day.uptime_pct < 100 && day.uptime_pct >= 95) bgColor = "bg-amber-400";
              if (day.uptime_pct < 95) {
                  bgColor = "bg-red-500";
                  height = "h-1/2"; // visually lower
              }
              if (day.total_checks === 0) bgColor = "bg-[#333]"; // No data
              
              return (
                <div key={idx} className="flex-1 flex flex-col justify-end h-full group relative">
                  <div className={`w-full rounded-sm opacity-80 group-hover:opacity-100 transition-all cursor-pointer ${bgColor} ${height}`} />
                  {/* Tooltip */}
                  <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-[#222] border border-white/10 text-xs text-white px-3 py-2 rounded-lg whitespace-nowrap pointer-events-none z-10 shadow-xl">
                    <p className="font-medium mb-0.5">{new Date(day.date).toLocaleDateString()}</p>
                    <p className={day.uptime_pct < 100 ? 'text-red-300' : 'text-emerald-300'}>{day.uptime_pct}% uptime</p>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex items-center justify-between text-[#666] text-xs font-medium">
            <span>30 days ago</span>
            <div className="w-full mx-4 border-t border-dashed border-white/10" />
            <span>Today</span>
          </div>
        </section>

        {/* Active Incidents */}
        {!is_operational && active_incidents.length > 0 && (
          <section className="space-y-4">
            <h3 className="text-lg font-medium tracking-tight mb-4">Active Incidents</h3>
            {active_incidents.map((inc: any) => (
              <div key={inc.id} className="bg-[#111] border border-white/[0.08] rounded-2xl p-6 md:p-8">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-base font-semibold text-white">System Outage</h4>
                  <span className="text-xs font-medium text-red-400 bg-red-400/10 px-2 py-1 rounded">Investigating</span>
                </div>
                <p className="text-[#888] text-sm leading-relaxed mb-6">
                  We are currently investigating an issue affecting {app_name}. Automated monitoring detected downtime starting at {new Date(inc.started_at).toLocaleString()}. We will provide updates as more information becomes available.
                </p>
                <div className="border-l-2 border-red-500/50 pl-4 space-y-1">
                  <p className="text-xs text-[#666] uppercase tracking-wider font-semibold">Incident Started</p>
                  <p className="text-sm text-[#EDEDED]">{new Date(inc.started_at).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </section>
        )}

      </div>
    </div>
  );
}
