"use client";

import React, { useEffect, useState } from "react";
import { Bug, Search, Plus, Filter, AlertCircle, CheckCircle2, Clock, ShieldAlert, X } from "lucide-react";
import { getApiUrl } from "@/lib/api";

type BugItem = {
  id: string;
  title: string;
  description: string;
  severity: "critical" | "high" | "medium" | "low";
  status: "open" | "in_progress" | "resolved";
  reported_by: string;
  reporter_avatar?: string;
  assignee: string;
  assignee_avatar?: string;
  created_at: string;
};

const DEFAULT_BUGS: BugItem[] = [
  {
    id: "bug-101",
    title: "Postgres client pool connection timeout under 5,000 req/s traffic spike",
    description: "Max connection limit hit causing 504 Gateway Timeouts in the payment microservice cluster.",
    severity: "critical",
    status: "in_progress",
    reported_by: "SRE Autonomous Watchdog",
    assignee: "Rohan Patil",
    assignee_avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    created_at: "2026-11-08T18:24:00Z"
  },
  {
    id: "bug-102",
    title: "Kafka trace ingest buffer lag during EU peak traffic hours",
    description: "Partition consumer lag exceeded 15,000 messages on topic `telemetry.spans.v1`.",
    severity: "high",
    status: "open",
    reported_by: "Ananya Iyer",
    reporter_avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
    assignee: "Neha Sharma",
    assignee_avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    created_at: "2026-11-08T14:10:00Z"
  },
  {
    id: "bug-103",
    title: "WebSocket reconnect backoff loop in dashboard overview",
    description: "Network reconnection didn't reset jitter timeout on client refresh.",
    severity: "medium",
    status: "resolved",
    reported_by: "Samarth Choudhar",
    reporter_avatar: "/avatars/samarth.png",
    assignee: "Samarth Choudhar",
    assignee_avatar: "/avatars/samarth.png",
    created_at: "2026-11-07T21:05:00Z"
  },
  {
    id: "bug-104",
    title: "Redis memory fragmentation threshold alert on cache cluster 02",
    description: "Active defragmentation script trigger needed adjustment for 16GB instances.",
    severity: "medium",
    status: "open",
    reported_by: "Automated SRE Daemon",
    assignee: "Vikram Desai",
    assignee_avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    created_at: "2026-11-07T11:45:00Z"
  },
  {
    id: "bug-105",
    title: "Minor telemetry badge alignment shift on WebKit / Safari 17",
    description: "CSS flex layout discrepancy on high-DPI displays fixed with standard min-w constraint.",
    severity: "low",
    status: "resolved",
    reported_by: "Vikram Desai",
    reporter_avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    assignee: "Sarah Jenkins",
    assignee_avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
    created_at: "2026-11-06T09:15:00Z"
  }
];

