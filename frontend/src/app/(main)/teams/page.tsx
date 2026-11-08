"use client";

import React, { useEffect, useState } from "react";
import { Users, UserPlus, Shield, Activity, MoreHorizontal, CheckCircle2, Clock, Mail, Trash2 } from "lucide-react";

const DEFAULT_MEMBERS = [
  {
    id: "mem-1",
    user: { full_name: "Samarth Choudhar", email: "samarth@bhartinexus.com" },
    role: "admin",
    is_owner: true,
    is_pending: false,
    online: true
  },
  {
    id: "mem-2",
    user: { full_name: "Neha Sharma", email: "neha.s@bhartinexus.com" },
    role: "project_manager",
    is_owner: false,
    is_pending: false,
    online: true
  },
  {
    id: "mem-3",
    user: { full_name: "Rohan Patil", email: "rohan.p@bhartinexus.com" },
    role: "developer",
    is_owner: false,
    is_pending: false,
    online: true
  },
  {
    id: "mem-4",
    user: { full_name: "Ananya Iyer", email: "ananya.i@bhartinexus.com" },
    role: "developer",
    is_owner: false,
    is_pending: false,
    online: false
  },
  {
    id: "mem-5",
    user: { full_name: "Vikram Desai", email: "vikram.d@bhartinexus.com" },
    role: "tester",
    is_owner: false,
    is_pending: false,
    online: true
  },
  {
    id: "mem-6",
    user: { full_name: "Sarah Jenkins", email: "sarah.j@bhartinexus.com" },
    role: "viewer",
    is_owner: false,
    is_pending: true,
    online: false
  }
];

const DEFAULT_ACTIVITIES = [
  {
    id: "act-1",
    action: "Samarth Choudhar provisioned production cluster API key for Brexal AI",
    user: { full_name: "Samarth Choudhar" },
    created_at: new Date(Date.now() - 15 * 60 * 1000).toISOString()
  },
  {
    id: "act-2",
    action: "Neha Sharma escalated P2 latency alert threshold to 120ms",
    user: { full_name: "Neha Sharma" },
    created_at: new Date(Date.now() - 65 * 60 * 1000).toISOString()
  },
  {
    id: "act-3",
    action: "Rohan Patil merged PR #42: Distributed tracing span collector",
    user: { full_name: "Rohan Patil" },
    created_at: new Date(Date.now() - 180 * 60 * 1000).toISOString()
  },
  {
    id: "act-4",
    action: "Ananya Iyer deployed fine-tuned anomaly detection model v2.1",
    user: { full_name: "Ananya Iyer" },
    created_at: new Date(Date.now() - 360 * 60 * 1000).toISOString()
  },
  {
    id: "act-5",
    action: "Vikram Desai completed synthetic load testing across 8 regions",
    user: { full_name: "Vikram Desai" },
    created_at: new Date(Date.now() - 86400 * 1000).toISOString()
  }
];

