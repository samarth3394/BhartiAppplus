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
      case "critical": return "text-red-500 bg-red-500/10 border-red-500/20";
      case "high": return "text-orange-500 bg-orange-500/10 border-orange-500/20";
      case "medium": return "text-amber-500 bg-amber-500/10 border-amber-500/20";
      case "low": return "text-blue-500 bg-blue-500/10 border-blue-500/20";
      default: return "text-zinc-400 bg-zinc-500/10 border-zinc-500/20";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "open": return <AlertCircle size={16} className="text-red-400" />;
      case "in_progress": return <Clock size={16} className="text-blue-400" />;
      case "resolved": return <CheckCircle2 size={16} className="text-emerald-400" />;
      default: return <Bug size={16} className="text-zinc-400" />;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-white/10 text-white rounded-xl border border-white/10">
            <Bug size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white mb-1">Issues & Bugs</h1>
            <p className="text-zinc-400">Track and manage application errors and user reports.</p>
          </div>
        </div>
        {canEdit && (
          <button onClick={() => setShowBugModal(true)} className="flex items-center gap-2 bg-white text-black px-5 py-2.5 rounded-xl font-medium hover:bg-zinc-200 transition shadow-[0_0_15px_rgba(255,255,255,0.1)]">
            <Plus size={18} />
            Report Bug
          </button>
        )}
      </div>

      {/* Toolbar */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input 
            type="text" 
            placeholder="Search issues..." 
            className="w-full bg-white/[0.02] border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white outline-none focus:border-white/30 transition-colors font-light"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-white/[0.02] border border-white/10 rounded-xl text-white hover:bg-white/[0.05] transition font-medium">
          <Filter size={18} />
          Filters
        </button>
      </div>

      {/* Bug List */}
      <div className="flex-1 bg-white/[0.02] backdrop-blur-2xl border border-white/5 rounded-2xl overflow-hidden flex flex-col">
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
          </div>
        ) : bugs.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
            <div className="w-16 h-16 bg-white/[0.02] rounded-full flex items-center justify-center mb-4 text-zinc-500 border border-white/5">
              <Bug size={32} />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2 tracking-tight">No bugs found</h3>
            <p className="text-zinc-400 max-w-md font-light">You're all caught up! There are no open issues matching your criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.02] text-xs uppercase tracking-wider text-zinc-500">
                  <th className="px-6 py-4 font-medium">Issue</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Severity</th>
                  <th className="px-6 py-4 font-medium">Reporter</th>
                  <th className="px-6 py-4 font-medium">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {bugs.map((bug) => (
                  <tr key={bug.id} className="hover:bg-white/[0.03] transition-colors cursor-pointer group">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-medium text-white transition-colors">{bug.title}</span>
                        <span className="text-sm text-zinc-500 truncate max-w-md">{bug.description || "No description provided"}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(bug.status)}
                        <span className="text-sm text-zinc-300 capitalize">{bug.status.replace("_", " ")}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getSeverityColor(bug.severity)} capitalize`}>
                        {bug.severity}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-zinc-400">
                      {bug.reporter?.full_name || "System"}
                    </td>
                    <td className="px-6 py-4 text-sm text-zinc-500">
                      {new Date(bug.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showBugModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-zinc-950 border border-white/10 rounded-2xl w-full max-w-lg p-6 shadow-2xl">
            <h2 className="text-xl font-bold text-white mb-6 tracking-tight">Report New Bug</h2>
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1 ml-1">Bug Title</label>
                <input 
                  type="text" 
                  placeholder="e.g. App crashes on login"
                  value={newBug.title}
                  onChange={e => setNewBug({...newBug, title: e.target.value})}
                  className="w-full bg-white/[0.02] border border-white/10 text-white rounded-xl py-2 px-3 outline-none focus:border-white/30 font-light"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1 ml-1">Description</label>
                <textarea 
                  rows={3}
                  placeholder="Steps to reproduce..."
                  value={newBug.description}
                  onChange={e => setNewBug({...newBug, description: e.target.value})}
                  className="w-full bg-white/[0.02] border border-white/10 text-white rounded-xl py-2 px-3 outline-none focus:border-white/30 font-light"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1 ml-1">Severity</label>
                <select 
                  value={newBug.severity}
                  onChange={e => setNewBug({...newBug, severity: e.target.value})}
                  className="w-full bg-white/[0.02] border border-white/10 text-white rounded-xl py-2 px-3 outline-none focus:border-white/30 font-light"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowBugModal(false)} className="px-4 py-2 text-zinc-400 hover:text-white transition font-medium">Cancel</button>
              <button onClick={handleCreateBug} className="px-5 py-2 bg-white hover:bg-zinc-200 text-black rounded-xl font-medium transition shadow-lg shadow-white/10">Report Bug</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
