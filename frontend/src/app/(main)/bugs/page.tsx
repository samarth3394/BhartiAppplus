"use client";

import React, { useEffect, useState } from "react";
import {
  Search,
  Plus,
  AlertCircle,
  CheckCircle2,
  Clock,
  X,
  Sparkles,
  GitPullRequest,
  Copy,
  Check,
  DollarSign,
  ExternalLink,
  Code2,
} from "lucide-react";
import { getApiUrl } from "@/lib/api";

type BugFixDiff = {
  mode?: string;
  target_file: string;
  line: number;
  confidence: number;
  root_cause: string;
  explanation: string;
  unified_diff: string;
  test_case: string;
  pr_title: string;
  pr_body: string;
};

type BugPRInfo = {
  status: string;
  pr_number?: number;
  pr_url?: string;
  branch_name?: string;
  pr_title?: string;
  cli_command?: string;
  message?: string;
};

type BugRevenueImpact = {
  severity_weight: number;
  hourly_exposure: number;
  cumulative_risk: number;
  open_hours: number;
  is_active: boolean;
};

type BugItem = {
  id: string;
  title: string;
  description: string;
  severity: "critical" | "high" | "medium" | "low";
  status: "open" | "in_progress" | "testing" | "resolved";
  reported_by: string;
  reporter_avatar?: string;
  assignee: string;
  assignee_avatar?: string;
  created_at: string;
  metadata_json?: {
    stack_trace?: string;
    ai_fix?: BugFixDiff;
    github_pr?: BugPRInfo;
  };
  revenue_impact?: BugRevenueImpact;
};

const DEFAULT_BUGS: BugItem[] = [
  {
    id: "bug-101",
    title: "Postgres client pool connection timeout under 5,000 req/s traffic spike",
    description:
      'File "services/db_pool.py", line 84, in get_db_connection — PoolTimeoutError acquiring connection from primary pool after 2.0s.',
    severity: "critical",
    status: "in_progress",
    reported_by: "SRE Autonomous Watchdog",
    assignee: "Rohan Patil",
    assignee_avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    created_at: "2026-11-08T18:24:00Z",
    revenue_impact: {
      severity_weight: 1.0,
      hourly_exposure: 14500,
      cumulative_risk: 29000,
      open_hours: 2.0,
      is_active: true,
    },
  },
  {
    id: "bug-102",
    title: "Memory leak in Kafka consumer worker when deserializing malformed Protobuf batch",
    description:
      'File "workers/kafka_ingest.py", line 142, in consume_batch — Unhandled KeyError in dead-letter queue fallback handler.',
    severity: "high",
    status: "open",
    reported_by: "Neha Sharma",
    reporter_avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    assignee: "Samarth Choudhar",
    assignee_avatar: "/avatars/samarth.png",
    created_at: "2026-11-09T09:12:00Z",
    revenue_impact: {
      severity_weight: 0.5,
      hourly_exposure: 7250,
      cumulative_risk: 14500,
      open_hours: 2.0,
      is_active: true,
    },
  },
  {
    id: "bug-103",
    title: "Next.js OAuth state mismatch on expired token cookie refresh during SSR route",
    description:
      'File "src/app/login/page.tsx", line 42 — Cookie attribute SameSite needs proper fallback for preview deployments.',
    severity: "medium",
    status: "open",
    reported_by: "Vikram Kulkarni",
    reporter_avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80",
    assignee: "Unassigned",
    created_at: "2026-11-09T11:45:00Z",
    revenue_impact: {
      severity_weight: 0.15,
      hourly_exposure: 2175,
      cumulative_risk: 4350,
      open_hours: 2.0,
      is_active: true,
    },
  },
  {
    id: "bug-104",
    title: "API Gateway rate limiter returns 500 instead of 429 on Redis connection blip",
    description:
      'File "routes/api_ingest.py", line 55 — Redis timeout causes unhandled exception instead of graceful fail-open or 429.',
    severity: "high",
    status: "resolved",
    reported_by: "Rohan Patil",
    reporter_avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    assignee: "Samarth Choudhar",
    assignee_avatar: "/avatars/samarth.png",
    created_at: "2026-11-07T14:30:00Z",
    revenue_impact: {
      severity_weight: 0.5,
      hourly_exposure: 0,
      cumulative_risk: 3625,
      open_hours: 0.5,
      is_active: false,
    },
  },
];

