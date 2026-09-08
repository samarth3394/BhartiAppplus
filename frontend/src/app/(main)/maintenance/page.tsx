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
  const [tasks, setTasks] = useState<{ overdue: MaintenanceTask[], today: MaintenanceTask[], upcoming: MaintenanceTask[] }>({
    overdue: [], today: [], upcoming: []
  });
  const [loading, setLoading] = useState(true);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '', frequency: 'weekly', due_date: '' });

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

  const handleCreateTask = async () => {
    if (!newTask.title.trim()) return;
    try {
      const res = await fetch("http://localhost:5000/api/maintenance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(newTask)
      });
      if (res.ok) {
        setShowTaskModal(false);
        setNewTask({ title: '', description: '', frequency: 'weekly', due_date: '' });
        fetchTasks();
      } else {
        const errorData = await res.json();
        alert(errorData.detail || "Failed to schedule task");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred");
    }
  };

  const TaskCard = ({ task, isOverdue = false }: { task: MaintenanceTask, isOverdue?: boolean }) => (
    <div className={`p-4 rounded-xl border flex items-center justify-between transition-all group ${
      isOverdue ? 'bg-red-500/5 border-red-500/20' : 'bg-[#111] hover:bg-[#1a1a1a] border-white/[0.04] hover:border-white/[0.08]'
    }`}>
      <div className="flex items-start gap-4">
        <div className={`mt-1 flex items-center justify-center w-7 h-7 rounded border ${isOverdue ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-[#222] text-[#888] border-white/[0.08]'}`}>
          {isOverdue ? <AlertCircle size={14} /> : <PenTool size={14} />}
        </div>
        <div>
          <h3 className="font-medium text-[14px] text-[#EDEDED] mb-1">{task.title}</h3>
          {task.description && <p className="text-[12px] text-[#888] mb-2">{task.description}</p>}
          <div className="flex items-center gap-3 text-[11px] font-mono text-[#666]">
            <span className="flex items-center gap-1.5 uppercase tracking-wider text-[#888]">
              <Clock size={12} /> {task.frequency}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar size={12} /> Due: {new Date(task.due_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
            </span>
          </div>
        </div>
      </div>
      <button 
        onClick={() => completeTask(task.id)}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition text-[12px] ${
          isOverdue ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-[#1a1a1a] hover:bg-[#222] border border-white/[0.08] text-[#EDEDED] opacity-0 group-hover:opacity-100'
        }`}
      >
        <CheckCircle2 size={14} />
        Complete
      </button>
    </div>
  );

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="w-5 h-5 border-2 border-[#333] border-t-[#EDEDED] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto h-full flex flex-col pb-8 font-sans">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/[0.04] shrink-0">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-[#EDEDED] mb-1">Maintenance</h1>
          <p className="text-[13px] text-[#888]">Manage recurring operations and routine checks.</p>
        </div>
        <button 
          onClick={() => setShowTaskModal(true)}
          className="flex items-center gap-1.5 bg-white text-black px-3 py-1.5 rounded-md text-[13px] font-medium hover:bg-[#e5e5e5] transition"
        >
          <Plus size={16} />
          Schedule Task
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
        {/* Left Column: Overdue & Today */}
        <div className="space-y-6">
          <div className="bg-[#0a0a0a] border border-white/[0.04] rounded-xl flex flex-col">
            <div className="p-4 border-b border-white/[0.04] shrink-0 bg-[#111] rounded-t-xl">
              <h2 className="text-[14px] font-medium text-[#EDEDED] flex items-center gap-2">
                <AlertCircle size={16} className="text-red-400" /> Action Required (Overdue)
              </h2>
            </div>
            <div className="p-4">
              {tasks.overdue.length === 0 ? (
                <div className="text-center py-6 text-[#555] text-[13px] border border-dashed border-white/[0.04] rounded-lg">No overdue tasks.</div>
              ) : (
                <div className="space-y-3">
                  {tasks.overdue.map(t => <TaskCard key={t.id} task={t} isOverdue={true} />)}
                </div>
              )}
            </div>
          </div>

          <div className="bg-[#0a0a0a] border border-white/[0.04] rounded-xl flex flex-col">
            <div className="p-4 border-b border-white/[0.04] shrink-0 bg-[#111] rounded-t-xl">
              <h2 className="text-[14px] font-medium text-[#EDEDED] flex items-center gap-2">
                <Clock size={16} className="text-[#888]" /> Due Today
              </h2>
            </div>
            <div className="p-4">
              {tasks.today.length === 0 ? (
                <div className="text-center py-6 text-[#555] text-[13px] border border-dashed border-white/[0.04] rounded-lg">No tasks due today.</div>
              ) : (
                <div className="space-y-3">
                  {tasks.today.map(t => <TaskCard key={t.id} task={t} />)}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Upcoming */}
        <div className="bg-[#0a0a0a] border border-white/[0.04] rounded-xl flex flex-col h-[calc(100vh-12rem)]">
          <div className="p-4 border-b border-white/[0.04] shrink-0 bg-[#111] rounded-t-xl">
            <h2 className="text-[14px] font-medium text-[#EDEDED] flex items-center gap-2">
              <Calendar size={16} className="text-[#888]" /> Upcoming Tasks
            </h2>
          </div>
          
          <div className="p-4 flex-1 overflow-y-auto custom-scrollbar">
            {tasks.upcoming.length === 0 ? (
              <div className="text-center py-12 text-[#555] flex flex-col items-center border border-dashed border-white/[0.04] rounded-lg h-full justify-center">
                <CheckCircle2 size={32} className="text-[#333] mb-3" />
                <p className="text-[13px]">No upcoming maintenance tasks.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {tasks.upcoming.map(t => <TaskCard key={t.id} task={t} />)}
              </div>
            )}
          </div>
        </div>
      </div>

      {showTaskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#111111] border border-white/[0.08] rounded-xl w-full max-w-lg p-6 shadow-2xl">
            <h2 className="text-[15px] font-medium text-[#EDEDED] mb-5">Schedule Task</h2>
            <div className="space-y-4 mb-6">
              <div className="space-y-1.5">
                <input 
                  type="text" 
                  placeholder="Task title"
                  value={newTask.title}
                  onChange={e => setNewTask({...newTask, title: e.target.value})}
                  className="w-full bg-transparent border-b border-white/[0.08] text-[#EDEDED] py-2 px-1 outline-none focus:border-white/20 text-[15px] placeholder:text-[#555] transition-colors"
                  autoFocus
                />
              </div>
              <div className="space-y-1.5">
                <textarea 
                  rows={3}
                  placeholder="Task details..."
                  value={newTask.description}
                  onChange={e => setNewTask({...newTask, description: e.target.value})}
                  className="w-full bg-[#0a0a0a] border border-white/[0.08] text-[#EDEDED] rounded-lg py-2 px-3 outline-none focus:border-white/20 text-[13px] placeholder:text-[#555] resize-none transition-colors"
                />
              </div>
              <div className="flex gap-4">
                <div className="flex-1 space-y-1.5">
                  <label className="block text-[11px] font-medium text-[#888] uppercase tracking-wider">Frequency</label>
                  <select 
                    value={newTask.frequency}
                    onChange={e => setNewTask({...newTask, frequency: e.target.value})}
                    className="w-full bg-[#0a0a0a] border border-white/[0.08] text-[#EDEDED] rounded-lg py-2 px-2 outline-none focus:border-white/20 text-[13px] appearance-none transition-colors"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>
                <div className="flex-1 space-y-1.5">
                  <label className="block text-[11px] font-medium text-[#888] uppercase tracking-wider">Due Date</label>
                  <input 
                    type="date"
                    value={newTask.due_date}
                    onChange={e => setNewTask({...newTask, due_date: e.target.value})}
                    className="w-full bg-[#0a0a0a] border border-white/[0.08] text-[#EDEDED] rounded-lg py-2 px-3 outline-none focus:border-white/20 text-[13px] transition-colors"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-white/[0.04]">
              <button onClick={() => setShowTaskModal(false)} className="px-3 py-1.5 text-[13px] text-[#888] hover:text-[#EDEDED] transition">Cancel</button>
              <button onClick={handleCreateTask} className="px-3 py-1.5 bg-white hover:bg-[#e5e5e5] text-black rounded-md text-[13px] font-medium transition">Create Task</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
