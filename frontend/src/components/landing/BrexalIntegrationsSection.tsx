"use client";

import React, { useState } from "react";
import { CheckCheck, Copy, Terminal, CheckCircle2 } from "lucide-react";

export interface IntegrationItem {
  id: string;
  name: string;
  tag: string;
  iconBg: string;
  badge: string;
  snippetLang: string;
  command: string;
  description: string;
}

export const ROW_1_INTEGRATIONS: IntegrationItem[] = [
  {
    id: "kubernetes",
    name: "Kubernetes",
    tag: "Container Mesh",
    iconBg: "bg-blue-600",
    badge: "1-Click Helm",
    snippetLang: "bash",
    command: `helm repo add brexal https://charts.brexal.io
helm install brexal-agent brexal/ebpf-telemetry --namespace brexal --create-namespace`,
    description: "Automatic pod socket discovery, network flow tracing, and memory leak analysis across all nodes."
  },
  {
    id: "docker",
    name: "Docker",
    tag: "Container Engine",
    iconBg: "bg-sky-500",
    badge: "Host Daemon",
    snippetLang: "bash",
    command: `docker run -d --name brexal-probe --privileged --pid=host --net=host \\
  -v /sys/kernel/debug:/sys/kernel/debug:ro brexal/agent:latest`,
    description: "Kernel-level container lifecycle tracking, cgroup resource monitoring, and bridge network latency."
  },
  {
    id: "aws",
    name: "AWS",
    tag: "Amazon Web Services",
    iconBg: "bg-amber-500",
    badge: "CloudFormation",
    snippetLang: "bash",
    command: `aws cloudformation deploy --template-file brexal-aws-agent.yml \\
  --stack-name brexal-observability-mesh --capabilities CAPABILITY_IAM`,
    description: "EKS, ECS, Lambda serverless traces, and VPC flow logs without CloudWatch egress markups."
  },
  {
    id: "gcp",
    name: "Google Cloud",
    tag: "GCP & GKE",
    iconBg: "bg-red-500",
    badge: "GKE Native",
    snippetLang: "bash",
    command: `gcloud container clusters get-credentials prod-cluster --region us-central1
kubectl apply -f https://install.brexal.io/gcp-daemonset.yaml`,
    description: "Zero-configuration GKE and Cloud Run telemetry with Google Cloud VPC peering support."
  },
  {
    id: "azure",
    name: "Microsoft Azure",
    tag: "AKS & App Services",
    iconBg: "bg-blue-500",
    badge: "AKS Ready",
    snippetLang: "bash",
    command: `az aks get-credentials --resource-group prod-rg --name prod-aks
helm install brexal-aks brexal/ebpf-telemetry --set provider=azure`,
    description: "End-to-end tracing for AKS clusters, Azure App Services, and Event Hub throughput."
  },
  {
    id: "terraform",
    name: "Terraform",
    tag: "Infrastructure as Code",
    iconBg: "bg-purple-600",
    badge: "Registry Provider",
    snippetLang: "hcl",
    command: `terraform { required_providers { brexal = { source = "brexal/brexal", version = "~> 2.4" } } }
resource "brexal_cluster_mesh" "prod" { cluster_name = "k8s-prod-us" auto_trace = true }`,
    description: "Declarative cluster instrumentation, automated alert policy provisioning, and CI/CD pipelines."
  },
  {
    id: "go",
    name: "Go (Golang)",
    tag: "Runtime Binary",
    iconBg: "bg-cyan-600",
    badge: "0% Overhead",
    snippetLang: "bash",
    command: `# No code modification required! eBPF attaches directly to Go runtime symbols:
brexal-cli profile attach --pid $(pgrep my-go-binary) --goroutines`,
    description: "Live goroutine deadlock detection, GC stop-the-world latency, and HTTP route timings without code imports."
  },
  {
    id: "python",
    name: "Python",
    tag: "FastAPI / Django",
    iconBg: "bg-amber-600",
    badge: "Auto-Instrument",
    snippetLang: "bash",
    command: `pip install brexal-telemetry
python -m brexal.instrument --service-name api-gateway python main.py`,
    description: "Automatic ASGI/WSGI request tracing, async event loop lag, and slow database query inspection."
  },
  {
    id: "nodejs",
    name: "Node.js",
    tag: "Express / Nest / Next.js",
    iconBg: "bg-emerald-600",
    badge: "Zero-Code Loader",
    snippetLang: "bash",
    command: `npm install --save @brexal/node-telemetry
NODE_OPTIONS="--require @brexal/node-telemetry/register" node server.js`,
    description: "V8 event loop starvation metrics, active handle tracking, and distributed microservice spans."
  },
  {
    id: "java",
    name: "Java / JVM",
    tag: "Spring Boot / Quarkus",
    iconBg: "bg-orange-600",
    badge: "JVM eBPF Probe",
    snippetLang: "bash",
    command: `# Zero bytecode rewrite required. eBPF monitors JVM socket calls & thread states:
brexal-cli jvm watch --pid $(jps -q -m | grep spring) --heap-profile`,
    description: "Track JVM thread pool contention, heap allocation spikes, and JNI boundary latency without agents."
  }
];

