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
      case "admin": return "bg-purple-500/10 text-purple-400 border-purple-500/20";
      case "project_manager": return "bg-orange-500/10 text-orange-400 border-orange-500/20";
      case "developer": return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "tester": return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      default: return "bg-zinc-500/10 text-zinc-400 border-zinc-500/20";
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
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 h-full flex flex-col pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-500/20 text-blue-400 rounded-xl border border-blue-500/30">
            <Users size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white mb-1">Team & Access</h1>
            <p className="text-zinc-400">Manage members, roles, and view team activity.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column: Members & Invite */}
        <div className="xl:col-span-2 space-y-6">
          
          {/* Invite Member */}
          <div className="bg-zinc-900/40 backdrop-blur-xl border border-white/10 p-6 rounded-2xl">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <UserPlus size={20} className="text-blue-400" /> Invite New Member
            </h2>
            <form onSubmit={handleInvite} className="flex items-end gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-zinc-400 mb-2">Email Address</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                  <input
                    type="email"
                    required
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="colleague@company.com"
                    className="w-full bg-black/50 border border-white/10 text-white rounded-xl py-2.5 pl-10 pr-4 outline-none focus:border-blue-500/50 transition-colors"
                  />
                </div>
              </div>
              <div className="w-48">
                <label className="block text-sm font-medium text-zinc-400 mb-2">Role</label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 text-white rounded-xl py-2.5 px-4 outline-none focus:border-blue-500/50 transition-colors appearance-none"
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
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-xl transition disabled:opacity-50 h-[46px]"
              >
                {inviting ? "Sending..." : "Send Invite"}
              </button>
            </form>
          </div>

          {/* Members List */}
          <div className="bg-zinc-900/40 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Shield size={20} className="text-emerald-400" /> Active Members
              </h2>
              <span className="bg-white/10 text-zinc-300 text-xs px-2.5 py-1 rounded-full font-medium">
                {members.length} Total
              </span>
            </div>
            
            <div className="divide-y divide-white/5">
              {members.map((member) => (
                <div key={member.id} className="p-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold uppercase">
                      {member.user.full_name?.charAt(0) || member.user.email.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-white flex items-center gap-2">
                        {member.user.full_name || member.user.email}
                        {member.is_owner && <span className="text-[10px] bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border border-purple-500/20">Owner</span>}
                        {member.is_pending && <span className="text-[10px] bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border border-orange-500/20 flex items-center gap-1"><Clock size={10} /> Pending</span>}
                      </h3>
                      <p className="text-sm text-zinc-500">{member.user.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border capitalize ${getRoleBadge(member.role)}`}>
                      {member.role.replace("_", " ")}
                    </span>
                    
                    {!member.is_owner && (
                      <button 
                        onClick={() => removeMember(member.id)}
                        className="text-zinc-500 hover:text-red-400 transition-colors p-2"
                        title="Remove member"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Activity Log */}
        <div className="bg-zinc-900/40 backdrop-blur-xl border border-white/10 rounded-2xl flex flex-col h-[calc(100vh-8rem)]">
          <div className="p-6 border-b border-white/5 shrink-0">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Activity size={20} className="text-orange-400" /> Recent Activity
            </h2>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
            {activities.length === 0 ? (
              <div className="text-center text-zinc-500 py-12">No recent activity.</div>
            ) : (
              activities.map((activity, index) => (
                <div key={activity.id} className="relative pl-6">
                  {/* Timeline line */}
                  {index !== activities.length - 1 && (
                    <div className="absolute left-[11px] top-6 bottom-[-24px] w-px bg-white/5"></div>
                  )}
                  {/* Timeline dot */}
                  <div className="absolute left-0 top-1.5 w-[22px] h-[22px] rounded-full bg-zinc-900 border-4 border-zinc-800 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div>
                  </div>
                  
                  <p className="text-sm text-zinc-300 font-medium">{activity.action}</p>
                  <p className="text-xs text-zinc-500 mt-1">
                    {activity.user ? activity.user.full_name : 'System'} • {new Date(activity.created_at).toLocaleString()}
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