function formatMoney(val: number, currency: string) {
  const sym = currency === "INR" ? "₹" : "$";
  return `${sym}${val.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
}

export default function BugsPage() {
  const [bugs, setBugs] = useState<BugItem[]>(DEFAULT_BUGS);
  const [currency, setCurrency] = useState<string>("USD");
  const [showBugModal, setShowBugModal] = useState(false);
  const [newBug, setNewBug] = useState({ title: "", description: "", severity: "medium" });
  const [searchQuery, setSearchQuery] = useState("");
  const [severityFilter, setSeverityFilter] = useState("all");

  // AI Self-Healing Fix Diff Modal State
  const [selectedBug, setSelectedBug] = useState<BugItem | null>(null);
  const [fixLoading, setFixLoading] = useState(false);
  const [prLoading, setPrLoading] = useState(false);
  const [activeFix, setActiveFix] = useState<BugFixDiff | null>(null);
  const [activePR, setActivePR] = useState<BugPRInfo | null>(null);
  const [copiedPatch, setCopiedPatch] = useState(false);

  const fetchBugs = async () => {
    try {
      const res = await fetch(getApiUrl("/api/bugs"), {
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        if (data.currency) setCurrency(data.currency);
        if (data.bugs && data.bugs.length > 0) {
          setBugs(data.bugs);
        }
      }
    } catch {
      // Retain default view if unauthenticated or backend unreachable
    }
  };

  useEffect(() => {
    const loadBugs = async () => {
      try {
        const res = await fetch(getApiUrl("/api/bugs"), {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          if (data.currency) setCurrency(data.currency);
          if (data.bugs && data.bugs.length > 0) {
            setBugs(data.bugs);
          }
        }
      } catch {
        // Retain default view if unauthenticated or backend unreachable
      }
    };
    loadBugs();
  }, []);

  const handleCreateBug = async () => {
    if (!newBug.title.trim()) return;
    const created: BugItem = {
      id: "bug-" + Date.now(),
      title: newBug.title,
      description: newBug.description,
      severity: newBug.severity as BugItem["severity"],
      status: "open",
      reported_by: "Samarth Choudhar",
      assignee: "Unassigned",
      created_at: new Date().toISOString(),
    };

    setBugs((prev) => [created, ...prev]);
    setShowBugModal(false);
    setNewBug({ title: "", description: "", severity: "medium" });

    try {
      const res = await fetch(getApiUrl("/api/bugs"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(newBug),
      });
      if (res.ok) {
        fetchBugs();
      }
    } catch {
      // Local optimistic update remains visible
    }
  };

  const openSelfHealingModal = async (bug: BugItem) => {
    setSelectedBug(bug);
    setActiveFix(bug.metadata_json?.ai_fix || null);
    setActivePR(bug.metadata_json?.github_pr || null);

    if (bug.metadata_json?.ai_fix) return;

    setFixLoading(true);
    try {
      const res = await fetch(getApiUrl(`/api/bugs/${bug.id}/generate-fix`), {
        method: "POST",
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setActiveFix(data.fix);
        setBugs((prev) =>
          prev.map((b) =>
            b.id === bug.id
              ? { ...b, metadata_json: { ...(b.metadata_json || {}), ai_fix: data.fix } }
              : b
          )
        );
        return;
      }
    } catch {
      // Fall back to deterministic preview diff if viewing demo items unauthenticated
    } finally {
      setFixLoading(false);
    }

    // Preview fallback for demo bugs when not logged into a workspace
    const match = bug.description.match(/File "([^"]+)", line (\d+)/);
    const targetFile = match ? match[1] : "services/handler.py";
    const lineNum = match ? Number(match[2]) : 42;
    const previewFix: BugFixDiff = {
      mode: "preview_demo",
      target_file: targetFile,
      line: lineNum,
      confidence: 0.78,
      root_cause: `Detected runtime failure pattern in ${targetFile} at line ${lineNum} triggered by unhandled exception or timeout.`,
      explanation: "Adds defensive timeout / exception guard with structured contextual logging.",
      unified_diff:
        `--- a/${targetFile}\n` +
        `+++ b/${targetFile}\n` +
        `@@ -${lineNum},3 +${lineNum},8 @@\n` +
        `-    result = execute_operation(payload)\n` +
        `+    try:\n` +
        `+        result = execute_operation(payload, timeout=5.0)\n` +
        `+    except Exception as exc:\n` +
        `+        logger.warning("Handled incident cleanly: %s", exc)\n` +
        `+        raise HTTPException(status_code=503, detail="Transient upstream failure") from exc\n`,
      test_case: "Simulate upstream timeout / malformed payload and verify graceful non-crashing recovery.",
      pr_title: `fix: resolve ${bug.title.slice(0, 56)}`,
      pr_body: `Automated self-healing hotfix for ${bug.title}`,
    };
    setActiveFix(previewFix);
  };

  const handleCreatePR = async () => {
    if (!selectedBug || !activeFix) return;
    setPrLoading(true);
    try {
      const res = await fetch(getApiUrl(`/api/bugs/${selectedBug.id}/create-pr`), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          pr_title: activeFix.pr_title,
          pr_body: activeFix.pr_body,
          target_file: activeFix.target_file,
        }),
      });
      if (res.ok) {
        const data: BugPRInfo = await res.json();
        setActivePR(data);
        return;
      }
    } catch {
      // Fallback preview draft below
    } finally {
      setPrLoading(false);
    }

    const branch = `brexal/fix-${selectedBug.id.slice(0, 8)}`;
    setActivePR({
      status: "draft_ready",
      branch_name: branch,
      pr_title: activeFix.pr_title,
      cli_command: `git checkout -b ${branch} && git apply <<'EOF'\n${activeFix.unified_diff}\nEOF\ngh pr create --title "${activeFix.pr_title}"`,
      message: "Sign in & configure GitHub Repo/Token in Settings to publish PRs automatically via GitHub API.",
    });
  };

  const copyPatch = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPatch(true);
    setTimeout(() => setCopiedPatch(false), 2000);
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "critical": return "text-red-700 bg-red-50 border-red-200/80";
      case "high": return "text-orange-700 bg-orange-50 border-orange-200/80";
      case "medium": return "text-blue-700 bg-blue-50 border-blue-200/80";
      case "low": return "text-slate-700 bg-slate-100 border-slate-200/80";
      default: return "text-slate-700 bg-slate-100 border-slate-200/80";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "open":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold text-rose-700 bg-rose-50 border border-rose-200/80">
            <AlertCircle size={12} className="text-rose-600" /> Open
          </span>
        );
      case "in_progress":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold text-blue-700 bg-blue-50 border border-blue-200/80">
            <Clock size={12} className="text-blue-600" /> In Progress
          </span>
        );
      case "resolved":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/80">
            <CheckCircle2 size={12} className="text-emerald-600" /> Resolved
          </span>
        );
      default:
        return null;
    }
  };

  const filteredBugs = bugs.filter((b) => {
    const matchesSearch =
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSeverity = severityFilter === "all" || b.severity === severityFilter;
    return matchesSearch && matchesSeverity;
  });

  return (
    <div className="space-y-6 max-w-[1240px] mx-auto h-full flex flex-col pb-8 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0 pb-5 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0A2540]">
              Issues &amp; Incident Tracker
            </h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold uppercase tracking-wider bg-[#635BFF]/10 text-[#635BFF] border border-[#635BFF]/20">
              AI Self-Healing
            </span>
          </div>
          <p className="text-[13.5px] text-[#425466]">
            Real-time bug logs, estimated revenue exposure per incident, and 1-click AI GitHub Fix PR generation.
          </p>
        </div>
        <button
          onClick={() => setShowBugModal(true)}
          className="inline-flex items-center justify-center gap-2 bg-[#635BFF] hover:bg-[#5349e0] text-white px-5 py-2.5 rounded-xl text-[13px] font-bold transition-all shadow-[0_4px_14px_rgba(99,91,255,0.25)] hover:shadow-[0_6px_20px_rgba(99,91,255,0.35)] shrink-0 cursor-pointer"
        >
          <Plus size={15} />
          Report Issue
        </button>
      </div>

      {/* Toolbar / Filters */}
      <div className="flex flex-col sm:flex-row gap-3.5">
        <div className="relative flex-1 max-w-md">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search issues, endpoints, or stacktraces..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-slate-200/90 text-[#0A2540] rounded-xl py-2.5 pl-10 pr-3.5 text-[13px] outline-none focus:border-[#635BFF] focus:ring-2 focus:ring-[#635BFF]/15 placeholder:text-slate-400 font-medium transition shadow-xs"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="bg-white border border-slate-200/90 text-[#0A2540] rounded-xl py-2.5 px-3.5 text-[13px] outline-none focus:border-[#635BFF] font-semibold shadow-xs"
          >
            <option value="all">All Severities</option>
            <option value="critical">Critical (P0)</option>
            <option value="high">High (P1)</option>
            <option value="medium">Medium (P2)</option>
            <option value="low">Low (P3)</option>
          </select>
        </div>
      </div>

      {/* Issues Table / List */}
      <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(10,37,64,0.03)]">
        <div className="divide-y divide-slate-100">
          {filteredBugs.length === 0 ? (
            <div className="text-center py-14 text-[#425466] text-sm">
              No matching issues found.
            </div>
          ) : (
            filteredBugs.map((bug) => {
              const rev = bug.revenue_impact;
              const prInfo = bug.metadata_json?.github_pr;
              return (
                <div
                  key={bug.id}
                  className="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getSeverityBadge(bug.severity)}`}
                      >
                        {bug.severity}
                      </span>
                      {getStatusBadge(bug.status)}
                      <span className="text-[11px] font-mono text-[#425466]">#{bug.id.slice(0, 12)}</span>

                      {/* Revenue Impact Badge */}
                      {rev && rev.hourly_exposure > 0 && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-amber-50 text-amber-800 border border-amber-200/90">
                          <DollarSign size={11} className="text-amber-600" />
                          Est. Risk: {formatMoney(rev.hourly_exposure, currency)}/hr
                          {rev.cumulative_risk > 0 && (
                            <span className="text-amber-600 font-normal">
                              ({formatMoney(rev.cumulative_risk, currency)} cum.)
                            </span>
                          )}
                        </span>
                      )}

                      {prInfo?.pr_url && (
                        <a
                          href={prInfo.pr_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 hover:underline"
                        >
                          <GitPullRequest size={11} />
                          PR #{prInfo.pr_number}
                          <ExternalLink size={10} />
                        </a>
                      )}
                    </div>

                    <h3 className="text-[14.5px] font-bold text-[#0A2540] leading-snug mb-1">
                      {bug.title}
                    </h3>

                    <p className="text-[13px] text-[#425466] line-clamp-2 leading-relaxed">
                      {bug.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-5 mt-3 text-[12px] text-[#425466] font-medium">
                      <span className="flex items-center gap-1.5">
                        {bug.reporter_avatar || bug.reported_by?.includes("Samarth") ? (
                          <img
                            src={bug.reporter_avatar || "/avatars/samarth.png"}
                            alt=""
                            className="w-5 h-5 rounded-full object-cover border border-slate-200"
                          />
                        ) : null}
                        Reported by: <strong className="text-[#0A2540]">{bug.reported_by || "System"}</strong>
                      </span>
                      <span className="flex items-center gap-1.5">
                        {bug.assignee_avatar || bug.assignee?.includes("Samarth") ? (
                          <img
                            src={bug.assignee_avatar || "/avatars/samarth.png"}
                            alt=""
                            className="w-5 h-5 rounded-full object-cover border border-slate-200"
                          />
                        ) : null}
                        Assignee: <strong className="text-[#0A2540]">{bug.assignee || "Unassigned"}</strong>
                      </span>
                      <span className="font-mono text-slate-400">
                        {new Date(bug.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Action: AI Self-Healing PR Button */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => openSelfHealingModal(bug)}
                      className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#EFF6FF] hover:bg-[#DBEAFE] text-[#2563EB] border border-blue-200/80 text-xs font-bold transition-all cursor-pointer shadow-2xs"
                    >
                      <Sparkles size={14} />
                      <span>{bug.metadata_json?.ai_fix ? "View AI Fix Diff" : "AI Fix & PR"}</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* AI Self-Healing PR Modal */}
      {selectedBug && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A2540]/50 backdrop-blur-sm">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-50 text-[#2563EB] border border-blue-200">
                  <Code2 size={18} />
                </div>
                <div>
                  <h2 className="text-base font-extrabold text-[#0A2540]">
                    AI Self-Healing Patch &amp; GitHub PR
                  </h2>
                  <p className="text-[11.5px] text-slate-500 font-mono truncate max-w-md">
                    {selectedBug.title}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedBug(null)}
                className="p-1.5 hover:bg-slate-200/70 rounded-lg text-slate-500 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-5 text-left">
              {fixLoading ? (
                <div className="py-12 text-center space-y-3">
                  <Sparkles size={24} className="mx-auto text-[#2563EB] animate-spin" />
                  <p className="text-sm font-semibold text-[#0A2540]">
                    Analyzing stack trace and generating unified fix patch...
                  </p>
                </div>
              ) : activeFix ? (
                <>
                  {/* Root Cause & Metadata */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                      <div className="text-[10px] font-mono uppercase text-slate-400 font-bold">
                        Target File
                      </div>
                      <div className="text-xs font-mono font-bold text-[#0A2540] mt-0.5 truncate">
                        {activeFix.target_file}:{activeFix.line}
                      </div>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                      <div className="text-[10px] font-mono uppercase text-slate-400 font-bold">
                        Confidence
                      </div>
                      <div className="text-xs font-mono font-bold text-emerald-700 mt-0.5">
                        {Math.round((activeFix.confidence || 0.75) * 100)}% ({activeFix.mode || "ai"})
                      </div>
                    </div>
                    <div className="p-3 rounded-xl bg-amber-50 border border-amber-200/80">
                      <div className="text-[10px] font-mono uppercase text-amber-700 font-bold">
                        Revenue Risk
                      </div>
                      <div className="text-xs font-mono font-bold text-amber-900 mt-0.5">
                        {selectedBug.revenue_impact
                          ? `${formatMoney(selectedBug.revenue_impact.hourly_exposure, currency)}/hr`
                          : "Unconfigured"}
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200/80 text-xs text-[#0A2540] space-y-1.5">
                    <div className="font-bold text-[#2563EB] uppercase tracking-wider text-[10.5px] font-mono">
                      Root Cause Analysis
                    </div>
                    <p className="leading-relaxed font-medium">{activeFix.root_cause}</p>
                    <p className="text-slate-600">{activeFix.explanation}</p>
                  </div>

                  {/* Unified Diff Box */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-mono font-bold text-[#0A2540]">
                        Unified Patch Diff
                      </span>
                      <button
                        onClick={() => copyPatch(activeFix.unified_diff)}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-[#0A2540] text-[11px] font-mono font-bold cursor-pointer"
                      >
                        {copiedPatch ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
                        <span>{copiedPatch ? "Copied" : "Copy Diff"}</span>
                      </button>
                    </div>
                    <pre className="p-4 rounded-xl bg-[#0A2540] text-slate-100 font-mono text-xs overflow-x-auto leading-relaxed">
                      {activeFix.unified_diff.split("\n").map((line, i) => {
                        const cls = line.startsWith("+") && !line.startsWith("+++")
                          ? "text-emerald-400"
                          : line.startsWith("-") && !line.startsWith("---")
                            ? "text-rose-400"
                            : line.startsWith("@@")
                              ? "text-cyan-300"
                              : "text-slate-300";
                        return (
                          <div key={i} className={cls}>
                            {line}
                          </div>
                        );
                      })}
                    </pre>
                  </div>

                  {/* GitHub PR Result */}
                  {activePR && (
                    <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs space-y-2">
                      {activePR.pr_url ? (
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <div className="font-bold text-emerald-900">
                              Draft Pull Request #{activePR.pr_number} Created
                            </div>
                            <div className="text-emerald-700 font-mono text-[11px]">
                              Branch: {activePR.branch_name}
                            </div>
                          </div>
                          <a
                            href={activePR.pr_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-bold hover:bg-emerald-700"
                          >
                            <span>Open on GitHub</span>
                            <ExternalLink size={12} />
                          </a>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="font-bold text-[#0A2540]">{activePR.message}</div>
                          {activePR.cli_command && (
                            <pre className="p-3 rounded-lg bg-white border border-slate-200 font-mono text-[11px] text-[#0A2540] overflow-x-auto">
                              {activePR.cli_command}
                            </pre>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </>
              ) : null}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-slate-200 bg-slate-50/70 flex items-center justify-between gap-3">
              <span className="text-[11px] text-slate-500 font-mono">
                {activeFix ? `Test suggestion: ${activeFix.test_case}` : ""}
              </span>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setSelectedBug(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-[#0A2540] cursor-pointer"
                >
                  Close
                </button>
                <button
                  onClick={handleCreatePR}
                  disabled={prLoading || fixLoading || !activeFix}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-bold shadow-xs disabled:opacity-50 cursor-pointer"
                >
                  <GitPullRequest size={14} />
                  <span>{prLoading ? "Opening PR..." : "Create 1-Click GitHub PR"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Report Bug Modal */}
      {showBugModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A2540]/40 backdrop-blur-sm">
          <div className="bg-white border border-slate-200/90 rounded-2xl w-full max-w-lg p-6 sm:p-7 shadow-[0_20px_60px_rgba(10,37,64,0.15)]">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-[17px] font-extrabold text-[#0A2540]">Report Issue or Incident</h2>
              <button
                onClick={() => setShowBugModal(false)}
                className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-[#425466] uppercase tracking-wider">
                  Issue Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Memory leak in background worker..."
                  value={newBug.title}
                  onChange={(e) => setNewBug({ ...newBug, title: e.target.value })}
                  className="w-full bg-[#FAFBFD] border border-slate-200/90 text-[#0A2540] py-2.5 px-3.5 rounded-xl outline-none focus:border-[#635BFF] focus:bg-white focus:ring-2 focus:ring-[#635BFF]/15 text-[14px] placeholder:text-slate-400 font-semibold transition"
                  autoFocus
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-[#425466] uppercase tracking-wider">
                  Details &amp; Stacktrace
                </label>
                <textarea
                  rows={4}
                  placeholder="Steps to reproduce, File path/line number, error logs..."
                  value={newBug.description}
                  onChange={(e) => setNewBug({ ...newBug, description: e.target.value })}
                  className="w-full bg-[#FAFBFD] border border-slate-200/90 text-[#0A2540] rounded-xl py-2.5 px-3.5 outline-none focus:border-[#635BFF] focus:bg-white focus:ring-2 focus:ring-[#635BFF]/15 text-[13px] placeholder:text-slate-400 resize-none transition"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-[#425466] uppercase tracking-wider">
                  Severity Level
                </label>
                <select
                  value={newBug.severity}
                  onChange={(e) => setNewBug({ ...newBug, severity: e.target.value })}
                  className="w-full bg-[#FAFBFD] border border-slate-200/90 text-[#0A2540] rounded-xl py-2.5 px-3.5 outline-none focus:border-[#635BFF] text-[13px] font-semibold transition"
                >
                  <option value="critical">Critical (P0 / Service Outage)</option>
                  <option value="high">High (P1 / Major Degradation)</option>
                  <option value="medium">Medium (P2 / Standard Bug)</option>
                  <option value="low">Low (P3 / Minor Polish)</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-100">
              <button
                onClick={() => setShowBugModal(false)}
                className="px-4 py-2 text-[13px] font-bold text-[#425466] hover:text-[#0A2540] transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateBug}
                className="px-5 py-2 bg-[#635BFF] hover:bg-[#5349e0] text-white rounded-xl text-[13px] font-bold transition shadow-xs cursor-pointer"
              >
                Submit Incident
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
