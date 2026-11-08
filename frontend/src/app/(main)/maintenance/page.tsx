"use client";

import React, { useEffect, useState } from "react";
import { Wrench, CheckCircle2, Clock, AlertCircle, Plus, Calendar, Check } from "lucide-react";

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

const DEFAULT_MAINTENANCE_TASKS: {
  today: MaintenanceTask[];
  upcoming: MaintenanceTask[];
  overdue: MaintenanceTask[];
} = {
  today: [
    {
      id: "maint-1",
      title: "PostgreSQL vacuum & re-index on telemetry partition",
      description: "Automated zero-downtime background index defragmentation and table optimization.",
      frequency: "daily",
      due_date: "Today at 02:00 UTC",
      is_active: true,
      last_completed: "Yesterday",
      last_completed_by: "Cron SRE"
    }
  ],
  upcoming: [
    {
      id: "maint-2",
      title: "Rotate SSL / TLS Wildcard certificates across edge endpoints",
      description: "Verify automated Let's Encrypt certificate renewal across all 14 reverse proxies.",
      frequency: "monthly",
      due_date: "In 4 days",
      is_active: true,
      last_completed: "Oct 12",
      last_completed_by: "Cloudflare Daemon"
    },
    {
      id: "maint-3",
      title: "Prune stale Docker container layers on Ashburn worker nodes",
      description: "Free up disk blocks by removing dangling images and orphan build caches.",
      frequency: "weekly",
      due_date: "In 2 days",
      is_active: true,
      last_completed: "Nov 01",
      last_completed_by: "DevOps Bot"
    },
    {
      id: "maint-4",
      title: "Disaster Recovery standby cluster backup drill",
      description: "Spin up isolated snapshot replica and execute verification suite.",
      frequency: "monthly",
      due_date: "In 8 days",
      is_active: true,
      last_completed: "Oct 15",
      last_completed_by: "Samarth Choudhar"
    }
  ],
  overdue: []
};

