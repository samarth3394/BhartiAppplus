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
  { id: "planned", title: "Planned Ideas", icon: Lightbulb, color: "text-amber-500", bgLight: "bg-amber-50 text-amber-700 border-amber-200" },
  { id: "in_progress", title: "In Progress", icon: Clock, color: "text-blue-500", bgLight: "bg-blue-50 text-blue-700 border-blue-200" },
  { id: "completed", title: "Launched", icon: Rocket, color: "text-emerald-500", bgLight: "bg-emerald-50 text-emerald-700 border-emerald-200" },
];

const DEFAULT_ROADMAP_FEATURES: RoadmapFeature[] = [
  {
    id: "rf-1",
    title: "Multi-Cloud Synthetic Latency Probes",
    description: "Deploy automated global ping probes across AWS, GCP, and Cloudflare edge locations with sub-second degradation alerts.",
    status: "planned",
    priority: "high",
    start_date: null,
    due_date: "2026-12-15"
  },
  {
    id: "rf-2",
    title: "AI-driven Auto Root-Cause Analysis",
    description: "Correlate error traces with recent git commit authors, PRs, and infra changes to diagnose incidents in seconds.",
    status: "planned",
    priority: "urgent",
    start_date: null,
    due_date: "2026-12-28"
  },
  {
    id: "rf-3",
    title: "Custom Grafana & OpenTelemetry Bridge",
    description: "Direct bi-directional streaming of metrics, spans, and traces to external enterprise observability stacks.",
    status: "planned",
    priority: "medium",
    start_date: null,
    due_date: "2027-01-20"
  },
  {
    id: "rf-4",
    title: "Real-Time Distributed Trace Fabric",
    description: "End-to-end distributed span propagation for microservices with interactive flamegraphs and waterfall visualizers.",
    status: "in_progress",
    priority: "urgent",
    start_date: "2026-11-01",
    due_date: "2026-11-20"
  },
  {
    id: "rf-5",
    title: "Automated Incident Escalation Policies",
    description: "Smart paging workflows integrating Slack, PagerDuty, WhatsApp, and SMS alerts with acknowledgement timeout fallbacks.",
    status: "in_progress",
    priority: "high",
    start_date: "2026-11-05",
    due_date: "2026-11-25"
  },
  {
    id: "rf-6",
    title: "PostgreSQL Connection Pool Optimizer",
    description: "Dynamic max client connection throttling during traffic surges to prevent database saturation and connection refusal.",
    status: "in_progress",
    priority: "medium",
    start_date: "2026-11-03",
    due_date: "2026-11-30"
  },
  {
    id: "rf-7",
    title: "Enterprise Multi-Workspace Isolation",
    description: "Role-based access control (RBAC) with granular admin, developer, and viewer permissions across private workspaces.",
    status: "completed",
    priority: "high",
    start_date: "2026-10-01",
    due_date: "2026-10-25"
  },
  {
    id: "rf-8",
    title: "Live SRE Bot Autonomous Remediation",
    description: "Instant container auto-restart and cache purging triggers when critical memory or CPU thresholds are crossed.",
    status: "completed",
    priority: "urgent",
    start_date: "2026-10-10",
    due_date: "2026-11-02"
  },
  {
    id: "rf-9",
    title: "Sub-Millisecond Health Check Engine",
    description: "Synthetic TCP, HTTP, and gRPC ping monitors with zero false-positives and multi-datacenter validation.",
    status: "completed",
    priority: "medium",
    start_date: "2026-10-15",
    due_date: "2026-11-05"
  }
];

