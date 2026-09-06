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
  { id: "todo", title: "To Do", icon: Circle, color: "text-zinc-400" },
  { id: "in_progress", title: "In Progress", icon: Clock, color: "text-blue-400" },
  { id: "review", title: "Review", icon: AlertCircle, color: "text-orange-400" },
  { id: "done", title: "Done", icon: CheckCircle2, color: "text-emerald-400" },
];

export default function KanbanPage() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [draggedIssueId, setDraggedIssueId] = useState<string | null>(null);

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

  const createPlaceholderIssue = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/kanban/issues", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          title: "New Task",
          description: "Description here",
          type: "task",
          priority: "medium",
        }),
      });
      if (res.ok) fetchIssues();
    } catch (err) {
      console.error(err);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical": return "text-red-400 bg-red-400/10 border-red-400/20";
      case "high": return "text-orange-400 bg-orange-400/10 border-orange-400/20";
      case "low": return "text-blue-400 bg-blue-400/10 border-blue-400/20";
      default: return "text-zinc-400 bg-zinc-400/10 border-zinc-400/20"; // medium
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "bug": return "text-red-400";
      case "epic": return "text-purple-400";
      case "story": return "text-emerald-400";
      default: return "text-blue-400"; // task
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 h-[calc(100vh-8rem)] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-500/20 text-blue-400 rounded-xl border border-blue-500/30">
            <Layout size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white mb-1">Kanban Board</h1>
            <p className="text-zinc-400">Manage tasks, sprints, and product roadmap.</p>
          </div>
        </div>
        <button 
          onClick={createPlaceholderIssue}
          className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-blue-500 transition shadow-[0_0_20px_rgba(37,99,235,0.3)]"
        >
          <Plus size={18} />
          New Issue
        </button>
      </div>

      {/* Board */}
      <div className="flex-1 flex gap-6 overflow-x-auto pb-4">
        {COLUMNS.map((col) => (
          <div
            key={col.id}
            className="flex-1 min-w-[320px] max-w-[400px] flex flex-col bg-zinc-900/40 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, col.id)}
          >
            {/* Column Header */}
            <div className="p-4 flex items-center justify-between border-b border-white/5 bg-black/20">
              <div className="flex items-center gap-2">
                <col.icon size={18} className={col.color} />
                <h3 className="font-semibold text-white">{col.title}</h3>
                <span className="bg-white/10 text-zinc-300 text-xs px-2 py-0.5 rounded-full ml-2">
                  {issues.filter((i) => i.status === col.id).length}
                </span>
              </div>
              <button className="text-zinc-500 hover:text-zinc-300 transition">
                <MoreHorizontal size={18} />
              </button>
            </div>

            {/* Column Body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {issues
                .filter((i) => i.status === col.id)
                .map((issue) => (
                  <div
                    key={issue.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, issue.id)}
                    className="bg-zinc-800/50 hover:bg-zinc-800 border border-white/10 hover:border-white/20 rounded-xl p-4 cursor-grab active:cursor-grabbing transition-all hover:shadow-[0_4px_20px_rgba(0,0,0,0.3)] group"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <span className={`text-xs font-semibold uppercase tracking-wider ${getTypeColor(issue.type)}`}>
                        {issue.type}
                      </span>
                      <button className="text-zinc-500 opacity-0 group-hover:opacity-100 hover:text-white transition">
                        <MoreHorizontal size={16} />
                      </button>
                    </div>
                    
                    <h4 className="text-zinc-200 font-medium mb-1 leading-snug">{issue.title}</h4>
                    <p className="text-zinc-500 text-sm line-clamp-2 mb-4">{issue.description || "No description."}</p>
                    
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                      <div className="flex items-center gap-2 text-zinc-400">
                        <MessageSquare size={14} />
                        <span className="text-xs">0</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-medium border uppercase tracking-wider ${getPriorityColor(issue.priority)}`}>
                          {issue.priority}
                        </span>
                        {issue.assignee ? (
                          <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold ring-2 ring-zinc-900" title={issue.assignee.full_name}>
                            {issue.assignee.full_name.charAt(0)}
                          </div>
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-zinc-700 flex items-center justify-center border border-dashed border-zinc-500" title="Unassigned">
                            <span className="text-zinc-400 text-xs">?</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                
              {/* Empty state for column */}
              {issues.filter((i) => i.status === col.id).length === 0 && (
                <div className="h-24 border-2 border-dashed border-white/5 rounded-xl flex items-center justify-center text-zinc-600 text-sm font-medium">
                  Drop items here
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
