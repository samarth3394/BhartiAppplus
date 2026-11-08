"use client";

import React, { useEffect, useState } from "react";
import { Plus, MoreHorizontal, Layout, CheckCircle2, Circle, Clock, MessageSquare, AlertCircle, Filter, Settings, X, Tag } from "lucide-react";

type Issue = {
  id: string;
  title: string;
  description: string;
  type: string;
  status: string;
  priority: string;
  assignee: any;
  created_at: string;
  parent_id?: string;
  labels?: string[];
};

type ColumnDef = {
  id: string;
  title: string;
  icon: any;
  color: string;
};

const DEFAULT_COLUMNS: ColumnDef[] = [
  { id: "todo", title: "To Do", icon: Circle, color: "text-slate-400" },
  { id: "in_progress", title: "In Progress", icon: Clock, color: "text-blue-500" },
  { id: "review", title: "Review", icon: AlertCircle, color: "text-purple-500" },
  { id: "done", title: "Done", icon: CheckCircle2, color: "text-emerald-500" },
];

const DEFAULT_KANBAN_ISSUES: Issue[] = [
  {
    id: "kb-1",
    title: "Distributed trace waterfall visualizer UI",
    description: "Build high-speed interactive flamegraph rendering 10k spans in <50ms.",
    type: "feature",
    status: "todo",
    priority: "high",
    assignee: { 
      full_name: "Samarth Choudhar",
      avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
    },
    created_at: "2026-11-06",
    labels: ["tracing", "frontend"]
  },
  {
    id: "kb-2",
    title: "Audit IAM token lifetimes for internal service mesh",
    description: "Rotate edge certs and enforce 15-minute expiration on internal JWTs.",
    type: "task",
    status: "todo",
    priority: "medium",
    assignee: { 
      full_name: "Neha Sharma",
      avatar_url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"
    },
    created_at: "2026-11-07",
    labels: ["security", "mesh"]
  },
  {
    id: "kb-3",
    title: "Fix connection pool exhaustion during flash traffic",
    description: "Implement exponential backoff retry and circuit-breaker on primary Postgres pool.",
    type: "bug",
    status: "in_progress",
    priority: "high",
    assignee: { 
      full_name: "Rohan Patil",
      avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
    },
    created_at: "2026-11-08",
    labels: ["p1", "database"]
  },
  {
    id: "kb-4",
    title: "Synthetic health probe alert webhooks",
    description: "Real-time dispatch to Discord, Slack, and PagerDuty with rich incident cards.",
    type: "feature",
    status: "in_progress",
    priority: "medium",
    assignee: { 
      full_name: "Vikram Desai",
      avatar_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80"
    },
    created_at: "2026-11-07",
    labels: ["alerts", "sre"]
  },
  {
    id: "kb-5",
    title: "Kafka telemetry ingestion consumer autoscaling",
    description: "HPA scaling based on consumer lag metric instead of plain CPU utilization.",
    type: "feature",
    status: "review",
    priority: "high",
    assignee: { 
      full_name: "Ananya Iyer",
      avatar_url: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80"
    },
    created_at: "2026-11-05",
    labels: ["streaming", "infra"]
  },
  {
    id: "kb-6",
    title: "Update API documentation for v2.4.1 public endpoints",
    description: "Export OpenAPI 3.1 specification and auto-generate client SDK snippets.",
    type: "task",
    status: "review",
    priority: "low",
    assignee: { 
      full_name: "Sarah Jenkins",
      avatar_url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80"
    },
    created_at: "2026-11-06",
    labels: ["docs"]
  },
  {
    id: "kb-7",
    title: "Zero-downtime PostgreSQL schema migration",
    description: "Executed table partitions and non-blocking index additions in production.",
    type: "epic",
    status: "done",
    priority: "urgent",
    assignee: { 
      full_name: "Samarth Choudhar",
      avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
    },
    created_at: "2026-11-02",
    labels: ["infra", "completed"]
  },
  {
    id: "kb-8",
    title: "Resolve high memory usage in WebSocket telemetry daemon",
    description: "Fixed circular buffer reference leak and improved GC recycling throughput.",
    type: "bug",
    status: "done",
    priority: "high",
    assignee: { 
      full_name: "Rohan Patil",
      avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
    },
    created_at: "2026-11-04",
    labels: ["performance", "fixed"]
  }
];

