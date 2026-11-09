"use client";

import React, { useState } from "react";
import {
  Check,
  Copy,
  Terminal,
  Cpu,
  Layers,
  ShieldCheck,
  Zap
} from "lucide-react";

interface IntegrationItem {
  id: string;
  name: string;
  category: string;
  badge: string;
  logo: string;
  command: string;
  tagline: string;
  details: string;
  metrics: {
    primary: string;
    primaryLabel: string;
    secondary: string;
    secondaryLabel: string;
    latency: string;
  };
}

const INTEGRATIONS_ROW_1: IntegrationItem[] = [
  {
    id: "kubernetes",
    name: "Kubernetes",
    category: "Container Orchestration",
    badge: "1-Click Helm",
    logo: "/logos/kubernetes.svg",
    command: "helm repo add brexal https://charts.brexal.io\nhelm install brexal-agent brexal/ebpf-telemetry --namespace brexal --create-namespace",
    tagline: "Automatic pod socket discovery, network flow tracing, and memory leak analysis across all nodes.",
    details: "Deploys as an ultra-lightweight DaemonSet with host-pid privileges. Requires zero sidecars and zero pod restarts.",
    metrics: {
      primary: "DaemonSet",
      primaryLabel: "Deployment Mode",
      secondary: "0 Pod Restarts",
      secondaryLabel: "Cluster Impact",
      latency: "0.12ms"
    }
  },
  {
    id: "docker",
    name: "Docker",
    category: "Container Engine",
    badge: "Host Daemon",
    logo: "/logos/docker.svg",
    command: "docker run -d --name brexal-probe --privileged --pid=host --net=host -v /sys/kernel/debug:/sys/kernel/debug:ro brexal/agent:latest",
    tagline: "Direct host-level socket interception covering every container without modifying docker-compose or Dockerfiles.",
    details: "Attaches to host networking namespace and container cgroups to capture ingress, egress, and container lifecycle events.",
    metrics: {
      primary: "1 Container",
      primaryLabel: "Per Node",
      secondary: "All cgroups",
      secondaryLabel: "Coverage",
      latency: "0.08ms"
    }
  },
  {
    id: "aws",
    name: "AWS",
    category: "Amazon Web Services",
    badge: "CloudFormation",
    logo: "/logos/aws.svg",
    command: "aws cloudformation deploy --template-file https://brexal.io/aws/ebpf-stack.yml --stack-name brexal-telemetry --capabilities CAPABILITY_IAM",
    tagline: "VPC Flow Logs, EKS telemetry, ECS task profiling, and API Gateway latency without CloudWatch egress costs.",
    details: "Bypasses costly AWS CloudWatch custom metrics by streaming raw OTel metrics directly to your private Brexal collector.",
    metrics: {
      primary: "EKS & ECS",
      primaryLabel: "Supported Runtimes",
      secondary: "$0 Egress",
      secondaryLabel: "VPC Peering",
      latency: "Line-Rate"
    }
  },
  {
    id: "gcp",
    name: "Google Cloud",
    category: "Google Cloud Platform",
    badge: "GKE Native",
    logo: "/logos/gcp.svg",
    command: "gcloud container clusters get-credentials prod-cluster --region us-central1\nkubectl apply -f https://install.brexal.io/gcp-daemonset.yaml",
    tagline: "Instant GKE Autopilot and Cloud Run observability with zero proxy overhead and native Google VPC peering.",
    details: "Pre-configured for Google Kubernetes Engine (GKE) Autopilot and Standard modes with zero code modifications.",
    metrics: {
      primary: "GKE Autopilot",
      primaryLabel: "Cluster Mesh",
      secondary: "Native",
      secondaryLabel: "Cloud Run",
      latency: "0.19ms"
    }
  },
  {
    id: "azure",
    name: "Microsoft Azure",
    category: "Azure Cloud",
    badge: "AKS Ready",
    logo: "/logos/azure.svg",
    command: "az aks get-credentials --resource-group prod-rg --name prod-aks\nhelm install brexal-probe brexal/azure-aks -n brexal --create-namespace",
    tagline: "End-to-end tracing for AKS clusters, Azure App Services, and Event Hub throughput.",
    details: "Collects high-frequency socket metrics across Azure Virtual Networks with zero Azure Monitor ingest penalty.",
    metrics: {
      primary: "AKS Cluster",
      primaryLabel: "Pod Telemetry",
      secondary: "Event Hub",
      secondaryLabel: "Stream Latency",
      latency: "0.22ms"
    }
  },
  {
    id: "terraform",
    name: "Terraform",
    category: "Infrastructure as Code",
    badge: "Registry Provider",
    logo: "/logos/terraform.svg",
    command: "provider \"brexal\" { api_key = var.brexal_key }\nresource \"brexal_cluster_agent\" \"prod\" { cluster_name = \"us-prod-1\" }",
    tagline: "Automate entire fleet telemetry deployment across multi-cloud environments via official HashiCorp provider.",
    details: "Integrates seamlessly into CI/CD pipelines to automatically configure alert thresholds and telemetry endpoints.",
    metrics: {
      primary: "HashiCorp",
      primaryLabel: "Official Partner",
      secondary: "100% IaC",
      secondaryLabel: "Automation",
      latency: "< 5s Apply"
    }
  },
  {
    id: "postgresql",
    name: "PostgreSQL",
    category: "Relational DB",
    badge: "Query Planner AI",
    logo: "/logos/postgresql.svg",
    command: "# Zero extensions or pg_stat_statements required\n# Automatically hooked via eBPF kernel network socket probes",
    tagline: "Live slow-query detection, wait-lock contention, and connection pool starvation without database extensions.",
    details: "eBPF listens to libpq protocol packets on port 5432 directly at the kernel socket layer, decoding SQL queries in real-time.",
    metrics: {
      primary: "0 Locks",
      primaryLabel: "Wait Lock Free",
      secondary: "Port 5432",
      secondaryLabel: "Socket Intercept",
      latency: "0.84ms"
    }
  },
  {
    id: "redis",
    name: "Redis",
    category: "In-Memory Cache",
    badge: "Zero CPU Overhead",
    logo: "/logos/redis.svg",
    command: "# Zero redis.conf changes needed\n# Brexal eBPF attaches directly to Redis TCP socket port 6379",
    tagline: "Track command latencies (HGET, SET, MGET), key eviction rates, and pipeline delays with zero CPU overhead.",
    details: "Parses RESP protocol packets directly on the wire with zero CPU contention on single-threaded Redis processes.",
    metrics: {
      primary: "RESP Wire",
      primaryLabel: "Protocol Sniffer",
      secondary: "0ms Delay",
      secondaryLabel: "Redis Main Thread",
      latency: "0.02ms"
    }
  }
];

