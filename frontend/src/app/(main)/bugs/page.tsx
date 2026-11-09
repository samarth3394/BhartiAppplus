"use client";

import React, { useEffect, useState } from "react";
import { Bug, Search, Plus, Filter, AlertCircle, CheckCircle2, Clock, ShieldAlert } from "lucide-react";

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
      const res = await fetch("http://localhost:5000/api/bugs", {
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        if (data.bugs && data.bugs.length > 0) {
          setBugs(data.bugs);
        }
      }
    } catch (err) {
      // Keep rich default state
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
      await fetch("http://localhost:5000/api/bugs", {
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
      case "critical": return "text-red-700 bg-red-50 border-red-200";
      case "high": return "text-orange-700 bg-orange-50 border-orange-200";
      case "medium": return "text-blue-700 bg-blue-50 border-blue-200";
      case "low": return "text-slate-700 bg-slate-100 border-slate-200";
      default: return "text-slate-700 bg-slate-100 border-slate-200";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "open": return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold text-rose-700 bg-rose-50 border border-rose-200">
          <AlertCircle size={12} className="text-rose-600" /> Open
        </span>
      );
      case "in_progress": return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold text-blue-700 bg-blue-50 border border-blue-200">
          <Clock size={12} className="text-blue-600" /> In Progress
        </span>
      );
      case "resolved": return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200">
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#0F172A] mb-1">Issues & Incident Tracker</h1>
          <p className="text-[13.5px] text-slate-600">Real-time bug logs, automated stacktraces, and priority triage queue.</p>
        </div>
        <button 
          onClick={() => setShowBugModal(true)} 
          className="flex items-center gap-1.5 bg-[#0F172A] hover:bg-slate-800 text-white px-3.5 py-2 rounded-lg text-[13px] font-semibold transition-all shadow-xs"
        >
          <Plus size={15} />
          Report Issue
        </button>
      </div>

      {/* Toolbar / Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search issues and stacktraces..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-slate-200 text-[#0F172A] rounded-lg py-2 pl-9 pr-3 text-[13px] outline-none focus:border-[#635BFF] placeholder:text-slate-400 font-medium transition-colors shadow-xs"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={severityFilter}
            onChange={e => setSeverityFilter(e.target.value)}
            className="bg-white border border-slate-200 text-[#0F172A] rounded-lg py-2 px-3 text-[13px] outline-none focus:border-[#635BFF] font-medium shadow-xs"
          >
            <option value="all">All Severities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      {/* Issues Table / List */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <div className="divide-y divide-slate-100">
          {filteredBugs.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-sm">
              No matching issues found.
            </div>
          ) : (
            filteredBugs.map((bug) => (
              <div key={bug.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/80 transition-colors">
                <div className="flex-1">
                  <div className="flex items-center gap-2.5 mb-1.5 flex-wrap">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getSeverityBadge(bug.severity)}`}>
                      {bug.severity}
                    </span>
                    {getStatusBadge(bug.status)}
                    <span className="text-[11px] font-mono text-slate-400">#{bug.id}</span>
                  </div>

                  <h3 className="text-[14px] font-bold text-[#0F172A] leading-snug mb-1">
                    {bug.title}
                  </h3>

                  <p className="text-[12.5px] text-slate-600 line-clamp-2 leading-relaxed">
                    {bug.description}
                  </p>

                  <div className="flex items-center gap-5 mt-2.5 text-[11.5px] text-slate-500 font-medium">
                    <span className="flex items-center gap-1.5">
                      {(bug.reporter_avatar || bug.reported_by?.includes("Samarth")) ? (
                        <img src={bug.reporter_avatar || "/avatars/samarth.png"} alt="" className="w-4.5 h-4.5 rounded-full object-cover border border-slate-200" />
                      ) : null}
                      Reported by: <strong className="text-slate-700">{bug.reported_by}</strong>
                    </span>
                    <span className="flex items-center gap-1.5">
                      {(bug.assignee_avatar || bug.assignee?.includes("Samarth")) ? (
                        <img src={bug.assignee_avatar || "/avatars/samarth.png"} alt="" className="w-4.5 h-4.5 rounded-full object-cover border border-slate-200" />
                      ) : null}
                      Assignee: <strong className="text-slate-700">{bug.assignee}</strong>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white border border-slate-200 rounded-xl w-full max-w-lg p-6 shadow-2xl">
            <h2 className="text-[16px] font-bold text-[#0F172A] mb-4">Report Issue or Incident</h2>
            <div className="space-y-4 mb-6">
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">Issue Title</label>
                <input 
                  type="text" 
                  placeholder="e.g. Memory leak in background worker..."
                  value={newBug.title}
                  onChange={e => setNewBug({...newBug, title: e.target.value})}
                  className="w-full bg-white border border-slate-200 text-[#0F172A] py-2 px-3 rounded-lg outline-none focus:border-[#635BFF] text-[14px] placeholder:text-slate-400 font-medium transition-colors"
                  autoFocus
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">Details & Stacktrace</label>
                <textarea 
                  rows={4}
                  placeholder="Steps to reproduce, error codes, logs..."
                  value={newBug.description}
                  onChange={e => setNewBug({...newBug, description: e.target.value})}
                  className="w-full bg-white border border-slate-200 text-[#0F172A] rounded-lg py-2 px-3 outline-none focus:border-[#635BFF] text-[13px] placeholder:text-slate-400 resize-none transition-colors"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">Severity</label>
                <select 
                  value={newBug.severity}
                  onChange={e => setNewBug({...newBug, severity: e.target.value})}
                  className="w-full bg-white border border-slate-200 text-[#0F172A] rounded-lg py-2 px-3 outline-none focus:border-[#635BFF] text-[13px] transition-colors"
                >
                  <option value="critical">Critical (P0 / Outage)</option>
                  <option value="high">High (P1 / Major degradation)</option>
                  <option value="medium">Medium (P2 / Normal bug)</option>
                  <option value="low">Low (P3 / Minor polish)</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button onClick={() => setShowBugModal(false)} className="px-3 py-1.5 text-[13px] font-medium text-slate-600 hover:text-slate-900 transition">Cancel</button>
              <button onClick={handleCreateBug} className="px-4 py-1.5 bg-[#0F172A] hover:bg-slate-800 text-white rounded-lg text-[13px] font-semibold transition">Submit Report</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
