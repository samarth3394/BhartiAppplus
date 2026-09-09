"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
    LayoutDashboard, 
    Bug, 
    Zap, 
    Activity, 
    Settings, 
    KanbanSquare, 
    Map, 
    Wrench,
    Users,
    LogOut,
    Menu,
    X,
    Server,
    ChevronDown,
    Check,
    Plus,
    Folder,
    Box,
    User,
    MessageSquare,
    ChevronRight,
    Terminal
} from "lucide-react";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const [apps, setApps] = useState<any[]>([]);
  const [workspaces, setWorkspaces] = useState<any[]>([]);
  const [currentAppId, setCurrentAppId] = useState<string | null>(null);
  const [currentWorkspaceId, setCurrentWorkspaceId] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    Overview: true,
    Communication: true,
    Planning: true,
    Operations: true,
    System: true
  });

  const toggleGroup = (title: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [title]: !prev[title]
    }));
  };

  // Modals
  const [showAppModal, setShowAppModal] = useState(false);
  const [showWorkspaceModal, setShowWorkspaceModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [newUrl, setNewUrl] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const wRes = await fetch("http://localhost:5000/api/workspaces", { credentials: "include" });
      if (wRes.ok) {
        const wData = await wRes.json();
        setWorkspaces(wData.workspaces || []);
        setCurrentWorkspaceId(wData.current_workspace_id);
      }

      const aRes = await fetch("http://localhost:5000/api/apps", { credentials: "include" });
      if (aRes.ok) {
        const aData = await aRes.json();
        setApps(aData.apps || []);
        setCurrentAppId(aData.current_app_id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const switchWorkspace = async (workspaceId: string) => {
    try {
      await fetch(`http://localhost:5000/api/workspaces/switch/${workspaceId}`, {
        method: "POST",
        credentials: "include"
      });
      window.location.reload();
    } catch (err) {
      console.error(err);
    }
  };

  const switchApp = async (appId: string) => {
    try {
      await fetch(`http://localhost:5000/api/apps/switch/${appId}`, {
        method: "POST",
        credentials: "include"
      });
      window.location.reload();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSignOut = async () => {
    try {
      await fetch("http://localhost:5000/api/auth/logout", {
        method: "POST",
        credentials: "include"
      });
      router.push("/login");
    } catch (err) {
      console.error(err);
    }
  };

  const createWorkspace = async () => {
    if (!newName.trim()) return;
    try {
      const res = await fetch("http://localhost:5000/api/workspaces", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name: newName })
      });
      if (res.ok) {
        window.location.reload();
      } else {
        const errorData = await res.json();
        alert(errorData.detail || "Failed to create workspace");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred");
    }
  };

  const createApp = async () => {
    if (!newName.trim()) return;
    try {
      const res = await fetch("http://localhost:5000/api/apps", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name: newName, url: newUrl, workspace_id: currentWorkspaceId || "personal" })
      });
      if (res.ok) {
        window.location.reload();
      } else {
        const errorData = await res.json();
        alert(errorData.detail || "Failed to create app");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred");
    }
  };

  const navGroups = [
    {
      title: "Overview",
      items: [
        { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { name: "AI Copilot", href: "/ai-dashboard", icon: Zap },
      ]
    },
    {
      title: "Communication",
      items: [
        { name: "Inbox", href: "/inbox", icon: MessageSquare },
        { name: "Teams", href: "/teams", icon: Users },
      ]
    },
    {
      title: "Planning",
      items: [
        { name: "Kanban", href: "/kanban", icon: KanbanSquare },
        { name: "Issues & Bugs", href: "/bugs", icon: Bug },
        { name: "Roadmap", href: "/roadmap", icon: Map },
      ]
    },
    {
      title: "Operations",
      items: [
        { name: "Uptime", href: "/uptime", icon: Activity },
        { name: "Infrastructure", href: "/infrastructure", icon: Server },
        { name: "Logs", href: "/logs", icon: Terminal },
        { name: "Maintenance", href: "/maintenance", icon: Wrench },
      ]
    },
    {
      title: "System",
      items: [
        { name: "Settings", href: "/settings", icon: Settings },
      ]
    }
  ];

  const currentApp = apps.find(a => a.id === currentAppId);
  const currentWorkspace = workspaces.find(w => w.id === currentWorkspaceId);

  return (
    <div className="min-h-screen bg-[#080808] text-[#EDEDED] flex font-sans selection:bg-white/20">
      {/* Mobile Menu Toggle */}
      <div className="lg:hidden fixed top-3 right-4 z-50">
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
          className="p-1.5 bg-[#111] rounded-md border border-white/10"
        >
          {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-[#0a0a0a] border-r border-white/[0.04] flex flex-col transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:static
      `}>
        <div className="px-4 py-4 flex items-center gap-2 h-14 border-b border-white/[0.02]">
          <div className="w-5 h-5 bg-white rounded-sm flex items-center justify-center shrink-0">
            <span className="text-[10px] font-bold text-black">B</span>
          </div>
          <h1 className="text-sm font-semibold text-[#EDEDED] tracking-tight">
            BhartiAppPlus
          </h1>
        </div>
        
        <nav className="flex-1 px-3 py-4 space-y-4 overflow-y-auto no-scrollbar">
          {navGroups.map((group, idx) => {
            const isExpanded = expandedGroups[group.title];
            return (
              <div key={idx} className="flex flex-col mb-1">
                <button 
                  onClick={() => toggleGroup(group.title)}
                  className="w-full px-2 py-1 flex justify-between items-center text-[#666666] hover:text-[#888888] transition-colors rounded-md"
                >
                  <span className="text-[10px] font-medium tracking-wider uppercase">{group.title}</span>
                  {isExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                </button>
                <div className={`grid transition-all duration-200 ease-in-out ${isExpanded ? "grid-rows-[1fr] opacity-100 mt-0.5" : "grid-rows-[0fr] opacity-0"}`}>
                  <div className="overflow-hidden space-y-0.5">
                    {group.items.map((item) => {
                      const Icon = item.icon;
                      const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                      return (
                        <a
                          key={item.name}
                          href={item.href}
                          title={item.name}
                          className={`
                            flex items-center gap-2.5 px-2 py-1.5 rounded-md text-[13px] font-medium transition-all duration-150 whitespace-nowrap overflow-hidden
                            ${isActive 
                              ? "bg-white/[0.06] text-white" 
                              : "text-[#888888] hover:text-[#EDEDED] hover:bg-white/[0.03]"}
                          `}
                        >
                          <Icon size={14} className={`shrink-0 ${isActive ? "text-white" : "text-[#666]"}`} />
                          <span>
                            {item.name}
                          </span>
                        </a>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </nav>

        <div className="p-3 border-t border-white/[0.04]">
          <button onClick={handleSignOut} title="Sign out" className="flex w-full items-center gap-2.5 px-2 py-1.5 rounded-md text-[13px] font-medium text-[#888888] hover:text-[#EDEDED] hover:bg-white/[0.03] transition-colors">
            <LogOut size={14} className="shrink-0 text-[#666]" />
            <span>Sign out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-[#080808]">
        {/* Top Header */}
        <header className="h-14 border-b border-white/[0.04] bg-[#0a0a0a]/80 backdrop-blur-md flex items-center justify-between px-6 relative z-30">
            
            {/* App Switcher Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-1.5 text-[#888888] text-[13px] hover:text-[#EDEDED] transition-colors px-2 py-1 rounded-md hover:bg-white/[0.03]"
              >
                {currentWorkspace ? currentWorkspace.name : "Personal"} 
                <span className="text-[#555]">/</span> 
                <span className="font-medium text-[#EDEDED]">{currentApp ? currentApp.name : "Select App"}</span>
                {currentApp && currentApp.role && (
                  <span className="ml-1 px-1 py-[1px] rounded text-[9px] bg-white/[0.06] text-[#888] border border-white/[0.04] uppercase tracking-wider font-semibold">
                    {currentApp.role}
                  </span>
                )}
                <ChevronDown size={12} className="ml-0.5 text-[#555]" />
              </button>

              {isDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsDropdownOpen(false)}></div>
                  <div className="absolute top-full left-0 mt-2 w-64 bg-[#111111] border border-white/[0.08] rounded-lg shadow-2xl overflow-hidden z-20">
                    
                    {/* Workspaces Section */}
                    <div className="p-1.5 border-b border-white/[0.04]">
                      <div className="px-2 py-1.5 text-[10px] font-medium text-[#666] tracking-wider flex items-center justify-between">
                        WORKSPACES
                        <button onClick={() => { setIsDropdownOpen(false); setNewName(""); setShowWorkspaceModal(true); }} className="hover:text-white p-0.5 hover:bg-white/10 rounded"><Plus size={12} /></button>
                      </div>
                      <button
                        onClick={() => switchWorkspace("personal")}
                        className="w-full text-left px-2 py-1.5 text-[13px] hover:bg-white/[0.04] flex items-center justify-between group transition-colors rounded-md"
                      >
                        <span className="flex items-center gap-2 text-[#EDEDED]"><Folder size={12} className="text-[#666]"/> Personal</span>
                        {!currentWorkspaceId && <Check size={12} className="text-white" />}
                      </button>
                      {workspaces.map(w => (
                        <button
                          key={w.id}
                          onClick={() => switchWorkspace(w.id)}
                          className="w-full text-left px-2 py-1.5 text-[13px] hover:bg-white/[0.04] flex items-center justify-between group transition-colors rounded-md"
                        >
                          <span className="flex items-center gap-2 text-[#EDEDED]"><Folder size={12} className="text-[#666]"/> {w.name}</span>
                          {w.id === currentWorkspaceId && <Check size={12} className="text-white" />}
                        </button>
                      ))}
                    </div>

                    {/* Apps Section */}
                    <div className="p-1.5">
                      <div className="px-2 py-1.5 text-[10px] font-medium text-[#666] tracking-wider flex items-center justify-between">
                        APPS IN {currentWorkspace ? currentWorkspace.name.toUpperCase() : "PERSONAL"}
                        <button onClick={() => { setIsDropdownOpen(false); setNewName(""); setShowAppModal(true); }} className="hover:text-white p-0.5 hover:bg-white/10 rounded"><Plus size={12} /></button>
                      </div>
                      {apps.length === 0 ? (
                        <div className="px-2 py-2 text-xs text-[#666] text-center">No apps found. Create one!</div>
                      ) : (
                        apps.map(app => (
                          <button
                            key={app.id}
                            onClick={() => switchApp(app.id)}
                            className="w-full text-left px-2 py-1.5 text-[13px] hover:bg-white/[0.04] flex items-center justify-between group transition-colors rounded-md"
                          >
                            <span className={`flex items-center gap-2 ${app.id === currentAppId ? 'text-white font-medium' : 'text-[#EDEDED]'}`}>
                              <Box size={12} className={app.id === currentAppId ? 'text-white' : 'text-[#666]'} /> {app.name}
                            </span>
                            {app.id === currentAppId && <Check size={12} className="text-white" />}
                          </button>
                        ))
                      )}
                    </div>

                  </div>
                </>
              )}
            </div>

            <div className="flex items-center gap-4">
                <Link href="/settings" className="w-7 h-7 rounded-full bg-[#1a1a1a] border border-white/[0.08] flex items-center justify-center hover:border-white/[0.2] transition-colors cursor-pointer overflow-hidden">
                    <User size={14} className="text-[#888]" />
                </Link>
            </div>
        </header>

        <div className="flex-1 overflow-y-auto bg-[#080808] p-6 relative">
          {children}

          {/* Creation Modals (Linear Style) */}
          {showWorkspaceModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
              <div className="bg-[#111111] border border-white/[0.08] rounded-xl w-full max-w-sm p-5 shadow-2xl">
                <h2 className="text-[15px] font-medium text-white mb-4">Create workspace</h2>
                <input 
                  type="text" 
                  placeholder="Workspace Name"
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  className="w-full bg-[#0a0a0a] border border-white/[0.08] text-white rounded-lg py-2 px-3 mb-5 outline-none focus:border-white/20 text-sm placeholder:text-[#555]"
                  autoFocus
                />
                <div className="flex justify-end gap-2">
                  <button onClick={() => setShowWorkspaceModal(false)} className="px-3 py-1.5 text-[13px] text-[#888] hover:text-white transition">Cancel</button>
                  <button onClick={createWorkspace} className="px-3 py-1.5 bg-white hover:bg-[#e5e5e5] text-black rounded-md text-[13px] font-medium transition">Create</button>
                </div>
              </div>
            </div>
          )}

          {showAppModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
              <div className="bg-[#111111] border border-white/[0.08] rounded-xl w-full max-w-sm p-5 shadow-2xl">
                <h2 className="text-[15px] font-medium text-white mb-4">Create new app</h2>
                <input 
                  type="text" 
                  placeholder="App Name"
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  className="w-full bg-[#0a0a0a] border border-white/[0.08] text-white rounded-lg py-2 px-3 mb-3 outline-none focus:border-white/20 text-sm placeholder:text-[#555]"
                  autoFocus
                />
                <input 
                  type="url" 
                  placeholder="URL (Optional)"
                  value={newUrl}
                  onChange={e => setNewUrl(e.target.value)}
                  className="w-full bg-[#0a0a0a] border border-white/[0.08] text-white rounded-lg py-2 px-3 mb-5 outline-none focus:border-white/20 text-sm placeholder:text-[#555]"
                />
                <div className="flex justify-end gap-2">
                  <button onClick={() => { setShowAppModal(false); setNewUrl(""); }} className="px-3 py-1.5 text-[13px] text-[#888] hover:text-white transition">Cancel</button>
                  <button onClick={createApp} className="px-3 py-1.5 bg-white hover:bg-[#e5e5e5] text-black rounded-md text-[13px] font-medium transition">Create App</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