export const ROW_2_INTEGRATIONS: IntegrationItem[] = [
  {
    id: "rust",
    name: "Rust",
    tag: "Tokio / Axum",
    iconBg: "bg-stone-800",
    badge: "Native Binary",
    snippetLang: "bash",
    command: `# Zero-overhead native eBPF tracing attaches to compiled ELF symbols:
brexal-cli trace attach --bin ./target/release/my-microservice`,
    description: "Track async task scheduling, channel backpressure, and TCP connection pooling at microsecond scale."
  },
  {
    id: "dotnet",
    name: ".NET Core",
    tag: "C# / ASP.NET",
    iconBg: "bg-violet-600",
    badge: "CLR Socket Hooks",
    snippetLang: "bash",
    command: `dotnet add package Brexal.Telemetry.AspNetCore
export BREXAL_ENABLE_AUTO_TRACE="true" && dotnet run`,
    description: "ASP.NET Core request pipeline tracing, Kestrel connection metrics, and CLR GC pause diagnostics."
  },
  {
    id: "kafka",
    name: "Apache Kafka",
    tag: "Event Streaming",
    iconBg: "bg-slate-900",
    badge: "Lag Exporter",
    snippetLang: "bash",
    command: `helm install brexal-kafka brexal/kafka-monitor \\
  --set kafka.bootstrapServers="kafka-cluster:9092" --set autoMitigateLag=true`,
    description: "Monitor consumer group partition lag, broker produce/fetch latencies, and leader rebalance events."
  },
  {
    id: "redis",
    name: "Redis",
    tag: "In-Memory Cache",
    iconBg: "bg-rose-600",
    badge: "Zero CPU Overhead",
    snippetLang: "bash",
    command: `brexal-cli redis attach --host redis-master.production:6379 \\
  --collect-keyspace-hitrate --slowlog-threshold-ms 5`,
    description: "Real-time cache hit/miss ratio, key eviction spikes, replication lag, and slow command audit."
  },
  {
    id: "postgres",
    name: "PostgreSQL",
    tag: "Relational DB",
    iconBg: "bg-sky-700",
    badge: "Query Planner AI",
    snippetLang: "sql",
    command: `-- No heavy extensions needed! eBPF sniffs client socket queries safely:
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;
-- BREXAL AI maps slow queries to application endpoints automatically.`,
    description: "Analyze slow query execution plans, wait lock contention, and connection pool starvation."
  },
  {
    id: "mongodb",
    name: "MongoDB",
    tag: "Document Store",
    iconBg: "bg-emerald-700",
    badge: "Replica Health",
    snippetLang: "bash",
    command: `brexal-cli mongo attach --uri "mongodb+srv://cluster.mongodb.net" \\
  --detect-unindexed-queries --cluster-topology`,
    description: "Unindexed collection scans, primary/secondary replication lag, and opcode operation timing."
  },
  {
    id: "elasticsearch",
    name: "Elasticsearch",
    tag: "Search & Log Engine",
    iconBg: "bg-yellow-600",
    badge: "Cluster Health",
    snippetLang: "bash",
    command: `brexal-cli es monitor --endpoint "https://es-cluster.internal:9200" \\
  --watch-unassigned-shards --jvm-pressure`,
    description: "Cluster yellow/red health alerts, JVM old gen garbage collection pressure, and index write throttle."
  },
  {
    id: "rabbitmq",
    name: "RabbitMQ",
    tag: "AMQP Message Broker",
    iconBg: "bg-orange-500",
    badge: "Queue Sentry",
    snippetLang: "bash",
    command: `brexal-cli rabbitmq watch --api "http://guest:guest@rabbitmq:15672/api" \\
  --channel-backpressure --unacked-alert-threshold 500`,
    description: "Track queue message depth, unacknowledged consumer counts, channel block events, and throughput."
  },
  {
    id: "prometheus",
    name: "Prometheus",
    tag: "Metrics Engine",
    iconBg: "bg-amber-700",
    badge: "PromQL Native",
    snippetLang: "yaml",
    command: `# Add to your existing prometheus.yml scrape_configs:
- job_name: 'brexal-otel-metrics'
  scrape_interval: 5s
  static_configs: [{ targets: ['localhost:9464'] }]`,
    description: "Drop-in replacement for node_exporter. Keep all your existing Grafana dashboards and PromQL queries intact."
  },
  {
    id: "opentelemetry",
    name: "OpenTelemetry",
    tag: "CNCF Open Standard",
    iconBg: "bg-indigo-600",
    badge: "Zero Lock-In",
    snippetLang: "bash",
    command: `export OTEL_EXPORTER_OTLP_ENDPOINT="https://ingest.brexal.io:4317"
export OTEL_EXPORTER_OTLP_HEADERS="x-brexal-token=bx_live_9f82a17b"
# 100% native OTLP gRPC & HTTP protocol support.`,
    description: "Send traces, metrics, and logs using standard OTLP protocols. Never worry about proprietary agent traps."
  }
];

