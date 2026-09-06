"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
    X
} from "lucide-react";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "AI Copilot", href: "/ai-dashboard", icon: Zap },
    { name: "Issues & Bugs", href: "/bugs", icon: Bug },
    { name: "Kanban", href: "/kanban", icon: KanbanSquare },
    { name: "Uptime", href: "/uptime", icon: Activity },
    { name: "Maintenance", href: "/maintenance", icon: Wrench },
    { name: "Teams", href: "/teams", icon: Users },
    { name: "Roadmap", href: "/roadmap", icon: Map },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

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
          <button className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors border border-transparent hover:border-red-500/20">
            <LogOut size={18} />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Optional Top Header for contextual actions */}
        <header className="h-16 border-b border-white/10 bg-zinc-950/50 backdrop-blur-md flex items-center justify-between px-8">
            <div className="text-zinc-400 text-sm">
                Workspace / <span className="text-zinc-100 font-medium">Production App</span>
            </div>
            <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 border border-white/20"></div>
            </div>
        </header>

        <div className="flex-1 overflow-y-auto bg-black p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
