"use client";

import React, { useState, useEffect, useRef } from "react";
import { Send, User as UserIcon, MessageSquare, CheckCheck, Sparkles, Hash, Circle } from "lucide-react";

type ChatMessage = {
  id: string;
  sender_name: string;
  sender_email: string;
  avatar_url?: string;
  content: string;
  created_at: string;
  is_ai?: boolean;
};

const DEFAULT_MESSAGES: ChatMessage[] = [
  {
    id: "msg-1",
    sender_name: "Samarth Choudhar",
    sender_email: "samarth@bhartinexus.com",
    avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    content: "Team, v2.4.1 deployment has been rolled out to production. Please monitor your respective service dashboards.",
    created_at: "10:15 AM"
  },
  {
    id: "msg-2",
    sender_name: "Brexal AI Copilot",
    sender_email: "copilot@bhartinexus.ai",
    content: "🟢 Autonomous Verification: All 14 ingress nodes report p99 latency < 16.4ms. Error rate at 0.008%.",
    created_at: "10:16 AM",
    is_ai: true
  },
  {
    id: "msg-3",
    sender_name: "Neha Sharma",
    sender_email: "neha.s@bhartinexus.com",
    avatar_url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    content: "SRE monitors are green. Database replica lag is at 0ms. Excellent rollout!",
    created_at: "10:20 AM"
  },
  {
    id: "msg-4",
    sender_name: "Rohan Patil",
    sender_email: "rohan.p@bhartinexus.com",
    avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    content: "Connection pool circuit-breaker is primed. Ready for the noon traffic wave.",
    created_at: "10:24 AM"
  },
  {
    id: "msg-5",
    sender_name: "Ananya Iyer",
    sender_email: "ananya.i@bhartinexus.com",
    avatar_url: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
    content: "Neural anomaly detector is streaming live telemetry. Zero false positives so far.",
    created_at: "10:31 AM"
  }
];

export default function InboxPage() {
  const [messages, setMessages] = useState<ChatMessage[]>(DEFAULT_MESSAGES);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const userMsg: ChatMessage = {
      id: "msg-" + Date.now(),
      sender_name: "Samarth Choudhar",
      sender_email: "samarth@bhartinexus.com",
      content: newMessage.trim(),
      created_at: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setNewMessage("");

    // Realistic AI reply after 1.5 seconds if mentioned or asked
    setTimeout(() => {
      const aiReply: ChatMessage = {
        id: "msg-ai-" + Date.now(),
        sender_name: "Brexal AI Copilot",
        sender_email: "copilot@bhartinexus.ai",
        content: `Acknowledged: "${userMsg.content}". Telemetry mesh updated and synchronized across all nodes.`,
        created_at: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        is_ai: true
      };
      setMessages(prev => [...prev, aiReply]);
    }, 1200);
  };

  return (
    <div className="max-w-[1200px] mx-auto h-[calc(100vh-8rem)] flex flex-col font-sans">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 shrink-0">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="flex items-center gap-1.5 text-xs font-bold text-[#0F172A]">
              <Hash size={15} className="text-[#635BFF]" /> #engineering-ops
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10.5px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Channel
            </span>
          </div>
          <p className="text-[13px] text-slate-600">Cross-team operational dispatch, incident discussions, and AI Copilot notifications.</p>
        </div>
      </div>

      {/* Main Chat Box Container */}
      <div className="flex-1 bg-white border border-slate-200 rounded-xl mt-4 flex flex-col overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
          {messages.map((msg) => {
            const isMe = msg.sender_name === "Samarth Choudhar";
            return (
              <div 
                key={msg.id} 
                className={`flex items-start gap-3.5 ${msg.is_ai ? "bg-slate-50/80 p-3.5 rounded-xl border border-slate-100" : ""}`}
              >
                {msg.is_ai ? (
                  <div className="w-9 h-9 rounded-full bg-[#635BFF] text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Sparkles size={16} />
                  </div>
                ) : msg.avatar_url ? (
                  <img 
                    src={msg.avatar_url} 
                    alt={msg.sender_name} 
                    className="w-9 h-9 rounded-full object-cover border border-slate-200 shrink-0 shadow-xs" 
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-[#0A2540] text-white flex items-center justify-center text-[12px] font-bold shrink-0 shadow-xs">
                    {msg.sender_name.charAt(0)}
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="font-bold text-[13.5px] text-[#0F172A]">
                      {msg.sender_name}
                    </span>
                    {msg.is_ai && (
                      <span className="text-[10px] font-bold bg-[#635BFF]/10 text-[#635BFF] px-1.5 py-0.5 rounded border border-[#635BFF]/20 uppercase">
                        AI Bot
                      </span>
                    )}
                    <span className="text-[11px] text-slate-400 font-mono">
                      {msg.created_at}
                    </span>
                  </div>

                  <p className="text-[13.5px] text-slate-800 leading-relaxed font-normal">
                    {msg.content}
                  </p>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input Bar */}
        <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-200 bg-slate-50/70 flex items-center gap-3">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Message #engineering-ops or ask @Brexal AI..."
            className="flex-1 bg-white border border-slate-200 text-[#0F172A] rounded-lg px-4 py-2.5 text-[13.5px] outline-none focus:border-[#635BFF] placeholder:text-slate-400 font-medium transition-colors shadow-xs"
          />
          <button
            type="submit"
            className="px-4 py-2.5 bg-[#0F172A] hover:bg-slate-800 text-white rounded-lg text-[13px] font-semibold transition-all shadow-xs flex items-center gap-1.5"
          >
            <Send size={14} />
            <span>Send</span>
          </button>
        </form>
      </div>
    </div>
  );
}
