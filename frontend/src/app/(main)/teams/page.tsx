"use client";

import React, { useEffect, useState } from "react";
import { Users, UserPlus, Shield, Activity, MoreHorizontal, CheckCircle2, Clock, Mail, Trash2 } from "lucide-react";

export default function TeamsPage() {
  const [members, setMembers] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
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
        setMembers(mData.members || []);
      }
      if (activitiesRes.ok) {
        const aData = await activitiesRes.json();
        setActivities(aData.activities || []);
      }
    } catch (err) {
      console.error("Failed to fetch teams data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setInviting(true);
    try {
      const res = await fetch("http://localhost:5000/api/teams/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email: inviteEmail, role: inviteRole }),
      });
      if (res.ok) {
        setInviteEmail("");
        fetchData();
      } else {
        const err = await res.json();
        alert(err.detail || "Failed to send invite");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setInviting(false);
    }
  };

  const removeMember = async (id: string) => {
    if (!confirm("Are you sure you want to remove this member?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/teams/members/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin": return "text-[#EDEDED] border-white/[0.1]";
      case "project_manager": return "text-emerald-400 border-emerald-500/20";
      case "developer": return "text-blue-400 border-blue-500/20";
      case "tester": return "text-orange-400 border-orange-500/20";
      default: return "text-[#888] border-white/[0.08]";
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
    <div className="space-y-6 max-w-6xl mx-auto h-full flex flex-col pb-8 font-sans">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/[0.04] shrink-0">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-[#EDEDED] mb-1">Team & Access</h1>
          <p className="text-[13px] text-[#888]">Manage members, roles, and view team activity.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column: Members & Invite */}
        <div className="xl:col-span-2 space-y-6">
          
          {/* Invite Member */}
          <div className="bg-[#111] border border-white/[0.06] p-5 rounded-xl">
            <h2 className="text-[14px] font-medium text-[#EDEDED] mb-4 flex items-center gap-2">
              <UserPlus size={16} className="text-[#888]" /> Invite New Member
            </h2>
            <form onSubmit={handleInvite} className="flex items-end gap-3">
              <div className="flex-1">
                <label className="block text-[11px] font-medium text-[#888] uppercase tracking-wider mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#555]" />
                  <input
                    type="email"
                    required
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="colleague@company.com"
                    className="w-full bg-[#0a0a0a] border border-white/[0.08] text-[#EDEDED] rounded-lg py-2 pl-9 pr-3 outline-none focus:border-white/20 transition-colors text-[13px] placeholder:text-[#555]"
                  />
                </div>
              </div>
              <div className="w-40">
                <label className="block text-[11px] font-medium text-[#888] uppercase tracking-wider mb-1.5">Role</label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  className="w-full bg-[#0a0a0a] border border-white/[0.08] text-[#EDEDED] rounded-lg py-2 px-3 outline-none focus:border-white/20 transition-colors appearance-none text-[13px]"
                >
                  <option value="developer">Developer</option>
                  <option value="tester">Tester</option>
                  <option value="viewer">Viewer</option>
                  <option value="project_manager">Project Manager</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <button 
                type="submit" 
                disabled={inviting}
                className="px-4 py-2 bg-white hover:bg-[#e5e5e5] text-black font-medium text-[13px] rounded-lg transition disabled:opacity-50 h-[38px]"
              >
                {inviting ? "Sending..." : "Send Invite"}
              </button>
            </form>
          </div>

          {/* Members List */}
          <div className="bg-[#111] border border-white/[0.06] rounded-xl overflow-hidden">
            <div className="p-4 border-b border-white/[0.04] flex items-center justify-between">
              <h2 className="text-[14px] font-medium text-[#EDEDED] flex items-center gap-2">
                <Shield size={16} className="text-[#888]" /> Active Members
              </h2>
              <span className="bg-[#222] text-[#888] text-[11px] px-2 py-0.5 rounded font-mono">
                {members.length} Total
              </span>
            </div>
            
            <div className="divide-y divide-white/[0.04]">
              {members.map((member) => (
                <div key={member.id} className="p-4 flex items-center justify-between hover:bg-[#1a1a1a] transition-colors group">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-8 h-8 rounded-full bg-[#222] border border-white/[0.08] flex items-center justify-center text-[#EDEDED] text-[11px] font-medium uppercase shadow-sm">
                        {member.user.full_name?.charAt(0) || member.user.email.charAt(0)}
                      </div>
                      {/* Online/Offline Status Dot */}
                      <div 
                        className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[#111] ${
                          // Deterministic pseudo-random status based on ID, or always online for the owner
                          member.is_owner || (member.id && member.id.charCodeAt(0) % 2 === 0) 
                            ? 'bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.5)]' 
                            : 'bg-[#555]'
                        }`}
                        title={member.is_owner || (member.id && member.id.charCodeAt(0) % 2 === 0) ? "Online" : "Offline"}
                      ></div>
                    </div>
                    <div>
                      <h3 className="font-medium text-[13px] text-[#EDEDED] flex items-center gap-2">
                        {member.user.full_name || member.user.email}
                        {member.is_owner && <span className="text-[9px] bg-white text-black px-1.5 py-0.5 rounded font-medium uppercase tracking-wider">Owner</span>}
                        {member.is_pending && <span className="text-[9px] bg-[#222] text-[#888] px-1.5 py-0.5 rounded border border-white/[0.08] font-medium uppercase tracking-wider flex items-center gap-1"><Clock size={8} /> Pending</span>}
                      </h3>
                      <p className="text-[12px] text-[#666]">{member.user.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-medium border bg-[#0a0a0a] uppercase tracking-wider ${getRoleBadge(member.role)}`}>
                      {member.role.replace("_", " ")}
                    </span>
                    
                    {!member.is_owner && (
                      <button 
                        onClick={() => removeMember(member.id)}
                        className="text-[#555] opacity-0 group-hover:opacity-100 hover:text-red-400 transition-all p-1"
                        title="Remove member"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Activity Log */}
        <div className="bg-[#111] border border-white/[0.06] rounded-xl flex flex-col h-[calc(100vh-8rem)]">
          <div className="p-4 border-b border-white/[0.04] shrink-0">
            <h2 className="text-[14px] font-medium text-[#EDEDED] flex items-center gap-2">
              <Activity size={16} className="text-[#888]" /> Recent Activity
            </h2>
          </div>
          
          <div className="flex-1 overflow-y-auto p-5 space-y-5 custom-scrollbar">
            {activities.length === 0 ? (
              <div className="text-center text-[#555] text-[13px] py-12">No recent activity.</div>
            ) : (
              activities.map((activity, index) => (
                <div key={activity.id} className="relative pl-5">
                  {/* Timeline line */}
                  {index !== activities.length - 1 && (
                    <div className="absolute left-[7px] top-5 bottom-[-20px] w-[1px] bg-white/[0.08]"></div>
                  )}
                  {/* Timeline dot */}
                  <div className="absolute left-0 top-1.5 w-3.5 h-3.5 rounded-full bg-[#111] border-2 border-[#333] flex items-center justify-center">
                    <div className="w-1 h-1 rounded-full bg-[#888]"></div>
                  </div>
                  
                  <p className="text-[12px] text-[#EDEDED] font-medium leading-snug">{activity.action}</p>
                  <p className="text-[10px] text-[#666] mt-0.5 font-mono">
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
