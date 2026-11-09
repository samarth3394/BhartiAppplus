"use client";

import React, { useState } from "react";
import { Wrench, CheckCircle2, Clock, AlertCircle, Plus, Calendar, Check, X } from "lucide-react";

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
      description: "Spin up isolated snapshot replica and execute verification suite in sandbox.",
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
    <div className="p-5 rounded-2xl border border-slate-200/80 bg-white hover:bg-slate-50/70 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-[0_4px_20px_rgba(10,37,64,0.03)] hover:shadow-[0_8px_30px_rgba(10,37,64,0.06)]">
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-xl bg-slate-100/80 border border-slate-200/60 text-[#0A2540] mt-0.5 shrink-0">
          <Wrench size={17} />
        </div>
        <div>
          <h3 className="font-bold text-[14.5px] text-[#0A2540] mb-1">{task.title}</h3>
          <p className="text-[13px] text-[#425466] mb-2.5 leading-relaxed">{task.description}</p>
          <div className="flex flex-wrap items-center gap-3 text-[11.5px] font-medium">
            <span className="flex items-center gap-1.5 uppercase tracking-wider text-slate-700 bg-slate-100/90 border border-slate-200/70 px-2.5 py-0.5 rounded-md font-mono font-bold">
              <Clock size={12} /> {task.frequency}
            </span>
            <span className="flex items-center gap-1.5 text-[#425466]">
              <Calendar size={12} /> Due: {task.due_date}
            </span>
          </div>
        </div>
      </div>
      <button
        onClick={() => completeTask(task.id)}
        className="px-4 py-2 rounded-xl border border-slate-200/90 text-[#0A2540] hover:text-emerald-700 hover:bg-emerald-50 hover:border-emerald-200 text-xs font-bold transition-all flex items-center gap-1.5 self-start sm:self-center shadow-xs cursor-pointer shrink-0"
      >
        <Check size={14} className="text-emerald-600" /> Mark Complete
      </button>
    </div>
  );

  return (
    <div className="space-y-6 max-w-5xl mx-auto h-full flex flex-col pb-8 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200/80 shrink-0">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0A2540]">
              Preventative Maintenance
            </h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold uppercase tracking-wider bg-[#635BFF]/10 text-[#635BFF] border border-[#635BFF]/20">
              SRE Automation
            </span>
          </div>
          <p className="text-[13.5px] text-[#425466]">
            Scheduled database vacuums, certificate rotations, and automated cluster health tasks.
          </p>
        </div>
        <button
          onClick={() => setShowTaskModal(true)}
          className="inline-flex items-center justify-center gap-2 bg-[#635BFF] hover:bg-[#5349e0] text-white px-5 py-2.5 rounded-xl text-[13px] font-bold transition shadow-[0_4px_14px_rgba(99,91,255,0.25)] hover:shadow-[0_6px_20px_rgba(99,91,255,0.35)] shrink-0 cursor-pointer"
        >
          <Plus size={15} />
          Schedule Task
        </button>
      </div>

      {/* Due Today */}
      <div className="space-y-3.5">
        <h2 className="text-xs font-bold uppercase tracking-wider text-[#425466] flex items-center gap-2">
          <Clock size={15} className="text-[#635BFF]" /> Due Today ({tasks.today.length})
        </h2>
        {tasks.today.length === 0 ? (
          <div className="p-8 bg-white border border-slate-200/80 rounded-2xl text-center text-[#425466] text-xs shadow-xs">
            No maintenance tasks scheduled for today. All scheduled procedures complete.
          </div>
        ) : (
          tasks.today.map(t => <TaskCard key={t.id} task={t} />)
        )}
      </div>

      {/* Upcoming Tasks */}
      <div className="space-y-3.5 pt-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-[#425466] flex items-center gap-2">
          <Calendar size={15} className="text-blue-500" /> Upcoming Routine Tasks ({tasks.upcoming.length})
        </h2>
        {tasks.upcoming.map(t => <TaskCard key={t.id} task={t} />)}
      </div>

      {/* Schedule Modal */}
      {showTaskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A2540]/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200/90 rounded-2xl w-full max-w-lg p-6 sm:p-7 shadow-[0_20px_60px_rgba(10,37,64,0.15)]">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-[17px] font-extrabold text-[#0A2540]">Schedule Maintenance Task</h2>
              <button 
                onClick={() => setShowTaskModal(false)}
                className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-[11px] font-bold text-[#425466] uppercase tracking-wider mb-1.5">Task Title</label>
                <input
                  type="text"
                  placeholder="e.g. Rotate DB Read Replica Credentials"
                  value={newTask.title}
                  onChange={e => setNewTask({...newTask, title: e.target.value})}
                  className="w-full bg-[#FAFBFD] border border-slate-200/90 text-[#0A2540] rounded-xl py-2.5 px-3.5 text-[13.5px] outline-none focus:border-[#635BFF] focus:bg-white focus:ring-2 focus:ring-[#635BFF]/15 font-semibold transition"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-[#425466] uppercase tracking-wider mb-1.5">Description</label>
                <textarea
                  rows={3}
                  placeholder="Task scope, downtime impact, and procedures..."
                  value={newTask.description}
                  onChange={e => setNewTask({...newTask, description: e.target.value})}
                  className="w-full bg-[#FAFBFD] border border-slate-200/90 text-[#0A2540] rounded-xl py-2.5 px-3.5 text-[13px] outline-none focus:border-[#635BFF] focus:bg-white focus:ring-2 focus:ring-[#635BFF]/15 resize-none transition"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-[#425466] uppercase tracking-wider mb-1.5">Frequency</label>
                  <select
                    value={newTask.frequency}
                    onChange={e => setNewTask({...newTask, frequency: e.target.value})}
                    className="w-full bg-[#FAFBFD] border border-slate-200/90 text-[#0A2540] rounded-xl py-2.5 px-3 text-[13px] outline-none focus:border-[#635BFF] font-semibold"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#425466] uppercase tracking-wider mb-1.5">Due Date</label>
                  <input
                    type="text"
                    placeholder="e.g. Next Friday 02:00 UTC"
                    value={newTask.due_date}
                    onChange={e => setNewTask({...newTask, due_date: e.target.value})}
                    className="w-full bg-[#FAFBFD] border border-slate-200/90 text-[#0A2540] rounded-xl py-2.5 px-3 text-[13px] outline-none focus:border-[#635BFF] font-semibold"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-100">
              <button 
                onClick={() => setShowTaskModal(false)} 
                className="px-4 py-2 text-[13px] font-bold text-[#425466] hover:text-[#0A2540] transition cursor-pointer"
              >
                Cancel
              </button>
              <button 
                onClick={handleCreateTask} 
                className="px-5 py-2 bg-[#635BFF] hover:bg-[#5349e0] text-white rounded-xl text-[13px] font-bold transition shadow-xs cursor-pointer"
              >
                Schedule Procedure
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
