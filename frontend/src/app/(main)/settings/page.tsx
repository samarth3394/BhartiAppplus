"use client";

import React, { useEffect, useState } from "react";
import { Settings, User, Bell, Shield, Key, Download, Trash2, Smartphone, Globe, Mail } from "lucide-react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  
  // Profile State
  const [profile, setProfile] = useState({ full_name: "", email: "", password: "", avatar_url: "" });
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
  const [userRole, setUserRole] = useState<string>("viewer");

  const fetchProfile = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/me", { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setProfile({ ...data.user, password: "" });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAppSettings = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/settings/app", { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setUserRole(data.user_role || "viewer");
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
      const payload = {
        full_name: profile.full_name,
        avatar_url: profile.avatar_url || null,
        password: profile.password || null
      };
      const res = await fetch("http://localhost:5000/api/auth/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        alert("Profile updated successfully!");
        setProfile(prev => ({ ...prev, password: "" }));
      } else {
        const data = await res.json();
        alert(data.detail || "Failed to update profile");
      }
    } catch (err) {
      console.error(err);
      alert("Error updating profile");
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
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 h-full flex flex-col pb-12 font-sans">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/[0.04] shrink-0">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-[#EDEDED]">Settings</h1>
          <p className="text-[13px] text-[#888] mt-1">Manage your preferences, integrations, and app security.</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 flex-1 items-start">
        {/* Sidebar Nav */}
        <div className="w-full lg:w-56 shrink-0 flex flex-col gap-1">
          <button 
            onClick={() => setActiveTab("profile")}
            className={`flex items-center gap-3 px-3 py-2 rounded-md transition-all text-[13px] font-medium ${activeTab === "profile" ? "bg-white/[0.06] text-white" : "text-[#888] hover:text-[#EDEDED] hover:bg-white/[0.03]"}`}
          >
            <User size={16} className={activeTab === "profile" ? "text-white" : "text-[#555]"} /> My Profile
          </button>
          {["admin", "project_manager"].includes(userRole) && (
            <button 
              onClick={() => setActiveTab("app")}
              className={`flex items-center gap-3 px-3 py-2 rounded-md transition-all text-[13px] font-medium ${activeTab === "app" ? "bg-white/[0.06] text-white" : "text-[#888] hover:text-[#EDEDED] hover:bg-white/[0.03]"}`}
            >
              <Smartphone size={16} className={activeTab === "app" ? "text-white" : "text-[#555]"} /> App Settings
            </button>
          )}
          <button 
            onClick={() => setActiveTab("notifications")}
            className={`flex items-center gap-3 px-3 py-2 rounded-md transition-all text-[13px] font-medium ${activeTab === "notifications" ? "bg-white/[0.06] text-white" : "text-[#888] hover:text-[#EDEDED] hover:bg-white/[0.03]"}`}
          >
            <Bell size={16} className={activeTab === "notifications" ? "text-white" : "text-[#555]"} /> Notifications
          </button>
          {["admin"].includes(userRole) && (
            <button 
              onClick={() => setActiveTab("security")}
              className={`flex items-center gap-3 px-3 py-2 rounded-md transition-all text-[13px] font-medium ${activeTab === "security" ? "bg-white/[0.06] text-white" : "text-[#888] hover:text-[#EDEDED] hover:bg-white/[0.03]"}`}
            >
              <Shield size={16} className={activeTab === "security" ? "text-white" : "text-[#555]"} /> Security
            </button>
          )}
        </div>

        {/* Content Area */}
        <div className="flex-1 w-full bg-[#111] border border-white/[0.06] rounded-xl overflow-hidden min-h-[500px]">
          
          {activeTab === "profile" && (
            <div className="p-6">
              <h2 className="text-[15px] font-semibold text-[#EDEDED] mb-6">Profile Settings</h2>
              <form onSubmit={saveProfile} className="space-y-5 max-w-lg">
                <div className="space-y-1.5">
                  <label className="block text-[12px] font-medium text-[#888] uppercase tracking-wider">Full Name</label>
                  <input
                    type="text"
                    value={profile.full_name || ""}
                    onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                    className="w-full bg-[#0a0a0a] border border-white/[0.08] text-white rounded-lg py-2 px-3 outline-none focus:border-white/20 transition-colors text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-[12px] font-medium text-[#888] uppercase tracking-wider">Email Address</label>
                  <input
                    type="email"
                    value={profile.email || ""}
                    disabled
                    className="w-full bg-[#111] border border-white/[0.04] text-[#666] rounded-lg py-2 px-3 outline-none cursor-not-allowed text-sm"
                  />
                  <p className="text-[11px] text-[#555] mt-1">Email address cannot be changed.</p>
                </div>
                <div className="space-y-1.5">
                  <label className="block text-[12px] font-medium text-[#888] uppercase tracking-wider">Avatar URL</label>
                  <input
                    type="url"
                    value={profile.avatar_url || ""}
                    onChange={(e) => setProfile({ ...profile, avatar_url: e.target.value })}
                    className="w-full bg-[#0a0a0a] border border-white/[0.08] text-white rounded-lg py-2 px-3 outline-none focus:border-white/20 transition-colors text-sm"
                    placeholder="https://example.com/avatar.png"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-[12px] font-medium text-[#888] uppercase tracking-wider">New Password</label>
                  <input
                    type="password"
                    placeholder="Leave blank to keep current password"
                    value={profile.password || ""}
                    onChange={(e) => setProfile({ ...profile, password: e.target.value })}
                    className="w-full bg-[#0a0a0a] border border-white/[0.08] text-white rounded-lg py-2 px-3 outline-none focus:border-white/20 transition-colors text-sm"
                  />
                </div>
                <div className="pt-2">
                  <button type="submit" disabled={savingProfile} className="bg-white hover:bg-[#e5e5e5] text-black px-4 py-2 rounded-lg text-[13px] font-medium transition disabled:opacity-50">
                    {savingProfile ? "Saving..." : "Save Profile"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === "app" && (
            <div className="p-6">
              <h2 className="text-[15px] font-semibold text-[#EDEDED] mb-6">Application Settings</h2>
              <form onSubmit={saveApp} className="space-y-5 max-w-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-[12px] font-medium text-[#888] uppercase tracking-wider">App Logo URL</label>
                    <input
                      type="url"
                      placeholder="https://example.com/logo.png"
                      value={appSettings.logo_url || ""}
                      onChange={(e) => setAppSettings({ ...appSettings, logo_url: e.target.value })}
                      className="w-full bg-[#0a0a0a] border border-white/[0.08] text-white rounded-lg py-2 px-3 outline-none focus:border-white/20 transition-colors text-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[12px] font-medium text-[#888] uppercase tracking-wider">App Status</label>
                    <select
                      value={appSettings.is_active ? "active" : "maintenance"}
                      onChange={(e) => setAppSettings({ ...appSettings, is_active: e.target.value === "active" })}
                      className="w-full bg-[#0a0a0a] border border-white/[0.08] text-white rounded-lg py-2 px-3 outline-none focus:border-white/20 transition-colors appearance-none text-sm"
                    >
                      <option value="active">Active</option>
                      <option value="maintenance">Maintenance Mode</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="block text-[12px] font-medium text-[#888] uppercase tracking-wider">App Description</label>
                  <textarea
                    value={appSettings.description || ""}
                    onChange={(e) => setAppSettings({ ...appSettings, description: e.target.value })}
                    className="w-full bg-[#0a0a0a] border border-white/[0.08] text-white rounded-lg py-2 px-3 outline-none focus:border-white/20 transition-colors h-20 resize-none text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-[12px] font-medium text-[#888] uppercase tracking-wider">Production URL</label>
                  <div className="relative">
                    <Globe size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#555]" />
                    <input
                      type="url"
                      value={appSettings.url || ""}
                      onChange={(e) => setAppSettings({ ...appSettings, url: e.target.value })}
                      className="w-full bg-[#0a0a0a] border border-white/[0.08] text-white rounded-lg py-2 pl-9 pr-3 outline-none focus:border-white/20 transition-colors text-sm"
                    />
                  </div>
                </div>
                
                <div className="pt-6 mt-6 border-t border-white/[0.04]">
                  <h3 className="text-[14px] font-semibold text-[#EDEDED] mb-4">Uptime Monitoring</h3>
                  <div className="flex items-center gap-3 mb-4">
                    <input 
                      type="checkbox" 
                      id="monitor"
                      checked={appSettings.monitoring_enabled}
                      onChange={(e) => setAppSettings({ ...appSettings, monitoring_enabled: e.target.checked })}
                      className="w-4 h-4 rounded accent-white bg-[#0a0a0a] border-white/[0.08]" 
                    />
                    <label htmlFor="monitor" className="text-[13px] text-[#EDEDED]">Enable automated uptime checks</label>
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[12px] font-medium text-[#888] uppercase tracking-wider">Check Interval</label>
                    <select
                      value={appSettings.check_interval}
                      onChange={(e) => setAppSettings({ ...appSettings, check_interval: parseInt(e.target.value) })}
                      className="w-full bg-[#0a0a0a] border border-white/[0.08] text-white rounded-lg py-2 px-3 outline-none focus:border-white/20 transition-colors appearance-none text-sm"
                    >
                      <option value={1}>Every 1 Minute</option>
                      <option value={5}>Every 5 Minutes</option>
                      <option value={10}>Every 10 Minutes</option>
                      <option value={30}>Every 30 Minutes</option>
                    </select>
                  </div>
                </div>
                <div className="pt-4">
                  <button type="submit" disabled={savingApp} className="bg-white hover:bg-[#e5e5e5] text-black px-4 py-2 rounded-lg text-[13px] font-medium transition disabled:opacity-50">
                    {savingApp ? "Saving..." : "Save App Settings"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="p-6">
              <h2 className="text-[15px] font-semibold text-[#EDEDED] mb-6">Notification Preferences</h2>
              <form onSubmit={saveNotifications} className="space-y-5 max-w-lg">
                
                {/* Email Alerts */}
                <div className="p-4 border border-white/[0.06] rounded-xl bg-[#0a0a0a] space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-[#EDEDED] text-[13px] font-medium mb-1">Downtime Alerts (Email)</h4>
                      <p className="text-[12px] text-[#888]">Receive an email immediately when your app goes offline.</p>
                    </div>
                    <button type="button" onClick={() => setNotificationSettings(s => ({ ...s, alert_email: !s.alert_email }))}
                      className={`w-10 h-5 rounded-full relative transition-colors ${notificationSettings.alert_email ? 'bg-white' : 'bg-[#333]'}`}>
                      <div className={`w-3.5 h-3.5 rounded-full absolute top-[3px] transition-all ${notificationSettings.alert_email ? 'right-1 bg-black' : 'left-1 bg-[#888]'}`}></div>
                    </button>
                  </div>
                  {notificationSettings.alert_email && (
                    <div className="space-y-1.5 pt-2 border-t border-white/[0.04]">
                      <label className="block text-[11px] font-medium text-[#888] uppercase tracking-wider">Alert Email Address</label>
                      <div className="relative">
                        <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#555]" />
                        <input type="email" placeholder="alerts@yourcompany.com"
                          value={notificationSettings.alert_email_address}
                          onChange={(e) => setNotificationSettings(s => ({ ...s, alert_email_address: e.target.value }))}
                          className="w-full bg-[#111] border border-white/[0.08] text-white rounded-lg py-1.5 pl-9 pr-3 outline-none focus:border-white/20 transition-colors text-[13px]" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Weekly CTO Report */}
                <div className="p-4 border border-white/[0.06] rounded-xl bg-[#0a0a0a]">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-[#EDEDED] text-[13px] font-medium mb-1">Weekly AI Report</h4>
                      <p className="text-[12px] text-[#888]">Receive AI-generated summaries every Monday.</p>
                    </div>
                    <button type="button" onClick={() => setNotificationSettings(s => ({ ...s, weekly_cto_report: !s.weekly_cto_report }))}
                      className={`w-10 h-5 rounded-full relative transition-colors ${notificationSettings.weekly_cto_report ? 'bg-white' : 'bg-[#333]'}`}>
                      <div className={`w-3.5 h-3.5 rounded-full absolute top-[3px] transition-all ${notificationSettings.weekly_cto_report ? 'right-1 bg-black' : 'left-1 bg-[#888]'}`}></div>
                    </button>
                  </div>
                </div>

                {/* Slack Integration */}
                <div className="p-4 border border-white/[0.06] rounded-xl bg-[#0a0a0a]">
                  <h4 className="text-[#EDEDED] text-[13px] font-medium mb-1">Slack Integration</h4>
                  <p className="text-[12px] text-[#888] mb-3">Send alerts to a Slack channel via Webhook.</p>
                  <input type="url" placeholder="https://hooks.slack.com/services/..."
                    value={notificationSettings.slack_webhook}
                    onChange={(e) => setNotificationSettings(s => ({ ...s, slack_webhook: e.target.value }))}
                    className="w-full bg-[#111] border border-white/[0.08] text-white rounded-lg py-2 px-3 outline-none focus:border-white/20 transition-colors font-mono text-[12px]" />
                </div>

                <div className="pt-2">
                  <button type="submit" disabled={savingNotifications} className="bg-white hover:bg-[#e5e5e5] text-black px-4 py-2 rounded-lg text-[13px] font-medium transition disabled:opacity-50">
                    {savingNotifications ? "Saving..." : "Save Preferences"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === "security" && (
            <div className="p-6">
              <h2 className="text-[15px] font-semibold text-[#EDEDED] mb-6">Security & API</h2>
              
              <div className="space-y-8 max-w-2xl">
                <div>
                  <h3 className="text-[14px] font-medium text-[#EDEDED] mb-1">API Client Key</h3>
                  <p className="text-[12px] text-[#888] mb-3">Use this key to authenticate external systems pushing logs to BhartiAppPlus.</p>
                  <div className="flex gap-3">
                    <input 
                      type="text" 
                      readOnly 
                      value={appSettings.client_key}
                      className="flex-1 bg-[#0a0a0a] border border-white/[0.08] text-white font-mono rounded-lg py-2 px-3 outline-none text-[13px]"
                    />
                    <button 
                      onClick={regenerateKey}
                      className="px-3 py-2 bg-[#1a1a1a] border border-white/[0.08] hover:bg-[#222] text-[#EDEDED] rounded-lg transition flex items-center gap-1.5 text-[13px]"
                    >
                      <Key size={14} /> Regenerate
                    </button>
                  </div>
                </div>

                <div className="pt-6 border-t border-white/[0.04]">
                  <h3 className="text-[14px] font-medium text-[#EDEDED] mb-1">Export Data</h3>
                  <p className="text-[12px] text-[#888] mb-3">Download a complete JSON dump of all your app's data including logs, tasks, and users.</p>
                  <button 
                    onClick={exportData}
                    className="px-4 py-2 bg-[#111] hover:bg-[#1a1a1a] text-[#EDEDED] border border-white/[0.08] rounded-lg transition flex items-center gap-2 text-[13px]"
                  >
                    <Download size={14} /> Export JSON Data
                  </button>
                </div>

                <div className="pt-6 border-t border-white/[0.04]">
                  <h3 className="text-[14px] font-medium text-red-400 mb-1">Danger Zone</h3>
                  <p className="text-[12px] text-[#888] mb-3">Permanent actions that cannot be undone.</p>
                  <button onClick={deleteApp} className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-lg transition flex items-center gap-2 text-[13px] font-medium">
                    <Trash2 size={14} /> Delete Application
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