export default function RoadmapPage() {
  const [features, setFeatures] = useState<RoadmapFeature[]>(DEFAULT_ROADMAP_FEATURES);
  const [loading, setLoading] = useState(false);
  const [showFeatureModal, setShowFeatureModal] = useState(false);
  const [newFeature, setNewFeature] = useState({ title: '', description: '', status: 'planned', priority: 'medium' });
  const [userRole, setUserRole] = useState<string>("admin");

  const fetchFeatures = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/roadmap", { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        if (data.features && data.features.length > 0) {
          setFeatures(data.features);
        } else {
          setFeatures(DEFAULT_ROADMAP_FEATURES);
        }
        if (data.user_role) setUserRole(data.user_role);
      }
    } catch (err) {
      // Keep rich default roadmap
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeatures();
  }, []);

  const canEdit = ["admin", "project_manager", "developer"].includes(userRole);

  const handleCreateFeature = async () => {
    if (!newFeature.title.trim()) return;
    const created: RoadmapFeature = {
      id: "rf-" + Date.now(),
      title: newFeature.title,
      description: newFeature.description,
      status: newFeature.status,
      priority: newFeature.priority,
      start_date: new Date().toISOString().split("T")[0],
      due_date: "2026-12-31"
    };

    setFeatures(prev => [created, ...prev]);
    setShowFeatureModal(false);
    setNewFeature({ title: '', description: '', status: 'planned', priority: 'medium' });

    try {
      await fetch("http://localhost:5000/api/roadmap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(newFeature)
      });
    } catch (err) {
      // Local state is already updated
    }
  };

  const updateStatus = async (id: string, status: string) => {
    setFeatures(prev => prev.map(f => f.id === id ? { ...f, status } : f));
    try {
      await fetch(`http://localhost:5000/api/roadmap/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status })
      });
    } catch (err) {
      // Local state is already updated
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "urgent": return "bg-red-50 text-red-700 border-red-200";
      case "high": return "bg-orange-50 text-orange-700 border-orange-200";
      case "medium": return "bg-blue-50 text-blue-700 border-blue-200";
      case "low": return "bg-slate-100 text-slate-700 border-slate-200";
      default: return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto h-full flex flex-col pb-8 font-sans">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 shrink-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#0F172A] mb-1">Product Roadmap</h1>
          <p className="text-[13.5px] text-slate-600">Plan epics, track major architecture features, and synchronize sprint vision.</p>
        </div>
        {canEdit && (
          <button 
            onClick={() => setShowFeatureModal(true)}
            className="flex items-center gap-1.5 bg-[#0F172A] hover:bg-slate-800 text-white px-3.5 py-2 rounded-lg text-[13px] font-semibold transition-all shadow-xs"
          >
            <Plus size={15} />
            Suggest Feature
          </button>
        )}
      </div>

      {/* 3 Status Columns */}
      <div className="flex-1 grid grid-cols-1 xl:grid-cols-3 gap-5 items-start">
        {STATUS_COLS.map((col) => {
          const colFeatures = features.filter((f) => f.status === col.id);
          return (
            <div key={col.id} className="bg-white border border-slate-200 rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col max-h-[calc(100vh-12rem)]">
              <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50/70 rounded-t-xl shrink-0">
                <h2 className="text-[14px] font-bold text-[#0F172A] flex items-center gap-2">
                  <col.icon size={16} className={col.color} /> {col.title}
                </h2>
                <span className="bg-white border border-slate-200 text-slate-700 text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-xs">
                  {colFeatures.length}
                </span>
              </div>
              
              <div className="p-3 space-y-3 overflow-y-auto">
                {colFeatures.length === 0 ? (
                  <div className="text-center py-10 text-slate-400 text-[13px] border border-dashed border-slate-200 rounded-lg">
                    No features in this phase.
                  </div>
                ) : (
                  colFeatures.map((feature) => (
                    <div key={feature.id} className="p-4 bg-white hover:bg-slate-50/80 border border-slate-200 rounded-lg transition-all group relative shadow-xs hover:border-slate-300">
                      <div className="flex items-start justify-between mb-2">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getPriorityBadge(feature.priority)}`}>
                          {feature.priority}
                        </span>
                        
                        {/* Quick actions on hover */}
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 bg-white rounded-lg border border-slate-200 absolute right-3 top-3 p-1 shadow-md">
                          {col.id !== "planned" && (
                            <button onClick={() => updateStatus(feature.id, "planned")} className="p-1 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded transition-colors" title="Move to Planned">
                              <Lightbulb size={13} />
                            </button>
                          )}
                          {col.id !== "in_progress" && (
                            <button onClick={() => updateStatus(feature.id, "in_progress")} className="p-1 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors" title="Move to In Progress">
                              <Clock size={13} />
                            </button>
                          )}
                          {col.id !== "completed" && (
                            <button onClick={() => updateStatus(feature.id, "completed")} className="p-1 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-colors" title="Mark Completed">
                              <CheckCircle2 size={13} />
                            </button>
                          )}
                        </div>
                      </div>
                      
                      <h3 className="font-bold text-[14px] text-[#0F172A] mb-1.5 leading-snug pr-8">{feature.title}</h3>
                      {feature.description && (
                        <p className="text-[12.5px] text-slate-600 line-clamp-3 leading-relaxed">{feature.description}</p>
                      )}
                      
                      {feature.due_date && (
                        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-medium">
                          <span className="flex items-center gap-1.5">
                            <Target size={12} className="text-slate-400" /> Target: {new Date(feature.due_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white border border-slate-200 rounded-xl w-full max-w-lg p-6 shadow-2xl">
            <h2 className="text-[16px] font-bold text-[#0F172A] mb-4">Suggest Roadmap Feature</h2>
            <div className="space-y-4 mb-6">
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">Title</label>
                <input 
                  type="text" 
                  placeholder="e.g. Distributed Tracing Visualizer"
                  value={newFeature.title}
                  onChange={e => setNewFeature({...newFeature, title: e.target.value})}
                  className="w-full bg-white border border-slate-200 text-[#0F172A] py-2 px-3 rounded-lg outline-none focus:border-[#635BFF] text-[14px] placeholder:text-slate-400 font-medium transition-colors"
                  autoFocus
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">Description</label>
                <textarea 
                  rows={3}
                  placeholder="Feature requirements and impact..."
                  value={newFeature.description}
                  onChange={e => setNewFeature({...newFeature, description: e.target.value})}
                  className="w-full bg-white border border-slate-200 text-[#0F172A] rounded-lg py-2 px-3 outline-none focus:border-[#635BFF] text-[13px] placeholder:text-slate-400 resize-none transition-colors"
                />
              </div>
              <div className="flex gap-4">
                <div className="flex-1 space-y-1.5">
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">Status</label>
                  <select 
                    value={newFeature.status}
                    onChange={e => setNewFeature({...newFeature, status: e.target.value})}
                    className="w-full bg-white border border-slate-200 text-[#0F172A] rounded-lg py-2 px-3 outline-none focus:border-[#635BFF] text-[13px] transition-colors"
                  >
                    <option value="planned">Planned Ideas</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Launched</option>
                  </select>
                </div>
                <div className="flex-1 space-y-1.5">
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">Priority</label>
                  <select 
                    value={newFeature.priority}
                    onChange={e => setNewFeature({...newFeature, priority: e.target.value})}
                    className="w-full bg-white border border-slate-200 text-[#0F172A] rounded-lg py-2 px-3 outline-none focus:border-[#635BFF] text-[13px] transition-colors"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button onClick={() => setShowFeatureModal(false)} className="px-3 py-1.5 text-[13px] font-medium text-slate-600 hover:text-slate-900 transition">Cancel</button>
              <button onClick={handleCreateFeature} className="px-4 py-1.5 bg-[#0F172A] hover:bg-slate-800 text-white rounded-lg text-[13px] font-semibold transition">Save Feature</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