const INTEGRATIONS_ROW_2: IntegrationItem[] = [
  {
    id: "go",
    name: "Go (Golang)",
    category: "Systems Runtime",
    badge: "0% Overhead",
    logo: "/logos/go.svg",
    command: "# Compile your Go binary normally with zero dependencies\n./my-go-service  # Brexal eBPF uprobes auto-discover runtime goroutines",
    tagline: "Attaches to compiled ELF symbols via eBPF uprobes. No imports, no code edits, and zero binary overhead.",
    details: "Instruments Go routines, GC pauses, and net/http handlers without linking any CGO or third-party Go libraries.",
    metrics: {
      primary: "4,120",
      primaryLabel: "Live Goroutines",
      secondary: "0 Deadlocks",
      secondaryLabel: "Thread Safety",
      latency: "0.05ms"
    }
  },
  {
    id: "python",
    name: "Python",
    category: "FastAPI / Django / Flask",
    badge: "Auto-Instrument",
    logo: "/logos/python.svg",
    command: "pip install opentelemetry-distro\nopentelemetry-instrument python main.py",
    tagline: "Automated distributed tracing across FastAPI, Django, Flask, SQLAlchemy, Celery, and async event loops.",
    details: "Auto-wraps incoming WSGI/ASGI requests and downstream HTTP calls with full OpenTelemetry v1.32 span context.",
    metrics: {
      primary: "ASGI / WSGI",
      primaryLabel: "Auto Wrapped",
      secondary: "1-Command",
      secondaryLabel: "No Code Changes",
      latency: "0.45ms"
    }
  },
  {
    id: "nodejs",
    name: "Node.js",
    category: "Express / Nest / Next.js",
    badge: "Zero-Code Loader",
    logo: "/logos/nodejs.svg",
    command: "NODE_OPTIONS=\"--require @brexal/auto-probe\" node server.js",
    tagline: "Continuous event loop delay monitoring, async microtask profiling, and unhandled promise tracking.",
    details: "Instruments V8 engine handles directly before your application starts, reporting event loop lag and heap stats.",
    metrics: {
      primary: "V8 Engine",
      primaryLabel: "Event Loop Lag",
      secondary: "< 1.2ms",
      secondaryLabel: "Task Delay",
      latency: "0.22ms"
    }
  },
  {
    id: "java",
    name: "Java / JVM",
    category: "Spring Boot / Quarkus",
    badge: "JVM eBPF Probe",
    logo: "/logos/java.svg",
    command: "java -javaagent:/opt/brexal/brexal-agent.jar -jar application.jar",
    tagline: "JVM Garbage Collection pause profiling, thread contention, and Spring Web / Hibernate query tracing.",
    details: "Bytecode enhancement for Java 11, 17, and 21 with zero configuration changes to pom.xml or build.gradle.",
    metrics: {
      primary: "G1 / ZGC",
      primaryLabel: "GC Profiler",
      secondary: "Zero Edits",
      secondaryLabel: "pom.xml",
      latency: "0.31ms"
    }
  },
  {
    id: "rust",
    name: "Rust",
    category: "Tokio / Axum / Actix",
    badge: "Native Binary",
    logo: "/logos/rust.svg",
    command: "# Zero Rust dependencies or Cargo.toml crates needed\n./target/release/my-rust-app  # Brexal eBPF maps syscalls at line-rate",
    tagline: "Zero-cost abstractions with socket-level async Tokio runtime polling metrics and epoll flow analysis.",
    details: "Tracks async task yields, future executor delays, and raw TCP throughput without slowing memory-safe binaries.",
    metrics: {
      primary: "Tokio Tasks",
      primaryLabel: "Async Runtime",
      secondary: "0 Cargo Deps",
      secondaryLabel: "Cargo.toml",
      latency: "0.03ms"
    }
  },
  {
    id: "dotnet",
    name: ".NET Core",
    category: "C# / ASP.NET Core",
    badge: "CLR Socket Hooks",
    logo: "/logos/dotnet.svg",
    command: "export CORECLR_ENABLE_PROFILING=1\ndotnet run -c Release",
    tagline: "ASP.NET Core controller latency, Entity Framework Core queries, and CLR GC generation monitoring.",
    details: "Hooks directly into the .NET CLR profiling API to trace incoming Kestrel HTTP requests and background workers.",
    metrics: {
      primary: "CLR Gen 0/1/2",
      primaryLabel: "GC Allocation",
      secondary: "Kestrel",
      secondaryLabel: "HTTP Tracing",
      latency: "0.26ms"
    }
  },
  {
    id: "kafka",
    name: "Apache Kafka",
    category: "Event Streaming",
    badge: "Lag Exporter",
    logo: "/logos/kafka.svg",
    command: "# eBPF probes inspect Kafka broker port 9092\n# Zero JMX plugins or Kafka connect dependencies required",
    tagline: "Real-time consumer group lag calculation, partition skew analysis, and broker fetch latencies.",
    details: "Inspects raw Kafka binary protocol packets on port 9092 to identify slow consumer partitions instantly.",
    metrics: {
      primary: "Port 9092",
      primaryLabel: "Wire Protocol",
      secondary: "0 Lag Alert",
      secondaryLabel: "Consumer State",
      latency: "0.41ms"
    }
  },
  {
    id: "opentelemetry",
    name: "OpenTelemetry",
    category: "CNCF Standard",
    badge: "Zero Vendor Lock-In",
    logo: "/logos/opentelemetry.svg",
    command: "export OTEL_EXPORTER_OTLP_ENDPOINT=\"https://otlp.brexal.io:4317\"\n# Drop-in compatible with standard OTel collectors",
    tagline: "100% native CNCF OTel v1.32 protocol support. Ingest, query, and forward traces, metrics, and logs freely.",
    details: "Eliminates proprietary vendor lock-in. Compatible with PromQL, Grafana, Jaeger, and standard OTLP gRPC/HTTP.",
    metrics: {
      primary: "OTLP v1.32",
      primaryLabel: "gRPC & HTTP",
      secondary: "PromQL",
      secondaryLabel: "Query Engine",
      latency: "Sub-ms"
    }
  }
];