export default function BugsPage() {
  const [bugs, setBugs] = useState<BugItem[]>(DEFAULT_BUGS);
  const [loading, setLoading] = useState(false);
  const [showBugModal, setShowBugModal] = useState(false);
  const [newBug, setNewBug] = useState({ title: '', description: '', severity: 'medium' });
  const [searchQuery, setSearchQuery] = useState("");
  const [severityFilter, setSeverityFilter] = useState("all");

  const fetchBugs = async () => {
    try {
      const res = await fetch(getApiUrl("/api/bugs"), {
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        if (data.bugs && data.bugs.length > 0) {
          setBugs(data.bugs);
        }
      }
    } catch (err) {
      // Retain rich fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBugs();
  }, []);

  const handleCreateBug = async () => {
    if (!newBug.title.trim()) return;
    const created: BugItem = {
      id: "bug-" + Date.now(),
      title: newBug.title,
      description: newBug.description,
      severity: newBug.severity as any,
      status: "open",
      reported_by: "Samarth Choudhar",
      assignee: "Unassigned",
      created_at: new Date().toISOString()
    };

    setBugs(prev => [created, ...prev]);
    setShowBugModal(false);
    setNewBug({ title: '', description: '', severity: 'medium' });

    try {
      await fetch(getApiUrl("/api/bugs"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(newBug)
      });
    } catch (err) {
      // Local state is updated
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "critical": return "text-red-700 bg-red-50 border-red-200/80";
      case "high": return "text-orange-700 bg-orange-50 border-orange-200/80";
      case "medium": return "text-blue-700 bg-blue-50 border-blue-200/80";
      case "low": return "text-slate-700 bg-slate-100 border-slate-200/80";
      default: return "text-slate-700 bg-slate-100 border-slate-200/80";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "open": return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold text-rose-700 bg-rose-50 border border-rose-200/80">
          <AlertCircle size={12} className="text-rose-600" /> Open
        </span>
      );
      case "in_progress": return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold text-blue-700 bg-blue-50 border border-blue-200/80">
          <Clock size={12} className="text-blue-600" /> In Progress
        </span>
      );
      case "resolved": return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/80">
          <CheckCircle2 size={12} className="text-emerald-600" /> Resolved
        </span>
      );
      default: return null;
    }
  };

  const filteredBugs = bugs.filter(b => {
    const matchesSearch = b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          b.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSeverity = severityFilter === "all" || b.severity === severityFilter;
    return matchesSearch && matchesSeverity;
  });

  return (
    <div className="space-y-6 max-w-[1240px] mx-auto h-full flex flex-col pb-8 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0 pb-5 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0A2540]">
              Issues & Incident Tracker
            </h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold uppercase tracking-wider bg-[#635BFF]/10 text-[#635BFF] border border-[#635BFF]/20">
              Live Triage
            </span>
          </div>
          <p className="text-[13.5px] text-[#425466]">
            Real-time bug logs, automated stacktraces, and priority incident queue.
          </p>
        </div>
        <button 
          onClick={() => setShowBugModal(true)} 
          className="inline-flex items-center justify-center gap-2 bg-[#635BFF] hover:bg-[#5349e0] text-white px-5 py-2.5 rounded-xl text-[13px] font-bold transition-all shadow-[0_4px_14px_rgba(99,91,255,0.25)] hover:shadow-[0_6px_20px_rgba(99,91,255,0.35)] shrink-0 cursor-pointer"
        >
          <Plus size={15} />
          Report Issue
        </button>
      </div>

      {/* Toolbar / Filters */}
      <div className="flex flex-col sm:flex-row gap-3.5">
        <div className="relative flex-1 max-w-md">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search issues, endpoints, or stacktraces..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-slate-200/90 text-[#0A2540] rounded-xl py-2.5 pl-10 pr-3.5 text-[13px] outline-none focus:border-[#635BFF] focus:ring-2 focus:ring-[#635BFF]/15 placeholder:text-slate-400 font-medium transition shadow-xs"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={severityFilter}
            onChange={e => setSeverityFilter(e.target.value)}
            className="bg-white border border-slate-200/90 text-[#0A2540] rounded-xl py-2.5 px-3.5 text-[13px] outline-none focus:border-[#635BFF] font-semibold shadow-xs"
          >
            <option value="all">All Severities</option>
            <option value="critical">Critical (P0)</option>
            <option value="high">High (P1)</option>
            <option value="medium">Medium (P2)</option>
            <option value="low">Low (P3)</option>
          </select>
        </div>
      </div>

      {/* Issues Table / List */}
      <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(10,37,64,0.03)]">
        <div className="divide-y divide-slate-100">
          {filteredBugs.length === 0 ? (
            <div className="text-center py-14 text-[#425466] text-sm">
              No matching issues found.
            </div>
          ) : (
            filteredBugs.map((bug) => (
              <div key={bug.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors">
                <div className="flex-1">
                  <div className="flex items-center gap-2.5 mb-1.5 flex-wrap">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getSeverityBadge(bug.severity)}`}>
                      {bug.severity}
                    </span>
                    {getStatusBadge(bug.status)}
                    <span className="text-[11px] font-mono text-[#425466]">#{bug.id}</span>
                  </div>

                  <h3 className="text-[14.5px] font-bold text-[#0A2540] leading-snug mb-1">
                    {bug.title}
                  </h3>

                  <p className="text-[13px] text-[#425466] line-clamp-2 leading-relaxed">
                    {bug.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-5 mt-3 text-[12px] text-[#425466] font-medium">
                    <span className="flex items-center gap-1.5">
                      {(bug.reporter_avatar || bug.reported_by?.includes("Samarth")) ? (
                        <img src={bug.reporter_avatar || "/avatars/samarth.png"} alt="" className="w-5 h-5 rounded-full object-cover border border-slate-200" />
                      ) : null}
                      Reported by: <strong className="text-[#0A2540]">{bug.reported_by}</strong>
                    </span>
                    <span className="flex items-center gap-1.5">
                      {(bug.assignee_avatar || bug.assignee?.includes("Samarth")) ? (
                        <img src={bug.assignee_avatar || "/avatars/samarth.png"} alt="" className="w-5 h-5 rounded-full object-cover border border-slate-200" />
                      ) : null}
                      Assignee: <strong className="text-[#0A2540]">{bug.assignee}</strong>
                    </span>
                    <span className="font-mono text-slate-400">{new Date(bug.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Report Bug Modal */}
      {showBugModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A2540]/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200/90 rounded-2xl w-full max-w-lg p-6 sm:p-7 shadow-[0_20px_60px_rgba(10,37,64,0.15)]">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-[17px] font-extrabold text-[#0A2540]">Report Issue or Incident</h2>
              <button 
                onClick={() => setShowBugModal(false)}
                className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-[#425466] uppercase tracking-wider">Issue Title</label>
                <input 
                  type="text" 
                  placeholder="e.g. Memory leak in background worker..."
                  value={newBug.title}
                  onChange={e => setNewBug({...newBug, title: e.target.value})}
                  className="w-full bg-[#FAFBFD] border border-slate-200/90 text-[#0A2540] py-2.5 px-3.5 rounded-xl outline-none focus:border-[#635BFF] focus:bg-white focus:ring-2 focus:ring-[#635BFF]/15 text-[14px] placeholder:text-slate-400 font-semibold transition"
                  autoFocus
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-[#425466] uppercase tracking-wider">Details & Stacktrace</label>
                <textarea 
                  rows={4}
                  placeholder="Steps to reproduce, error codes, logs..."
                  value={newBug.description}
                  onChange={e => setNewBug({...newBug, description: e.target.value})}
                  className="w-full bg-[#FAFBFD] border border-slate-200/90 text-[#0A2540] rounded-xl py-2.5 px-3.5 outline-none focus:border-[#635BFF] focus:bg-white focus:ring-2 focus:ring-[#635BFF]/15 text-[13px] placeholder:text-slate-400 resize-none transition"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-[#425466] uppercase tracking-wider">Severity Level</label>
                <select 
                  value={newBug.severity}
                  onChange={e => setNewBug({...newBug, severity: e.target.value})}
                  className="w-full bg-[#FAFBFD] border border-slate-200/90 text-[#0A2540] rounded-xl py-2.5 px-3.5 outline-none focus:border-[#635BFF] text-[13px] font-semibold transition"
                >
                  <option value="critical">Critical (P0 / Service Outage)</option>
                  <option value="high">High (P1 / Major Degradation)</option>
                  <option value="medium">Medium (P2 / Standard Bug)</option>
                  <option value="low">Low (P3 / Minor Polish)</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-100">
              <button 
                onClick={() => setShowBugModal(false)} 
                className="px-4 py-2 text-[13px] font-bold text-[#425466] hover:text-[#0A2540] transition cursor-pointer"
              >
                Cancel
              </button>
              <button 
                onClick={handleCreateBug} 
                className="px-5 py-2 bg-[#635BFF] hover:bg-[#5349e0] text-white rounded-xl text-[13px] font-bold transition shadow-xs cursor-pointer"
              >
                Submit Incident
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
