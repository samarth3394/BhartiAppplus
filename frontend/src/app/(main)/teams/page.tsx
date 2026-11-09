"use client";

import React, { useEffect, useState } from "react";
import { Users, UserPlus, Shield, Activity, MoreHorizontal, CheckCircle2, Clock, Mail, Trash2 } from "lucide-react";

const DEFAULT_MEMBERS = [
  {
    id: "mem-1",
    user: { 
      full_name: "Samarth Choudhar", 
      email: "samarth@brexal.com",
      avatar_url: "/avatars/samarth.png"
    },
    role: "admin",
    title: "Founder & Lead Architect",
    is_owner: true,
    is_pending: false,
    online: true
  },
  {
    id: "mem-2",
    user: { 
      full_name: "Neha Sharma", 
      email: "neha.s@brexal.com",
      avatar_url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"
    },
    role: "project_manager",
    title: "Lead SRE & Platform Engineer",
    is_owner: false,
    is_pending: false,
    online: true
  },
  {
    id: "mem-3",
    user: { 
      full_name: "Rohan Patil", 
      email: "rohan.p@brexal.com",
      avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
    },
    role: "developer",
    title: "Staff Distributed Systems Engineer",
    is_owner: false,
    is_pending: false,
    online: true
  },
  {
    id: "mem-4",
    user: { 
      full_name: "Ananya Iyer", 
      email: "ananya.i@brexal.com",
      avatar_url: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80"
    },
    role: "developer",
    title: "AI Telemetry & Neural Models",
    is_owner: false,
    is_pending: false,
    online: false
  },
  {
    id: "mem-5",
    user: { 
      full_name: "Vikram Desai", 
      email: "vikram.d@brexal.com",
      avatar_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80"
    },
    role: "tester",
    title: "Senior Chaos & QA Engineer",
    is_owner: false,
    is_pending: false,
    online: true
  },
  {
    id: "mem-6",
    user: { 
      full_name: "Sarah Jenkins", 
      email: "sarah.j@brexal.com",
      avatar_url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80"
    },
    role: "viewer",
    title: "Enterprise Security Auditor",
    is_owner: false,
    is_pending: true,
    online: false
  },
  {
    id: "mem-7",
    user: { 
      full_name: "Alex Rivera", 
      email: "alex.r@brexal.com",
      avatar_url: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80"
    },
    role: "developer",
    title: "Cloud Infrastructure Specialist",
    is_owner: false,
    is_pending: false,
    online: true
  }
];

