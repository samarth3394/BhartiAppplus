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
  { id: "planned", title: "Planned Ideas", icon: Lightbulb, color: "text-zinc-400" },
  { id: "in_progress", title: "In Progress", icon: Clock, color: "text-white" },
  { id: "completed", title: "Launched", icon: Rocket, color: "text-zinc-500" },
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
      case "urgent": return "bg-white/10 text-white border-white/20";
      case "high": return "bg-white/[0.05] text-zinc-300 border-white/10";
      case "low": return "bg-white/[0.02] text-zinc-500 border-white/5";
      default: return "bg-white/[0.03] text-zinc-400 border-white/10";
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 h-full flex flex-col pb-12">
      {/* Header */}
      <div className="flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-white/10 text-white rounded-xl border border-white/10">
            <Map size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white mb-1">Product Roadmap</h1>
            <p className="text-zinc-400">Plan epics, track major features, and share vision.</p>
          </div>
        </div>
        {canEdit && (
          <button 
            onClick={() => setShowFeatureModal(true)}
            className="flex items-center gap-2 bg-white text-black px-5 py-2.5 rounded-xl font-medium hover:bg-zinc-200 transition shadow-[0_0_15px_rgba(255,255,255,0.1)]"
          >
            <Plus size={18} />
            Suggest Feature
          </button>
        )}
      </div>

      <div className="flex-1 grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        {STATUS_COLS.map((col) => {
          const colFeatures = features.filter((f) => f.status === col.id);
          return (
            <div key={col.id} className="bg-white/[0.02] backdrop-blur-2xl border border-white/5 p-6 rounded-2xl flex flex-col max-h-full">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white flex items-center gap-2 tracking-tight">
                  <col.icon size={20} className={col.color} /> {col.title}
                </h2>
                <span className="bg-white/10 text-white text-xs px-2.5 py-1 rounded-full font-medium">
                  {colFeatures.length}
                </span>
              </div>
              
              <div className="space-y-4 overflow-y-auto custom-scrollbar pr-2 pb-4">
                {colFeatures.length === 0 ? (
                  <div className="text-center py-8 text-zinc-600 border border-dashed border-white/10 rounded-xl font-light">
                    No features in this phase.
                  </div>
                ) : (
                  colFeatures.map((feature) => (
                    <div key={feature.id} className="p-5 bg-white/[0.02] border border-white/5 hover:border-white/10 rounded-xl transition-all hover:bg-white/[0.04] group relative">
                      <div className="flex items-start justify-between mb-3">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${getPriorityColor(feature.priority)}`}>
                          {feature.priority} Priority
                        </span>
                        
                        {/* Quick actions on hover */}
                        <div className="opacity-0 group-hover:opacity-100 transition flex gap-1 bg-black/80 rounded-lg backdrop-blur-md p-1 border border-white/10 absolute right-4 top-4">
                          {col.id !== "planned" && (
                            <button onClick={() => updateStatus(feature.id, "planned")} className="p-1.5 text-zinc-400 hover:text-white rounded-md hover:bg-white/10" title="Move to Planned">
                              <Lightbulb size={14} />
                            </button>
                          )}
                          {col.id !== "in_progress" && (
                            <button onClick={() => updateStatus(feature.id, "in_progress")} className="p-1.5 text-zinc-400 hover:text-white rounded-md hover:bg-white/10" title="Move to In Progress">
                              <Clock size={14} />
                            </button>
                          )}
                          {col.id !== "completed" && (
                            <button onClick={() => updateStatus(feature.id, "completed")} className="p-1.5 text-zinc-400 hover:text-white rounded-md hover:bg-white/10" title="Mark Completed">
                              <CheckCircle2 size={14} />
                            </button>
                          )}
                        </div>
                      </div>
                      
                      <h3 className="font-semibold text-white mb-2 text-lg">{feature.title}</h3>
                      <p className="text-sm text-zinc-400 line-clamp-3">{feature.description || "No description provided."}</p>
                      
                      {feature.due_date && (
                        <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-zinc-500">
                          <span className="flex items-center gap-1">
                            <Target size={14} /> Due: {new Date(feature.due_date).toLocaleDateString()}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-zinc-950 border border-white/10 rounded-2xl w-full max-w-lg p-6 shadow-2xl">
            <h2 className="text-xl font-bold text-white mb-6 tracking-tight">Suggest Roadmap Feature</h2>
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1 ml-1">Title</label>
                <input 
                  type="text" 
                  placeholder="Feature title"
                  value={newFeature.title}
                  onChange={e => setNewFeature({...newFeature, title: e.target.value})}
                  className="w-full bg-white/[0.02] border border-white/10 text-white rounded-xl py-2 px-3 outline-none focus:border-white/30 font-light"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1 ml-1">Description</label>
                <textarea 
                  rows={3}
                  placeholder="Details..."
                  value={newFeature.description}
                  onChange={e => setNewFeature({...newFeature, description: e.target.value})}
                  className="w-full bg-white/[0.02] border border-white/10 text-white rounded-xl py-2 px-3 outline-none focus:border-white/30 font-light"
                />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-zinc-400 mb-1 ml-1">Status</label>
                  <select 
                    value={newFeature.status}
                    onChange={e => setNewFeature({...newFeature, status: e.target.value})}
                    className="w-full bg-white/[0.02] border border-white/10 text-white rounded-xl py-2 px-3 outline-none focus:border-white/30 font-light"
                  >
                    <option value="planned">Planned Ideas</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Launched</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-zinc-400 mb-1 ml-1">Priority</label>
                  <select 
                    value={newFeature.priority}
                    onChange={e => setNewFeature({...newFeature, priority: e.target.value})}
                    className="w-full bg-white/[0.02] border border-white/10 text-white rounded-xl py-2 px-3 outline-none focus:border-white/30 font-light"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowFeatureModal(false)} className="px-4 py-2 text-zinc-400 hover:text-white transition font-medium">Cancel</button>
              <button onClick={handleCreateFeature} className="px-5 py-2 bg-white hover:bg-zinc-200 text-black rounded-xl font-medium transition shadow-lg shadow-white/10">Suggest Feature</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
