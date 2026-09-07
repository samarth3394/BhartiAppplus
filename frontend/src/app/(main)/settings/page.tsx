"use client";

import React, { useEffect, useState } from "react";
import { Settings, User, Bell, Shield, Key, Download, Trash2, Smartphone, Globe, Mail } from "lucide-react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  
  // Profile State
  const [profile, setProfile] = useState({ full_name: "", email: "" });
  const [savingProfile, setSavingProfile] = useState(false);

  // App Settings State
  const [appSettings, setAppSettings] = useState({ 
    url: "", description: "", monitoring_enabled: true, check_interval: 5, client_key: "",
    logo_url: "", is_active: true
  });
  const [savingApp, setSavingApp] = useState(false);

  // Notification Settings State
  const [notificationSettings, setNotificationSettings] = useState({
    alert_email: true, alert_email_address: "",
    alert_whatsapp: false, alert_whatsapp_number: "",
    weekly_cto_report: false, slack_webhook: ""
  });
  const [savingNotifications, setSavingNotifications] = useState(false);

  const fetchProfile = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/settings/profile", { credentials: "include" });
      if (res.ok) setProfile(await res.json());
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAppSettings = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/settings/app", { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setAppSettings({
          url: data.url || "",
          description: data.description || "",
          monitoring_enabled: data.settings?.monitoring_enabled ?? true,
          check_interval: data.settings?.check_interval ?? 5,
          client_key: data.client_key,
          logo_url: data.settings?.logo_url || "",
          is_active: data.is_active ?? true
        });
        setNotificationSettings({
          alert_email: data.settings?.alert_email ?? true,
          alert_email_address: data.settings?.alert_email_address || "",
          alert_whatsapp: data.settings?.alert_whatsapp ?? false,
          alert_whatsapp_number: data.settings?.alert_whatsapp_number || "",
          weekly_cto_report: data.settings?.weekly_cto_report ?? false,
          slack_webhook: data.settings?.slack_webhook || ""
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchAppSettings();
  }, []);

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      await fetch("http://localhost:5000/api/settings/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(profile)
      });
    } finally {
      setSavingProfile(false);
    }
  };

  const saveApp = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingApp(true);
    try {
      await fetch("http://localhost:5000/api/settings/app", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          description: appSettings.description,
          url: appSettings.url,
          is_active: appSettings.is_active,
          settings: {
            monitoring_enabled: appSettings.monitoring_enabled,
            check_interval: appSettings.check_interval,
            logo_url: appSettings.logo_url
          }
        })
      });
      alert("App settings saved!");
    } catch (err) {
      console.error(err);
      alert("Failed to save app settings");
    } finally {
      setSavingApp(false);
    }
  };

  const saveNotifications = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingNotifications(true);
    try {
      await fetch("http://localhost:5000/api/settings/notifications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(notificationSettings)
      });
      alert("Notification settings saved!");
    } catch (err) {
      console.error(err);
      alert("Failed to save notification settings");
    } finally {
      setSavingNotifications(false);
    }
  };

  const regenerateKey = async () => {
    if (!confirm("Are you sure? Old clients using this key will lose access immediately.")) return;
    try {
      const res = await fetch("http://localhost:5000/api/settings/security/regenerate-key", { method: "POST", credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setAppSettings(prev => ({ ...prev, client_key: data.client_key }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const exportData = () => {
    window.open("http://localhost:5000/api/settings/danger/export-data", "_blank");
  };

  const deleteApp = async () => {
    if (!confirm("Are you ABSOLUTELY sure? This will delete the app and ALL its data permanently!")) return;
    try {
      const res = await fetch("http://localhost:5000/api/settings/danger/delete-app", { method: "DELETE", credentials: "include" });
      if (res.ok) {
        alert("App deleted successfully.");
        window.location.href = "/dashboard";
      } else {
        const errorData = await res.json();
        alert(errorData.detail || "Failed to delete app");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 h-full flex flex-col pb-12">
      {/* Header */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="p-3 bg-zinc-800 text-zinc-300 rounded-xl border border-white/10">
          <Settings size={28} />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-1">Settings</h1>
          <p className="text-zinc-400">Manage your profile, app configurations, and security.</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 flex-1 items-start">
        {/* Sidebar Nav */}
        <div className="w-full lg:w-64 bg-zinc-900/40 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shrink-0 flex flex-col gap-1">
          <button 
            onClick={() => setActiveTab("profile")}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === "profile" ? "bg-white/10 text-white font-medium" : "text-zinc-400 hover:text-white hover:bg-white/5"}`}
          >
            <User size={18} /> My Profile
          </button>
          <button 
            onClick={() => setActiveTab("app")}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === "app" ? "bg-white/10 text-white font-medium" : "text-zinc-400 hover:text-white hover:bg-white/5"}`}
          >
            <Smartphone size={18} /> App Settings
          </button>
          <button 
            onClick={() => setActiveTab("notifications")}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === "notifications" ? "bg-white/10 text-white font-medium" : "text-zinc-400 hover:text-white hover:bg-white/5"}`}
          >
            <Bell size={18} /> Notifications
          </button>
          <button 
            onClick={() => setActiveTab("security")}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === "security" ? "bg-white/10 text-white font-medium" : "text-zinc-400 hover:text-white hover:bg-white/5"}`}
          >
            <Shield size={18} /> Security
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 w-full bg-zinc-900/40 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
          
          {activeTab === "profile" && (
            <div className="p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Profile Settings</h2>
              <form onSubmit={saveProfile} className="space-y-6 max-w-lg">
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={profile.full_name || ""}
                    onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                    className="w-full bg-black/50 border border-white/10 text-white rounded-xl py-2.5 px-4 outline-none focus:border-blue-500/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">Email Address</label>
                  <input
                    type="email"
                    value={profile.email || ""}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    className="w-full bg-black/50 border border-white/10 text-white rounded-xl py-2.5 px-4 outline-none focus:border-blue-500/50 transition-colors"
                  />
                </div>
                <button type="submit" disabled={savingProfile} className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-xl font-medium transition disabled:opacity-50">
                  {savingProfile ? "Saving..." : "Save Profile"}
                </button>
              </form>
            </div>
          )}

          {activeTab === "app" && (
            <div className="p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Application Settings</h2>
              <form onSubmit={saveApp} className="space-y-6 max-w-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-2">App Logo URL</label>
                    <input
                      type="url"
                      placeholder="https://example.com/logo.png"
                      value={appSettings.logo_url || ""}
                      onChange={(e) => setAppSettings({ ...appSettings, logo_url: e.target.value })}
                      className="w-full bg-black/50 border border-white/10 text-white rounded-xl py-2.5 px-4 outline-none focus:border-purple-500/50 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-2">App Status</label>
                    <select
                      value={appSettings.is_active ? "active" : "maintenance"}
                      onChange={(e) => setAppSettings({ ...appSettings, is_active: e.target.value === "active" })}
                      className="w-full bg-black/50 border border-white/10 text-white rounded-xl py-2.5 px-4 outline-none focus:border-purple-500/50 transition-colors appearance-none"
                    >
                      <option value="active">Active</option>
                      <option value="maintenance">Maintenance Mode</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">App Description</label>
                  <textarea
                    value={appSettings.description || ""}
                    onChange={(e) => setAppSettings({ ...appSettings, description: e.target.value })}
                    className="w-full bg-black/50 border border-white/10 text-white rounded-xl py-2.5 px-4 outline-none focus:border-purple-500/50 transition-colors h-24 resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">Production URL</label>
                  <div className="relative">
                    <Globe size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                    <input
                      type="url"
                      value={appSettings.url || ""}
                      onChange={(e) => setAppSettings({ ...appSettings, url: e.target.value })}
                      className="w-full bg-black/50 border border-white/10 text-white rounded-xl py-2.5 pl-10 pr-4 outline-none focus:border-purple-500/50 transition-colors"
                    />
                  </div>
                </div>
                <div className="pt-4 border-t border-white/5">
                  <h3 className="text-lg font-semibold text-white mb-4">Uptime Monitoring</h3>
                  <div className="flex items-center gap-4 mb-4">
                    <input 
                      type="checkbox" 
                      id="monitor"
                      checked={appSettings.monitoring_enabled}
                      onChange={(e) => setAppSettings({ ...appSettings, monitoring_enabled: e.target.checked })}
                      className="w-5 h-5 rounded accent-purple-500 bg-black/50 border-white/10" 
                    />
                    <label htmlFor="monitor" className="text-zinc-300">Enable automated uptime checks</label>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-2">Check Interval (Minutes)</label>
                    <select
                      value={appSettings.check_interval}
                      onChange={(e) => setAppSettings({ ...appSettings, check_interval: parseInt(e.target.value) })}
                      className="w-full bg-black/50 border border-white/10 text-white rounded-xl py-2.5 px-4 outline-none focus:border-purple-500/50 transition-colors appearance-none"
                    >
                      <option value={1}>Every 1 Minute</option>
                      <option value={5}>Every 5 Minutes</option>
                      <option value={10}>Every 10 Minutes</option>
                      <option value={30}>Every 30 Minutes</option>
                    </select>
                  </div>
                </div>
                <button type="submit" disabled={savingApp} className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-2.5 rounded-xl font-medium transition disabled:opacity-50">
                  {savingApp ? "Saving..." : "Save App Settings"}
                </button>
              </form>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Notification Preferences</h2>
              <form onSubmit={saveNotifications} className="space-y-6 max-w-lg">
                {/* Email Alerts */}
                <div className="p-5 border border-white/10 rounded-xl bg-black/20 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-white font-medium mb-1">Downtime Alerts (Email)</h4>
                      <p className="text-sm text-zinc-400">Receive an email immediately when your app goes offline.</p>
                    </div>
                    <button type="button" onClick={() => setNotificationSettings(s => ({ ...s, alert_email: !s.alert_email }))}
                      className={`w-12 h-6 rounded-full relative transition-colors ${notificationSettings.alert_email ? 'bg-emerald-500' : 'bg-zinc-700'}`}>
                      <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${notificationSettings.alert_email ? 'right-1' : 'left-1'}`}></div>
                    </button>
                  </div>
                  {notificationSettings.alert_email && (
                    <div>
                      <label className="block text-sm font-medium text-zinc-400 mb-2">Alert Email Address</label>
                      <div className="relative">
                        <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                        <input type="email" placeholder="alerts@yourcompany.com"
                          value={notificationSettings.alert_email_address}
                          onChange={(e) => setNotificationSettings(s => ({ ...s, alert_email_address: e.target.value }))}
                          className="w-full bg-black/50 border border-white/10 text-white rounded-xl py-2.5 pl-10 pr-4 outline-none focus:border-emerald-500/50 transition-colors" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Weekly CTO Report */}
                <div className="p-5 border border-white/10 rounded-xl bg-black/20">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-white font-medium mb-1">Weekly CTO Report</h4>
                      <p className="text-sm text-zinc-400">Receive AI-generated executive summaries every Monday.</p>
                    </div>
                    <button type="button" onClick={() => setNotificationSettings(s => ({ ...s, weekly_cto_report: !s.weekly_cto_report }))}
                      className={`w-12 h-6 rounded-full relative transition-colors ${notificationSettings.weekly_cto_report ? 'bg-emerald-500' : 'bg-zinc-700'}`}>
                      <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${notificationSettings.weekly_cto_report ? 'right-1' : 'left-1'}`}></div>
                    </button>
                  </div>
                </div>

                {/* Slack Integration */}
                <div className="p-5 border border-white/10 rounded-xl bg-black/20">
                  <h4 className="text-white font-medium mb-1">Slack Integration</h4>
                  <p className="text-sm text-zinc-400 mb-3">Send downtime and critical alerts to a Slack channel via Webhook.</p>
                  <input type="url" placeholder="https://hooks.slack.com/services/..."
                    value={notificationSettings.slack_webhook}
                    onChange={(e) => setNotificationSettings(s => ({ ...s, slack_webhook: e.target.value }))}
                    className="w-full bg-black/50 border border-white/10 text-white rounded-xl py-2.5 px-4 outline-none focus:border-purple-500/50 transition-colors font-mono text-sm" />
                </div>

                <button type="submit" disabled={savingNotifications} className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2.5 rounded-xl font-medium transition disabled:opacity-50">
                  {savingNotifications ? "Saving..." : "Save Notification Settings"}
                </button>
              </form>
            </div>
          )}

          {activeTab === "security" && (
            <div className="p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Security & API</h2>
              
              <div className="space-y-8 max-w-2xl">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">API Client Key</h3>
                  <p className="text-sm text-zinc-400 mb-4">Use this key to authenticate external systems pushing logs to BhartiAppPlus.</p>
                  <div className="flex gap-4">
                    <input 
                      type="text" 
                      readOnly 
                      value={appSettings.client_key}
                      className="flex-1 bg-black/80 border border-white/10 text-emerald-400 font-mono rounded-xl py-2.5 px-4 outline-none"
                    />
                    <button 
                      onClick={regenerateKey}
                      className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl transition flex items-center gap-2"
                    >
                      <Key size={16} /> Regenerate
                    </button>
                  </div>
                </div>

                <div className="pt-8 border-t border-white/5">
                  <h3 className="text-lg font-semibold text-white mb-2">Export Data</h3>
                  <p className="text-sm text-zinc-400 mb-4">Download a complete JSON dump of all your app's data including logs, tasks, and users.</p>
                  <button 
                    onClick={exportData}
                    className="px-5 py-2.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 rounded-xl transition flex items-center gap-2"
                  >
                    <Download size={18} /> Export JSON Data
                  </button>
                </div>

                <div className="pt-8 border-t border-white/5">
                  <h3 className="text-lg font-semibold text-red-400 mb-2">Danger Zone</h3>
                  <p className="text-sm text-zinc-400 mb-4">Permanent actions that cannot be undone.</p>
                  <button onClick={deleteApp} className="px-5 py-2.5 bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/30 rounded-xl transition flex items-center gap-2">
                    <Trash2 size={18} /> Delete Application
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
