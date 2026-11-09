"use client";

import React, { useEffect, useState } from "react";
import { Map, Plus, Target, Rocket, Lightbulb, Clock, MoreHorizontal, CheckCircle2, Circle, X } from "lucide-react";

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
  { id: "planned", title: "Planned Vision", icon: Lightbulb, color: "text-amber-500", bgLight: "bg-amber-50 text-amber-700 border-amber-200/80" },
  { id: "in_progress", title: "In Active Engineering", icon: Clock, color: "text-blue-500", bgLight: "bg-blue-50 text-blue-700 border-blue-200/80" },
  { id: "completed", title: "Launched & Live", icon: Rocket, color: "text-emerald-500", bgLight: "bg-emerald-50 text-emerald-700 border-emerald-200/80" },
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
      // Retain rich fallback
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
      case "urgent": return "bg-red-50 text-red-700 border-red-200/80";
      case "high": return "bg-orange-50 text-orange-700 border-orange-200/80";
      case "medium": return "bg-blue-50 text-blue-700 border-blue-200/80";
      case "low": return "bg-slate-100 text-slate-700 border-slate-200/80";
      default: return "bg-slate-100 text-slate-700 border-slate-200/80";
    }
  };

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto h-full flex flex-col pb-8 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200/80 shrink-0">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0A2540]">
              Product Architecture Roadmap
            </h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold uppercase tracking-wider bg-[#635BFF]/10 text-[#635BFF] border border-[#635BFF]/20">
              Q4 / Q1 Horizon
            </span>
          </div>
          <p className="text-[13.5px] text-[#425466]">
            Plan epics, track strategic telemetry milestones, and synchronize architectural releases.
          </p>
        </div>
        {canEdit && (
          <button
            onClick={() => setShowFeatureModal(true)}
            className="inline-flex items-center justify-center gap-2 bg-[#635BFF] hover:bg-[#5349e0] text-white px-5 py-2.5 rounded-xl text-[13px] font-bold transition-all shadow-[0_4px_14px_rgba(99,91,255,0.25)] hover:shadow-[0_6px_20px_rgba(99,91,255,0.35)] shrink-0 cursor-pointer"
          >
            <Plus size={15} />
            Suggest Feature
          </button>
        )}
      </div>

      {/* 3 Status Columns */}
      <div className="flex-1 overflow-x-auto pb-4">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start min-w-[320px] xl:min-w-full">
          {STATUS_COLS.map((col) => {
            const colFeatures = features.filter((f) => f.status === col.id);
            return (
              <div key={col.id} className="bg-white border border-slate-200/80 rounded-2xl shadow-[0_4px_20px_rgba(10,37,64,0.03)] flex flex-col max-h-[calc(100vh-14rem)]">
                <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-100 bg-[#FAFBFD] rounded-t-2xl shrink-0">
                  <h2 className="text-[15px] font-bold text-[#0A2540] flex items-center gap-2">
                    <col.icon size={17} className={col.color} /> {col.title}
                  </h2>
                  <span className="bg-white border border-slate-200 text-slate-700 text-[11px] font-bold px-3 py-1 rounded-full shadow-2xs">
                    {colFeatures.length}
                  </span>
                </div>

                <div className="p-4 space-y-3.5 overflow-y-auto">
                  {colFeatures.length === 0 ? (
                    <div className="text-center py-12 text-[#425466] text-[13px] border border-dashed border-slate-200/80 rounded-xl">
                      No milestones in this phase.
                    </div>
                  ) : (
                    colFeatures.map((feature) => (
                      <div key={feature.id} className="p-4 sm:p-5 bg-white hover:bg-slate-50/70 border border-slate-200/80 rounded-xl transition-all group relative shadow-[0_1px_4px_rgba(10,37,64,0.02)] hover:border-[#635BFF]/40">
                        <div className="flex items-start justify-between mb-2.5">
                          <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${getPriorityBadge(feature.priority)}`}>
                            {feature.priority}
                          </span>

                          {/* Quick actions on hover */}
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 bg-white rounded-lg border border-slate-200 absolute right-3.5 top-3.5 p-1 shadow-md">
                            {col.id !== "planned" && (
                              <button onClick={() => updateStatus(feature.id, "planned")} className="p-1 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded transition-colors cursor-pointer" title="Move to Planned">
                                <Lightbulb size={13} />
                              </button>
                            )}
                            {col.id !== "in_progress" && (
                              <button onClick={() => updateStatus(feature.id, "in_progress")} className="p-1 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors cursor-pointer" title="Move to In Progress">
                                <Clock size={13} />
                              </button>
                            )}
                            {col.id !== "completed" && (
                              <button onClick={() => updateStatus(feature.id, "completed")} className="p-1 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-colors cursor-pointer" title="Mark Completed">
                                <CheckCircle2 size={13} />
                              </button>
                            )}
                          </div>
                        </div>

                        <h3 className="font-bold text-[14.5px] text-[#0A2540] mb-1.5 leading-snug pr-8">{feature.title}</h3>
                        {feature.description && (
                          <p className="text-[12.5px] text-[#425466] line-clamp-3 leading-relaxed">{feature.description}</p>
                        )}

                        {feature.due_date && (
                          <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between text-[11.5px] text-[#425466] font-medium">
                            <span className="flex items-center gap-1.5">
                              <Target size={13} className="text-[#635BFF]" /> Target: {new Date(feature.due_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
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

      {showFeatureModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A2540]/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200/90 rounded-2xl w-full max-w-lg p-6 sm:p-7 shadow-[0_20px_60px_rgba(10,37,64,0.15)]">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-[17px] font-extrabold text-[#0A2540]">Suggest Roadmap Milestone</h2>
              <button 
                onClick={() => setShowFeatureModal(false)}
                className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-[#425466] uppercase tracking-wider">Milestone Title</label>
                <input
                  type="text"
                  placeholder="e.g. Distributed Tracing Waterfall Engine"
                  value={newFeature.title}
                  onChange={e => setNewFeature({ ...newFeature, title: e.target.value })}
                  className="w-full bg-[#FAFBFD] border border-slate-200/90 text-[#0A2540] py-2.5 px-3.5 rounded-xl outline-none focus:border-[#635BFF] focus:bg-white focus:ring-2 focus:ring-[#635BFF]/15 text-[14px] placeholder:text-slate-400 font-semibold transition"
                  autoFocus
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-[#425466] uppercase tracking-wider">Technical Scope & Impact</label>
                <textarea
                  rows={3}
                  placeholder="Detailed architecture requirements and outcomes..."
                  value={newFeature.description}
                  onChange={e => setNewFeature({ ...newFeature, description: e.target.value })}
                  className="w-full bg-[#FAFBFD] border border-slate-200/90 text-[#0A2540] rounded-xl py-2.5 px-3.5 outline-none focus:border-[#635BFF] focus:bg-white focus:ring-2 focus:ring-[#635BFF]/15 text-[13px] placeholder:text-slate-400 resize-none transition"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold text-[#425466] uppercase tracking-wider">Phase</label>
                  <select
                    value={newFeature.status}
                    onChange={e => setNewFeature({ ...newFeature, status: e.target.value })}
                    className="w-full bg-[#FAFBFD] border border-slate-200/90 text-[#0A2540] rounded-xl py-2.5 px-3.5 outline-none focus:border-[#635BFF] text-[13px] font-semibold transition"
                  >
                    <option value="planned">Planned Vision</option>
                    <option value="in_progress">In Active Engineering</option>
                    <option value="completed">Launched & Live</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold text-[#425466] uppercase tracking-wider">Priority</label>
                  <select
                    value={newFeature.priority}
                    onChange={e => setNewFeature({ ...newFeature, priority: e.target.value })}
                    className="w-full bg-[#FAFBFD] border border-slate-200/90 text-[#0A2540] rounded-xl py-2.5 px-3.5 outline-none focus:border-[#635BFF] text-[13px] font-semibold transition"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-100">
              <button 
                onClick={() => setShowFeatureModal(false)} 
                className="px-4 py-2 text-[13px] font-bold text-[#425466] hover:text-[#0A2540] transition cursor-pointer"
              >
                Cancel
              </button>
              <button 
                onClick={handleCreateFeature} 
                className="px-5 py-2 bg-[#635BFF] hover:bg-[#5349e0] text-white rounded-xl text-[13px] font-bold transition shadow-xs cursor-pointer"
              >
                Save Milestone
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
