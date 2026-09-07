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
    Box
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

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "AI Copilot", href: "/ai-dashboard", icon: Zap },
    { name: "Issues & Bugs", href: "/bugs", icon: Bug },
    { name: "Kanban", href: "/kanban", icon: KanbanSquare },
    { name: "Uptime", href: "/uptime", icon: Activity },
    { name: "Infrastructure", href: "/infrastructure", icon: Server },
    { name: "Maintenance", href: "/maintenance", icon: Wrench },
    { name: "Teams", href: "/teams", icon: Users },
    { name: "Roadmap", href: "/roadmap", icon: Map },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  const currentApp = apps.find(a => a.id === currentAppId);
  const currentWorkspace = workspaces.find(w => w.id === currentWorkspaceId);

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Mobile Menu Toggle */}
      <div className="lg:hidden fixed top-4 right-4 z-50">
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
          className="p-2 bg-zinc-900 rounded-md border border-white/10"
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-zinc-950 border-r border-white/10 flex flex-col transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:static
      `}>
        <div className="p-6">
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
            BNexora
          </h1>
        </div>
        
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <a
                key={item.name}
                href={item.href}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                  ${isActive 
                    ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" 
                    : "text-zinc-400 hover:text-zinc-100 hover:bg-white/5 border border-transparent"}
                `}
              >
                <Icon size={18} className={isActive ? "text-blue-400" : "text-zinc-500"} />
                {item.name}
              </a>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button onClick={handleSignOut} className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors border border-transparent hover:border-red-500/20">
            <LogOut size={18} />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header */}
        <header className="h-16 border-b border-white/10 bg-zinc-950/50 backdrop-blur-md flex items-center justify-between px-8 relative z-30">
            
            {/* App Switcher Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 text-zinc-300 text-sm hover:text-white transition-colors px-3 py-1.5 rounded-lg hover:bg-white/5 border border-transparent hover:border-white/10"
              >
                {currentWorkspace ? currentWorkspace.name : "Personal"} / <span className="font-bold text-white">{currentApp ? currentApp.name : "Select App"}</span>
                <ChevronDown size={14} className="ml-2 text-zinc-500" />
              </button>

              {isDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsDropdownOpen(false)}></div>
                  <div className="absolute top-full left-0 mt-2 w-72 bg-zinc-900 border border-white/10 rounded-xl shadow-2xl overflow-hidden z-20 animate-in fade-in slide-in-from-top-2">
                    
                    {/* Workspaces Section */}
                    <div className="p-2 border-b border-white/10 bg-zinc-950/50">
                      <div className="px-2 py-1.5 text-xs font-semibold text-zinc-500 uppercase tracking-wider flex items-center justify-between">
                        Workspaces
                        <button onClick={() => { setIsDropdownOpen(false); setNewName(""); setShowWorkspaceModal(true); }} className="hover:text-white"><Plus size={14} /></button>
                      </div>
                      <button
                        onClick={() => switchWorkspace("personal")}
                        className="w-full text-left px-2 py-2 text-sm hover:bg-white/5 flex items-center justify-between group transition-colors rounded-lg"
                      >
                        <span className="flex items-center gap-2 text-zinc-300"><Folder size={14} className="text-zinc-500"/> Personal</span>
                        {!currentWorkspaceId && <Check size={14} className="text-blue-400" />}
                      </button>
                      {workspaces.map(w => (
                        <button
                          key={w.id}
                          onClick={() => switchWorkspace(w.id)}
                          className="w-full text-left px-2 py-2 text-sm hover:bg-white/5 flex items-center justify-between group transition-colors rounded-lg"
                        >
                          <span className="flex items-center gap-2 text-zinc-300"><Folder size={14} className="text-zinc-500"/> {w.name}</span>
                          {w.id === currentWorkspaceId && <Check size={14} className="text-blue-400" />}
                        </button>
                      ))}
                    </div>

                    {/* Apps Section */}
                    <div className="p-2">
                      <div className="px-2 py-1.5 text-xs font-semibold text-zinc-500 uppercase tracking-wider flex items-center justify-between">
                        Apps in {currentWorkspace ? currentWorkspace.name : "Personal"}
                        <button onClick={() => { setIsDropdownOpen(false); setNewName(""); setShowAppModal(true); }} className="hover:text-white"><Plus size={14} /></button>
                      </div>
                      {apps.length === 0 ? (
                        <div className="px-2 py-3 text-sm text-zinc-500 text-center">No apps found. Create one!</div>
                      ) : (
                        apps.map(app => (
                          <button
                            key={app.id}
                            onClick={() => switchApp(app.id)}
                            className="w-full text-left px-2 py-2 text-sm hover:bg-white/5 flex items-center justify-between group transition-colors rounded-lg"
                          >
                            <span className={`flex items-center gap-2 ${app.id === currentAppId ? 'text-blue-400 font-medium' : 'text-zinc-300 group-hover:text-white'}`}>
                              <Box size={14} className={app.id === currentAppId ? 'text-blue-400' : 'text-zinc-500'} /> {app.name}
                            </span>
                            {app.id === currentAppId && <Check size={14} className="text-blue-400" />}
                          </button>
                        ))
                      )}
                    </div>

                  </div>
                </>
              )}
            </div>

            <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 border border-white/20"></div>
            </div>
        </header>

        <div className="flex-1 overflow-y-auto bg-black p-8 relative">
          {children}

          {/* Creation Modals */}
          {showWorkspaceModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
              <div className="bg-zinc-900 border border-white/10 rounded-2xl w-full max-w-md p-6 shadow-2xl">
                <h2 className="text-xl font-bold text-white mb-4">Create New Workspace</h2>
                <input 
                  type="text" 
                  placeholder="Workspace Name"
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 text-white rounded-xl py-3 px-4 mb-6 outline-none focus:border-blue-500"
                />
                <div className="flex justify-end gap-3">
                  <button onClick={() => setShowWorkspaceModal(false)} className="px-4 py-2 text-zinc-400 hover:text-white transition">Cancel</button>
                  <button onClick={createWorkspace} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium transition">Create Workspace</button>
                </div>
              </div>
            </div>
          )}

          {showAppModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
              <div className="bg-zinc-900 border border-white/10 rounded-2xl w-full max-w-md p-6 shadow-2xl">
                <h2 className="text-xl font-bold text-white mb-4">Create New App</h2>
                <input 
                  type="text" 
                  placeholder="App Name (e.g. My Awesome Startup)"
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 text-white rounded-xl py-3 px-4 mb-4 outline-none focus:border-blue-500"
                />
                <input 
                  type="url" 
                  placeholder="App URL (e.g. https://myapp.com) - Optional"
                  value={newUrl}
                  onChange={e => setNewUrl(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 text-white rounded-xl py-3 px-4 mb-6 outline-none focus:border-blue-500"
                />
                <div className="flex justify-end gap-3">
                  <button onClick={() => { setShowAppModal(false); setNewUrl(""); }} className="px-4 py-2 text-zinc-400 hover:text-white transition">Cancel</button>
                  <button onClick={createApp} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium transition">Create App</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
