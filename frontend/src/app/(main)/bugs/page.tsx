"use client";

import React, { useEffect, useState } from "react";
import { Bug, Search, Plus, Filter, AlertCircle, CheckCircle2, Clock } from "lucide-react";

export default function BugsPage() {
  const [bugs, setBugs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBugModal, setShowBugModal] = useState(false);
  const [newBug, setNewBug] = useState({ title: '', description: '', severity: 'medium' });
  const [userRole, setUserRole] = useState<string>("viewer");

  const fetchBugs = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/bugs", {
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setBugs(data.bugs || []);
        setUserRole(data.user_role || "viewer");
      }
    } catch (err) {
      console.error("Failed to fetch bugs", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBugs();
  }, []);

  const canEdit = ["admin", "project_manager", "developer", "tester"].includes(userRole);

  const handleCreateBug = async () => {
    if (!canEdit) return;
    if (!newBug.title.trim()) return;
    try {
      const res = await fetch("http://localhost:5000/api/bugs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(newBug)
      });
      if (res.ok) {
        setShowBugModal(false);
        setNewBug({ title: '', description: '', severity: 'medium' });
        window.location.reload();
      } else {
        const errorData = await res.json();
        alert(errorData.detail || "Failed to create bug");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred");
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical": return "text-red-400 bg-red-400/10 border-red-400/20";
      case "high": return "text-orange-400 bg-orange-400/10 border-orange-400/20";
      case "medium": return "text-amber-400 bg-amber-400/10 border-amber-400/20";
      case "low": return "text-blue-400 bg-blue-400/10 border-blue-400/20";
      default: return "text-[#888] bg-white/[0.04] border-white/[0.08]";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "open": return <AlertCircle size={14} className="text-red-400" />;
      case "in_progress": return <Clock size={14} className="text-amber-400" />;
      case "resolved": return <CheckCircle2 size={14} className="text-emerald-400" />;
      default: return <Bug size={14} className="text-[#888]" />;
    }
  };

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto h-full flex flex-col pb-8 font-sans">
      {/* Header */}
      <div className="flex items-center justify-between shrink-0 pb-4 border-b border-white/[0.04]">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-[#EDEDED] mb-1">Issues & Bugs</h1>
          <p className="text-[13px] text-[#888]">Track and manage application errors and user reports.</p>
        </div>
        {canEdit && (
          <button onClick={() => setShowBugModal(true)} className="flex items-center gap-1.5 bg-white text-black px-3 py-1.5 rounded-md text-[13px] font-medium hover:bg-[#e5e5e5] transition">
            <Plus size={16} />
            Report Issue
          </button>
        )}
      </div>

      {/* Toolbar */}
      <div className="flex gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#555]" />
          <input 
            type="text" 
            placeholder="Search issues..." 
            className="w-full bg-[#111] border border-white/[0.08] rounded-lg py-1.5 pl-9 pr-3 text-[#EDEDED] text-[13px] outline-none focus:border-white/20 transition-colors placeholder:text-[#555]"
          />
        </div>
        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#111] border border-white/[0.08] rounded-lg text-[#EDEDED] text-[13px] hover:bg-[#1a1a1a] transition font-medium">
          <Filter size={14} />
          Filters
        </button>
      </div>

      {/* Bug List */}
      <div className="flex-1 bg-[#0a0a0a] border border-white/[0.04] rounded-xl overflow-hidden flex flex-col">
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
             <div className="w-5 h-5 border-2 border-[#333] border-t-[#EDEDED] rounded-full animate-spin" />
          </div>
        ) : bugs.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
            <div className="w-12 h-12 bg-[#111] rounded border border-white/[0.08] flex items-center justify-center mb-4 text-[#555]">
              <Bug size={24} />
            </div>
            <h3 className="text-[14px] font-medium text-[#EDEDED] mb-1">No issues found</h3>
            <p className="text-[#888] text-[13px] max-w-xs">You're all caught up! There are no open issues matching your criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/[0.04] bg-[#111] text-[11px] uppercase tracking-wider text-[#888]">
                  <th className="px-5 py-3 font-medium">Issue</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Severity</th>
                  <th className="px-5 py-3 font-medium">Reporter</th>
                  <th className="px-5 py-3 font-medium">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {bugs.map((bug) => (
                  <tr key={bug.id} className="hover:bg-[#111] transition-colors cursor-pointer group">
                    <td className="px-5 py-4">
                      <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono text-[#555]">{bug.id.substring(0, 8)}</span>
                            <span className="font-medium text-[13px] text-[#EDEDED]">{bug.title}</span>
                        </div>
                        {bug.description && (
                            <span className="text-[12px] text-[#666] truncate max-w-md pl-[52px]">{bug.description}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(bug.status)}
                        <span className="text-[12px] text-[#888] capitalize">{bug.status.replace("_", " ")}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-medium border ${getSeverityColor(bug.severity)} capitalize tracking-wide`}>
                        {bug.severity}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-[12px] text-[#888]">
                      {bug.reporter?.full_name || "System"}
                    </td>
                    <td className="px-5 py-4 text-[12px] text-[#666]">
                      {new Date(bug.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showBugModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#111111] border border-white/[0.08] rounded-xl w-full max-w-lg p-6 shadow-2xl">
            <h2 className="text-[15px] font-medium text-[#EDEDED] mb-5">Report Issue</h2>
            <div className="space-y-4 mb-6">
              <div className="space-y-1.5">
                <input 
                  type="text" 
                  placeholder="Issue title"
                  value={newBug.title}
                  onChange={e => setNewBug({...newBug, title: e.target.value})}
                  className="w-full bg-transparent border-b border-white/[0.08] text-[#EDEDED] py-2 px-1 outline-none focus:border-white/20 text-[15px] placeholder:text-[#555] transition-colors"
                  autoFocus
                />
              </div>
              <div className="space-y-1.5">
                <textarea 
                  rows={3}
                  placeholder="Describe the issue..."
                  value={newBug.description}
                  onChange={e => setNewBug({...newBug, description: e.target.value})}
                  className="w-full bg-[#0a0a0a] border border-white/[0.08] text-[#EDEDED] rounded-lg py-2 px-3 outline-none focus:border-white/20 text-[13px] placeholder:text-[#555] resize-none transition-colors"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-[11px] font-medium text-[#888] uppercase tracking-wider">Severity</label>
                <select 
                  value={newBug.severity}
                  onChange={e => setNewBug({...newBug, severity: e.target.value})}
                  className="w-full bg-[#0a0a0a] border border-white/[0.08] text-[#EDEDED] rounded-lg py-2 px-3 outline-none focus:border-white/20 text-[13px] appearance-none transition-colors"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-white/[0.04]">
              <button onClick={() => setShowBugModal(false)} className="px-3 py-1.5 text-[13px] text-[#888] hover:text-[#EDEDED] transition">Cancel</button>
              <button onClick={handleCreateBug} className="px-3 py-1.5 bg-white hover:bg-[#e5e5e5] text-black rounded-md text-[13px] font-medium transition">Submit Issue</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
