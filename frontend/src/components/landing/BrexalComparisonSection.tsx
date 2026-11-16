"use client";

import React, { useState } from "react";
import { Check, ExternalLink, Info, Minus } from "lucide-react";

type CapabilityStatus = "implemented" | "partial" | "not_implemented" | "unverified";

interface PlatformEntry {
  summary: string;
  docUrl?: string;
  docLabel?: string;
}

interface ComparisonRow {
  category: string;
  context: string;
  brexal: {
    summary: string;
    status: CapabilityStatus;
  };
  datadog: PlatformEntry;
  newrelic: PlatformEntry;
  dynatrace: PlatformEntry;
}

const COMPARISON_ROWS: ComparisonRow[] = [
  {
    category: "1. Telemetry Collection Architecture",
    context: "How host, runtime, and error signals are collected",
    brexal: {
      summary:
        "Lightweight Python host agent (psutil CPU/RAM/disk polling), HTTP/REST error & metrics ingest APIs, and scheduled HTTP/SSL uptime checks.",
      status: "implemented",
    },
    datadog: {
      summary:
        "Datadog Agent daemon, DogStatsD, language-specific APM tracers, and embedded OTel Collector (DDOT).",
      docUrl: "https://docs.datadoghq.com/agent/",
      docLabel: "Datadog Agent Docs",
    },
    newrelic: {
      summary:
        "Infrastructure agent, language APM agents, Kubernetes Pixie integration, and OTLP ingest endpoints.",
      docUrl: "https://docs.newrelic.com/docs/newrelic-solutions/get-started/intro-new-relic/",
      docLabel: "New Relic Docs",
    },
    dynatrace: {
      summary:
        "Unified OneAgent daemon combining OS telemetry, process runtime modules, and network sensors.",
      docUrl: "https://docs.dynatrace.com/docs/ingest-from/dynatrace-oneagent",
      docLabel: "Dynatrace OneAgent Docs",
    },
  },
  {
    category: "2. eBPF Support",
    context: "Kernel-level network and process visibility",
    brexal: {
      summary:
        "Not currently implemented in the active agent (uses userspace psutil polling; kernel eBPF probes not present in codebase).",
      status: "not_implemented",
    },
    datadog: {
      summary:
        "Native support on supported Linux kernels via Universal Service Monitoring (USM), Network Performance Monitoring, and Host Profiler.",
      docUrl: "https://docs.datadoghq.com/universal_service_monitoring/",
      docLabel: "Datadog USM Docs",
    },
    newrelic: {
      summary:
        "Supported via New Relic eBPF infrastructure/APM agent and Pixie Kubernetes integration on Linux kernels.",
      docUrl: "https://docs.newrelic.com/docs/infrastructure/new-relic-infrastructure/data-ingest/ebpf-agent/",
      docLabel: "New Relic eBPF Docs",
    },
    dynatrace: {
      summary:
        "Supported on Linux hosts via NetTracer and eBPF Service Discovery alongside OneAgent.",
      docUrl: "https://docs.dynatrace.com/docs/observe/infrastructure-monitoring/hosts/configuration/ebpf-service-discovery",
      docLabel: "Dynatrace eBPF Docs",
    },
  },
  {
    category: "3. OpenTelemetry Compatibility",
    context: "OTLP gRPC/HTTP ingest and standard pipelines",
    brexal: {
      summary:
        "Supports standard OTLP/HTTP JSON ingestion (/v1/metrics, /v1/traces, /v1/logs) alongside REST JSON APIs; OTLP gRPC (4317) not implemented.",
      status: "partial",
    },
    datadog: {
      summary:
        "Native OTLP ingestion via Datadog Agent, DDOT Collector, or standalone OpenTelemetry Collector exporter.",
      docUrl: "https://docs.datadoghq.com/opentelemetry/",
      docLabel: "Datadog OTel Docs",
    },
    newrelic: {
      summary:
        "Native OTLP gRPC/HTTP ingestion and official OpenTelemetry SDK and Collector interoperability.",
      docUrl: "https://docs.newrelic.com/docs/opentelemetry/get-started/opentelemetry-new-relic-intro/",
      docLabel: "New Relic OTel Docs",
    },
    dynatrace: {
      summary:
        "Native OTLP ingestion via Dynatrace API, Collector exporter, and local OneAgent OTLP endpoint.",
      docUrl: "https://docs.dynatrace.com/docs/ingest-from/opentelemetry",
      docLabel: "Dynatrace OTel Docs",
    },
  },
  {
    category: "4. Telemetry Portability",
    context: "Ability to export data and switch pipelines",
    brexal: {
      summary:
        "Supports JSON data export via account export endpoints and direct PostgreSQL/SQLite database access in self-hosted setups.",
      status: "implemented",
    },
    datadog: {
      summary:
        "OpenTelemetry upstream instrumentation enables multi-vendor routing; stored data uses Datadog query APIs.",
      docUrl: "https://docs.datadoghq.com/opentelemetry/",
      docLabel: "Datadog OTel Docs",
    },
    newrelic: {
      summary:
        "Upstream OpenTelemetry Collectors allow multi-destination forwarding; stored telemetry uses NRQL.",
      docUrl: "https://docs.newrelic.com/docs/opentelemetry/",
      docLabel: "New Relic OTel Docs",
    },
    dynatrace: {
      summary:
        "Supports OpenTelemetry ingest and OpenPipeline routing; stored data is queried via DQL on Grail™.",
      docUrl: "https://docs.dynatrace.com/docs/ingest-from/opentelemetry",
      docLabel: "Dynatrace OTel Docs",
    },
  },
  {
    category: "5. CPU and Memory Overhead",
    context: "Host resource consumption under load",
    brexal: {
      summary:
        "Periodic psutil metric polling at configurable intervals; Not independently verified under standardized benchmark loads.",
      status: "unverified",
    },
    datadog: {
      summary:
        "Varies by enabled agent modules (APM, Logs, Profiler, USM); Not independently verified in standardized third-party comparisons.",
      docUrl: "https://docs.datadoghq.com/opentelemetry/guide/ingestion_sampling_with_opentelemetry/",
      docLabel: "Datadog Docs",
    },
    newrelic: {
      summary:
        "Varies by agent type (language bytecode, eBPF/Pixie, or OTel Collector); Not independently verified in standardized comparisons.",
      docUrl: "https://docs.newrelic.com/docs/agents/",
      docLabel: "New Relic Agent Docs",
    },
    dynatrace: {
      summary:
        "Varies by OneAgent monitoring depth and service density; Not independently verified in standardized third-party comparisons.",
      docUrl: "https://docs.dynatrace.com/docs/ingest-from/dynatrace-oneagent",
      docLabel: "Dynatrace OneAgent Docs",
    },
  },
  {
    category: "6. Pricing Model",
    context: "Commercial structure and cost predictability",
    brexal: {
      summary:
        "Designed for predictable observability costs without per-GB ingest meters in the platform; commercial pricing plans are not finalized.",
      status: "implemented",
    },
    datadog: {
      summary:
        "Modular per-host/month pricing (Infrastructure, APM) plus usage-based billing for indexed spans, custom metrics, and log ingest.",
      docUrl: "https://docs.datadoghq.com/account_management/billing/",
      docLabel: "Datadog Billing Docs",
    },
    newrelic: {
      summary:
        "Consumption-based pricing combining data ingest (GB/month with 100 GB free tier) with user seats or Compute Capacity Units (CCUs).",
      docUrl: "https://docs.newrelic.com/docs/accounts/accounts-billing/new-relic-one-pricing-billing/usage-plan-and-pricing/",
      docLabel: "New Relic Pricing Docs",
    },
    dynatrace: {
      summary:
        "Dynatrace Platform Subscription (DPS) unified consumption model across host hours, GiB ingested/retained, and monitors.",
      docUrl: "https://docs.dynatrace.com/docs/manage/subscriptions-and-licensing/dynatrace-platform-subscription",
      docLabel: "Dynatrace DPS Docs",
    },
  },
  {
    category: "7. AI-Powered Incident Analysis",
    context: "Automated root cause and anomaly tooling",
    brexal: {
      summary:
        "Implements Google Gemini bug root-cause suggestions, executive impact summaries, and Pandas/NumPy linear-regression 7-day trend alerts.",
      status: "implemented",
    },
    datadog: {
      summary:
        "Watchdog automated anomaly detection and Bits AI incident investigation across correlated metrics, logs, and traces.",
      docUrl: "https://docs.datadoghq.com/watchdog/",
      docLabel: "Datadog Watchdog Docs",
    },
    newrelic: {
      summary:
        "New Relic AI generative incident assistant, automated anomaly detection, and AI/LLM workload monitoring.",
      docUrl: "https://docs.newrelic.com/docs/new-relic-ai/",
      docLabel: "New Relic AI Docs",
    },
    dynatrace: {
      summary:
        "Davis® AI engine combining causal, predictive, and generative analysis over Smartscape topology.",
      docUrl: "https://docs.dynatrace.com/docs/platform/davis-ai",
      docLabel: "Dynatrace Davis AI Docs",
    },
  },
  {
    category: "8. Distributed Tracing",
    context: "Span collection and sampling controls",
    brexal: {
      summary:
        "Ingests OTLP/HTTP trace spans (/v1/traces) and application error stack traces with automated self-healing fix diff drafts; tail-based sampling not implemented.",
      status: "partial",
    },
    datadog: {
      summary:
        "Distributed APM tracing with head-based ingestion controls; tail-based sampling supported upstream via OpenTelemetry Collector.",
      docUrl: "https://docs.datadoghq.com/tracing/",
      docLabel: "Datadog Tracing Docs",
    },
    newrelic: {
      summary:
        "Distributed tracing with Infinite Tracing (cloud-based tail sampling) and upstream OpenTelemetry tail-sampling support.",
      docUrl: "https://docs.newrelic.com/docs/distributed-tracing/concepts/introduction-distributed-tracing/",
      docLabel: "New Relic Tracing Docs",
    },
    dynatrace: {
      summary:
        "End-to-end PurePath® tracing plus head-based and tail-based sampling support via OpenTelemetry Collector.",
      docUrl: "https://docs.dynatrace.com/docs/observe/applications-and-microservices/distributed-traces",
      docLabel: "Dynatrace Tracing Docs",
    },
  },
  {
    category: "9. Deployment Options",
    context: "Hosting topology and backend infrastructure",
    brexal: {
      summary:
        "Self-hosted FastAPI + Next.js stack (SQLite or PostgreSQL) or multi-service cloud PaaS deployment (e.g., Vercel Services).",
      status: "implemented",
    },
    datadog: {
      summary:
        "Multi-region SaaS (US1, US3, US5, EU1, AP1, GovCloud) with Datadog Agents/Collectors running in customer infrastructure.",
      docUrl: "https://docs.datadoghq.com/getting_started/site/",
      docLabel: "Datadog Sites Docs",
    },
    newrelic: {
      summary:
        "Multi-region SaaS (US, EU, JP, FedRAMP); self-hosted OTel Collectors forward telemetry to regional SaaS endpoints.",
      docUrl: "https://docs.newrelic.com/docs/using-new-relic/welcome-new-relic/getting-started/our-eu-us-data-centers/",
      docLabel: "New Relic Regions Docs",
    },
    dynatrace: {
      summary:
        "Available as Dynatrace SaaS (multi-region cloud) or Dynatrace Managed (self-hosted cluster on private/on-prem infrastructure).",
      docUrl: "https://docs.dynatrace.com/docs/manage/managed-deployment",
      docLabel: "Dynatrace Managed Docs",
    },
  },
  {
    category: "10. Data Governance and Sovereignty",
    context: "Residency, privacy controls, and audit status",
    brexal: {
      summary:
        "Direct customer control of backend and PostgreSQL database residency in self-hosted setups; third-party SOC 2 Type II / HIPAA audits not independently verified.",
      status: "unverified",
    },
    datadog: {
      summary:
        "Regional SaaS data residency, PII scrubbing pipelines, and published enterprise compliance attestations depending on plan.",
      docUrl: "https://docs.datadoghq.com/data_security/",
      docLabel: "Datadog Security Docs",
    },
    newrelic: {
      summary:
        "Regional hosting (US, EU, JP), ingest obfuscation rules, and compliance options varying by subscription tier (e.g., Data Plus).",
      docUrl: "https://docs.newrelic.com/docs/security/security-privacy/data-privacy/",
      docLabel: "New Relic Privacy Docs",
    },
    dynatrace: {
      summary:
        "Regional SaaS hosting or self-hosted Managed clusters, capture/storage data masking, and enterprise compliance controls.",
      docUrl: "https://docs.dynatrace.com/docs/manage/data-privacy-and-security",
      docLabel: "Dynatrace Security Docs",
    },
  },
];