export default function MaintenancePage() {
  const [tasks, setTasks] = useState(DEFAULT_MAINTENANCE_TASKS);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '', frequency: 'weekly', due_date: '' });

  const completeTask = (taskId: string) => {
    setTasks(prev => ({
      ...prev,
      today: prev.today.filter(t => t.id !== taskId),
      upcoming: prev.upcoming.filter(t => t.id !== taskId),
    }));
  };

  const handleCreateTask = () => {
    if (!newTask.title.trim()) return;
    const created: MaintenanceTask = {
      id: "maint-" + Date.now(),
      title: newTask.title,
      description: newTask.description,
      frequency: newTask.frequency,
      due_date: newTask.due_date || "Next Week",
      is_active: true,
      last_completed: null,
      last_completed_by: null
    };

    setTasks(prev => ({
      ...prev,
      upcoming: [created, ...prev.upcoming]
    }));
    setShowTaskModal(false);
    setNewTask({ title: '', description: '', frequency: 'weekly', due_date: '' });
  };

  const TaskCard = ({ task }: { task: MaintenanceTask }) => (
    <div className="p-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50/80 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
      <div className="flex items-start gap-3.5">
        <div className="p-2 rounded-lg bg-slate-100 text-[#0F172A] mt-0.5">
          <Wrench size={16} />
        </div>
        <div>
          <h3 className="font-bold text-[14px] text-[#0F172A] mb-1">{task.title}</h3>
          <p className="text-[12.5px] text-slate-600 mb-2 leading-relaxed">{task.description}</p>
          <div className="flex items-center gap-3 text-[11px] font-medium text-slate-400">
            <span className="flex items-center gap-1 uppercase tracking-wider text-slate-600 bg-slate-100 px-2 py-0.5 rounded font-mono font-bold">
              <Clock size={11} /> {task.frequency}
            </span>
            <span className="flex items-center gap-1 text-slate-500">
              <Calendar size={11} /> Due: {task.due_date}
            </span>
          </div>
        </div>
      </div>
      <button
        onClick={() => completeTask(task.id)}
        className="px-3.5 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:text-emerald-700 hover:bg-emerald-50 hover:border-emerald-200 text-xs font-semibold transition-all flex items-center gap-1.5 self-start sm:self-center shadow-xs"
      >
        <Check size={14} /> Mark Done
      </button>
    </div>
  );

  return (
    <div className="space-y-6 max-w-5xl mx-auto h-full flex flex-col pb-8 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 shrink-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#0F172A] mb-1">Preventative Maintenance</h1>
          <p className="text-[13.5px] text-slate-600">Scheduled database vacuums, certificate rotations, and automated cluster tasks.</p>
        </div>
        <button
          onClick={() => setShowTaskModal(true)}
          className="flex items-center gap-1.5 bg-[#0F172A] hover:bg-slate-800 text-white px-3.5 py-2 rounded-lg text-[13px] font-semibold transition shadow-xs"
        >
          <Plus size={15} />
          Schedule Task
        </button>
      </div>

      {/* Due Today */}
      <div className="space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
          <Clock size={14} className="text-[#635BFF]" /> Due Today ({tasks.today.length})
        </h2>
        {tasks.today.length === 0 ? (
          <div className="p-6 bg-white border border-slate-200 rounded-xl text-center text-slate-400 text-xs">
            No maintenance tasks scheduled for today.
          </div>
        ) : (
          tasks.today.map(t => <TaskCard key={t.id} task={t} />)
        )}
      </div>

      {/* Upcoming Tasks */}
      <div className="space-y-3 pt-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
          <Calendar size={14} className="text-blue-500" /> Upcoming Routine Tasks ({tasks.upcoming.length})
        </h2>
        {tasks.upcoming.map(t => <TaskCard key={t.id} task={t} />)}
      </div>

      {/* Schedule Modal */}
      {showTaskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white border border-slate-200 rounded-xl w-full max-w-lg p-6 shadow-2xl">
            <h2 className="text-[16px] font-bold text-[#0F172A] mb-4">Schedule Maintenance Task</h2>
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Task Title</label>
                <input
                  type="text"
                  placeholder="e.g. Rotate DB Read Replica Credentials"
                  value={newTask.title}
                  onChange={e => setNewTask({...newTask, title: e.target.value})}
                  className="w-full bg-white border border-slate-200 text-[#0F172A] rounded-lg py-2 px-3 text-[13.5px] outline-none focus:border-[#635BFF] font-medium"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Description</label>
                <textarea
                  rows={3}
                  placeholder="Task scope, downtime impact, and procedures..."
                  value={newTask.description}
                  onChange={e => setNewTask({...newTask, description: e.target.value})}
                  className="w-full bg-white border border-slate-200 text-[#0F172A] rounded-lg py-2 px-3 text-[13px] outline-none focus:border-[#635BFF] resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Cadence / Frequency</label>
                  <select
                    value={newTask.frequency}
                    onChange={e => setNewTask({...newTask, frequency: e.target.value})}
                    className="w-full bg-white border border-slate-200 text-[#0F172A] rounded-lg py-2 px-3 text-[13px] outline-none focus:border-[#635BFF]"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Due Date</label>
                  <input
                    type="text"
                    placeholder="e.g. Next Friday 02:00 UTC"
                    value={newTask.due_date}
                    onChange={e => setNewTask({...newTask, due_date: e.target.value})}
                    className="w-full bg-white border border-slate-200 text-[#0F172A] rounded-lg py-2 px-3 text-[13px] outline-none focus:border-[#635BFF]"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button onClick={() => setShowTaskModal(false)} className="px-3 py-1.5 text-[13px] font-medium text-slate-600 hover:text-slate-900 transition">Cancel</button>
              <button onClick={handleCreateTask} className="px-4 py-1.5 bg-[#0F172A] hover:bg-slate-800 text-white rounded-lg text-[13px] font-semibold transition">Schedule</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
