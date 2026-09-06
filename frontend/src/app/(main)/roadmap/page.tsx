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
  { id: "planned", title: "Planned Ideas", icon: Lightbulb, color: "text-blue-400" },
  { id: "in_progress", title: "In Progress", icon: Clock, color: "text-orange-400" },
  { id: "completed", title: "Launched", icon: Rocket, color: "text-emerald-400" },
];

export default function RoadmapPage() {
  const [features, setFeatures] = useState<RoadmapFeature[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFeatures = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/roadmap", { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setFeatures(data.features || []);
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

  const createPlaceholderFeature = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/roadmap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          title: "New Epic Feature",
          description: "Describe what this feature will accomplish.",
          status: "planned",
          priority: "high"
        })
      });
      if (res.ok) fetchFeatures();
    } catch (err) {
      console.error(err);
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
      case "low": return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      default: return "bg-zinc-500/10 text-zinc-400 border-zinc-500/20";
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 h-full flex flex-col pb-12">
      {/* Header */}
      <div className="flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-purple-500/20 text-purple-400 rounded-xl border border-purple-500/30">
            <Map size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white mb-1">Product Roadmap</h1>
            <p className="text-zinc-400">Plan epics, track major features, and share vision.</p>
          </div>
        </div>
        <button 
          onClick={createPlaceholderFeature}
          className="flex items-center gap-2 bg-purple-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-purple-500 transition shadow-[0_0_20px_rgba(168,85,247,0.3)]"
        >
          <Plus size={18} />
          New Feature
        </button>
      </div>

      <div className="flex-1 grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        {STATUS_COLS.map((col) => {
          const colFeatures = features.filter((f) => f.status === col.id);
          return (
            <div key={col.id} className="bg-zinc-900/40 backdrop-blur-xl border border-white/10 p-6 rounded-2xl flex flex-col max-h-full">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <col.icon size={20} className={col.color} /> {col.title}
                </h2>
                <span className="bg-white/10 text-zinc-300 text-xs px-2.5 py-1 rounded-full font-medium">
                  {colFeatures.length}
                </span>
              </div>
              
              <div className="space-y-4 overflow-y-auto custom-scrollbar pr-2 pb-4">
                {colFeatures.length === 0 ? (
                  <div className="text-center py-8 text-zinc-600 border border-dashed border-white/5 rounded-xl">
                    No features in this phase.
                  </div>
                ) : (
                  colFeatures.map((feature) => (
                    <div key={feature.id} className="p-5 bg-black/40 border border-white/5 hover:border-white/10 rounded-xl transition-all hover:bg-white/[0.02] group relative">
                      <div className="flex items-start justify-between mb-3">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${getPriorityColor(feature.priority)}`}>
                          {feature.priority} Priority
                        </span>
                        
                        {/* Quick actions on hover */}
                        <div className="opacity-0 group-hover:opacity-100 transition flex gap-1 bg-black/80 rounded-lg backdrop-blur-sm p-1 border border-white/10 absolute right-4 top-4">
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
                            <button onClick={() => updateStatus(feature.id, "completed")} className="p-1.5 text-zinc-400 hover:text-emerald-400 rounded-md hover:bg-white/10" title="Mark Completed">
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
    </div>
  );
}
