"use client";

import React, { useState } from "react";
import { CheckCheck, Copy, Terminal, ShieldCheck, Zap, Layers } from "lucide-react";

interface IntegrationPill {
  id: string;
  name: string;
  tag: string;
  iconBg: string;
  badge: string;
}

const ROW_1: IntegrationPill[] = [
  { id: "k8s", name: "Kubernetes", tag: "Mesh Orchestration", iconBg: "bg-[#326CE5]", badge: "1-Click Helm" },
  { id: "docker", name: "Docker", tag: "Container Engine", iconBg: "bg-[#2496ED]", badge: "Host Daemon" },
  { id: "aws", name: "AWS", tag: "EKS, ECS & Lambda", iconBg: "bg-[#FF9900]", badge: "CloudFormation" },
  { id: "gcp", name: "Google Cloud", tag: "GKE & Cloud Run", iconBg: "bg-[#4285F4]", badge: "GKE Native" },
  { id: "azure", name: "Microsoft Azure", tag: "AKS & App Services", iconBg: "bg-[#0078D4]", badge: "AKS Ready" },
  { id: "terraform", name: "Terraform", tag: "Infrastructure as Code", iconBg: "bg-[#7B42BC]", badge: "Registry Provider" },
  { id: "go", name: "Go (Golang)", tag: "Runtime eBPF Uprobes", iconBg: "bg-[#00ADD8]", badge: "0% Overhead" },
  { id: "python", name: "Python", tag: "FastAPI / Django", iconBg: "bg-[#3776AB]", badge: "Auto-Instrument" },
  { id: "nodejs", name: "Node.js", tag: "Express / Nest / Next.js", iconBg: "bg-[#339933]", badge: "Zero-Code Loader" },
  { id: "java", name: "Java / JVM", tag: "Spring Boot / Quarkus", iconBg: "bg-[#ED8B00]", badge: "JVM eBPF Probe" }
];

const ROW_2: IntegrationPill[] = [
  { id: "rust", name: "Rust", tag: "Tokio / Axum Native", iconBg: "bg-[#CE412B]", badge: "Native Binary" },
  { id: "dotnet", name: ".NET Core", tag: "C# / ASP.NET Core", iconBg: "bg-[#512BD4]", badge: "CLR Socket Hooks" },
  { id: "kafka", name: "Apache Kafka", tag: "Partition & Lag Sentry", iconBg: "bg-[#231F20]", badge: "Lag Exporter" },
  { id: "redis", name: "Redis", tag: "In-Memory Cache", iconBg: "bg-[#DC382D]", badge: "Zero CPU Hit" },
  { id: "postgres", name: "PostgreSQL", tag: "Query Planner AI", iconBg: "bg-[#4169E1]", badge: "Slow Query Audit" },
  { id: "mongodb", name: "MongoDB", tag: "Document Store", iconBg: "bg-[#47A248]", badge: "Replica Health" },
  { id: "elasticsearch", name: "Elasticsearch", tag: "Search & Log Engine", iconBg: "bg-[#005571]", badge: "Cluster Health" },
  { id: "rabbitmq", name: "RabbitMQ", tag: "AMQP Message Broker", iconBg: "bg-[#FF6600]", badge: "Queue Sentry" },
  { id: "prometheus", name: "Prometheus", tag: "Metrics Engine", iconBg: "bg-[#E6522C]", badge: "PromQL Native" },
  { id: "opentelemetry", name: "OpenTelemetry", tag: "CNCF Open Standard", iconBg: "bg-[#4A154B]", badge: "Zero Lock-In" }
];

type TargetPlatform = "helm" | "docker" | "aws" | "otel";

