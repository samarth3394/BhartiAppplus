"use client";

import React, { useState, useEffect, useRef } from "react";
import { Send, User as UserIcon, MessageSquare, AlertCircle } from "lucide-react";

export default function InboxPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [workspaceId, setWorkspaceId] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState("");
  
  const ws = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (workspaceId && currentUser) {
      connectWebSocket();
    }
    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [workspaceId, currentUser]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchInitialData = async () => {
    try {
      // Get current user
      const uRes = await fetch("http://localhost:5000/api/auth/me", { credentials: "include" });
      if (uRes.ok) {
        const uData = await uRes.json();
        setCurrentUser(uData.user);
      }

      // Get workspace id
      const wRes = await fetch("http://localhost:5000/api/workspaces", { credentials: "include" });
      if (wRes.ok) {
        const wData = await wRes.json();
        if (wData.current_workspace_id && wData.current_workspace_id !== "personal") {
          setWorkspaceId(wData.current_workspace_id);
          fetchMessages(wData.current_workspace_id);
        } else {
          setError("Inbox is only available within a Workspace. Please select a Workspace from the top bar.");
        }
      }
    } catch (err) {
      console.error("Failed to fetch initial data", err);
    }
  };

  const fetchMessages = async (wsId: string) => {
    try {
      const res = await fetch(`http://localhost:5000/api/workspaces/${wsId}/messages`, { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages || []);
      }
    } catch (err) {
      console.error("Failed to fetch messages", err);
    }
  };

  const connectWebSocket = () => {
    if (!workspaceId) return;
    
    // Connect to WebSocket
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `ws://localhost:5000/api/ws/chat/${workspaceId}`;
    const websocket = new WebSocket(wsUrl);

    websocket.onopen = () => {
      console.log("WebSocket Connected");
      setIsConnected(true);
    };

    websocket.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      setMessages((prev) => [...prev, msg]);
    };

    websocket.onclose = () => {
      console.log("WebSocket Disconnected");
      setIsConnected(false);
      // Try to reconnect after 3 seconds
      setTimeout(() => {
        if (workspaceId) connectWebSocket();
      }, 3000);
    };

    websocket.onerror = (err) => {
      console.error("WebSocket Error:", err);
    };

    ws.current = websocket;
  };

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !ws.current || !isConnected) return;
    
    ws.current.send(newMessage);
    setNewMessage("");
  };

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center h-[calc(100vh-8rem)]">
        <div className="bg-[#111] border border-white/[0.06] rounded-xl p-6 max-w-sm text-center">
          <AlertCircle className="w-8 h-8 text-[#555] mx-auto mb-4" />
          <h2 className="text-[15px] font-medium text-white mb-2">Workspace Required</h2>
          <p className="text-[#888] text-[13px] leading-relaxed">
            {error}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col -m-6 max-w-5xl mx-auto border-x border-white/[0.04] bg-[#0a0a0a]">
      {/* Header */}
      <div className="h-14 border-b border-white/[0.04] bg-[#0a0a0a] px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-[#111] border border-white/[0.08] flex items-center justify-center">
            <MessageSquare size={14} className="text-[#EDEDED]" />
          </div>
          <div>
            <h1 className="text-[14px] font-medium text-[#EDEDED] leading-tight">Team Inbox</h1>
            <p className="text-[11px] text-[#666] flex items-center gap-1.5 mt-0.5">
              <span className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
              {isConnected ? 'Connected' : 'Connecting...'}
            </p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-[#555]">
            <MessageSquare size={32} className="mb-3 opacity-20" />
            <p className="text-[13px]">No messages yet. Start the conversation.</p>
          </div>
        ) : (
          messages.map((msg, idx) => {
            const isMe = currentUser && msg.sender_id === currentUser.id;
            return (
              <div key={msg.id || idx} className={`flex gap-3 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                {/* Avatar */}
                <div className="w-8 h-8 rounded bg-[#1a1a1a] border border-white/[0.08] flex items-center justify-center overflow-hidden shrink-0">
                  {msg.sender?.avatar_url ? (
                    <img src={msg.sender.avatar_url} alt={msg.sender.full_name} className="w-full h-full object-cover" />
                  ) : (
                    <UserIcon size={14} className="text-[#666]" />
                  )}
                </div>
                
                {/* Message Bubble */}
                <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[70%]`}>
                  <div className="flex items-baseline gap-2 mb-1 px-1">
                    <span className="text-[11px] font-medium text-[#888]">{msg.sender?.full_name || 'Unknown User'}</span>
                    <span className="text-[10px] text-[#555]">
                      {msg.created_at ? new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Now'}
                    </span>
                  </div>
                  <div className={`px-4 py-2.5 text-[13px] leading-relaxed ${
                    isMe 
                      ? 'bg-white text-black rounded-lg rounded-tr-sm' 
                      : 'bg-[#111] text-[#EDEDED] border border-white/[0.06] rounded-lg rounded-tl-sm'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-[#0a0a0a] border-t border-white/[0.04] shrink-0">
        <form onSubmit={sendMessage} className="relative flex items-end gap-2">
          <div className="flex-1 bg-[#111] border border-white/[0.08] rounded-lg overflow-hidden focus-within:border-white/20 transition-all">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage(e);
                }
              }}
              placeholder="Message team..."
              className="w-full bg-transparent text-[#EDEDED] px-4 py-3 outline-none resize-none min-h-[44px] max-h-32 text-[13px] placeholder:text-[#555]"
              rows={1}
            />
          </div>
          <button 
            type="submit"
            disabled={!newMessage.trim() || !isConnected}
            className="w-[44px] h-[44px] rounded-lg bg-white text-black flex items-center justify-center hover:bg-[#e5e5e5] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
          >
            <Send size={16} className="ml-0.5" />
          </button>
        </form>
        <div className="text-center mt-2">
          <span className="text-[10px] text-[#555]">Press <span className="font-mono bg-[#1a1a1a] px-1 rounded border border-white/[0.06]">Enter</span> to send, <span className="font-mono bg-[#1a1a1a] px-1 rounded border border-white/[0.06]">Shift + Enter</span> for new line</span>
        </div>
      </div>
    </div>
  );
}