const DEFAULT_ACTIVITIES = [
  {
    id: "act-1",
    action: "Samarth Choudhar provisioned production cluster API key for Brexal AI",
    user: { 
      full_name: "Samarth Choudhar",
      avatar_url: "/avatars/samarth.png"
    },
    created_at: new Date(Date.now() - 15 * 60 * 1000).toISOString()
  },
  {
    id: "act-2",
    action: "Neha Sharma calibrated P2 latency alert threshold to 120ms",
    user: { 
      full_name: "Neha Sharma",
      avatar_url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"
    },
    created_at: new Date(Date.now() - 65 * 60 * 1000).toISOString()
  },
  {
    id: "act-3",
    action: "Rohan Patil merged PR #42: Distributed tracing span collector",
    user: { 
      full_name: "Rohan Patil",
      avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
    },
    created_at: new Date(Date.now() - 180 * 60 * 1000).toISOString()
  },
  {
    id: "act-4",
    action: "Ananya Iyer deployed fine-tuned anomaly detection model v2.1",
    user: { 
      full_name: "Ananya Iyer",
      avatar_url: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80"
    },
    created_at: new Date(Date.now() - 360 * 60 * 1000).toISOString()
  },
  {
    id: "act-5",
    action: "Vikram Desai completed synthetic load testing across 8 regions",
    user: { 
      full_name: "Vikram Desai",
      avatar_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80"
    },
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

      let combinedMembers = [...DEFAULT_MEMBERS];
      if (membersRes.ok) {
        const mData = await membersRes.json();
        if (mData.members && mData.members.length > 0) {
          const serverUser = mData.members[0];
          combinedMembers = [
            {
              id: serverUser.id || "mem-owner",
              user: {
                full_name: serverUser.user?.full_name || "Samarth Choudhar",
                email: serverUser.user?.email || "samarth@brexal.com",
                avatar_url: serverUser.user?.avatar_url || "/avatars/samarth.png"
              },
              role: serverUser.role || "admin",
              title: "Founder & Lead Architect",
              is_owner: true,
              is_pending: false,
              online: true
            },
            ...DEFAULT_MEMBERS.slice(1)
          ];
        }
      }
      setMembers(combinedMembers);

      let combinedActivities = [...DEFAULT_ACTIVITIES];
      if (activitiesRes.ok) {
        const aData = await activitiesRes.json();
        if (aData.activities && aData.activities.length > 0) {
          const serverActs = aData.activities.map((act: any) => ({
            ...act,
            user: {
              full_name: act.user_name || act.user?.full_name || "Samarth Choudhar",
              avatar_url: "/avatars/samarth.png"
            }
          }));
          combinedActivities = [...serverActs, ...DEFAULT_ACTIVITIES];
        }
      }
      setActivities(combinedActivities);
    } catch (err) {
      setMembers(DEFAULT_MEMBERS);
      setActivities(DEFAULT_ACTIVITIES);
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
      user: { 
        full_name: inviteEmail.split("@")[0], 
        email: inviteEmail,
        avatar_url: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"
      },
      role: inviteRole,
      title: "Team Member",
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
      case "admin": return "text-purple-700 bg-purple-50 border-purple-200/80";
      case "project_manager": return "text-emerald-700 bg-emerald-50 border-emerald-200/80";
      case "developer": return "text-blue-700 bg-blue-50 border-blue-200/80";
      case "tester": return "text-amber-700 bg-amber-50 border-amber-200/80";
      default: return "text-slate-700 bg-slate-100 border-slate-200/80";
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto h-full flex flex-col pb-8 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200/80 shrink-0">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0A2540]">
              Team & Role-Based Access
            </h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold uppercase tracking-wider bg-[#635BFF]/10 text-[#635BFF] border border-[#635BFF]/20">
              RBAC Enabled
            </span>
          </div>
          <p className="text-[13.5px] text-[#425466]">
            Manage organization members, assign role permissions, and audit security events.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column: Members & Invite */}
        <div className="xl:col-span-2 space-y-6">
          
          {/* Invite Member */}
          <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-[0_4px_20px_rgba(10,37,64,0.03)]">
            <h2 className="text-[15px] font-bold text-[#0A2540] mb-4 flex items-center gap-2">
              <UserPlus size={17} className="text-[#635BFF]" /> Invite New Colleague
            </h2>
            <form onSubmit={handleInvite} className="flex flex-col sm:flex-row items-stretch sm:items-end gap-3.5">
              <div className="flex-1">
                <label className="block text-[11px] font-bold text-[#425466] uppercase tracking-wider mb-1.5">Work Email</label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="developer@brexal.com"
                    className="w-full bg-[#FAFBFD] border border-slate-200/90 text-[#0A2540] rounded-xl py-2.5 pl-10 pr-3.5 outline-none focus:border-[#635BFF] focus:bg-white focus:ring-2 focus:ring-[#635BFF]/15 transition text-[13px] placeholder:text-slate-400 font-semibold"
                  />
                </div>
              </div>
              <div className="w-full sm:w-48">
                <label className="block text-[11px] font-bold text-[#425466] uppercase tracking-wider mb-1.5">Role Permission</label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  className="w-full bg-[#FAFBFD] border border-slate-200/90 text-[#0A2540] rounded-xl py-2.5 px-3.5 outline-none focus:border-[#635BFF] focus:bg-white focus:ring-2 focus:ring-[#635BFF]/15 transition text-[13px] font-semibold"
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
                className="px-5 py-2.5 bg-[#635BFF] hover:bg-[#5349e0] text-white font-bold text-[13px] rounded-xl transition-all shadow-[0_4px_14px_rgba(99,91,255,0.25)] hover:shadow-[0_6px_20px_rgba(99,91,255,0.35)] disabled:opacity-50 h-[42px] cursor-pointer shrink-0"
              >
                {inviting ? "Sending..." : "Send Invite"}
              </button>
            </form>
          </div>

          {/* Members List */}
          <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(10,37,64,0.03)]">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-[#FAFBFD]">
              <h2 className="text-[15px] font-bold text-[#0A2540] flex items-center gap-2">
                <Shield size={17} className="text-[#635BFF]" /> Active Team Members
              </h2>
              <span className="bg-white border border-slate-200 text-slate-700 text-[11px] font-bold px-3 py-1 rounded-full shadow-2xs">
                {members.length} Members
              </span>
            </div>
            
            <div className="divide-y divide-slate-100">
              {members.map((member) => {
                const avatarSrc = member.user?.avatar_url || (
                  member.is_owner 
                    ? "/avatars/samarth.png" 
                    : "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
                );
                return (
                  <div key={member.id} className="p-4 sm:p-5 flex items-center justify-between hover:bg-slate-50/70 transition-colors group">
                    <div className="flex items-center gap-3.5">
                      <div className="relative">
                        <img 
                          src={avatarSrc} 
                          alt={member.user?.full_name || ""} 
                          className="w-10 h-10 rounded-full object-cover border border-slate-200 shadow-2xs" 
                        />
                        <div 
                          className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${
                            member.is_owner || member.online
                              ? 'bg-emerald-500 ring-1 ring-emerald-500/20' 
                              : 'bg-slate-300'
                          }`}
                          title={member.is_owner || member.online ? "Online" : "Offline"}
                        ></div>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-[14px] text-[#0A2540]">
                            {member.user?.full_name || member.user?.email}
                          </h3>
                          {member.is_owner && <span className="text-[9.5px] bg-[#0A2540] text-white px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Owner</span>}
                          {member.is_pending && <span className="text-[9.5px] bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider flex items-center gap-1"><Clock size={10} /> Pending</span>}
                        </div>
                        <div className="flex flex-wrap items-center gap-2 mt-0.5 text-[12px]">
                          {member.title && (
                            <span className="text-slate-600 font-semibold">{member.title} •</span>
                          )}
                          <span className="text-[#425466] font-medium">{member.user?.email}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 sm:gap-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10.5px] font-bold border uppercase tracking-wider ${getRoleBadge(member.role)}`}>
                        {member.role.replace("_", " ")}
                      </span>
                      
                      {!member.is_owner && (
                        <button 
                          onClick={() => removeMember(member.id)}
                          className="text-slate-400 opacity-0 group-hover:opacity-100 hover:text-red-600 transition-all p-1.5 rounded-lg cursor-pointer"
                          title="Remove member"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Activity Log */}
        <div className="bg-white border border-slate-200/80 rounded-2xl flex flex-col h-[calc(100vh-13rem)] shadow-[0_4px_20px_rgba(10,37,64,0.03)]">
          <div className="p-4 sm:p-5 border-b border-slate-100 shrink-0 bg-[#FAFBFD] rounded-t-2xl">
            <h2 className="text-[15px] font-bold text-[#0A2540] flex items-center gap-2">
              <Activity size={17} className="text-[#635BFF]" /> Security & Audit Feed
            </h2>
          </div>
          
          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            {activities.length === 0 ? (
              <div className="text-center text-[#425466] text-[13px] py-12">No recent security events.</div>
            ) : (
              activities.map((activity) => {
                const actAvatar = activity.user?.avatar_url || "/avatars/samarth.png";
                return (
                  <div key={activity.id} className="flex items-start gap-3 relative pl-1">
                    <img 
                      src={actAvatar} 
                      alt="" 
                      className="w-7 h-7 rounded-full object-cover border border-slate-200 shrink-0 mt-0.5 shadow-2xs" 
                    />
                    <div className="flex-1">
                      <p className="text-[12.5px] text-[#0A2540] font-semibold leading-snug">{activity.action}</p>
                      <p className="text-[10.5px] text-[#425466] mt-0.5 font-mono">
                        {activity.user ? activity.user.full_name : 'System'} • {new Date(activity.created_at).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
