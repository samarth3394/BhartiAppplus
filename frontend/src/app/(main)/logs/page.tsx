"use client";

import React, { useEffect, useState } from "react";
import { Terminal, Search, AlertCircle, Clock, Globe, Laptop, ChevronRight } from "lucide-react";

export default function LogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedLog, setSelectedLog] = useState<any | null>(null);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      // In a real scenario, app_id would be dynamic (e.g., from context or cookies)
      // Here we assume the server can infer it or we hardcode it for demo.
      // We will just fetch from the API. The API might need app_id, we can pass a dummy one or grab from local storage.
      const currentAppId = document.cookie.split('; ').find(row => row.startsWith('current_app_id='))?.split('=')[1];
      if (!currentAppId) {
          setLoading(false);
          return;
      }
      
      const res = await fetch(`http://localhost:5000/api/logs?app_id=${currentAppId}&search=${encodeURIComponent(search)}`, { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setLogs(data.logs || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [search]);

  return (
    <div className="flex flex-col h-full font-sans">
      {/* Header */}
      <div className="shrink-0 flex items-center justify-between pb-4 mb-4 border-b border-white/[0.04]">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-[#EDEDED] mb-1">Centralized Logs</h1>
          <p className="text-[13px] text-[#888]">Real-time application errors and exceptions.</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex gap-4 mb-4">
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#666]" />
          <input 
            type="text" 
            placeholder="Search logs (e.g. 'TypeError')..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#111] border border-white/[0.08] text-[#EDEDED] text-[13px] rounded-lg pl-9 pr-3 py-2 outline-none focus:border-white/20 transition-colors"
          />
        </div>
        <button 
          onClick={fetchLogs}
          className="px-4 py-2 bg-[#111] hover:bg-[#1a1a1a] border border-white/[0.08] text-[#EDEDED] text-[13px] font-medium rounded-lg transition"
        >
          Refresh
        </button>
      </div>

      <div className="flex flex-1 gap-4 overflow-hidden">
        {/* Log List */}
        <div className={`flex flex-col border border-white/[0.06] bg-[#111] rounded-xl overflow-hidden transition-all duration-300 ${selectedLog ? 'w-1/2' : 'w-full'}`}>
          {loading ? (
            <div className="flex-1 flex items-center justify-center text-[#555] text-[13px]">Loading logs...</div>
          ) : logs.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-[#555] p-8 text-center">
                <Terminal size={32} className="mb-3 opacity-20" />
                <p className="text-[14px] font-medium text-[#888]">No logs found</p>
                <p className="text-[12px] mt-1">Application errors will appear here automatically.</p>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              {logs.map((log) => (
                <div 
                  key={log.id} 
                  onClick={() => setSelectedLog(log)}
                  className={`flex flex-col p-4 border-b border-white/[0.04] cursor-pointer hover:bg-white/[0.02] transition-colors ${selectedLog?.id === log.id ? 'bg-white/[0.04]' : ''}`}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <AlertCircle size={14} className="text-red-400 shrink-0" />
                    <span className="text-[13px] font-mono text-red-400 truncate">{log.message}</span>
                  </div>
                  <div className="flex items-center gap-4 text-[11px] text-[#666]">
                    <span className="flex items-center gap-1"><Clock size={12} /> {new Date(log.timestamp).toLocaleString()}</span>
                    {log.url && <span className="flex items-center gap-1 truncate"><Globe size={12} /> {log.url}</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Log Details Panel */}
        {selectedLog && (
          <div className="w-1/2 flex flex-col border border-white/[0.06] bg-[#111] rounded-xl overflow-hidden">
            <div className="p-4 border-b border-white/[0.04] flex items-center justify-between bg-[#151515]">
              <h3 className="text-[14px] font-semibold text-[#EDEDED] flex items-center gap-2">
                <AlertCircle size={16} className="text-red-400" /> Log Details
              </h3>
              <button onClick={() => setSelectedLog(null)} className="text-[#666] hover:text-[#EDEDED] transition">
                <ChevronRight size={18} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-6">
              {/* Message */}
              <div>
                <div className="text-[11px] uppercase tracking-wider text-[#666] font-semibold mb-2">Error Message</div>
                <div className="bg-[#1a1a1a] border border-white/[0.04] rounded-lg p-3 text-[13px] text-red-400 font-mono break-words">
                  {selectedLog.message}
                </div>
              </div>
              
              {/* Context */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-[11px] uppercase tracking-wider text-[#666] font-semibold mb-2">Timestamp</div>
                  <div className="text-[13px] text-[#EDEDED] flex items-center gap-2">
                    <Clock size={14} className="text-[#888]" /> {new Date(selectedLog.timestamp).toLocaleString()}
                  </div>
                </div>
                {selectedLog.url && (
                  <div>
                    <div className="text-[11px] uppercase tracking-wider text-[#666] font-semibold mb-2">URL</div>
                    <div className="text-[13px] text-[#EDEDED] flex items-center gap-2 truncate">
                      <Globe size={14} className="text-[#888]" /> {selectedLog.url}
                    </div>
                  </div>
                )}
              </div>

              {/* Stack Trace */}
              {selectedLog.stack_trace && (
                <div>
                  <div className="text-[11px] uppercase tracking-wider text-[#666] font-semibold mb-2">Stack Trace</div>
                  <div className="bg-[#0a0a0a] border border-white/[0.04] rounded-lg p-4 overflow-x-auto">
                    <pre className="text-[12px] text-[#EDEDED] font-mono leading-relaxed">
                      {selectedLog.stack_trace}
                    </pre>
                  </div>
                </div>
              )}

              {/* Metadata */}
              {selectedLog.user_agent && (
                <div>
                  <div className="text-[11px] uppercase tracking-wider text-[#666] font-semibold mb-2">User Agent</div>
                  <div className="bg-[#1a1a1a] border border-white/[0.04] rounded-lg p-3 text-[12px] text-[#888] font-mono break-all">
                    <div className="flex items-start gap-2">
                        <Laptop size={14} className="mt-0.5 shrink-0" />
                        <span>{selectedLog.user_agent}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
