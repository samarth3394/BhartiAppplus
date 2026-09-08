"use client";

import React, { useEffect, useState } from "react";
import { Map, Plus, Target, Rocket, Lightbulb, Clock, MoreHorizontal, CheckCircle2, Circle } from "lucide-react";

type RoadmapFeature = {
  id: string;
  title: string;
  description: string;
  status: string; // planned, in_progress, completed
  priority: string; // low, medium, high, urgent
  start_date: string | null;
  due_date: string | null;
};

const STATUS_COLS = [
  { id: "planned", title: "Planned Ideas", icon: Lightbulb, color: "text-[#888]" },
  { id: "in_progress", title: "In Progress", icon: Clock, color: "text-amber-400" },
  { id: "completed", title: "Launched", icon: Rocket, color: "text-emerald-400" },
];

export default function RoadmapPage() {
  const [features, setFeatures] = useState<RoadmapFeature[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFeatureModal, setShowFeatureModal] = useState(false);
  const [newFeature, setNewFeature] = useState({ title: '', description: '', status: 'planned', priority: 'medium' });
  const [userRole, setUserRole] = useState<string>("viewer");

  const fetchFeatures = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/roadmap", { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setFeatures(data.features || []);
        setUserRole(data.user_role || "viewer");
      }
    } catch (err) {
      console.error("Failed to fetch roadmap", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeatures();
  }, []);

  const canEdit = ["admin", "project_manager", "developer"].includes(userRole);

  const handleCreateFeature = async () => {
    if (!canEdit) return;
    if (!newFeature.title.trim()) return;
    try {
      const res = await fetch("http://localhost:5000/api/roadmap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(newFeature)
      });
      if (res.ok) {
        setShowFeatureModal(false);
        setNewFeature({ title: '', description: '', status: 'planned', priority: 'medium' });
        fetchFeatures();
      } else {
        const errorData = await res.json();
        alert(errorData.detail || "Failed to suggest feature");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred");
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`http://localhost:5000/api/roadmap/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status })
      });
      if (res.ok) fetchFeatures();
    } catch (err) {
      console.error(err);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent": return "bg-red-500/10 text-red-400 border-red-500/20";
      case "high": return "bg-orange-500/10 text-orange-400 border-orange-500/20";
      case "medium": return "bg-white/[0.04] text-[#EDEDED] border-white/[0.08]";
      case "low": return "bg-white/[0.02] text-[#888] border-white/[0.04]";
      default: return "bg-white/[0.02] text-[#888] border-white/[0.04]";
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="w-5 h-5 border-2 border-[#333] border-t-[#EDEDED] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto h-full flex flex-col pb-8 font-sans">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/[0.04] shrink-0">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-[#EDEDED] mb-1">Product Roadmap</h1>
          <p className="text-[13px] text-[#888]">Plan epics, track major features, and share vision.</p>
        </div>
        {canEdit && (
          <button 
            onClick={() => setShowFeatureModal(true)}
            className="flex items-center gap-1.5 bg-white text-black px-3 py-1.5 rounded-md text-[13px] font-medium hover:bg-[#e5e5e5] transition"
          >
            <Plus size={16} />
            Suggest Feature
          </button>
        )}
      </div>

      <div className="flex-1 grid grid-cols-1 xl:grid-cols-3 gap-5 items-start">
        {STATUS_COLS.map((col) => {
          const colFeatures = features.filter((f) => f.status === col.id);
          return (
            <div key={col.id} className="bg-[#0a0a0a] border border-white/[0.04] rounded-xl flex flex-col max-h-[calc(100vh-12rem)]">
              <div className="flex items-center justify-between p-4 border-b border-white/[0.04] bg-[#111] shrink-0">
                <h2 className="text-[14px] font-medium text-[#EDEDED] flex items-center gap-2">
                  <col.icon size={16} className={col.color} /> {col.title}
                </h2>
                <span className="bg-[#222] text-[#888] text-[11px] font-medium px-2 py-0.5 rounded">
                  {colFeatures.length}
                </span>
              </div>
              
              <div className="p-3 space-y-3 overflow-y-auto custom-scrollbar">
                {colFeatures.length === 0 ? (
                  <div className="text-center py-8 text-[#555] text-[13px] border border-dashed border-white/[0.04] rounded-lg">
                    No features in this phase.
                  </div>
                ) : (
                  colFeatures.map((feature) => (
                    <div key={feature.id} className="p-4 bg-[#111] hover:bg-[#1a1a1a] border border-white/[0.06] hover:border-white/[0.12] rounded-lg transition-all group relative">
                      <div className="flex items-start justify-between mb-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider border ${getPriorityColor(feature.priority)}`}>
                          {feature.priority}
                        </span>
                        
                        {/* Quick actions on hover */}
                        <div className="opacity-0 group-hover:opacity-100 transition flex gap-1 bg-[#111] rounded border border-white/[0.08] absolute right-3 top-3 p-0.5 shadow-xl">
                          {col.id !== "planned" && (
                            <button onClick={() => updateStatus(feature.id, "planned")} className="p-1 text-[#888] hover:text-[#EDEDED] hover:bg-[#222] rounded transition-colors" title="Move to Planned">
                              <Lightbulb size={14} />
                            </button>
                          )}
                          {col.id !== "in_progress" && (
                            <button onClick={() => updateStatus(feature.id, "in_progress")} className="p-1 text-[#888] hover:text-[#EDEDED] hover:bg-[#222] rounded transition-colors" title="Move to In Progress">
                              <Clock size={14} />
                            </button>
                          )}
                          {col.id !== "completed" && (
                            <button onClick={() => updateStatus(feature.id, "completed")} className="p-1 text-[#888] hover:text-[#EDEDED] hover:bg-[#222] rounded transition-colors" title="Mark Completed">
                              <CheckCircle2 size={14} />
                            </button>
                          )}
                        </div>
                      </div>
                      
                      <h3 className="font-medium text-[14px] text-[#EDEDED] mb-1.5 leading-snug pr-8">{feature.title}</h3>
                      {feature.description && (
                        <p className="text-[12px] text-[#888] line-clamp-3 leading-relaxed">{feature.description}</p>
                      )}
                      
                      {feature.due_date && (
                        <div className="mt-4 pt-3 border-t border-white/[0.04] flex items-center justify-between text-[11px] text-[#666] font-mono">
                          <span className="flex items-center gap-1.5">
                            <Target size={12} /> Due: {new Date(feature.due_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {showFeatureModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#111111] border border-white/[0.08] rounded-xl w-full max-w-lg p-6 shadow-2xl">
            <h2 className="text-[15px] font-medium text-[#EDEDED] mb-5">Suggest Feature</h2>
            <div className="space-y-4 mb-6">
              <div className="space-y-1.5">
                <input 
                  type="text" 
                  placeholder="Feature title"
                  value={newFeature.title}
                  onChange={e => setNewFeature({...newFeature, title: e.target.value})}
                  className="w-full bg-transparent border-b border-white/[0.08] text-[#EDEDED] py-2 px-1 outline-none focus:border-white/20 text-[15px] placeholder:text-[#555] transition-colors"
                  autoFocus
                />
              </div>
              <div className="space-y-1.5">
                <textarea 
                  rows={3}
                  placeholder="Details..."
                  value={newFeature.description}
                  onChange={e => setNewFeature({...newFeature, description: e.target.value})}
                  className="w-full bg-[#0a0a0a] border border-white/[0.08] text-[#EDEDED] rounded-lg py-2 px-3 outline-none focus:border-white/20 text-[13px] placeholder:text-[#555] resize-none transition-colors"
                />
              </div>
              <div className="flex gap-4">
                <div className="flex-1 space-y-1.5">
                  <label className="block text-[11px] font-medium text-[#888] uppercase tracking-wider">Status</label>
                  <select 
                    value={newFeature.status}
                    onChange={e => setNewFeature({...newFeature, status: e.target.value})}
                    className="w-full bg-[#0a0a0a] border border-white/[0.08] text-[#EDEDED] rounded-lg py-2 px-2 outline-none focus:border-white/20 text-[13px] appearance-none transition-colors"
                  >
                    <option value="planned">Planned Ideas</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Launched</option>
                  </select>
                </div>
                <div className="flex-1 space-y-1.5">
                  <label className="block text-[11px] font-medium text-[#888] uppercase tracking-wider">Priority</label>
                  <select 
                    value={newFeature.priority}
                    onChange={e => setNewFeature({...newFeature, priority: e.target.value})}
                    className="w-full bg-[#0a0a0a] border border-white/[0.08] text-[#EDEDED] rounded-lg py-2 px-2 outline-none focus:border-white/20 text-[13px] appearance-none transition-colors"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-white/[0.04]">
              <button onClick={() => setShowFeatureModal(false)} className="px-3 py-1.5 text-[13px] text-[#888] hover:text-[#EDEDED] transition">Cancel</button>
              <button onClick={handleCreateFeature} className="px-3 py-1.5 bg-white hover:bg-[#e5e5e5] text-black rounded-md text-[13px] font-medium transition">Suggest Feature</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
