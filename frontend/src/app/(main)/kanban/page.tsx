"use client";

import React, { useEffect, useState } from "react";
import { Plus, MoreHorizontal, Layout, CheckCircle2, Circle, Clock, MessageSquare, AlertCircle } from "lucide-react";

type Issue = {
  id: string;
  title: string;
  description: string;
  type: string;
  status: string;
  priority: string;
  assignee: any;
  created_at: string;
};

const COLUMNS = [
  { id: "todo", title: "To Do", icon: Circle, color: "text-[#888]" },
  { id: "in_progress", title: "In Progress", icon: Clock, color: "text-amber-400" },
  { id: "review", title: "Review", icon: AlertCircle, color: "text-purple-400" },
  { id: "done", title: "Done", icon: CheckCircle2, color: "text-emerald-400" },
];

export default function KanbanPage() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [draggedIssueId, setDraggedIssueId] = useState<string | null>(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '', type: 'task', priority: 'medium' });

  const fetchIssues = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/kanban/issues", {
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setIssues(data.issues || []);
      }
    } catch (err) {
      console.error("Failed to fetch issues", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, []);

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

    // Optimistic UI update
    setIssues((prev) =>
      prev.map((i) => (i.id === draggedIssueId ? { ...i, status } : i))
    );

    // API update
    try {
      await fetch(`http://localhost:5000/api/kanban/issues/${draggedIssueId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status }),
      });
    } catch (err) {
      console.error("Failed to update status", err);
      // Revert on error (simple re-fetch)
      fetchIssues();
    }
    setDraggedIssueId(null);
  };

  const handleCreateTask = async () => {
    if (!newTask.title.trim()) return;
    try {
      const res = await fetch("http://localhost:5000/api/kanban/issues", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(newTask)
      });
      if (res.ok) {
        setShowTaskModal(false);
        setNewTask({ title: '', description: '', type: 'task', priority: 'medium' });
        fetchIssues();
      } else {
        const errorData = await res.json();
        alert(errorData.detail || "Failed to create task");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred");
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "text-red-400 bg-red-400/10 border-red-400/20";
      case "medium": return "text-orange-400 bg-orange-400/10 border-orange-400/20";
      case "low": return "text-blue-400 bg-blue-400/10 border-blue-400/20";
      default: return "text-[#888] bg-white/[0.04] border-white/[0.08]"; // medium/unspecified
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "bug": return "text-red-400";
      case "epic": return "text-purple-400";
      case "feature": return "text-emerald-400";
      default: return "text-[#888]"; // task
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
    <div className="space-y-6 max-w-[1400px] mx-auto h-full flex flex-col pb-6 font-sans">
      {/* Header */}
      <div className="flex items-center justify-between shrink-0 pb-4 border-b border-white/[0.04]">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-[#EDEDED] mb-1">Board</h1>
          <p className="text-[13px] text-[#888]">Manage issues and track progress.</p>
        </div>
        <button 
          onClick={() => setShowTaskModal(true)} 
          className="flex items-center gap-1.5 bg-white text-black px-3 py-1.5 rounded-md text-[13px] font-medium hover:bg-[#e5e5e5] transition"
        >
          <Plus size={16} />
          New Issue
        </button>
      </div>

      {/* Board */}
      <div className="flex-1 flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
        {COLUMNS.map((col) => (
          <div
            key={col.id}
            className="flex-1 min-w-[300px] max-w-[340px] flex flex-col bg-[#0a0a0a] border border-white/[0.04] rounded-xl overflow-hidden shrink-0"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, col.id)}
          >
            {/* Column Header */}
            <div className="p-3.5 flex items-center justify-between border-b border-white/[0.04] bg-[#111]">
              <div className="flex items-center gap-2">
                <col.icon size={14} className={col.color} />
                <h3 className="font-medium text-[13px] text-[#EDEDED]">{col.title}</h3>
                <span className="bg-[#222] text-[#888] text-[11px] font-medium px-1.5 py-0.5 rounded ml-1.5">
                  {issues.filter((i) => i.status === col.id).length}
                </span>
              </div>
              <button className="text-[#555] hover:text-[#EDEDED] transition">
                <MoreHorizontal size={14} />
              </button>
            </div>

            {/* Column Body */}
            <div className="flex-1 p-3 overflow-y-auto space-y-3">
              {issues
                .filter((i) => i.status === col.id)
                .map((issue) => (
                  <div
                    key={issue.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, issue.id)}
                    className="bg-[#111] hover:bg-[#1a1a1a] border border-white/[0.06] hover:border-white/[0.12] rounded-lg p-3.5 cursor-grab active:cursor-grabbing transition-all group"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <span className={`text-[10px] font-semibold uppercase tracking-wider ${getTypeColor(issue.type)}`}>
                        {issue.type}
                      </span>
                      <span className="text-[#555] text-[10px] font-mono">
                        {issue.id.substring(0, 8)}
                      </span>
                    </div>
                    
                    <h4 className="text-[#EDEDED] text-[13px] font-medium mb-1.5 leading-snug">{issue.title}</h4>
                    {issue.description && (
                      <p className="text-[#888] text-[12px] line-clamp-2 mb-3 leading-relaxed">{issue.description}</p>
                    )}
                    
                    <div className="flex items-center justify-between mt-auto pt-3 border-t border-white/[0.04]">
                      <div className="flex items-center gap-2 text-[#555]">
                        <MessageSquare size={12} />
                        <span className="text-[11px]">0</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-medium border uppercase tracking-wider ${getPriorityColor(issue.priority)}`}>
                          {issue.priority}
                        </span>
                        {issue.assignee ? (
                          <div className="w-5 h-5 rounded-full bg-[#333] text-white flex items-center justify-center text-[10px] font-medium border border-white/[0.08]" title={issue.assignee.full_name}>
                            {issue.assignee.full_name.charAt(0)}
                          </div>
                        ) : (
                          <div className="w-5 h-5 rounded-full bg-[#1a1a1a] flex items-center justify-center border border-dashed border-[#444]" title="Unassigned">
                            <span className="text-[#555] text-[10px]">?</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                
              {/* Empty state for column */}
              {issues.filter((i) => i.status === col.id).length === 0 && (
                <div className="h-20 border border-dashed border-white/[0.04] rounded-lg flex items-center justify-center text-[#555] text-[12px]">
                  Drop items here
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* New Task Modal */}
      {showTaskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#111111] border border-white/[0.08] rounded-xl w-full max-w-lg p-6 shadow-2xl">
            <h2 className="text-[15px] font-medium text-[#EDEDED] mb-5">Create New Issue</h2>
            <div className="space-y-4 mb-6">
              <div className="space-y-1.5">
                <input 
                  type="text" 
                  placeholder="Issue title"
                  value={newTask.title}
                  onChange={e => setNewTask({...newTask, title: e.target.value})}
                  className="w-full bg-transparent border-b border-white/[0.08] text-[#EDEDED] py-2 px-1 outline-none focus:border-white/20 text-[15px] placeholder:text-[#555] transition-colors"
                  autoFocus
                />
              </div>
              <div className="space-y-1.5">
                <textarea 
                  rows={3}
                  placeholder="Add description..."
                  value={newTask.description}
                  onChange={e => setNewTask({...newTask, description: e.target.value})}
                  className="w-full bg-[#0a0a0a] border border-white/[0.08] text-[#EDEDED] rounded-lg py-2 px-3 outline-none focus:border-white/20 text-[13px] placeholder:text-[#555] resize-none transition-colors"
                />
              </div>
              <div className="flex gap-4">
                <div className="flex-1 space-y-1.5">
                  <label className="block text-[11px] font-medium text-[#888] uppercase tracking-wider">Type</label>
                  <select 
                    value={newTask.type}
                    onChange={e => setNewTask({...newTask, type: e.target.value})}
                    className="w-full bg-[#0a0a0a] border border-white/[0.08] text-[#EDEDED] rounded-lg py-1.5 px-2 outline-none focus:border-white/20 text-[13px] appearance-none transition-colors"
                  >
                    <option value="task">Task</option>
                    <option value="bug">Bug</option>
                    <option value="feature">Feature</option>
                    <option value="epic">Epic</option>
                  </select>
                </div>
                <div className="flex-1 space-y-1.5">
                  <label className="block text-[11px] font-medium text-[#888] uppercase tracking-wider">Priority</label>
                  <select 
                    value={newTask.priority}
                    onChange={e => setNewTask({...newTask, priority: e.target.value})}
                    className="w-full bg-[#0a0a0a] border border-white/[0.08] text-[#EDEDED] rounded-lg py-1.5 px-2 outline-none focus:border-white/20 text-[13px] appearance-none transition-colors"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-white/[0.04]">
              <button onClick={() => setShowTaskModal(false)} className="px-3 py-1.5 text-[13px] text-[#888] hover:text-[#EDEDED] transition">Cancel</button>
              <button onClick={handleCreateTask} className="px-3 py-1.5 bg-white hover:bg-[#e5e5e5] text-black rounded-md text-[13px] font-medium transition">Create Issue</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
