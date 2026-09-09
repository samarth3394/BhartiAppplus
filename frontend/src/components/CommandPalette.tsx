"use client";

import React, { useEffect, useState } from "react";
import { Command } from "cmdk";
import { useRouter } from "next/navigation";
import { LayoutDashboard, Bug, Activity, Settings, Users, Server, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  // Toggle the menu when ⌘K is pressed
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = (command: () => void) => {
    setOpen(false);
    command();
  };

  return (
    <AnimatePresence>
      {open && (
        <Command.Dialog 
          open={open} 
          onOpenChange={setOpen}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 pt-[20vh] bg-black/60 backdrop-blur-sm"
          label="Global Command Menu"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="w-full max-w-lg bg-[#111111] border border-white/[0.08] rounded-xl shadow-2xl overflow-hidden flex flex-col"
          >
            <div className="flex items-center border-b border-white/[0.08] px-4">
              <Search size={18} className="text-[#888] shrink-0" />
              <Command.Input 
                autoFocus 
                placeholder="Type a command or search..." 
                className="flex-1 bg-transparent border-none text-white px-4 py-4 text-sm outline-none placeholder:text-[#555]"
              />
              <div className="text-[10px] text-[#666] border border-white/[0.1] bg-white/[0.05] px-1.5 py-0.5 rounded font-mono">
                ESC
              </div>
            </div>

            <Command.List className="max-h-[300px] overflow-y-auto p-2 no-scrollbar">
              <Command.Empty className="py-6 text-center text-sm text-[#888]">
                No results found.
              </Command.Empty>

              <Command.Group heading={<div className="px-2 py-1.5 text-[10px] font-medium tracking-wider text-[#666] uppercase">Navigation</div>}>
                <Command.Item 
                  onSelect={() => runCommand(() => router.push("/dashboard"))}
                  className="flex items-center gap-3 px-3 py-2.5 text-sm text-[#EDEDED] rounded-lg hover:bg-white/[0.06] cursor-pointer aria-selected:bg-white/[0.06] aria-selected:text-white transition-colors"
                >
                  <LayoutDashboard size={14} className="text-[#888]" /> Dashboard
                </Command.Item>
                <Command.Item 
                  onSelect={() => runCommand(() => router.push("/bugs"))}
                  className="flex items-center gap-3 px-3 py-2.5 text-sm text-[#EDEDED] rounded-lg hover:bg-white/[0.06] cursor-pointer aria-selected:bg-white/[0.06] aria-selected:text-white transition-colors"
                >
                  <Bug size={14} className="text-[#888]" /> Issues & Bugs
                </Command.Item>
                <Command.Item 
                  onSelect={() => runCommand(() => router.push("/uptime"))}
                  className="flex items-center gap-3 px-3 py-2.5 text-sm text-[#EDEDED] rounded-lg hover:bg-white/[0.06] cursor-pointer aria-selected:bg-white/[0.06] aria-selected:text-white transition-colors"
                >
                  <Activity size={14} className="text-[#888]" /> Uptime & Metrics
                </Command.Item>
                <Command.Item 
                  onSelect={() => runCommand(() => router.push("/infrastructure"))}
                  className="flex items-center gap-3 px-3 py-2.5 text-sm text-[#EDEDED] rounded-lg hover:bg-white/[0.06] cursor-pointer aria-selected:bg-white/[0.06] aria-selected:text-white transition-colors"
                >
                  <Server size={14} className="text-[#888]" /> Infrastructure
                </Command.Item>
                <Command.Item 
                  onSelect={() => runCommand(() => router.push("/teams"))}
                  className="flex items-center gap-3 px-3 py-2.5 text-sm text-[#EDEDED] rounded-lg hover:bg-white/[0.06] cursor-pointer aria-selected:bg-white/[0.06] aria-selected:text-white transition-colors"
                >
                  <Users size={14} className="text-[#888]" /> Teams
                </Command.Item>
              </Command.Group>

              <div className="h-px bg-white/[0.04] my-2" />

              <Command.Group heading={<div className="px-2 py-1.5 text-[10px] font-medium tracking-wider text-[#666] uppercase">System</div>}>
                <Command.Item 
                  onSelect={() => runCommand(() => router.push("/settings"))}
                  className="flex items-center gap-3 px-3 py-2.5 text-sm text-[#EDEDED] rounded-lg hover:bg-white/[0.06] cursor-pointer aria-selected:bg-white/[0.06] aria-selected:text-white transition-colors"
                >
                  <Settings size={14} className="text-[#888]" /> Settings
                </Command.Item>
              </Command.Group>
            </Command.List>
          </motion.div>
        </Command.Dialog>
      )}
    </AnimatePresence>
  );
}