export function BrexalIntegrationsSection() {
  const [activeItem, setActiveItem] = useState<IntegrationItem>(INTEGRATIONS_ROW_1[0]);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(activeItem.command);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <section className="py-20 sm:py-28 bg-[#F8FAFC] border-y border-slate-200/80 relative overflow-hidden text-center">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-blue-50/70 via-indigo-50/20 to-transparent pointer-events-none" />

      {/* ── TOP SECTION CONTAINER: HEADER + 2 ROWS OF PILLS ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-[11px] font-mono font-bold text-[#2563EB] uppercase tracking-wider mb-4 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] animate-pulse" />
            ENTERPRISE ECOSYSTEM &amp; ZERO-CODE INSTRUMENTATION
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0A2540] tracking-tight leading-tight">
            20+ Enterprise Integrations. <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2563EB] via-indigo-600 to-[#0A2540]">
              Zero Code Changes.
            </span>
          </h2>
          <p className="mt-4 text-sm sm:text-base text-[#425466] max-w-2xl mx-auto leading-relaxed">
            Attach to running processes in seconds via verified eBPF probes. Native support for every major cloud, container runtime, database, and backend framework.
          </p>
        </div>

        {/* 2 LINES OF HORIZONTALLY SCROLLABLE INTEGRATION PILLS */}
        <div className="space-y-3.5 mb-2">
          
          {/* Row 1: Cloud & Infrastructure */}
          <div className="flex items-center gap-3 overflow-x-auto pb-2 scroll-smooth no-scrollbar px-1 justify-start md:justify-center">
            {INTEGRATIONS_ROW_1.map((item) => {
              const isSelected = activeItem.id === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveItem(item)}
                  type="button"
                  className={`group inline-flex items-center gap-2.5 px-3.5 py-2 rounded-full border text-xs font-semibold whitespace-nowrap transition-all duration-200 shrink-0 cursor-pointer shadow-xs ${
                    isSelected
                      ? "bg-white border-[#2563EB] ring-2 ring-blue-500/30 text-[#0A2540] shadow-md scale-[1.03]"
                      : "bg-white/95 border-slate-200/90 text-slate-700 hover:border-slate-300 hover:bg-white hover:text-[#0A2540]"
                  }`}
                >
                  {/* Official SVG Logo */}
                  <div className="w-5 h-5 rounded-md bg-slate-50 border border-slate-200/70 p-0.5 flex items-center justify-center shrink-0">
                    <img
                      src={item.logo}
                      alt={item.name}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  <span className="font-bold text-[#0A2540]">{item.name}</span>

                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-medium ${
                    isSelected
                      ? "bg-blue-100/80 text-[#2563EB]"
                      : "bg-slate-100 text-slate-500 group-hover:bg-slate-200/70"
                  }`}>
                    {item.badge}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Row 2: Runtimes & Frameworks */}
          <div className="flex items-center gap-3 overflow-x-auto pb-2 scroll-smooth no-scrollbar px-1 justify-start md:justify-center">
            {INTEGRATIONS_ROW_2.map((item) => {
              const isSelected = activeItem.id === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveItem(item)}
                  type="button"
                  className={`group inline-flex items-center gap-2.5 px-3.5 py-2 rounded-full border text-xs font-semibold whitespace-nowrap transition-all duration-200 shrink-0 cursor-pointer shadow-xs ${
                    isSelected
                      ? "bg-white border-[#2563EB] ring-2 ring-blue-500/30 text-[#0A2540] shadow-md scale-[1.03]"
                      : "bg-white/95 border-slate-200/90 text-slate-700 hover:border-slate-300 hover:bg-white hover:text-[#0A2540]"
                  }`}
                >
                  {/* Official SVG Logo */}
                  <div className="w-5 h-5 rounded-md bg-slate-50 border border-slate-200/70 p-0.5 flex items-center justify-center shrink-0">
                    <img
                      src={item.logo}
                      alt={item.name}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  <span className="font-bold text-[#0A2540]">{item.name}</span>

                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-medium ${
                    isSelected
                      ? "bg-blue-100/80 text-[#2563EB]"
                      : "bg-slate-100 text-slate-500 group-hover:bg-slate-200/70"
                  }`}>
                    {item.badge}
                  </span>
                </button>
              );
            })}
          </div>

        </div>

      </div>

      {/* ── FULL SCREEN EDGE-TO-EDGE WHITE STRIPE (TOUCHES LEFT & RIGHT SCREEN EDGES ON MOBILE & LAPTOP) ── */}
      <div className="w-full bg-white border-y border-slate-200/90 py-6 sm:py-8 shadow-xs my-8 sm:my-10 text-left">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Top Bar inside Stripe: Service Meta & Highlights */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-5 border-b border-slate-100">
            
            {/* Left: Active Service Logo, Name & Badge */}
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-200 p-2 flex items-center justify-center shrink-0 shadow-2xs">
                <img
                  src={activeItem.logo}
                  alt={activeItem.name}
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <div className="flex items-center gap-2.5">
                  <h3 className="text-lg sm:text-xl font-extrabold text-[#0A2540]">
                    {activeItem.name}
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-[#2563EB] border border-blue-200/80 text-[10.5px] font-mono font-bold">
                    {activeItem.badge}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs font-mono text-emerald-600 font-bold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    eBPF Kernel Socket Verified
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="text-xs text-slate-500 font-mono">
                    {activeItem.category}
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Metrics Badges */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3 w-full lg:w-auto shrink-0">
              <div className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200/80 text-center min-w-[95px]">
                <div className="text-xs sm:text-sm font-black text-[#0A2540] font-mono">
                  {activeItem.metrics.primary}
                </div>
                <div className="text-[9.5px] text-slate-500 font-mono mt-0.5">
                  {activeItem.metrics.primaryLabel}
                </div>
              </div>

              <div className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200/80 text-center min-w-[95px]">
                <div className="text-xs sm:text-sm font-black text-[#0A2540] font-mono">
                  {activeItem.metrics.secondary}
                </div>
                <div className="text-[9.5px] text-slate-500 font-mono mt-0.5">
                  {activeItem.metrics.secondaryLabel}
                </div>
              </div>

              <div className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200/80 text-center min-w-[95px]">
                <div className="text-xs sm:text-sm font-black text-emerald-600 font-mono">
                  {activeItem.metrics.latency}
                </div>
                <div className="text-[9.5px] text-slate-500 font-mono mt-0.5">
                  Avg Overhead
                </div>
              </div>
            </div>

          </div>

          {/* Middle: Code Snippet Bar with Copy Button */}
          <div className="mt-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono text-[#0A2540] font-bold flex items-center gap-2">
                <Terminal size={14} className="text-[#2563EB]" />
                <span>Zero-Code 1-Command Installation:</span>
              </span>
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-mono font-bold transition-all duration-150 shadow-xs cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check size={13} className="text-emerald-200" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy size={13} />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-slate-200 font-mono text-xs sm:text-[13px] text-[#0A2540] overflow-x-auto whitespace-pre-wrap leading-relaxed shadow-inner">
              {activeItem.command}
            </div>
          </div>

          {/* Bottom Row inside Stripe */}
          <div className="mt-4 pt-3.5 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-mono text-emerald-600 font-bold">
                0.0% CPU penalty verified via eBPF probes
              </span>
            </div>
            <div className="text-slate-400 font-mono text-[11px]">
              Protocol: OpenTelemetry v1.32+ &amp; PromQL Native
            </div>
          </div>

        </div>
      </div>

      {/* ── BOTTOM CONTAINER: 4 ENTERPRISE STAT PILLARS ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 pt-2 text-left">
          
          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
            <div className="text-xl sm:text-2xl font-black text-[#0A2540] font-mono mb-0.5">
              &lt; 0.8% CPU
            </div>
            <div className="text-xs font-bold text-[#2563EB] mb-1 font-mono">
              Zero Bytecode Penalty
            </div>
            <p className="text-[11.5px] text-[#425466] leading-relaxed">
              eBPF probes run in a verified kernel sandbox without slowing application code.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
            <div className="text-xl sm:text-2xl font-black text-[#0A2540] font-mono mb-0.5">
              20+ Protocols
            </div>
            <div className="text-xs font-bold text-[#2563EB] mb-1 font-mono">
              Socket-Level Parsing
            </div>
            <p className="text-[11.5px] text-[#425466] leading-relaxed">
              HTTP/2, gRPC, Kafka, Redis, SQL, TLS &amp; DNS parsed at line-rate.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
            <div className="text-xl sm:text-2xl font-black text-[#0A2540] font-mono mb-0.5">
              0 Code Edits
            </div>
            <div className="text-xs font-bold text-[#2563EB] mb-1 font-mono">
              Zero Manual SDKs
            </div>
            <p className="text-[11.5px] text-[#425466] leading-relaxed">
              Never recompile binaries or add heavy dependencies to your repositories.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
            <div className="text-xl sm:text-2xl font-black text-[#0A2540] font-mono mb-0.5">
              100% OTel Native
            </div>
            <div className="text-xs font-bold text-[#2563EB] mb-1 font-mono">
              Zero Lock-In
            </div>
            <p className="text-[11.5px] text-[#425466] leading-relaxed">
              Full CNCF OpenTelemetry v1.32 &amp; PromQL query compatibility out of the box.
            </p>
          </div>

        </div>
      </div>

    </section>
  );
}

export default BrexalIntegrationsSection;
