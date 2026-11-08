"use client";

import React, { useEffect, useState } from "react";
import { Settings, User, Bell, Shield, Key, Download, Trash2, Smartphone, Globe, Mail, Webhook, Check } from "lucide-react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  
  // Profile State
  const [profile, setProfile] = useState({ 
    full_name: "Samarth Choudhar", 
    email: "samarth@bhartinexus.com", 
    password: "", 
    avatar_url: "" 
  });
  const [savingProfile, setSavingProfile] = useState(false);

  // App Settings State
  const [appSettings, setAppSettings] = useState({ 
    url: "https://api.bhartinexus.com", 
    description: "Enterprise AI Observability & Incident Autonomous Telemetry Mesh", 
    monitoring_enabled: true, 
    check_interval: 5, 
    client_key: "bharti_live_sec_994a8e2b71c4f0",
    logo_url: "", 
    is_active: true
  });
  const [savingApp, setSavingApp] = useState(false);

  // Notification Settings State
  const [notificationSettings, setNotificationSettings] = useState({
    alert_email: true, 
    alert_email_address: "alerts@bhartinexus.com",
    alert_whatsapp: false, 
    alert_whatsapp_number: "+91 98765 43210",
    weekly_cto_report: true, 
    slack_webhook: "https://hooks.slack.com/services/T00/B00/bhartinexus-ops"
  });
  const [savingNotifications, setSavingNotifications] = useState(false);
  const [userRole, setUserRole] = useState<string>("admin");

  const saveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setTimeout(() => {
      setSavingProfile(false);
      alert("Profile updated successfully!");
    }, 600);
  };

  const saveApp = (e: React.FormEvent) => {
    e.preventDefault();
    setSavingApp(true);
    setTimeout(() => {
      setSavingApp(false);
      alert("Application settings saved!");
    }, 600);
  };

  const saveNotifications = (e: React.FormEvent) => {
    e.preventDefault();
    setSavingNotifications(true);
    setTimeout(() => {
      setSavingNotifications(false);
      alert("Notification preferences updated!");
    }, 600);
  };

  const regenerateKey = () => {
    if (!confirm("Regenerating the API key will invalidate existing agent integrations. Continue?")) return;
    setAppSettings(prev => ({
      ...prev,
      client_key: "bharti_live_sec_" + Math.random().toString(36).substring(2, 15)
    }));
  };

  const exportData = () => {
    const data = JSON.stringify({ app: appSettings, profile, export_date: new Date() }, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "bharti-nexus-export.json";
    a.click();
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto h-full flex flex-col pb-8 font-sans">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 shrink-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#0F172A] mb-1">Organization Settings</h1>
          <p className="text-[13.5px] text-slate-600">Configure your profile, app endpoints, alert dispatch channels, and API keys.</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6 items-start">
        {/* Navigation Tabs */}
        <div className="w-full md:w-56 flex md:flex-col gap-1 shrink-0 overflow-x-auto pb-2 md:pb-0 bg-white p-2 rounded-xl border border-slate-200 shadow-xs">
          <button
            onClick={() => setActiveTab("profile")}
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg transition-all text-[13px] font-semibold text-left ${activeTab === "profile" ? "bg-slate-100 text-[#0F172A] shadow-xs" : "text-slate-600 hover:text-[#0F172A] hover:bg-slate-50"}`}
          >
            <User size={16} className={activeTab === "profile" ? "text-[#635BFF]" : "text-slate-400"} /> Profile
          </button>
          <button
            onClick={() => setActiveTab("app")}
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg transition-all text-[13px] font-semibold text-left ${activeTab === "app" ? "bg-slate-100 text-[#0F172A] shadow-xs" : "text-slate-600 hover:text-[#0F172A] hover:bg-slate-50"}`}
          >
            <Settings size={16} className={activeTab === "app" ? "text-[#635BFF]" : "text-slate-400"} /> App Config
          </button>
          <button
            onClick={() => setActiveTab("notifications")}
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg transition-all text-[13px] font-semibold text-left ${activeTab === "notifications" ? "bg-slate-100 text-[#0F172A] shadow-xs" : "text-slate-600 hover:text-[#0F172A] hover:bg-slate-50"}`}
          >
            <Bell size={16} className={activeTab === "notifications" ? "text-[#635BFF]" : "text-slate-400"} /> Alerts & Paging
          </button>
          <button
            onClick={() => setActiveTab("security")}
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg transition-all text-[13px] font-semibold text-left ${activeTab === "security" ? "bg-slate-100 text-[#0F172A] shadow-xs" : "text-slate-600 hover:text-[#0F172A] hover:bg-slate-50"}`}
          >
            <Shield size={16} className={activeTab === "security" ? "text-[#635BFF]" : "text-slate-400"} /> API Keys & Data
          </button>
          <button
            onClick={() => setActiveTab("integrations")}
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg transition-all text-[13px] font-semibold text-left ${activeTab === "integrations" ? "bg-slate-100 text-[#0F172A] shadow-xs" : "text-slate-600 hover:text-[#0F172A] hover:bg-slate-50"}`}
          >
            <Webhook size={16} className={activeTab === "integrations" ? "text-[#635BFF]" : "text-slate-400"} /> Integrations
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 w-full bg-white border border-slate-200 rounded-xl overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.04)] min-h-[460px]">
          
          {/* Profile Tab */}
          {activeTab === "profile" && (
            <div className="p-6">
              <h2 className="text-[16px] font-bold text-[#0F172A] mb-5">Personal Profile</h2>
              <form onSubmit={saveProfile} className="space-y-4 max-w-lg">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Full Name</label>
                  <input
                    type="text"
                    value={profile.full_name}
                    onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                    className="w-full bg-white border border-slate-200 text-[#0F172A] rounded-lg py-2 px-3 outline-none focus:border-[#635BFF] text-sm font-medium"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Work Email</label>
                  <input
                    type="email"
                    value={profile.email}
                    disabled
                    className="w-full bg-slate-50 border border-slate-200 text-slate-500 rounded-lg py-2 px-3 outline-none text-sm font-mono cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Avatar Image URL</label>
                  <input
                    type="url"
                    value={profile.avatar_url}
                    onChange={(e) => setProfile({ ...profile, avatar_url: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full bg-white border border-slate-200 text-[#0F172A] rounded-lg py-2 px-3 outline-none focus:border-[#635BFF] text-sm font-medium"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Change Password</label>
                  <input
                    type="password"
                    placeholder="••••••••••••"
                    value={profile.password}
                    onChange={(e) => setProfile({ ...profile, password: e.target.value })}
                    className="w-full bg-white border border-slate-200 text-[#0F172A] rounded-lg py-2 px-3 outline-none focus:border-[#635BFF] text-sm font-medium"
                  />
                </div>
                <div className="pt-2">
                  <button type="submit" disabled={savingProfile} className="bg-[#0F172A] hover:bg-slate-800 text-white px-4 py-2 rounded-lg text-[13px] font-semibold transition shadow-xs">
                    {savingProfile ? "Saving..." : "Save Profile"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* App Settings Tab */}
          {activeTab === "app" && (
            <div className="p-6">
              <h2 className="text-[16px] font-bold text-[#0F172A] mb-5">Application & Telemetry Target</h2>
              <form onSubmit={saveApp} className="space-y-4 max-w-lg">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Production URL</label>
                  <input
                    type="url"
                    value={appSettings.url}
                    onChange={(e) => setAppSettings({ ...appSettings, url: e.target.value })}
                    className="w-full bg-white border border-slate-200 text-[#0F172A] rounded-lg py-2 px-3 outline-none focus:border-[#635BFF] text-sm font-medium font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">App Description</label>
                  <textarea
                    rows={2}
                    value={appSettings.description}
                    onChange={(e) => setAppSettings({ ...appSettings, description: e.target.value })}
                    className="w-full bg-white border border-slate-200 text-[#0F172A] rounded-lg py-2 px-3 outline-none focus:border-[#635BFF] text-sm font-medium resize-none"
                  />
                </div>
                <div className="pt-3 border-t border-slate-100 space-y-3">
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="text-[13px] font-bold text-[#0F172A]">Automated Heartbeat Checks</span>
                    <input
                      type="checkbox"
                      checked={appSettings.monitoring_enabled}
                      onChange={(e) => setAppSettings({ ...appSettings, monitoring_enabled: e.target.checked })}
                      className="w-4 h-4 accent-[#635BFF]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Check Frequency</label>
                    <select
                      value={appSettings.check_interval}
                      onChange={(e) => setAppSettings({ ...appSettings, check_interval: parseInt(e.target.value) })}
                      className="w-full bg-white border border-slate-200 text-[#0F172A] rounded-lg py-2 px-3 text-sm outline-none focus:border-[#635BFF] font-medium"
                    >
                      <option value={1}>Every 1 Minute</option>
                      <option value={5}>Every 5 Minutes</option>
                      <option value={10}>Every 10 Minutes</option>
                    </select>
                  </div>
                </div>
                <div className="pt-2">
                  <button type="submit" disabled={savingApp} className="bg-[#0F172A] hover:bg-slate-800 text-white px-4 py-2 rounded-lg text-[13px] font-semibold transition shadow-xs">
                    {savingApp ? "Saving..." : "Save App Settings"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === "notifications" && (
            <div className="p-6">
              <h2 className="text-[16px] font-bold text-[#0F172A] mb-5">Alert Dispatch & Paging Preferences</h2>
              <form onSubmit={saveNotifications} className="space-y-4 max-w-lg">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-[13px] font-bold text-[#0F172A]">Downtime Email Alerts</h4>
                      <p className="text-[12px] text-slate-500">Immediate trigger when health probes fail twice.</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notificationSettings.alert_email}
                      onChange={(e) => setNotificationSettings({ ...notificationSettings, alert_email: e.target.checked })}
                      className="w-4 h-4 accent-[#635BFF]"
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      value={notificationSettings.alert_email_address}
                      onChange={(e) => setNotificationSettings({ ...notificationSettings, alert_email_address: e.target.value })}
                      className="w-full bg-white border border-slate-200 text-[#0F172A] rounded-lg py-1.5 px-3 text-xs outline-none focus:border-[#635BFF]"
                    />
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <h4 className="text-[13px] font-bold text-[#0F172A] mb-1">Slack Incident Webhook</h4>
                  <p className="text-[12px] text-slate-500 mb-2">Pings #ops channel whenever high-severity errors occur.</p>
                  <input
                    type="url"
                    value={notificationSettings.slack_webhook}
                    onChange={(e) => setNotificationSettings({ ...notificationSettings, slack_webhook: e.target.value })}
                    className="w-full bg-white border border-slate-200 text-[#0F172A] rounded-lg py-2 px-3 text-xs font-mono outline-none focus:border-[#635BFF]"
                  />
                </div>

                <button type="submit" disabled={savingNotifications} className="bg-[#0F172A] hover:bg-slate-800 text-white px-4 py-2 rounded-lg text-[13px] font-semibold transition shadow-xs">
                  {savingNotifications ? "Saving..." : "Save Preferences"}
                </button>
              </form>
            </div>
          )}

          {/* Security & API Keys Tab */}
          {activeTab === "security" && (
            <div className="p-6">
              <h2 className="text-[16px] font-bold text-[#0F172A] mb-5">API Keys & Ingestion Tokens</h2>
              <div className="space-y-6 max-w-xl">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Primary Ingestion Key</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      readOnly
                      value={appSettings.client_key}
                      className="flex-1 bg-slate-50 border border-slate-200 text-[#0F172A] rounded-lg py-2 px-3 text-xs font-mono font-bold"
                    />
                    <button
                      onClick={regenerateKey}
                      className="px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-[#0F172A] rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1.5"
                    >
                      <Key size={13} /> Rotate Key
                    </button>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <h3 className="text-[14px] font-bold text-[#0F172A] mb-1">Data Portability</h3>
                  <p className="text-[12px] text-slate-500 mb-3">Download complete JSON export of all audit logs, task history, and metrics.</p>
                  <button
                    onClick={exportData}
                    className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-[#0F172A] rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1.5"
                  >
                    <Download size={13} /> Export JSON Data
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Integrations Tab */}
          {activeTab === "integrations" && (
            <div className="p-6">
              <h2 className="text-[16px] font-bold text-[#0F172A] mb-5">Third-Party CI/CD Integrations</h2>
              <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 max-w-xl space-y-3">
                <div className="flex items-center gap-2.5">
                  <Webhook size={18} className="text-[#635BFF]" />
                  <h4 className="font-bold text-[14px] text-[#0F172A]">GitHub Deployment Webhook</h4>
                </div>
                <p className="text-[12.5px] text-slate-600">
                  Correlate code commits and pull requests with production latency spikes automatically.
                </p>
                <input
                  type="text"
                  readOnly
                  value="https://api.bhartinexus.com/v1/integrations/github"
                  className="w-full bg-white border border-slate-200 text-[#0F172A] rounded-lg py-2 px-3 text-xs font-mono font-semibold"
                />
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