export function BrexalIntegrationsSection() {
  const [activeIntegration, setActiveIntegration] = useState<IntegrationItem>(ROW_1_INTEGRATIONS[0]);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(activeIntegration.command);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <section id="integrations" className="pt-14 sm:pt-18 md:pt-20 pb-0 bg-white border-b border-slate-200/80 font-sans relative overflow-hidden">
      
      {/* ── HEADER ── */}
      <div className="max-w-[1320px] mx-auto px-4 sm:px-10 text-left mb-6 sm:mb-8">
        <div className="flex items-center gap-2 mb-2">
          <span className="w-6 h-[1.5px] bg-[#2563EB]" />
          <span className="text-[11px] sm:text-[12px] font-mono font-bold text-[#2563EB] uppercase tracking-widest">
            ECOSYSTEM &amp; 20+ INTEGRATIONS
          </span>
        </div>
        <h2 className="text-2xl sm:text-4xl md:text-[40px] font-extrabold tracking-[-0.035em] text-[#0A2540] leading-[1.15] mb-2.5">
          Connects With Everything You Already Run.
        </h2>
        <p className="text-sm sm:text-base text-[#425466] leading-relaxed max-w-2xl font-normal">
          Zero vendor lock-in. 1-line instant instrumentation across your entire cloud infrastructure, databases, and microservices. Click any technology to see its quick setup.
        </p>
      </div>

      {/* ── 2 HORIZONTALLY SCROLLING LINES (ADVA SCROLL) ── */}
      <div className="max-w-[1320px] mx-auto px-4 sm:px-10 mb-8 sm:mb-10 space-y-2.5 sm:space-y-3">
        
        {/* ROW 1 (10 Items) */}
        <div className="flex items-center gap-2.5 sm:gap-3 overflow-x-auto no-scrollbar scroll-smooth pb-1 pt-0.5">
          {ROW_1_INTEGRATIONS.map((item) => {
            const isSelected = activeIntegration.id === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveIntegration(item)}
                className={`group py-2 px-3 sm:px-3.5 rounded-full border transition-all duration-150 flex items-center gap-2.5 shrink-0 cursor-pointer text-left whitespace-nowrap ${
                  isSelected
                    ? "bg-[#EFF6FF] border-[#2563EB] ring-2 ring-blue-500/20 shadow-xs"
                    : "bg-white border-slate-200/90 hover:border-slate-300 hover:bg-slate-50/80 shadow-[0_1px_3px_rgba(10,37,64,0.03)]"
                }`}
              >
                <div className={`w-5 h-5 rounded-md ${item.iconBg} text-white flex items-center justify-center font-bold text-[9px] font-mono shrink-0`}>
                  {item.name.slice(0, 2).toUpperCase()}
                </div>
                <span className={`text-xs sm:text-[13px] font-bold ${isSelected ? "text-[#1D4ED8]" : "text-[#0A2540] group-hover:text-[#2563EB]"}`}>
                  {item.name}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 font-medium">
                  {item.badge}
                </span>
              </button>
            );
          })}
        </div>

        {/* ROW 2 (10 Items) */}
        <div className="flex items-center gap-2.5 sm:gap-3 overflow-x-auto no-scrollbar scroll-smooth pb-1 pt-0.5">
          {ROW_2_INTEGRATIONS.map((item) => {
            const isSelected = activeIntegration.id === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveIntegration(item)}
                className={`group py-2 px-3 sm:px-3.5 rounded-full border transition-all duration-150 flex items-center gap-2.5 shrink-0 cursor-pointer text-left whitespace-nowrap ${
                  isSelected
                    ? "bg-[#EFF6FF] border-[#2563EB] ring-2 ring-blue-500/20 shadow-xs"
                    : "bg-white border-slate-200/90 hover:border-slate-300 hover:bg-slate-50/80 shadow-[0_1px_3px_rgba(10,37,64,0.03)]"
                }`}
              >
                <div className={`w-5 h-5 rounded-md ${item.iconBg} text-white flex items-center justify-center font-bold text-[9px] font-mono shrink-0`}>
                  {item.name.slice(0, 2).toUpperCase()}
                </div>
                <span className={`text-xs sm:text-[13px] font-bold ${isSelected ? "text-[#1D4ED8]" : "text-[#0A2540] group-hover:text-[#2563EB]"}`}>
                  {item.name}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 font-medium">
                  {item.badge}
                </span>
              </button>
            );
          })}
        </div>

      </div>

      {/* ── FULL-WIDTH HORIZONTAL STRIPE (IMAGE 3 COLOR: #0A2944 / #0B3856) ── */}
      <div className="w-full bg-gradient-to-r from-[#0A2540] via-[#0B3856] to-[#0A2944] border-t border-[#143B5E] py-5 sm:py-6 shadow-inner">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-10">
          
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
            
            {/* Left: Active Tech Info */}
            <div className="flex items-center gap-3 shrink-0">
              <div className={`w-9 h-9 rounded-xl ${activeIntegration.iconBg} text-white flex items-center justify-center font-black font-mono shadow-xs`}>
                {activeIntegration.name.slice(0, 2).toUpperCase()}
              </div>
              <div className="text-left">
                <div className="flex items-center gap-2">
                  <span className="text-sm sm:text-base font-extrabold text-white">
                    {activeIntegration.name}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-[10px] font-mono font-bold">
                    {activeIntegration.badge}
                  </span>
                </div>
                <p className="text-[11.5px] sm:text-xs text-blue-100/70 font-normal leading-tight max-w-xs sm:max-w-md">
                  {activeIntegration.description}
                </p>
              </div>
            </div>

            {/* Middle: 2-Line Monospace Terminal Strip */}
            <div className="flex-1 min-w-0 bg-[#06182B]/95 rounded-xl border border-[#163D63] px-3.5 sm:px-4 py-2.5 flex items-center justify-between gap-3 overflow-x-auto text-left shadow-xs">
              <div className="font-mono text-xs text-blue-200 whitespace-pre-wrap leading-relaxed select-all">
                <code>{activeIntegration.command}</code>
              </div>

              {/* Copy Button */}
              <button
                onClick={handleCopy}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer shadow-xs ${
                  copied
                    ? "bg-emerald-500 text-white"
                    : "bg-[#2563EB] hover:bg-[#1D4ED8] text-white"
                }`}
              >
                {copied ? <CheckCheck size={13} /> : <Copy size={13} />}
                <span>{copied ? "Copied!" : "Copy"}</span>
              </button>
            </div>

          </div>

          {/* Bottom Indicators on the Stripe */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-3 text-[11px] font-mono text-blue-200/60 border-t border-[#123657] mt-3">
            <div className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>0.0% CPU penalty verified via eBPF probes</span>
            </div>
            <span>OpenTelemetry v1.32+ &amp; PromQL Native</span>
          </div>

        </div>
      </div>

    </section>
  );
}
