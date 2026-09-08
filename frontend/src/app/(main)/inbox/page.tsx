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
        <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-8 max-w-md text-center">
          <AlertCircle className="w-12 h-12 text-zinc-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Workspace Required</h2>
          <p className="text-zinc-400 text-sm">
            {error}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col -m-8">
      {/* Header */}
      <div className="h-16 border-b border-white/5 bg-zinc-950/50 px-8 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center">
            <MessageSquare size={20} className="text-blue-400" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white leading-tight">Team Inbox</h1>
            <p className="text-xs text-zinc-400 flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
              {isConnected ? 'Connected' : 'Connecting...'}
            </p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-8 space-y-6 scroll-smooth bg-gradient-to-b from-transparent to-black/50">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-zinc-500">
            <MessageSquare size={48} className="mb-4 opacity-20" />
            <p>No messages yet. Say hello to your team!</p>
          </div>
        ) : (
          messages.map((msg, idx) => {
            const isMe = currentUser && msg.sender_id === currentUser.id;
            return (
              <div key={msg.id || idx} className={`flex gap-4 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
                  {msg.sender?.avatar_url ? (
                    <img src={msg.sender.avatar_url} alt={msg.sender.full_name} className="w-full h-full object-cover" />
                  ) : (
                    <UserIcon size={18} className="text-zinc-500" />
                  )}
                </div>
                
                {/* Message Bubble */}
                <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[70%]`}>
                  <div className="flex items-baseline gap-2 mb-1 px-1">
                    <span className="text-xs font-semibold text-zinc-300">{msg.sender?.full_name || 'Unknown User'}</span>
                    <span className="text-[10px] text-zinc-500">
                      {msg.created_at ? new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Now'}
                    </span>
                  </div>
                  <div className={`px-5 py-3 rounded-2xl text-sm ${
                    isMe 
                      ? 'bg-blue-600 text-white rounded-tr-sm shadow-[0_0_15px_rgba(37,99,235,0.2)]' 
                      : 'bg-zinc-800 text-zinc-200 border border-white/5 rounded-tl-sm shadow-xl'
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
      <div className="p-4 bg-zinc-950/80 border-t border-white/5 shrink-0 backdrop-blur-xl">
        <form onSubmit={sendMessage} className="relative max-w-4xl mx-auto flex items-end gap-3">
          <div className="flex-1 bg-zinc-900 border border-white/10 rounded-2xl overflow-hidden focus-within:border-blue-500/50 focus-within:ring-2 ring-blue-500/20 transition-all shadow-inner">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage(e);
                }
              }}
              placeholder="Type your message..."
              className="w-full bg-transparent text-white px-5 py-4 outline-none resize-none min-h-[60px] max-h-32 text-sm"
              rows={1}
            />
          </div>
          <button 
            type="submit"
            disabled={!newMessage.trim() || !isConnected}
            className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center hover:bg-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(37,99,235,0.3)] shrink-0"
          >
            <Send size={20} className="ml-1" />
          </button>
        </form>
      </div>
    </div>
  );
}