export function BrexalIntegrationsSection() {
  const [activePlatform, setActivePlatform] = useState<TargetPlatform>("helm");
  const [copied, setCopied] = useState(false);

  const platformCommands: Record<TargetPlatform, { label: string; desc: string; command: string }> = {
    helm: {
      label: "Kubernetes (Helm)",
      desc: "Installs eBPF daemonset across all nodes. Auto-discovers Redis, Kafka, Postgres, Go, Python & all 20+ protocols in < 60s.",
      command: "helm repo add brexal https://charts.brexal.io && helm install brexal-telemetry brexal/ebpf-agent --namespace brexal --create-namespace"
    },
    docker: {
      label: "Docker Daemon",
      desc: "Attaches directly to host Linux kernel socket events. Monitors all bridge networks and container lifecycles.",
      command: "docker run -d --name brexal-probe --privileged --pid=host --net=host -v /sys/kernel/debug:/sys/kernel/debug:ro brexal/agent:latest"
    },
    aws: {
      label: "AWS / CloudFormation",
      desc: "Deploys non-intrusive eBPF collectors to EKS and ECS worker nodes with zero CloudWatch egress fees.",
      command: "aws cloudformation deploy --template-file https://install.brexal.io/aws-mesh.yml --stack-name brexal-mesh --capabilities CAPABILITY_IAM"
    },
    otel: {
      label: "OpenTelemetry (OTel)",
      desc: "Standard 100% native OTLP gRPC endpoint. Zero proprietary agent lock-in; forwards traces and metrics seamlessly.",
      command: "export OTEL_EXPORTER_OTLP_ENDPOINT=\"https://ingest.brexal.io:4317\" && export OTEL_EXPORTER_OTLP_HEADERS=\"x-brexal-token=bx_live_key\""
    }
  };

  const current = platformCommands[activePlatform];

  const handleCopy = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(current.command);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <section id="integrations" className="pt-14 sm:pt-18 md:pt-22 pb-0 bg-white border-b border-slate-200/80 font-sans relative overflow-hidden">
      
      {/* ── SECTION HEADER ── */}
      <div className="max-w-[1320px] mx-auto px-4 sm:px-10 text-left mb-8 sm:mb-10">
        <div className="flex items-center gap-2 mb-2">
          <span className="w-6 h-[1.5px] bg-[#2563EB]" />
          <span className="text-[11px] sm:text-[12px] font-mono font-bold text-[#2563EB] uppercase tracking-widest">
            ECOSYSTEM &amp; 20+ INTEGRATIONS
          </span>
        </div>
        <h2 className="text-2xl sm:text-4xl md:text-[42px] font-extrabold tracking-[-0.035em] text-[#0A2540] leading-[1.15] mb-2.5">
          Works Seamlessly With Everything You Run.
        </h2>
        <p className="text-sm sm:text-base text-[#425466] leading-relaxed max-w-2xl font-normal">
          Zero manual SDK instrumentation. Deploy BREXAL with a single command and let eBPF kernel probes instantly auto-discover and trace all your microservices, databases, and message queues.
        </p>
      </div>

      {/* ── 2 INFINITE SEAMLESS LOGO MARQUEE TRACKS (NO SCROLLBARS) ── */}
      <div className="relative w-full overflow-hidden mb-10 sm:mb-12 py-1 select-none">
        
        {/* Left & Right Gradient Fade Masks */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-r from-white via-white/80 to-transparent z-10" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-l from-white via-white/80 to-transparent z-10" />

        {/* Marquee Track 1 (Leftward Flow) */}
        <div className="flex items-center gap-3 w-max animate-marquee-left mb-3 hover:pause">
          {[...ROW_1, ...ROW_1].map((item, idx) => (
            <div
              key={`${item.id}-${idx}`}
              className="py-2 px-3.5 sm:px-4 rounded-full bg-white border border-slate-200/90 hover:border-blue-400 hover:shadow-xs shadow-[0_1px_3px_rgba(10,37,64,0.03)] flex items-center gap-2.5 shrink-0 transition-all cursor-default"
            >
              <div className={`w-5 h-5 rounded-md ${item.iconBg} text-white flex items-center justify-center font-bold text-[9px] font-mono shadow-2xs`}>
                {item.name.slice(0, 2).toUpperCase()}
              </div>
              <span className="text-xs sm:text-[13px] font-bold text-[#0A2540]">
                {item.name}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 font-medium">
                {item.badge}
              </span>
            </div>
          ))}
        </div>

        {/* Marquee Track 2 (Rightward Flow) */}
        <div className="flex items-center gap-3 w-max animate-marquee-right hover:pause">
          {[...ROW_2, ...ROW_2].map((item, idx) => (
            <div
              key={`${item.id}-${idx}`}
              className="py-2 px-3.5 sm:px-4 rounded-full bg-white border border-slate-200/90 hover:border-blue-400 hover:shadow-xs shadow-[0_1px_3px_rgba(10,37,64,0.03)] flex items-center gap-2.5 shrink-0 transition-all cursor-default"
            >
              <div className={`w-5 h-5 rounded-md ${item.iconBg} text-white flex items-center justify-center font-bold text-[9px] font-mono shadow-2xs`}>
                {item.name.slice(0, 2).toUpperCase()}
              </div>
              <span className="text-xs sm:text-[13px] font-bold text-[#0A2540]">
                {item.name}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 font-medium">
                {item.badge}
              </span>
            </div>
          ))}
        </div>

      </div>

      {/* ── FULL-WIDTH HORIZONTAL STRIPE (IMAGE 3 COLOR: #0A2944 / #0B3856) ── */}
      <div className="w-full bg-gradient-to-r from-[#0A2540] via-[#0B3856] to-[#0A2944] border-t border-[#143B5E] py-6 sm:py-7 shadow-inner">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-10">
          
          {/* Header Row on Stripe */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
            
            {/* Title & Info */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-400/30 flex items-center justify-center shrink-0">
                <Terminal size={18} />
              </div>
              <div className="text-left">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm sm:text-base font-extrabold text-white">
                    Universal 1-Step Cluster Deployment
                  </h3>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-mono font-bold">
                    Zero Code Changes
                  </span>
                </div>
                <p className="text-[11.5px] sm:text-xs text-blue-100/75 font-normal leading-tight mt-0.5">
                  {current.desc}
                </p>
              </div>
            </div>

            {/* Platform Switcher Tabs */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#06182B]/80 border border-[#163D63] shrink-0 self-stretch md:self-auto overflow-x-auto no-scrollbar">
              {(["helm", "docker", "aws", "otel"] as TargetPlatform[]).map((plat) => {
                const isActive = activePlatform === plat;
                return (
                  <button
                    key={plat}
                    onClick={() => setActivePlatform(plat)}
                    className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all whitespace-nowrap cursor-pointer ${
                      isActive
                        ? "bg-[#2563EB] text-white shadow-xs"
                        : "text-blue-200/70 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {platformCommands[plat].label}
                  </button>
                );
              })}
            </div>

          </div>

          {/* Terminal Command Bar */}
          <div className="w-full bg-[#06182B]/95 rounded-xl border border-[#163D63] px-4 py-3 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-left shadow-sm overflow-hidden">
            <div className="font-mono text-xs sm:text-[13px] text-blue-200 overflow-x-auto no-scrollbar whitespace-nowrap leading-relaxed select-all">
              <code>{current.command}</code>
            </div>

            <button
              onClick={handleCopy}
              className={`inline-flex items-center justify-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer shadow-xs ${
                copied
                  ? "bg-emerald-500 text-white"
                  : "bg-[#2563EB] hover:bg-[#1D4ED8] text-white"
              }`}
            >
              {copied ? <CheckCheck size={13} /> : <Copy size={13} />}
              <span>{copied ? "Copied Command!" : "Copy"}</span>
            </button>
          </div>

          {/* Bottom Indicators on the Stripe */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-3 text-[11px] font-mono text-blue-200/60 border-t border-[#123657] mt-3.5">
            <div className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>0.0% CPU penalty verified via eBPF kernel probes</span>
            </div>
            <span>Auto-discovers Kafka, Redis, Postgres, HTTP &amp; gRPC at socket level</span>
            <span className="hidden sm:inline">OpenTelemetry v1.32+ &amp; PromQL Native</span>
          </div>

        </div>
      </div>

      {/* ── CSS KEYFRAMES FOR INFINITE MARQUEE ── */}
      <style jsx>{`
        @keyframes marquee-left {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marquee-right {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0%); }
        }
        .animate-marquee-left {
          animation: marquee-left 40s linear infinite;
        }
        .animate-marquee-right {
          animation: marquee-right 40s linear infinite;
        }
        .animate-marquee-left:hover, .animate-marquee-right:hover {
          animation-play-state: paused;
        }
      `}</style>

    </section>
  );
}
