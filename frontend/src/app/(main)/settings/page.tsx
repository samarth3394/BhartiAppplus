"use client";

import React, { useState } from "react";
import { Settings, User, Bell, Shield, Key, Download, Trash2, Smartphone, Globe, Mail, Webhook, Check, Sparkles } from "lucide-react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [statusMessage, setStatusMessage] = useState("");
  
  // Profile State
  const [profile, setProfile] = useState({ 
    full_name: "Samarth Choudhar", 
    email: "samarth@brexal.com", 
    password: "", 
    avatar_url: "/avatars/samarth.png" 
  });
  const [savingProfile, setSavingProfile] = useState(false);

  // App Settings State
  const [appSettings, setAppSettings] = useState({ 
    url: "https://api.brexal.com", 
    description: "Enterprise AI Observability & Incident Autonomous Telemetry Mesh", 
    monitoring_enabled: true, 
    check_interval: 5, 
    client_key: "brexal_live_sec_994a8e2b71c4f0",
    logo_url: "", 
    is_active: true
  });
  const [savingApp, setSavingApp] = useState(false);

  // Notification Settings State
  const [notificationSettings, setNotificationSettings] = useState({
    alert_email: true, 
    alert_email_address: "alerts@brexal.com",
    alert_whatsapp: false, 
    alert_whatsapp_number: "+91 98765 43210",
    weekly_cto_report: true, 
    slack_webhook: "https://hooks.slack.com/services/T00/B00/brexal-ops"
  });
  const [savingNotifications, setSavingNotifications] = useState(false);

  const saveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setTimeout(() => {
      setSavingProfile(false);
      setStatusMessage("Profile details updated successfully.");
      setTimeout(() => setStatusMessage(""), 3000);
    }, 500);
  };

  const saveApp = (e: React.FormEvent) => {
    e.preventDefault();
    setSavingApp(true);
    setTimeout(() => {
      setSavingApp(false);
      setStatusMessage("Application configuration saved.");
      setTimeout(() => setStatusMessage(""), 3000);
    }, 500);
  };

  const saveNotifications = (e: React.FormEvent) => {
    e.preventDefault();
    setSavingNotifications(true);
    setTimeout(() => {
      setSavingNotifications(false);
      setStatusMessage("Alert routing and notification preferences updated.");
      setTimeout(() => setStatusMessage(""), 3000);
    }, 500);
  };

  const regenerateKey = () => {
    if (!confirm("Regenerating the API key will invalidate existing agent integrations. Continue?")) return;
    setAppSettings(prev => ({
      ...prev,
      client_key: "brexal_live_sec_" + Math.random().toString(36).substring(2, 15)
    }));
    setStatusMessage("API key rotated. Remember to update your agent environment variables.");
    setTimeout(() => setStatusMessage(""), 4000);
  };

  const exportData = () => {
    const data = JSON.stringify({ app: appSettings, profile, export_date: new Date() }, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "brexal-organization-export.json";
    a.click();
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto h-full flex flex-col pb-8 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200/80 shrink-0">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0A2540]">
              Organization & Mesh Settings
            </h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200/80">
              SOC-2 Verified
            </span>
          </div>
          <p className="text-[13.5px] text-[#425466]">
            Configure your enterprise workspace, ingest tokens, alert dispatch channels, and team profiles.
          </p>
        </div>
      </div>

      {statusMessage && (
        <div className="p-3.5 bg-emerald-50/90 border border-emerald-200/90 rounded-xl text-emerald-800 text-[12.5px] font-semibold flex items-center gap-2.5 shadow-sm animate-in fade-in duration-200">
          <Check size={16} className="text-emerald-600 shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-6 items-start">
        {/* Navigation Tabs */}
        <div className="w-full md:w-60 flex md:flex-col gap-1.5 shrink-0 overflow-x-auto pb-2 md:pb-0 bg-white p-2 rounded-2xl border border-slate-200/80 shadow-[0_4px_20px_rgba(10,37,64,0.03)]">
          <button
            onClick={() => setActiveTab("profile")}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all text-[13px] font-bold text-left cursor-pointer ${
              activeTab === "profile" 
                ? "bg-[#635BFF]/10 text-[#635BFF] border border-[#635BFF]/20 shadow-xs" 
                : "text-[#425466] hover:text-[#0A2540] hover:bg-slate-50"
            }`}
          >
            <User size={16} className={activeTab === "profile" ? "text-[#635BFF]" : "text-slate-400"} /> Personal Profile
          </button>
          <button
            onClick={() => setActiveTab("app")}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all text-[13px] font-bold text-left cursor-pointer ${
              activeTab === "app" 
                ? "bg-[#635BFF]/10 text-[#635BFF] border border-[#635BFF]/20 shadow-xs" 
                : "text-[#425466] hover:text-[#0A2540] hover:bg-slate-50"
            }`}
          >
            <Settings size={16} className={activeTab === "app" ? "text-[#635BFF]" : "text-slate-400"} /> Cluster Config
          </button>
          <button
            onClick={() => setActiveTab("notifications")}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all text-[13px] font-bold text-left cursor-pointer ${
              activeTab === "notifications" 
                ? "bg-[#635BFF]/10 text-[#635BFF] border border-[#635BFF]/20 shadow-xs" 
                : "text-[#425466] hover:text-[#0A2540] hover:bg-slate-50"
            }`}
          >
            <Bell size={16} className={activeTab === "notifications" ? "text-[#635BFF]" : "text-slate-400"} /> Alerts & Paging
          </button>
          <button
            onClick={() => setActiveTab("security")}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all text-[13px] font-bold text-left cursor-pointer ${
              activeTab === "security" 
                ? "bg-[#635BFF]/10 text-[#635BFF] border border-[#635BFF]/20 shadow-xs" 
                : "text-[#425466] hover:text-[#0A2540] hover:bg-slate-50"
            }`}
          >
            <Shield size={16} className={activeTab === "security" ? "text-[#635BFF]" : "text-slate-400"} /> API Keys & Data
          </button>
          <button
            onClick={() => setActiveTab("integrations")}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all text-[13px] font-bold text-left cursor-pointer ${
              activeTab === "integrations" 
                ? "bg-[#635BFF]/10 text-[#635BFF] border border-[#635BFF]/20 shadow-xs" 
                : "text-[#425466] hover:text-[#0A2540] hover:bg-slate-50"
            }`}
          >
            <Webhook size={16} className={activeTab === "integrations" ? "text-[#635BFF]" : "text-slate-400"} /> Integrations
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 w-full bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(10,37,64,0.03)] min-h-[480px]">
          
          {/* Profile Tab */}
          {activeTab === "profile" && (
            <div className="p-6 sm:p-7">
              <h2 className="text-[17px] font-extrabold text-[#0A2540] mb-5">Personal Profile</h2>
              
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-100">
                <img 
                  src={profile.avatar_url || "/avatars/samarth.png"} 
                  alt={profile.full_name} 
                  className="w-16 h-16 rounded-full object-cover border-2 border-slate-200 shadow-2xs"
                />
                <div>
                  <h3 className="text-base font-bold text-[#0A2540]">{profile.full_name}</h3>
                  <p className="text-xs text-[#425466] font-mono">{profile.email}</p>
                  <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#635BFF]/10 text-[#635BFF] uppercase tracking-wider border border-[#635BFF]/20">
                    Organization Admin
                  </span>
                </div>
              </div>

              <form onSubmit={saveProfile} className="space-y-4 max-w-lg">
                <div>
                  <label className="block text-[11px] font-bold text-[#425466] uppercase tracking-wider mb-1.5">Full Name</label>
                  <input
                    type="text"
                    value={profile.full_name}
                    onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                    className="w-full bg-[#FAFBFD] border border-slate-200/90 text-[#0A2540] rounded-xl py-2.5 px-3.5 outline-none focus:border-[#635BFF] focus:bg-white focus:ring-2 focus:ring-[#635BFF]/15 text-sm font-semibold transition"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#425466] uppercase tracking-wider mb-1.5">Work Email</label>
                  <input
                    type="email"
                    value={profile.email}
                    disabled
                    className="w-full bg-slate-50 border border-slate-200 text-slate-500 rounded-xl py-2.5 px-3.5 outline-none text-sm font-mono cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#425466] uppercase tracking-wider mb-1.5">Avatar Image URL</label>
                  <input
                    type="url"
                    value={profile.avatar_url}
                    onChange={(e) => setProfile({ ...profile, avatar_url: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full bg-[#FAFBFD] border border-slate-200/90 text-[#0A2540] rounded-xl py-2.5 px-3.5 outline-none focus:border-[#635BFF] focus:bg-white focus:ring-2 focus:ring-[#635BFF]/15 text-sm font-semibold transition"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#425466] uppercase tracking-wider mb-1.5">Change Password</label>
                  <input
                    type="password"
                    placeholder="••••••••••••"
                    value={profile.password}
                    onChange={(e) => setProfile({ ...profile, password: e.target.value })}
                    className="w-full bg-[#FAFBFD] border border-slate-200/90 text-[#0A2540] rounded-xl py-2.5 px-3.5 outline-none focus:border-[#635BFF] focus:bg-white focus:ring-2 focus:ring-[#635BFF]/15 text-sm font-semibold transition"
                  />
                </div>
                <div className="pt-2">
                  <button 
                    type="submit" 
                    disabled={savingProfile} 
                    className="bg-[#635BFF] hover:bg-[#5349e0] text-white px-5 py-2.5 rounded-xl text-[13px] font-bold transition shadow-[0_4px_14px_rgba(99,91,255,0.25)] hover:shadow-[0_6px_20px_rgba(99,91,255,0.35)] cursor-pointer"
                  >
                    {savingProfile ? "Saving..." : "Save Profile"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* App Settings Tab */}
          {activeTab === "app" && (
            <div className="p-6 sm:p-7">
              <h2 className="text-[17px] font-extrabold text-[#0A2540] mb-5">Cluster & Telemetry Target</h2>
              <form onSubmit={saveApp} className="space-y-4 max-w-lg">
                <div>
                  <label className="block text-[11px] font-bold text-[#425466] uppercase tracking-wider mb-1.5">Production Ingress URL</label>
                  <input
                    type="url"
                    value={appSettings.url}
                    onChange={(e) => setAppSettings({ ...appSettings, url: e.target.value })}
                    className="w-full bg-[#FAFBFD] border border-slate-200/90 text-[#0A2540] rounded-xl py-2.5 px-3.5 outline-none focus:border-[#635BFF] focus:bg-white focus:ring-2 focus:ring-[#635BFF]/15 text-sm font-mono font-semibold transition"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#425466] uppercase tracking-wider mb-1.5">Cluster Description</label>
                  <textarea
                    rows={2}
                    value={appSettings.description}
                    onChange={(e) => setAppSettings({ ...appSettings, description: e.target.value })}
                    className="w-full bg-[#FAFBFD] border border-slate-200/90 text-[#0A2540] rounded-xl py-2.5 px-3.5 outline-none focus:border-[#635BFF] focus:bg-white focus:ring-2 focus:ring-[#635BFF]/15 text-sm font-semibold resize-none transition"
                  />
                </div>
                <div className="pt-3 border-t border-slate-100 space-y-3">
                  <div className="flex items-center justify-between p-3.5 bg-[#FAFBFD] rounded-xl border border-slate-200/80">
                    <span className="text-[13px] font-bold text-[#0A2540]">Automated Heartbeat Checks</span>
                    <input
                      type="checkbox"
                      checked={appSettings.monitoring_enabled}
                      onChange={(e) => setAppSettings({ ...appSettings, monitoring_enabled: e.target.checked })}
                      className="w-4 h-4 accent-[#635BFF] cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#425466] uppercase tracking-wider mb-1.5">Synthetic Probe Frequency</label>
                    <select
                      value={appSettings.check_interval}
                      onChange={(e) => setAppSettings({ ...appSettings, check_interval: parseInt(e.target.value) })}
                      className="w-full bg-[#FAFBFD] border border-slate-200/90 text-[#0A2540] rounded-xl py-2.5 px-3.5 text-sm outline-none focus:border-[#635BFF] font-semibold"
                    >
                      <option value={1}>Every 1 Minute</option>
                      <option value={5}>Every 5 Minutes</option>
                      <option value={10}>Every 10 Minutes</option>
                    </select>
                  </div>
                </div>
                <div className="pt-2">
                  <button 
                    type="submit" 
                    disabled={savingApp} 
                    className="bg-[#635BFF] hover:bg-[#5349e0] text-white px-5 py-2.5 rounded-xl text-[13px] font-bold transition shadow-[0_4px_14px_rgba(99,91,255,0.25)] hover:shadow-[0_6px_20px_rgba(99,91,255,0.35)] cursor-pointer"
                  >
                    {savingApp ? "Saving..." : "Save Cluster Config"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === "notifications" && (
            <div className="p-6 sm:p-7">
              <h2 className="text-[17px] font-extrabold text-[#0A2540] mb-5">Alert Dispatch & Paging Channels</h2>
              <form onSubmit={saveNotifications} className="space-y-4 max-w-lg">
                <div className="p-4.5 bg-[#FAFBFD] rounded-xl border border-slate-200/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-[13.5px] font-bold text-[#0A2540]">Downtime Email Alerts</h4>
                      <p className="text-[12px] text-[#425466]">Immediate notification when synthetic probes detect failure.</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notificationSettings.alert_email}
                      onChange={(e) => setNotificationSettings({ ...notificationSettings, alert_email: e.target.checked })}
                      className="w-4 h-4 accent-[#635BFF] cursor-pointer"
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      value={notificationSettings.alert_email_address}
                      onChange={(e) => setNotificationSettings({ ...notificationSettings, alert_email_address: e.target.value })}
                      className="w-full bg-white border border-slate-200 text-[#0A2540] rounded-xl py-2 px-3 text-xs outline-none focus:border-[#635BFF] font-medium"
                    />
                  </div>
                </div>

                <div className="p-4.5 bg-[#FAFBFD] rounded-xl border border-slate-200/80">
                  <h4 className="text-[13.5px] font-bold text-[#0A2540] mb-1">Slack Incident Webhook</h4>
                  <p className="text-[12px] text-[#425466] mb-2.5">Pings #ops channel whenever high-severity incident triggers.</p>
                  <input
                    type="url"
                    value={notificationSettings.slack_webhook}
                    onChange={(e) => setNotificationSettings({ ...notificationSettings, slack_webhook: e.target.value })}
                    className="w-full bg-white border border-slate-200 text-[#0A2540] rounded-xl py-2 px-3 text-xs font-mono outline-none focus:border-[#635BFF]"
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={savingNotifications} 
                  className="bg-[#635BFF] hover:bg-[#5349e0] text-white px-5 py-2.5 rounded-xl text-[13px] font-bold transition shadow-[0_4px_14px_rgba(99,91,255,0.25)] hover:shadow-[0_6px_20px_rgba(99,91,255,0.35)] cursor-pointer"
                >
                  {savingNotifications ? "Saving..." : "Save Preferences"}
                </button>
              </form>
            </div>
          )}

          {/* Security & API Keys Tab */}
          {activeTab === "security" && (
            <div className="p-6 sm:p-7">
              <h2 className="text-[17px] font-extrabold text-[#0A2540] mb-5">API Keys & Ingestion Tokens</h2>
              <div className="space-y-6 max-w-xl">
                <div>
                  <label className="block text-[11px] font-bold text-[#425466] uppercase tracking-wider mb-1.5">Primary Ingestion Key</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      readOnly
                      value={appSettings.client_key}
                      className="flex-1 bg-[#FAFBFD] border border-slate-200/90 text-[#0A2540] rounded-xl py-2.5 px-3.5 text-xs font-mono font-bold"
                    />
                    <button
                      onClick={regenerateKey}
                      className="px-4 py-2.5 bg-white border border-slate-200/90 hover:bg-[#FAFBFD] text-[#0A2540] rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <Key size={13} /> Rotate Key
                    </button>
                  </div>
                </div>

                <div className="pt-5 border-t border-slate-100">
                  <h3 className="text-[14.5px] font-bold text-[#0A2540] mb-1">Data Portability</h3>
                  <p className="text-[12.5px] text-[#425466] mb-3.5">Export a complete JSON archive of all telemetry metrics, audit logs, and configurations.</p>
                  <button
                    onClick={exportData}
                    className="px-4 py-2.5 bg-white border border-slate-200/90 hover:bg-[#FAFBFD] text-[#0A2540] rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Download size={14} className="text-[#635BFF]" /> Export JSON Archive
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Integrations Tab */}
          {activeTab === "integrations" && (
            <div className="p-6 sm:p-7">
              <h2 className="text-[17px] font-extrabold text-[#0A2540] mb-5">Enterprise CI/CD Integrations</h2>
              <div className="p-5 bg-[#FAFBFD] rounded-2xl border border-slate-200/80 max-w-xl space-y-3">
                <div className="flex items-center gap-2.5">
                  <Webhook size={18} className="text-[#635BFF]" />
                  <h4 className="font-bold text-[14.5px] text-[#0A2540]">GitHub & GitLab Deployment Webhooks</h4>
                </div>
                <p className="text-[12.5px] text-[#425466] leading-relaxed">
                  Correlate git commits and container deployments with production latency spikes and error cascades automatically.
                </p>
                <input
                  type="text"
                  readOnly
                  value="https://api.brexal.com/v1/integrations/github"
                  className="w-full bg-white border border-slate-200 text-[#0A2540] rounded-xl py-2 px-3 text-xs font-mono font-bold"
                />
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