export default function KanbanPage() {
  const [issues, setIssues] = useState<Issue[]>(DEFAULT_KANBAN_ISSUES);
  const [columns, setColumns] = useState<ColumnDef[]>(DEFAULT_COLUMNS);
  const [loading, setLoading] = useState(false);
  const [draggedIssueId, setDraggedIssueId] = useState<string | null>(null);
  
  // Modals & Forms
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showColumnModal, setShowColumnModal] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '', type: 'task', priority: 'medium', parent_id: '', labels: '' });
  const [newColumnTitle, setNewColumnTitle] = useState("");
  
  // Filters
  const [filters, setFilters] = useState({ priority: "", assignee: "", label: "" });

  const fetchIssues = async () => {
    try {
      const query = new URLSearchParams();
      if (filters.priority) query.append("priority", filters.priority);
      if (filters.assignee) query.append("assignee_id", filters.assignee);
      if (filters.label) query.append("label", filters.label);

      const res = await fetch(`http://localhost:5000/api/kanban/issues?${query.toString()}`, {
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        if (data.issues && data.issues.length > 0) {
          setIssues(data.issues);
        }
      }
    } catch (err) {
      // Keep rich default state
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, [filters]);

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedIssueId(id);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = async (e: React.DragEvent, status: string) => {
    e.preventDefault();
    if (!draggedIssueId) return;

    setIssues((prev) =>
      prev.map((i) => (i.id === draggedIssueId ? { ...i, status } : i))
    );

    try {
      await fetch(`http://localhost:5000/api/kanban/issues/${draggedIssueId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status }),
      });
    } catch (err) {
      // Local state is already updated
    }
    setDraggedIssueId(null);
  };

  const handleCreateTask = async () => {
    if (!newTask.title.trim()) return;
    
    const created: Issue = {
      id: "kb-" + Date.now(),
      title: newTask.title,
      description: newTask.description,
      type: newTask.type,
      status: "todo",
      priority: newTask.priority,
      assignee: { full_name: "Samarth Choudhar" },
      created_at: new Date().toISOString().split("T")[0],
      labels: newTask.labels ? newTask.labels.split(',').map(l => l.trim()) : ["general"]
    };

    setIssues(prev => [created, ...prev]);
    setShowTaskModal(false);
    setNewTask({ title: '', description: '', type: 'task', priority: 'medium', parent_id: '', labels: '' });

    try {
      await fetch("http://localhost:5000/api/kanban/issues", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          ...newTask,
          labels: newTask.labels ? newTask.labels.split(',').map(l => l.trim()) : [],
          parent_id: newTask.parent_id || null
        })
      });
    } catch (err) {
      // Local state is already updated
    }
  };

  const handleAddColumn = () => {
    if (!newColumnTitle.trim()) return;
    const newColId = newColumnTitle.toLowerCase().replace(/\s+/g, '_');
    setColumns([...columns, { id: newColId, title: newColumnTitle, icon: Circle, color: "text-slate-400" }]);
    setShowColumnModal(false);
    setNewColumnTitle("");
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "urgent": return "text-red-700 bg-red-50 border-red-200";
      case "high": return "text-orange-700 bg-orange-50 border-orange-200";
      case "medium": return "text-blue-700 bg-blue-50 border-blue-200";
      case "low": return "text-slate-700 bg-slate-100 border-slate-200";
      default: return "text-slate-700 bg-slate-100 border-slate-200";
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "bug": return "text-rose-600 bg-rose-50 border-rose-200";
      case "epic": return "text-purple-600 bg-purple-50 border-purple-200";
      case "feature": return "text-emerald-600 bg-emerald-50 border-emerald-200";
      default: return "text-slate-600 bg-slate-50 border-slate-200";
    }
  };

  return (
    <div className="space-y-6 max-w-[1440px] mx-auto h-full flex flex-col pb-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#0F172A] mb-1">Engineering Kanban Board</h1>
          <p className="text-[13.5px] text-slate-600">Track sprint issues, infrastructure tasks, and distributed releases across teams.</p>
        </div>
        <div className="flex items-center gap-2.5">
          <button 
            onClick={() => setShowColumnModal(true)} 
            className="flex items-center gap-1.5 bg-white border border-slate-200 text-[#0F172A] px-3.5 py-2 rounded-lg text-[13px] font-semibold hover:bg-slate-50 transition shadow-xs"
          >
            <Settings size={14} className="text-slate-500" />
            Add Column
          </button>
          <button 
            onClick={() => setShowTaskModal(true)} 
            className="flex items-center gap-1.5 bg-[#0F172A] hover:bg-slate-800 text-white px-3.5 py-2 rounded-lg text-[13px] font-semibold transition shadow-xs"
          >
            <Plus size={15} />
            New Issue
          </button>
        </div>
      </div>

      {/* Kanban Columns */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 items-start">
        {columns.map((col) => {
          const colIssues = issues.filter((i) => i.status === col.id);
          const ColIcon = col.icon;
          return (
            <div 
              key={col.id} 
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, col.id)}
              className="bg-white border border-slate-200 rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col max-h-[calc(100vh-13rem)]"
            >
              <div className="flex items-center justify-between p-3.5 border-b border-slate-100 bg-slate-50/70 rounded-t-xl shrink-0">
                <h2 className="text-[14px] font-bold text-[#0F172A] flex items-center gap-2">
                  <ColIcon size={16} className={col.color} /> {col.title}
                </h2>
                <span className="bg-white border border-slate-200 text-slate-700 text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-xs">
                  {colIssues.length}
                </span>
              </div>

              <div className="p-3 space-y-3 overflow-y-auto">
                {colIssues.length === 0 ? (
                  <div className="text-center py-10 text-slate-400 text-[12.5px] border border-dashed border-slate-200 rounded-lg">
                    Drag issues here
                  </div>
                ) : (
                  colIssues.map((issue) => (
                    <div 
                      key={issue.id} 
                      draggable 
                      onDragStart={(e) => handleDragStart(e, issue.id)}
                      className="p-3.5 bg-white hover:bg-slate-50/90 border border-slate-200 rounded-lg transition-all cursor-grab active:cursor-grabbing shadow-xs hover:border-slate-300 group"
                    >
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getTypeBadge(issue.type)}`}>
                          {issue.type}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getPriorityBadge(issue.priority)}`}>
                          {issue.priority}
                        </span>
                      </div>

                      <h3 className="font-bold text-[13.5px] text-[#0F172A] leading-snug mb-1">
                        {issue.title}
                      </h3>

                      {issue.description && (
                        <p className="text-[12px] text-slate-600 line-clamp-2 leading-relaxed mb-3">
                          {issue.description}
                        </p>
                      )}

                      {/* Labels and Assignee */}
                      <div className="flex items-center justify-between pt-2 border-t border-slate-100 mt-2 text-[11px]">
                        <div className="flex items-center gap-1 flex-wrap">
                          {issue.labels?.map((label, idx) => (
                            <span key={idx} className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded text-[10px] font-mono">
                              #{label}
                            </span>
                          ))}
                        </div>
                        {issue.assignee?.avatar_url ? (
                          <img 
                            src={issue.assignee.avatar_url} 
                            alt={issue.assignee.full_name} 
                            className="w-6 h-6 rounded-full object-cover border border-slate-200 shadow-xs" 
                            title={issue.assignee.full_name}
                          />
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-[#0A2540] text-white flex items-center justify-center text-[10px] font-bold shadow-xs">
                            {issue.assignee?.full_name?.charAt(0) || "U"}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* New Task Modal */}
      {showTaskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white border border-slate-200 rounded-xl w-full max-w-lg p-6 shadow-2xl">
            <h2 className="text-[16px] font-bold text-[#0F172A] mb-4">Create New Issue</h2>
            <div className="space-y-4 mb-6">
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">Title</label>
                <input 
                  type="text" 
                  placeholder="Issue title..."
                  value={newTask.title}
                  onChange={e => setNewTask({...newTask, title: e.target.value})}
                  className="w-full bg-white border border-slate-200 text-[#0F172A] py-2 px-3 rounded-lg outline-none focus:border-[#635BFF] text-[14px] placeholder:text-slate-400 font-medium transition-colors"
                  autoFocus
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">Description</label>
                <textarea 
                  rows={3}
                  placeholder="Issue details and reproduction steps..."
                  value={newTask.description}
                  onChange={e => setNewTask({...newTask, description: e.target.value})}
                  className="w-full bg-white border border-slate-200 text-[#0F172A] rounded-lg py-2 px-3 outline-none focus:border-[#635BFF] text-[13px] placeholder:text-slate-400 resize-none transition-colors"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">Type</label>
                  <select 
                    value={newTask.type}
                    onChange={e => setNewTask({...newTask, type: e.target.value})}
                    className="w-full bg-white border border-slate-200 text-[#0F172A] rounded-lg py-2 px-3 outline-none focus:border-[#635BFF] text-[13px] transition-colors"
                  >
                    <option value="task">Task</option>
                    <option value="feature">Feature</option>
                    <option value="bug">Bug</option>
                    <option value="epic">Epic</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">Priority</label>
                  <select 
                    value={newTask.priority}
                    onChange={e => setNewTask({...newTask, priority: e.target.value})}
                    className="w-full bg-white border border-slate-200 text-[#0F172A] rounded-lg py-2 px-3 outline-none focus:border-[#635BFF] text-[13px] transition-colors"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">Labels (comma-separated)</label>
                <input 
                  type="text" 
                  placeholder="e.g. backend, database, p1"
                  value={newTask.labels}
                  onChange={e => setNewTask({...newTask, labels: e.target.value})}
                  className="w-full bg-white border border-slate-200 text-[#0F172A] py-2 px-3 rounded-lg outline-none focus:border-[#635BFF] text-[13px] placeholder:text-slate-400 font-medium transition-colors"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button onClick={() => setShowTaskModal(false)} className="px-3 py-1.5 text-[13px] font-medium text-slate-600 hover:text-slate-900 transition">Cancel</button>
              <button onClick={handleCreateTask} className="px-4 py-1.5 bg-[#0F172A] hover:bg-slate-800 text-white rounded-lg text-[13px] font-semibold transition">Create Issue</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Column Modal */}
      {showColumnModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white border border-slate-200 rounded-xl w-full max-w-sm p-6 shadow-2xl">
            <h2 className="text-[15px] font-bold text-[#0F172A] mb-4">Add Board Column</h2>
            <input 
              type="text" 
              placeholder="Column name (e.g. QA Testing)"
              value={newColumnTitle}
              onChange={e => setNewColumnTitle(e.target.value)}
              className="w-full bg-white border border-slate-200 text-[#0F172A] py-2 px-3 rounded-lg outline-none focus:border-[#635BFF] text-[13.5px] placeholder:text-slate-400 font-medium mb-4"
              autoFocus
            />
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowColumnModal(false)} className="px-3 py-1.5 text-[13px] font-medium text-slate-600 hover:text-slate-900 transition">Cancel</button>
              <button onClick={handleAddColumn} className="px-4 py-1.5 bg-[#0F172A] hover:bg-slate-800 text-white rounded-lg text-[13px] font-semibold transition">Add</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
