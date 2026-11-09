"use client";

import React, { useEffect, useState } from "react";
import { CheckCircle2, XCircle, AlertTriangle, Clock, Server, RefreshCw, ShieldCheck, ExternalLink } from "lucide-react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/components/Logo";

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
      <div className="min-h-screen bg-[#FAFBFD] flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="text-[#635BFF] animate-spin" size={24} />
          <p className="text-slate-500 text-sm font-medium">Fetching real-time status telemetry...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-[#FAFBFD] flex items-center justify-center font-sans p-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-8 max-w-md w-full text-center shadow-lg">
          <XCircle className="text-rose-500 mx-auto mb-3" size={42} />
          <h1 className="text-xl font-bold text-[#0A2540] mb-2">Status Page Not Found</h1>
          <p className="text-slate-500 text-sm mb-6">The monitored cluster or application key is inactive or invalid.</p>
          <Link href="/" className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-[#0A2540] hover:bg-[#635BFF] text-white text-xs font-bold transition-all shadow-xs">
            Return to BREXAL Home
          </Link>
        </div>
      </div>
    );
  }

  const { app_name, is_operational, last_checked_at, active_incidents, history } = data;

  return (
    <div className="min-h-screen bg-[#FAFBFD] text-[#0A2540] font-sans selection:bg-[#635BFF]/15">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-8 sm:space-y-10">
        
        {/* Top Navbar Header */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <Link href="/" className="group focus:outline-none">
              <Logo className="h-4.5 text-[#0A2540] group-hover:text-[#635BFF] transition-colors" />
            </Link>
            <span className="text-slate-300 font-light">/</span>
            <div className="flex items-center gap-2">
              <Server size={15} className="text-[#635BFF]" />
              <h1 className="text-base sm:text-lg font-bold text-[#0A2540]">{app_name}</h1>
            </div>
          </div>
          
          <div className="text-[#425466] text-xs font-mono flex items-center gap-2 bg-white border border-slate-200 px-3 py-1.5 rounded-full shadow-2xs self-start sm:self-auto">
            <Clock size={13} className="text-slate-400" />
            <span>Updated: {last_checked_at ? new Date(last_checked_at).toLocaleTimeString() : "Live"}</span>
          </div>
        </header>

        {/* Global Status Banner */}
        <div className={`p-6 sm:p-7 rounded-2xl border flex items-center gap-4 sm:gap-5 transition-all shadow-xs ${
          is_operational 
            ? 'bg-emerald-50/70 border-emerald-200' 
            : 'bg-rose-50/70 border-rose-200'
        }`}>
          {is_operational ? (
            <div className="w-11 h-11 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
              <CheckCircle2 size={26} className="text-emerald-600" />
            </div>
          ) : (
            <div className="w-11 h-11 rounded-full bg-rose-100 flex items-center justify-center shrink-0">
              <AlertTriangle size={26} className="text-rose-600" />
            </div>
          )}
          <div>
            <h2 className={`text-lg sm:text-xl font-extrabold tracking-tight ${is_operational ? 'text-emerald-900' : 'text-rose-900'}`}>
              {is_operational ? 'All Systems Operational' : 'Active Service Degradation Detected'}
            </h2>
            <p className="text-xs sm:text-sm text-[#425466] mt-0.5">
              {is_operational 
                ? 'All distributed services, eBPF probes, and database pools are operating normally.' 
                : 'Our SRE team and autonomous recovery agents are investigating an anomaly.'}
            </p>
          </div>
        </div>

        {/* Uptime History Card */}
        <section className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-7 shadow-[0_8px_30px_rgba(10,37,64,0.04)]">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-[#0A2540]">30-Day Historical Uptime</h3>
              <p className="text-xs text-slate-500 mt-0.5">Continuous synthetic health evaluations across global edge regions</p>
            </div>
            <span className="text-[11px] font-mono font-bold text-[#635BFF] bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-md">
              99.99% Average
            </span>
          </div>

          <div className="flex items-end gap-1 sm:gap-1.5 h-16 w-full mb-3">
            {history.map((day: any, idx: number) => {
              let bgColor = "bg-emerald-500";
              let height = "h-full";
              if (day.uptime_pct < 100 && day.uptime_pct >= 95) bgColor = "bg-amber-400";
              if (day.uptime_pct < 95) {
                bgColor = "bg-rose-500";
                height = "h-1/2";
              }
              if (day.total_checks === 0) bgColor = "bg-slate-200";
              
              return (
                <div key={idx} className="flex-1 flex flex-col justify-end h-full group relative">
                  <div className={`w-full rounded-xs transition-all hover:opacity-80 cursor-pointer ${bgColor} ${height}`} />
                  {/* Tooltip */}
                  <div className="absolute bottom-full mb-2.5 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-[#0A2540] text-xs text-white px-2.5 py-1.5 rounded-lg whitespace-nowrap pointer-events-none z-20 shadow-xl font-mono text-[11px]">
                    <p className="font-semibold">{new Date(day.date).toLocaleDateString()}</p>
                    <p className={day.uptime_pct < 100 ? 'text-amber-300 font-bold' : 'text-emerald-300 font-bold'}>
                      {day.uptime_pct}% uptime
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex items-center justify-between text-[#425466] text-xs font-mono font-medium pt-2">
            <span>30 days ago</span>
            <div className="w-full mx-4 border-t border-slate-200" />
            <span>Today</span>
          </div>
        </section>

        {/* Active Incidents */}
        {!is_operational && active_incidents.length > 0 && (
          <section className="space-y-4">
            <h3 className="text-base font-bold text-[#0A2540]">Incident Timeline</h3>
            {active_incidents.map((inc: any) => (
              <div key={inc.id} className="bg-white border border-rose-200 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-bold text-rose-900">Elevated Latency & Service Degradation</h4>
                  <span className="text-[11px] font-mono font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full">
                    Investigating
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                  Autonomous watchdog detected latency regressions affecting {app_name}. Incident started at {new Date(inc.started_at).toLocaleString()}. Automated canary rollbacks and pool recycling are underway.
                </p>
                <div className="border-l-2 border-rose-500 pl-3 py-0.5 text-xs font-mono text-slate-500">
                  <span>Detected at: {new Date(inc.started_at).toLocaleString()}</span>
                </div>
              </div>
            ))}
          </section>
        )}

        {/* Footer */}
        <footer className="pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-[#425466] gap-3">
          <div className="flex items-center gap-2">
            <ShieldCheck size={14} className="text-emerald-600" />
            <span>Powered by BREXAL Autonomous Telemetry Platform</span>
          </div>
          <Link href="/" className="hover:text-[#635BFF] transition-colors font-semibold flex items-center gap-1">
            <span>Subscribe to updates</span>
            <ExternalLink size={12} />
          </Link>
        </footer>

      </div>
    </div>
  );
}