export default function TeamsPage() {
  const [members, setMembers] = useState<any[]>(DEFAULT_MEMBERS);
  const [activities, setActivities] = useState<any[]>(DEFAULT_ACTIVITIES);
  const [loading, setLoading] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("developer");
  const [inviting, setInviting] = useState(false);

  const fetchData = async () => {
    try {
      const [membersRes, activitiesRes] = await Promise.all([
        fetch("http://localhost:5000/api/teams/members", { credentials: "include" }),
        fetch("http://localhost:5000/api/teams/activity", { credentials: "include" })
      ]);

      if (membersRes.ok) {
        const mData = await membersRes.json();
        if (mData.members && mData.members.length > 0) {
          setMembers(mData.members);
        }
      }
      if (activitiesRes.ok) {
        const aData = await activitiesRes.json();
        if (aData.activities && aData.activities.length > 0) {
          setActivities(aData.activities);
        }
      }
    } catch (err) {
      // Keep rich default state
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;
    setInviting(true);

    const newMem = {
      id: "mem-" + Date.now(),
      user: { full_name: inviteEmail.split("@")[0], email: inviteEmail },
      role: inviteRole,
      is_owner: false,
      is_pending: true,
      online: false
    };

    setMembers(prev => [...prev, newMem]);
    setInviteEmail("");

    try {
      await fetch("http://localhost:5000/api/teams/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email: inviteEmail, role: inviteRole }),
      });
    } catch (err) {
      // Local state is already updated
    } finally {
      setInviting(false);
    }
  };

  const removeMember = async (id: string) => {
    if (!confirm("Are you sure you want to remove this member?")) return;
    setMembers(prev => prev.filter(m => m.id !== id));
    try {
      await fetch(`http://localhost:5000/api/teams/members/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
    } catch (err) {
      // Local state is already updated
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin": return "text-purple-700 bg-purple-50 border-purple-200";
      case "project_manager": return "text-emerald-700 bg-emerald-50 border-emerald-200";
      case "developer": return "text-blue-700 bg-blue-50 border-blue-200";
      case "tester": return "text-orange-700 bg-orange-50 border-orange-200";
      default: return "text-slate-700 bg-slate-100 border-slate-200";
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto h-full flex flex-col pb-8 font-sans">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 shrink-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#0F172A] mb-1">Team & Access Control</h1>
          <p className="text-[13.5px] text-slate-600">Manage organization members, assign RBAC permissions, and monitor security audit logs.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column: Members & Invite */}
        <div className="xl:col-span-2 space-y-6">
          
          {/* Invite Member */}
          <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <h2 className="text-[14px] font-bold text-[#0F172A] mb-4 flex items-center gap-2">
              <UserPlus size={16} className="text-[#635BFF]" /> Invite New Colleague
            </h2>
            <form onSubmit={handleInvite} className="flex flex-col sm:flex-row items-stretch sm:items-end gap-3">
              <div className="flex-1">
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="developer@bhartinexus.com"
                    className="w-full bg-white border border-slate-200 text-[#0F172A] rounded-lg py-2 pl-9 pr-3 outline-none focus:border-[#635BFF] transition-colors text-[13px] placeholder:text-slate-400 font-medium"
                  />
                </div>
              </div>
              <div className="w-full sm:w-44">
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Role Permission</label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  className="w-full bg-white border border-slate-200 text-[#0F172A] rounded-lg py-2 px-3 outline-none focus:border-[#635BFF] transition-colors text-[13px] font-medium"
                >
                  <option value="developer">Developer</option>
                  <option value="tester">Tester (QA)</option>
                  <option value="viewer">Viewer (Read-only)</option>
                  <option value="project_manager">Project Manager</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>
              <button 
                type="submit" 
                disabled={inviting}
                className="px-4 py-2 bg-[#0F172A] hover:bg-slate-800 text-white font-semibold text-[13px] rounded-lg transition disabled:opacity-50 h-[38px] shadow-xs"
              >
                {inviting ? "Sending..." : "Send Invite"}
              </button>
            </form>
          </div>

          {/* Members List */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <h2 className="text-[14px] font-bold text-[#0F172A] flex items-center gap-2">
                <Shield size={16} className="text-[#635BFF]" /> Active Team Members
              </h2>
              <span className="bg-white border border-slate-200 text-slate-700 text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-xs">
                {members.length} Members
              </span>
            </div>
            
            <div className="divide-y divide-slate-100">
              {members.map((member) => (
                <div key={member.id} className="p-4 flex items-center justify-between hover:bg-slate-50/80 transition-colors group">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-9 h-9 rounded-full bg-[#0A2540] text-white flex items-center justify-center text-[12px] font-bold uppercase shadow-xs">
                        {member.user.full_name?.charAt(0) || member.user.email.charAt(0)}
                      </div>
                      {/* Online/Offline Status Dot */}
                      <div 
                        className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${
                          member.is_owner || member.online
                            ? 'bg-emerald-500' 
                            : 'bg-slate-300'
                        }`}
                        title={member.is_owner || member.online ? "Online" : "Offline"}
                      ></div>
                    </div>
                    <div>
                      <h3 className="font-bold text-[13.5px] text-[#0F172A] flex items-center gap-2">
                        {member.user.full_name || member.user.email}
                        {member.is_owner && <span className="text-[9.5px] bg-[#0F172A] text-white px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Owner</span>}
                        {member.is_pending && <span className="text-[9.5px] bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider flex items-center gap-1"><Clock size={10} /> Pending</span>}
                      </h3>
                      <p className="text-[12px] text-slate-500 font-medium">{member.user.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10.5px] font-bold border uppercase tracking-wider ${getRoleBadge(member.role)}`}>
                      {member.role.replace("_", " ")}
                    </span>
                    
                    {!member.is_owner && (
                      <button 
                        onClick={() => removeMember(member.id)}
                        className="text-slate-400 opacity-0 group-hover:opacity-100 hover:text-red-600 transition-all p-1 rounded"
                        title="Remove member"
                      >
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Activity Log */}
        <div className="bg-white border border-slate-200 rounded-xl flex flex-col h-[calc(100vh-12rem)] shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <div className="p-4 border-b border-slate-100 shrink-0 bg-slate-50/70 rounded-t-xl">
            <h2 className="text-[14px] font-bold text-[#0F172A] flex items-center gap-2">
              <Activity size={16} className="text-[#635BFF]" /> Team Security & Audit Feed
            </h2>
          </div>
          
          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            {activities.length === 0 ? (
              <div className="text-center text-slate-400 text-[13px] py-12">No recent activity.</div>
            ) : (
              activities.map((activity, index) => (
                <div key={activity.id} className="relative pl-5">
                  {/* Timeline line */}
                  {index !== activities.length - 1 && (
                    <div className="absolute left-[7px] top-5 bottom-[-20px] w-[1px] bg-slate-200"></div>
                  )}
                  {/* Timeline dot */}
                  <div className="absolute left-0 top-1.5 w-3.5 h-3.5 rounded-full bg-white border-2 border-slate-300 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#635BFF]"></div>
                  </div>
                  
                  <p className="text-[12.5px] text-[#0F172A] font-semibold leading-snug">{activity.action}</p>
                  <p className="text-[10.5px] text-slate-400 mt-0.5 font-mono">
                    {activity.user ? activity.user.full_name : 'System'} • {new Date(activity.created_at).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
