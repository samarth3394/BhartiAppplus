"use client";

import React, { useEffect, useState } from "react";
import { PenTool, CheckCircle2, Clock, AlertCircle, Plus, Calendar } from "lucide-react";

type MaintenanceTask = {
  id: string;
  title: string;
  description: string;
  frequency: string;
  due_date: string;
  is_active: boolean;
  last_completed: string | null;
  last_completed_by: string | null;
};

type TaskCategories = {
  overdue: MaintenanceTask[];
  today: MaintenanceTask[];
  upcoming: MaintenanceTask[];
};

export default function MaintenancePage() {
  const [tasks, setTasks] = useState<TaskCategories>({ overdue: [], today: [], upcoming: [] });
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/maintenance", { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setTasks(data.tasks);
      }
    } catch (err) {
      console.error("Failed to fetch tasks", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const completeTask = async (taskId: string) => {
    try {
      const res = await fetch(`http://localhost:5000/api/maintenance/${taskId}/complete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ notes: "Completed via Dashboard" })
      });
      if (res.ok) fetchTasks();
    } catch (err) {
      console.error("Failed to complete task", err);
    }
  };

  const createPlaceholderTask = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/maintenance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ title: "New Maintenance Task", description: "Perform routine check", frequency: "weekly" })
      });
      if (res.ok) fetchTasks();
    } catch (err) {
      console.error("Failed to create task", err);
    }
  };

  const TaskCard = ({ task, isOverdue = false }: { task: MaintenanceTask, isOverdue?: boolean }) => (
    <div className={`p-4 rounded-xl border flex items-center justify-between transition-all hover:bg-black/40 ${
      isOverdue ? 'bg-red-500/5 border-red-500/20' : 'bg-zinc-900/40 border-white/5 hover:border-white/10'
    }`}>
      <div className="flex items-start gap-4">
        <div className={`mt-1 p-2 rounded-lg ${isOverdue ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'}`}>
          {isOverdue ? <AlertCircle size={20} /> : <PenTool size={20} />}
        </div>
        <div>
          <h3 className="font-semibold text-white mb-1">{task.title}</h3>
          <p className="text-sm text-zinc-400 mb-2">{task.description || "No description provided."}</p>
          <div className="flex items-center gap-3 text-xs text-zinc-500">
            <span className="flex items-center gap-1 uppercase tracking-wider font-medium text-zinc-400">
              <Clock size={12} /> {task.frequency}
            </span>
            <span className="flex items-center gap-1">
              <Calendar size={12} /> Due: {new Date(task.due_date).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
      <button 
        onClick={() => completeTask(task.id)}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
          isOverdue ? 'bg-red-600 hover:bg-red-500 text-white' : 'bg-white/10 hover:bg-emerald-500 hover:text-white text-zinc-300'
        }`}
      >
        <CheckCircle2 size={16} />
        Complete
      </button>
    </div>
  );

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
            <PenTool size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white mb-1">Maintenance Tasks</h1>
            <p className="text-zinc-400">Manage recurring operations and routine checks.</p>
          </div>
        </div>
        <button 
          onClick={createPlaceholderTask}
          className="flex items-center gap-2 bg-purple-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-purple-500 transition shadow-[0_0_20px_rgba(168,85,247,0.3)]"
        >
          <Plus size={18} />
          New Task
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Left Column: Overdue & Today */}
        <div className="space-y-6">
          <div className="bg-zinc-900/40 backdrop-blur-xl border border-white/10 p-6 rounded-2xl">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <AlertCircle size={20} className="text-red-400" /> Action Required (Overdue)
            </h2>
            {tasks.overdue.length === 0 ? (
              <div className="text-center py-6 text-zinc-500">No overdue tasks. Great job!</div>
            ) : (
              <div className="space-y-3">
                {tasks.overdue.map(t => <TaskCard key={t.id} task={t} isOverdue={true} />)}
              </div>
            )}
          </div>

          <div className="bg-zinc-900/40 backdrop-blur-xl border border-white/10 p-6 rounded-2xl">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Clock size={20} className="text-blue-400" /> Due Today
            </h2>
            {tasks.today.length === 0 ? (
              <div className="text-center py-6 text-zinc-500">No tasks due today.</div>
            ) : (
              <div className="space-y-3">
                {tasks.today.map(t => <TaskCard key={t.id} task={t} />)}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Upcoming */}
        <div className="bg-zinc-900/40 backdrop-blur-xl border border-white/10 p-6 rounded-2xl">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Calendar size={20} className="text-zinc-400" /> Upcoming Tasks
          </h2>
          {tasks.upcoming.length === 0 ? (
            <div className="text-center py-12 text-zinc-500 flex flex-col items-center">
              <CheckCircle2 size={48} className="text-emerald-500/20 mb-4" />
              <p>You have no upcoming maintenance tasks.</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
              {tasks.upcoming.map(t => <TaskCard key={t.id} task={t} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
