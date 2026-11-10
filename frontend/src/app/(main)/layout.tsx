"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Logo } from "@/components/Logo";
import { CommandPalette } from "@/components/CommandPalette";
import { Toaster } from "sonner";
import { getApiUrl } from "@/lib/api";
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
    Terminal,
    Bell
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

  const [notifications, setNotifications] = useState<any[]>([]);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const fetchData = async () => {
    try {
      const wRes = await fetch(getApiUrl("/api/workspaces"), { credentials: "include" });
      if (wRes.ok) {
        const wData = await wRes.json();
        setWorkspaces(wData.workspaces || []);
        setCurrentWorkspaceId(wData.current_workspace_id);
      }

      const aRes = await fetch(getApiUrl("/api/apps"), { credentials: "include" });
      if (aRes.ok) {
        const aData = await aRes.json();
        setApps(aData.apps || []);
        setCurrentAppId(aData.current_app_id);
      }

      const nRes = await fetch(getApiUrl("/api/notifications"), { credentials: "include" });
      if (nRes.ok) {
        const nData = await nRes.json();
        setNotifications(nData.notifications || []);
      }
    } catch (err) {
      // Silently fail if backend is unreachable, it will retry on next poll
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000); // poll every 30s
    return () => clearInterval(interval);
  }, []);

  const markNotificationAsRead = async (id: string) => {
    try {
      await fetch(getApiUrl(`/api/notifications/${id}/read`), { method: "POST", credentials: "include" });
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
    } catch (err) { console.error(err); }
  };

  const markAllNotificationsAsRead = async () => {
    try {
      await fetch(getApiUrl("/api/notifications/read-all"), { method: "POST", credentials: "include" });
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    } catch (err) { console.error(err); }
  };

  const switchWorkspace = async (workspaceId: string) => {
    try {
      await fetch(getApiUrl(`/api/workspaces/switch/${workspaceId}`), {
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
      await fetch(getApiUrl(`/api/apps/switch/${appId}`), {
        method: "POST",
        credentials: "include"
      });
      setCurrentAppId(appId);
      window.location.reload();
    } catch (err) {
      console.error(err);
      setCurrentAppId(appId);
    }
  };

  const handleSignOut = async () => {
    try {
      await fetch(getApiUrl("/api/auth/logout"), {
        method: "POST",
        credentials: "include"
      });
      router.push("/login");
    } catch (err) {
      console.error("Sign out failed", err);
      router.push("/login");
    }
  };

  const createWorkspace = async () => {
    if (!newName.trim()) return;
    try {
      const res = await fetch(getApiUrl("/api/workspaces"), {
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
      const res = await fetch(getApiUrl("/api/apps"), {
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

  const DEFAULT_DEMO_APPS = [
    { id: "app-bharti-nexus", name: "Bharti Nexus", role: "ADMIN", url: "https://bhartinexus.com" },
    { id: "app-cloud-core", name: "Cloud Core Engine", role: "PROD", url: "https://api.bhartinexus.com" },
    { id: "app-ai-copilot", name: "AI Ops Copilot", role: "STAGING", url: "https://copilot.bhartinexus.com" }
  ];

  const displayedApps = apps.length > 0 ? apps : DEFAULT_DEMO_APPS;
  const currentApp = displayedApps.find(a => a.id === currentAppId) || displayedApps[0];
  const currentWorkspace = workspaces.find(w => w.id === currentWorkspaceId) || { name: "Personal" };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex font-sans selection:bg-[#635BFF]/15">
      {/* Mobile Menu Toggle */}
      <div className="lg:hidden fixed top-3 right-4 z-50">
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
          className="p-1.5 bg-white rounded-md border border-slate-200 shadow-sm text-slate-700"
        >
          {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-slate-200 flex flex-col transition-transform duration-300 ease-in-out shadow-[1px_0_4px_rgba(0,0,0,0.02)]
        ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:static
      `}>
        <div className="px-5 py-3.5 flex items-center justify-between h-14 border-b border-slate-200/80 bg-white">
          <Link href="/" className="flex items-center gap-2 group">
            <Logo className="h-4 text-[#0A2540] group-hover:text-[#635BFF] transition-colors" />
          </Link>
          <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-indigo-50 text-[#635BFF] border border-indigo-100 uppercase tracking-wider">
            CONSOLE
          </span>
        </div>
        
        <nav className="flex-1 px-3 py-4 space-y-4 overflow-y-auto no-scrollbar">
          {navGroups.map((group, idx) => {
            const isExpanded = expandedGroups[group.title];
            return (
              <div key={idx} className="flex flex-col mb-1">
                <button 
                  onClick={() => toggleGroup(group.title)}
                  className="w-full px-2 py-1 flex justify-between items-center text-slate-400 hover:text-slate-700 transition-colors rounded-md"
                >
                  <span className="text-[10px] font-bold tracking-wider uppercase text-slate-400">{group.title}</span>
                  {isExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                </button>
                <div className={`grid transition-all duration-200 ease-in-out ${isExpanded ? "grid-rows-[1fr] opacity-100 mt-0.5" : "grid-rows-[0fr] opacity-0"}`}>
                  <div className="overflow-hidden space-y-0.5">
                    {group.items.map((item) => {
                      const Icon = item.icon;
                      const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                      return (
                        <Link
                          key={item.name}
                          href={item.href}
                          title={item.name}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={`
                            flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] font-medium transition-all duration-150 whitespace-nowrap overflow-hidden
                            ${isActive 
                              ? "bg-[#635BFF]/10 text-[#635BFF] font-bold border border-[#635BFF]/20 shadow-2xs" 
                              : "text-slate-600 hover:text-[#0A2540] hover:bg-slate-50"}
                          `}
                        >
                          <Icon size={15} className={`shrink-0 ${isActive ? "text-[#635BFF]" : "text-slate-400"}`} />
                          <span>
                            {item.name}
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </nav>

        {/* User Info & Sign out in Sidebar */}
        <div className="p-3 border-t border-slate-200 bg-white">
          <div className="flex items-center gap-2.5 px-2 py-2 mb-1.5 rounded-lg bg-slate-50 border border-slate-100">
            <img 
              src="/avatars/samarth.png" 
              alt="Samarth Choudhar" 
              className="w-8 h-8 rounded-full object-cover border border-slate-200 shadow-xs" 
            />
            <div className="flex flex-col min-w-0">
              <span className="text-[12px] font-bold text-[#0F172A] truncate">Samarth Choudhar</span>
              <span className="text-[10px] text-slate-500 font-mono truncate">samarth@bhartinexus.com</span>
            </div>
          </div>
          <button onClick={handleSignOut} title="Sign out" className="flex w-full items-center gap-2.5 px-2 py-1.5 rounded-md text-[13px] font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 transition-colors">
            <LogOut size={14} className="shrink-0 text-slate-400" />
            <span>Sign out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-[#F8FAFC]">
        {/* Top Header */}
        <header className="h-14 border-b border-slate-200 bg-white/95 backdrop-blur-md flex items-center justify-between px-4 sm:px-6 relative z-30 shadow-xs">
            
            {/* App Switcher Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-1.5 text-slate-600 text-[13px] hover:text-[#0F172A] transition-colors px-2.5 py-1.5 rounded-lg hover:bg-slate-100 border border-transparent hover:border-slate-200"
              >
                <span className="text-slate-500 font-medium">{currentWorkspace ? currentWorkspace.name : "Personal"}</span>
                <span className="text-slate-300">/</span> 
                <span className="font-semibold text-[#0F172A]">{currentApp ? currentApp.name : "Bharti Nexus"}</span>
                {currentApp && currentApp.role && (
                  <span className="ml-1 px-1.5 py-0.5 rounded text-[9.5px] bg-slate-100 text-slate-700 border border-slate-200 uppercase tracking-wider font-bold">
                    {currentApp.role}
                  </span>
                )}
                <ChevronDown size={12} className="ml-0.5 text-slate-400" />
              </button>

              {isDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsDropdownOpen(false)}></div>
                  <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden z-20">
                    
                    {/* Workspaces Section */}
                    <div className="p-1.5 border-b border-slate-100">
                      <div className="px-2.5 py-1.5 text-[10px] font-bold text-slate-400 tracking-wider flex items-center justify-between uppercase">
                        WORKSPACES
                        <button onClick={() => { setIsDropdownOpen(false); setNewName(""); setShowWorkspaceModal(true); }} className="hover:text-[#0F172A] p-0.5 hover:bg-slate-100 rounded"><Plus size={12} /></button>
                      </div>
                      <button
                        onClick={() => switchWorkspace("personal")}
                        className="w-full text-left px-2.5 py-1.5 text-[13px] hover:bg-slate-50 flex items-center justify-between group transition-colors rounded-md"
                      >
                        <span className="flex items-center gap-2 text-[#0F172A]"><Folder size={12} className="text-slate-400"/> Personal</span>
                        {!currentWorkspaceId && <Check size={12} className="text-[#635BFF]" />}
                      </button>
                      {workspaces.map(w => (
                        <button
                          key={w.id}
                          onClick={() => switchWorkspace(w.id)}
                          className="w-full text-left px-2.5 py-1.5 text-[13px] hover:bg-slate-50 flex items-center justify-between group transition-colors rounded-md"
                        >
                          <span className="flex items-center gap-2 text-[#0F172A]"><Folder size={12} className="text-slate-400"/> {w.name}</span>
                          {w.id === currentWorkspaceId && <Check size={12} className="text-[#635BFF]" />}
                        </button>
                      ))}
                    </div>

                    {/* Apps Section */}
                    <div className="p-1.5">
                      <div className="px-2.5 py-1.5 text-[10px] font-bold text-slate-400 tracking-wider flex items-center justify-between uppercase">
                        APPS IN {currentWorkspace ? currentWorkspace.name.toUpperCase() : "PERSONAL"}
                        <button onClick={() => { setIsDropdownOpen(false); setNewName(""); setShowAppModal(true); }} className="hover:text-[#0F172A] p-0.5 hover:bg-slate-100 rounded"><Plus size={12} /></button>
                      </div>
                      {displayedApps.map(app => (
                        <button
                          key={app.id}
                          onClick={() => { switchApp(app.id); setIsDropdownOpen(false); }}
                          className={`w-full text-left px-2.5 py-1.5 text-[13px] hover:bg-slate-50 flex items-center justify-between group transition-colors rounded-md ${app.id === (currentApp?.id) ? 'bg-slate-50 font-semibold text-[#0F172A]' : 'text-slate-700'}`}
                        >
                          <span className="flex items-center gap-2">
                            <Box size={13} className={app.id === (currentApp?.id) ? 'text-[#635BFF]' : 'text-slate-400'} /> {app.name}
                          </span>
                          {app.id === (currentApp?.id) && <Check size={13} className="text-[#635BFF]" />}
                        </button>
                      ))}
                    </div>

                  </div>
                </>
              )}
            </div>

            <div className="flex items-center gap-2.5 sm:gap-3">
                {/* Command Palette Trigger Pill */}
                <button
                  type="button"
                  onClick={() => {
                    const event = new KeyboardEvent('keydown', { key: 'k', metaKey: true, ctrlKey: true });
                    window.dispatchEvent(event);
                  }}
                  className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50/80 hover:bg-slate-100/80 text-xs text-slate-500 font-medium transition-colors"
                >
                  <span>Quick search...</span>
                  <kbd className="px-1.5 py-0.5 rounded bg-white border border-slate-200 text-[10px] font-mono text-slate-400 font-bold shadow-2xs">
                    ⌘K
                  </kbd>
                </button>

                {/* Notifications Dropdown */}
                <div className="relative">
                  <button 
                    onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                    className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center hover:border-slate-300 hover:bg-slate-50 transition-all cursor-pointer relative shadow-xs"
                    title="Notifications"
                  >
                    <Bell size={15} className="text-slate-600" />
                    {notifications.filter(n => !n.is_read).length > 0 && (
                      <span className="absolute top-1 right-1 w-2 h-2 bg-[#635BFF] rounded-full ring-2 ring-white"></span>
                    )}
                  </button>
                  {isNotificationsOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setIsNotificationsOpen(false)}></div>
                      <div className="absolute top-full right-0 mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden z-20 flex flex-col max-h-[400px]">
                        <div className="p-3 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                          <span className="text-xs font-semibold text-[#0F172A]">Notifications</span>
                          {notifications.some(n => !n.is_read) && (
                            <button onClick={markAllNotificationsAsRead} className="text-[10px] text-[#635BFF] hover:underline font-medium">Mark all read</button>
                          )}
                        </div>
                        <div className="overflow-y-auto flex-1 p-2 space-y-1">
                          {notifications.length === 0 ? (
                            <div className="p-6 text-center text-xs text-slate-500">No notifications right now</div>
                          ) : (
                            notifications.map(notif => (
                              <div 
                                key={notif.id} 
                                onClick={() => markNotificationAsRead(notif.id)}
                                className={`p-3 rounded-lg cursor-pointer transition-colors flex gap-3 ${notif.is_read ? 'opacity-60 hover:bg-slate-50' : 'bg-slate-50 hover:bg-slate-100/80 border border-slate-200/60'}`}
                              >
                                {!notif.is_read && <div className="w-1.5 h-1.5 rounded-full bg-[#635BFF] shrink-0 mt-1.5"></div>}
                                <div className={notif.is_read ? 'ml-4' : ''}>
                                  <div className="text-[13px] text-[#0F172A] font-semibold mb-1 leading-tight">{notif.title}</div>
                                  <div className="text-[11px] text-slate-600 leading-snug">{notif.message}</div>
                                  <div className="text-[9px] text-slate-400 mt-2 font-medium">{new Date(notif.created_at).toLocaleString()}</div>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <Link href="/settings" title="Account settings" className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center hover:border-slate-300 transition-all cursor-pointer overflow-hidden shadow-xs ring-1 ring-slate-900/5">
                    <img 
                      src="/avatars/samarth.png" 
                      alt="Profile" 
                      className="w-full h-full object-cover" 
                    />
                </Link>
            </div>
        </header>

        <div className="flex-1 overflow-y-auto bg-[#F8FAFC] p-4 sm:p-6 lg:p-8 relative">
          {children}

          {/* Premium UI Components */}
          <CommandPalette />
          <Toaster theme="light" position="bottom-right" toastOptions={{
            style: {
              background: '#FFFFFF',
              border: '1px solid #E2E8F0',
              color: '#0F172A',
            }
          }} />

          {/* Creation Modals */}
          {showWorkspaceModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
              <div className="bg-white border border-slate-200 rounded-xl w-full max-w-sm p-5 shadow-2xl">
                <h2 className="text-[15px] font-semibold text-[#0F172A] mb-4">Create workspace</h2>
                <input 
                  type="text" 
                  placeholder="Workspace Name"
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  className="w-full bg-white border border-slate-200 text-[#0F172A] rounded-lg py-2 px-3 mb-5 outline-none focus:border-[#635BFF] text-sm placeholder:text-slate-400"
                  autoFocus
                />
                <div className="flex justify-end gap-2">
                  <button onClick={() => setShowWorkspaceModal(false)} className="px-3 py-1.5 text-[13px] text-slate-600 hover:text-slate-900 transition">Cancel</button>
                  <button onClick={createWorkspace} className="px-3.5 py-1.5 bg-[#0F172A] hover:bg-slate-800 text-white rounded-lg text-[13px] font-medium transition">Create</button>
                </div>
              </div>
            </div>
          )}

          {showAppModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
              <div className="bg-white border border-slate-200 rounded-xl w-full max-w-sm p-5 shadow-2xl">
                <h2 className="text-[15px] font-semibold text-[#0F172A] mb-4">Create new app</h2>
                <input 
                  type="text" 
                  placeholder="App Name"
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  className="w-full bg-white border border-slate-200 text-[#0F172A] rounded-lg py-2 px-3 mb-3 outline-none focus:border-[#635BFF] text-sm placeholder:text-slate-400"
                  autoFocus
                />
                <input 
                  type="url" 
                  placeholder="URL (Optional)"
                  value={newUrl}
                  onChange={e => setNewUrl(e.target.value)}
                  className="w-full bg-white border border-slate-200 text-[#0F172A] rounded-lg py-2 px-3 mb-5 outline-none focus:border-[#635BFF] text-sm placeholder:text-slate-400"
                />
                <div className="flex justify-end gap-2">
                  <button onClick={() => { setShowAppModal(false); setNewUrl(""); }} className="px-3 py-1.5 text-[13px] text-slate-600 hover:text-slate-900 transition">Cancel</button>
                  <button onClick={createApp} className="px-3.5 py-1.5 bg-[#0F172A] hover:bg-slate-800 text-white rounded-lg text-[13px] font-medium transition">Create App</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
