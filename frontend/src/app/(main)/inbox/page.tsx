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
    sender_email: "samarth@brexal.com",
    avatar_url: "/avatars/samarth.png",
    content: "Team, v2.4.1 deployment has been rolled out to production. Please monitor your respective service dashboards.",
    created_at: "10:15 AM"
  },
  {
    id: "msg-2",
    sender_name: "Brexal AI Copilot",
    sender_email: "copilot@brexal.ai",
    content: "🟢 Autonomous Verification: All 14 ingress nodes report p99 latency < 16.4ms. Error rate at 0.008%.",
    created_at: "10:16 AM",
    is_ai: true
  },
  {
    id: "msg-3",
    sender_name: "Neha Sharma",
    sender_email: "neha.s@brexal.com",
    avatar_url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    content: "SRE monitors are green. Database replica lag is at 0ms. Excellent rollout!",
    created_at: "10:20 AM"
  },
  {
    id: "msg-4",
    sender_name: "Rohan Patil",
    sender_email: "rohan.p@brexal.com",
    avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    content: "Connection pool circuit-breaker is primed. Ready for the noon traffic wave.",
    created_at: "10:24 AM"
  },
  {
    id: "msg-5",
    sender_name: "Ananya Iyer",
    sender_email: "ananya.i@brexal.com",
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
      sender_email: "samarth@brexal.com",
      avatar_url: "/avatars/samarth.png",
      content: newMessage.trim(),
      created_at: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setNewMessage("");

    // Realistic AI reply after 1.2 seconds if mentioned or asked
    setTimeout(() => {
      const aiReply: ChatMessage = {
        id: "msg-ai-" + Date.now(),
        sender_name: "Brexal AI Copilot",
        sender_email: "copilot@brexal.ai",
        content: `Acknowledged: "${userMsg.content}". Ingress telemetry verified across all worker nodes. Zero regressions recorded.`,
        created_at: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        is_ai: true
      };
      setMessages(prev => [...prev, aiReply]);
    }, 1200);
  };

  return (
    <div className="max-w-[1240px] mx-auto h-[calc(100vh-8.5rem)] flex flex-col font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200/80 shrink-0">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="flex items-center gap-1.5 text-base sm:text-lg font-extrabold text-[#0A2540]">
              <Hash size={18} className="text-[#635BFF]" /> #engineering-ops
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200/80">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Channel
            </span>
          </div>
          <p className="text-[13.5px] text-[#425466]">
            Cross-team operational dispatch, incident discussions, and AI Copilot notifications.
          </p>
        </div>
      </div>

      {/* Main Chat Box Container */}
      <div className="flex-1 bg-white border border-slate-200/80 rounded-2xl mt-4 flex flex-col overflow-hidden shadow-[0_4px_20px_rgba(10,37,64,0.03)]">
        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-4">
          {messages.map((msg) => {
            const isMe = msg.sender_name === "Samarth Choudhar";
            return (
              <div 
                key={msg.id} 
                className={`flex items-start gap-3.5 ${
                  msg.is_ai 
                    ? "bg-[#FAFBFD] p-4 rounded-2xl border border-[#635BFF]/15" 
                    : ""
                }`}
              >
                {msg.is_ai ? (
                  <div className="w-10 h-10 rounded-full bg-[#635BFF] text-white flex items-center justify-center shrink-0 shadow-[0_2px_8px_rgba(99,91,255,0.3)]">
                    <Sparkles size={17} />
                  </div>
                ) : (msg.avatar_url || isMe) ? (
                  <img 
                    src={msg.avatar_url || (isMe ? "/avatars/samarth.png" : "")} 
                    alt={msg.sender_name} 
                    className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0 shadow-2xs" 
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-[#0A2540] text-white flex items-center justify-center text-[13px] font-bold shrink-0 shadow-2xs">
                    {msg.sender_name.charAt(0)}
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="font-bold text-[14px] text-[#0A2540]">
                      {msg.sender_name}
                    </span>
                    {msg.is_ai && (
                      <span className="text-[10px] font-bold bg-[#635BFF]/10 text-[#635BFF] px-2 py-0.5 rounded-full border border-[#635BFF]/20 uppercase">
                        AI Copilot
                      </span>
                    )}
                    <span className="text-[11px] text-[#425466] font-mono">
                      {msg.created_at}
                    </span>
                  </div>

                  <p className="text-[13.5px] text-[#0A2540] leading-relaxed font-normal">
                    {msg.content}
                  </p>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input Bar */}
        <form onSubmit={handleSendMessage} className="p-4 sm:p-5 border-t border-slate-200/80 bg-[#FAFBFD] flex items-center gap-3 shrink-0">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Message #engineering-ops or query @Brexal AI..."
            className="flex-1 bg-white border border-slate-200/90 text-[#0A2540] rounded-xl px-4 py-3 text-[13.5px] outline-none focus:border-[#635BFF] focus:ring-2 focus:ring-[#635BFF]/15 placeholder:text-slate-400 font-semibold transition shadow-xs"
          />
          <button
            type="submit"
            className="px-5 py-3 bg-[#635BFF] hover:bg-[#5349e0] text-white rounded-xl text-[13px] font-bold transition shadow-[0_4px_14px_rgba(99,91,255,0.25)] hover:shadow-[0_6px_20px_rgba(99,91,255,0.35)] flex items-center gap-2 cursor-pointer shrink-0"
          >
            <Send size={15} />
            <span className="hidden sm:inline">Send</span>
          </button>
        </form>
      </div>
    </div>
  );
}