function StatusBadge({ status }: { status: CapabilityStatus }) {
  if (status === "implemented") {
    return (
      <span
        className="w-5 h-5 rounded-full bg-[#4D6B53] text-white flex items-center justify-center shrink-0 mt-0.5"
        title="Implemented in current platform"
      >
        <Check size={12} strokeWidth={2.75} />
      </span>
    );
  }
  if (status === "partial") {
    return (
      <span
        className="w-5 h-5 rounded-full bg-[#FEF3C7] text-[#D97706] border border-[#FDE68A] flex items-center justify-center shrink-0 mt-0.5"
        title="Partially supported"
      >
        <Info size={12} strokeWidth={2.5} />
      </span>
    );
  }
  return (
    <span
      className="w-5 h-5 rounded-full bg-slate-100 text-[#8C857E] border border-[#E8E2D9] flex items-center justify-center shrink-0 mt-0.5"
      title={status === "not_implemented" ? "Not currently implemented" : "Not independently verified"}
    >
      <Minus size={12} strokeWidth={2.5} />
    </span>
  );
}

export function BrexalComparisonSection() {
  const [showDetailedMatrix, setShowDetailedMatrix] = useState(false);

  return (
    <section
      id="comparison"
      className="py-14 sm:py-20 px-4 sm:px-8 lg:px-10 bg-[#FAF8F5] border-b border-[#E8E2D9] relative font-sans"
    >
      <div className="max-w-[1320px] mx-auto text-left">
        {/* Eyebrow & Messaging */}
        <div className="max-w-3xl mb-8 sm:mb-10">
          <div className="flex items-center gap-2 mb-2.5">
            <span className="w-5 h-[2px] bg-[#CC5A2B]" />
            <span className="text-[11px] sm:text-xs font-mono font-bold text-[#CC5A2B] uppercase tracking-widest">
              WHY CHOOSE BREXAL
            </span>
          </div>
          <h2 className="text-2xl sm:text-4xl md:text-[40px] font-extrabold tracking-[-0.03em] text-[#1F1E1D] leading-[1.15] mb-3">
            A simpler, all-in-one alternative to <span className="font-editorial italic font-normal text-[#CC5A2B]">legacy APM.</span>
          </h2>
          <p className="text-sm sm:text-base text-[#57534E] leading-relaxed max-w-2xl font-normal">
            Traditional APM tools are fragmented, heavy on server CPU, and unpredictably priced. BREXAL unifies live monitoring, sprint bug tracking, and AI in one lightweight workspace.
          </p>
        </div>

        {/* ── HIGH-LEVEL COMPARISON SUMMARY CARDS (SUPER CLEAN & INTUITIVE) ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 mb-8">
          {/* BREXAL CARD */}
          <div className="p-6 sm:p-7 rounded-2xl bg-[#FDFBF7] border-2 border-[#CC5A2B]/40 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <span className="font-['Sora',sans-serif] font-bold text-lg text-[#101114]">
                BREXAL
              </span>
              <span className="px-3 py-1 rounded-full bg-[#CC5A2B] text-white text-xs font-semibold">
                Modern Unified Platform
              </span>
            </div>
            <ul className="space-y-3 text-sm text-[#101114]">
              <li className="flex items-center gap-2.5">
                <Check className="text-emerald-500 shrink-0" size={16} />
                <span><strong>All-In-One:</strong> Server health + Sprint bug tracker + AI copilot</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="text-emerald-500 shrink-0" size={16} />
                <span><strong>Minimal Overhead:</strong> &lt; 0.8% CPU, zero garbage collection halts</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="text-emerald-500 shrink-0" size={16} />
                <span><strong>1-Minute Setup:</strong> Single helm or docker command, zero code changes</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="text-emerald-500 shrink-0" size={16} />
                <span><strong>Predictable Pricing:</strong> $0 to $89 flat cluster rate, zero per-GB penalties</span>
              </li>
            </ul>
          </div>

          {/* LEGACY APM CARD */}
          <div className="p-6 sm:p-7 rounded-2xl bg-[#F5F1EB] border border-[#E8E2D9] shadow-3xs">
            <div className="flex items-center justify-between mb-4">
              <span className="font-['Sora',sans-serif] font-bold text-lg text-[#1F1E1D]">
                Legacy APM (Datadog &amp; New Relic)
              </span>
              <span className="px-3 py-1 rounded-full bg-[#E8E2D9] text-[#1F1E1D] text-xs font-medium">
                Traditional Monitoring
              </span>
            </div>
            <ul className="space-y-3 text-sm text-[#57534E]">
              <li className="flex items-center gap-2.5">
                <Minus className="text-slate-400 shrink-0" size={16} />
                <span><strong>Fragmented:</strong> Monitoring only — no bug tracker, no sprint Kanban</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Minus className="text-slate-400 shrink-0" size={16} />
                <span><strong>Heavy Load:</strong> 4% to 8% CPU overhead and heavy memory footprints</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Minus className="text-slate-400 shrink-0" size={16} />
                <span><strong>Complex Setup:</strong> Requires custom SDK imports and manual code hooks</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Minus className="text-slate-400 shrink-0" size={16} />
                <span><strong>Expensive Ingestion:</strong> Unpredictable monthly bills with per-GB penalties</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Toggle Detailed Matrix Button */}
        <div className="flex justify-center mb-6">
          <button
            onClick={() => setShowDetailedMatrix(!showDetailedMatrix)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#D5CDC0] bg-white hover:bg-[#F5F1EB] text-xs font-semibold text-[#1F1E1D] transition-all cursor-pointer shadow-3xs"
          >
            <span>{showDetailedMatrix ? "Hide Detailed 10-Point Technical Matrix" : "View Detailed 10-Point Technical Matrix"}</span>
          </button>
        </div>

        {/* ── COLLAPSIBLE DETAILED TECHNICAL MATRIX ── */}
        {showDetailedMatrix && (
          <div className="animate-fadeIn space-y-6 pt-2">
            {/* ── DESKTOP & TABLET COMPARISON TABLE ── */}
            <div className="hidden md:block rounded-2xl border border-[#E8E2D9] shadow-xs overflow-hidden bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[820px]">
              <thead>
                <tr className="border-b border-[#E8E2D9] bg-[#F5F1EB]/80">
                  <th className="py-4 px-5 text-[11px] font-mono font-bold uppercase tracking-wider text-[#8C857E] w-[20%]">
                    Category
                  </th>

                  {/* Highlighted BREXAL Column */}
                  <th className="py-4 px-5 bg-[#FBF0EA]/70 border-x border-[#F3DACD] w-[22%]">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-base font-extrabold text-[#1F1E1D] tracking-tight">
                        BREXAL
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-[#4D6B53]/10 text-[#CC5A2B] border border-[#2563EB]/20 text-[10px] font-mono font-semibold">
                        Self-Hosted / Cloud
                      </span>
                    </div>
                  </th>

                  <th className="py-4 px-5 text-sm font-bold text-[#1F1E1D] w-[19%]">
                    Datadog
                  </th>
                  <th className="py-4 px-5 text-sm font-bold text-[#1F1E1D] w-[19%]">
                    New Relic
                  </th>
                  <th className="py-4 px-5 text-sm font-bold text-[#1F1E1D] w-[20%]">
                    Dynatrace
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200/75 text-[13px] leading-relaxed">
                {COMPARISON_ROWS.map((row) => (
                  <tr key={row.category} className="hover:bg-[#F5F1EB]/60 transition-colors">
                    {/* Category & Context */}
                    <td className="py-4 px-5 align-top">
                      <div className="font-bold text-[#1F1E1D]">{row.category}</div>
                      <div className="text-[11px] text-[#8C857E] mt-1 leading-snug">
                        {row.context}
                      </div>
                    </td>

                    {/* BREXAL Cell */}
                    <td className="py-4 px-5 bg-[#FBF0EA]/40 border-x border-[#F3DACD] align-top">
                      <div className="flex items-start gap-2.5">
                        <StatusBadge status={row.brexal.status} />
                        <span className="text-[#1F1E1D] font-medium leading-snug">
                          {row.brexal.summary}
                        </span>
                      </div>
                    </td>

                    {/* Datadog Cell */}
                    <td className="py-4 px-5 text-[#57534E] align-top">
                      <p className="leading-snug mb-1.5">{row.datadog.summary}</p>
                      {row.datadog.docUrl && (
                        <a
                          href={row.datadog.docUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-medium text-[#CC5A2B] hover:underline"
                        >
                          <span>{row.datadog.docLabel}</span>
                          <ExternalLink size={10} />
                        </a>
                      )}
                    </td>

                    {/* New Relic Cell */}
                    <td className="py-4 px-5 text-[#57534E] align-top">
                      <p className="leading-snug mb-1.5">{row.newrelic.summary}</p>
                      {row.newrelic.docUrl && (
                        <a
                          href={row.newrelic.docUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-medium text-[#CC5A2B] hover:underline"
                        >
                          <span>{row.newrelic.docLabel}</span>
                          <ExternalLink size={10} />
                        </a>
                      )}
                    </td>

                    {/* Dynatrace Cell */}
                    <td className="py-4 px-5 text-[#57534E] align-top">
                      <p className="leading-snug mb-1.5">{row.dynatrace.summary}</p>
                      {row.dynatrace.docUrl && (
                        <a
                          href={row.dynatrace.docUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-medium text-[#CC5A2B] hover:underline"
                        >
                          <span>{row.dynatrace.docLabel}</span>
                          <ExternalLink size={10} />
                        </a>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── MOBILE RESPONSIVE COMPARISON CARDS ── */}
        <div className="md:hidden space-y-4">
          {COMPARISON_ROWS.map((row) => (
            <div
              key={row.category}
              className="rounded-xl border border-[#E8E2D9] bg-white shadow-2xs overflow-hidden"
            >
              <div className="px-4 py-3 bg-[#F5F1EB] border-b border-[#E8E2D9]/80">
                <h3 className="text-sm font-bold text-[#1F1E1D]">{row.category}</h3>
                <p className="text-[11px] text-[#8C857E] mt-0.5">{row.context}</p>
              </div>

              {/* BREXAL Mobile Row */}
              <div className="p-4 bg-[#FBF0EA]/40 border-b border-[#F3DACD]">
                <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#CC5A2B] mb-1.5">
                  BREXAL
                </div>
                <div className="flex items-start gap-2">
                  <StatusBadge status={row.brexal.status} />
                  <p className="text-xs text-[#1F1E1D] font-medium leading-relaxed">
                    {row.brexal.summary}
                  </p>
                </div>
              </div>

              {/* Competitor Rows */}
              <div className="divide-y divide-slate-100 text-xs">
                {[
                  { name: "Datadog", entry: row.datadog },
                  { name: "New Relic", entry: row.newrelic },
                  { name: "Dynatrace", entry: row.dynatrace },
                ].map(({ name, entry }) => (
                  <div key={name} className="p-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-[#1F1E1D]">{name}</span>
                      {entry.docUrl && (
                        <a
                          href={entry.docUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-medium text-[#CC5A2B] hover:underline"
                        >
                          <span>Docs</span>
                          <ExternalLink size={10} />
                        </a>
                      )}
                    </div>
                    <p className="text-[#57534E] leading-relaxed">{entry.summary}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* ── OFFICIAL DOCUMENTATION REFERENCES & TRADEMARK NOTICE ── */}
        <div className="mt-6 pt-5 border-t border-[#E8E2D9]/80 space-y-3">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] text-[#8C857E]">
            <span className="font-mono font-semibold uppercase tracking-wider text-[#57534E]">
              Primary Documentation Sources:
            </span>
            <a
              href="https://docs.datadoghq.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[#CC5A2B] hover:underline"
            >
              Datadog Documentation <ExternalLink size={10} />
            </a>
            <a
              href="https://docs.newrelic.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[#CC5A2B] hover:underline"
            >
              New Relic Documentation <ExternalLink size={10} />
            </a>
            <a
              href="https://docs.dynatrace.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[#CC5A2B] hover:underline"
            >
              Dynatrace Documentation <ExternalLink size={10} />
            </a>
            <a
              href="https://opentelemetry.io/docs/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[#CC5A2B] hover:underline"
            >
              OpenTelemetry Documentation <ExternalLink size={10} />
            </a>
          </div>

          <p className="text-[11.5px] text-[#8C857E] leading-relaxed max-w-5xl">
            Datadog, New Relic, and Dynatrace are trademarks of their respective owners. BREXAL is an independent observability platform and is not affiliated with, endorsed by, or sponsored by these companies. Product capabilities, pricing, and deployment options may vary by subscription plan, configuration, and region. Comparisons are based on publicly available documentation and BREXAL evaluations where applicable.
          </p>
        </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default BrexalComparisonSection;
