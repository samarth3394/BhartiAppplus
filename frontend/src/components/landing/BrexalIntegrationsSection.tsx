"use client";

import React, { useState } from "react";
import { CheckCheck, Copy, ChevronRight } from "lucide-react";

export type IntegrationCategory = "All" | "Cloud & Infra" | "Runtimes" | "Databases & Queues" | "Observability";

export interface IntegrationItem {
  id: string;
  name: string;
  category: "Cloud & Infra" | "Runtimes" | "Databases & Queues" | "Observability";
  tag: string;
  iconBg: string;
  badge: string;
  snippetLang: string;
  command: string;
  description: string;
}

export const INTEGRATIONS_DATA: IntegrationItem[] = [
  {
    id: "kubernetes",
    name: "Kubernetes",
    category: "Cloud & Infra",
    tag: "Container Orchestration",
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
    category: "Cloud & Infra",
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
    category: "Cloud & Infra",
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
    name: "Google Cloud (GCP)",
    category: "Cloud & Infra",
    tag: "Google Cloud Platform",
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
    category: "Cloud & Infra",
    tag: "Azure Cloud",
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
    category: "Cloud & Infra",
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
    category: "Runtimes",
    tag: "Systems Language",
    iconBg: "bg-cyan-600",
    badge: "Zero SDK Overhead",
    snippetLang: "bash",
    command: `# No code modification required! eBPF attaches directly to Go runtime symbols.
brexal-cli profile attach --pid $(pgrep my-go-binary) --goroutines`,
    description: "Live goroutine deadlock detection, GC stop-the-world latency, and HTTP route timings without code imports."
  },
  {
    id: "python",
    name: "Python",
    category: "Runtimes",
    tag: "FastAPI / Django / Flask",
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
    category: "Runtimes",
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
    category: "Runtimes",
    tag: "Spring Boot / Quarkus",
    iconBg: "bg-orange-600",
    badge: "JVM eBPF Probe",
    snippetLang: "bash",
    command: `# Zero bytecode rewrite required. eBPF monitors JVM socket calls & thread states.
brexal-cli jvm watch --pid $(jps -q -m | grep spring) --heap-profile`,
    description: "Track JVM thread pool contention, heap allocation spikes, and JNI boundary latency without agents."
  },
  {
    id: "rust",
    name: "Rust",
    category: "Runtimes",
    tag: "Tokio / Axum / Actix",
    iconBg: "bg-stone-800",
    badge: "Native Binary",
    snippetLang: "bash",
    command: `# Zero-overhead native eBPF tracing attaches to compiled ELF symbols.
brexal-cli trace attach --bin ./target/release/my-microservice`,
    description: "Track async task scheduling, channel backpressure, and TCP connection pooling at microsecond scale."
  },
  {
    id: "dotnet",
    name: ".NET Core",
    category: "Runtimes",
    tag: "C# / ASP.NET Core",
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
    category: "Databases & Queues",
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
    category: "Databases & Queues",
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
    category: "Databases & Queues",
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
    category: "Databases & Queues",
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
    category: "Databases & Queues",
    tag: "Search & Analytics",
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
    category: "Databases & Queues",
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
    category: "Observability",
    tag: "Metrics Engine",
    iconBg: "bg-amber-700",
    badge: "100% PromQL Native",
    snippetLang: "yaml",
    command: `# Add to your existing prometheus.yml scrape_configs:
- job_name: 'brexal-otel-metrics'
  scrape_interval: 5s
  static_configs:
    - targets: ['localhost:9464']`,
    description: "Drop-in replacement for node_exporter. Keep all your existing Grafana dashboards and PromQL queries intact."
  },
  {
    id: "opentelemetry",
    name: "OpenTelemetry",
    category: "Observability",
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
  const [selectedCategory, setSelectedCategory] = useState<IntegrationCategory>("All");
  const [activeIntegration, setActiveIntegration] = useState<IntegrationItem>(INTEGRATIONS_DATA[0]);
  const [copied, setCopied] = useState(false);

  const categories: IntegrationCategory[] = [
    "All",
    "Cloud & Infra",
    "Runtimes",
    "Databases & Queues",
    "Observability"
  ];

  const filtered = selectedCategory === "All"
    ? INTEGRATIONS_DATA
    : INTEGRATIONS_DATA.filter((item) => item.category === selectedCategory);

  const handleCopy = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(activeIntegration.command);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <section id="integrations" className="py-14 sm:py-20 md:py-24 px-4 sm:px-10 bg-[#FAFCFF] border-b border-slate-200/80 relative overflow-hidden font-sans">
      
      {/* Background radial highlight */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[550px] bg-gradient-to-r from-blue-100/35 via-indigo-50/25 to-sky-100/30 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-[1320px] mx-auto text-left relative z-10">
        
        {/* Eyebrow & Headline */}
        <div className="max-w-3xl mb-8 sm:mb-12">
          <div className="flex items-center gap-2 mb-2.5">
            <span className="w-6 h-[1.5px] bg-[#2563EB]" />
            <span className="text-[11px] sm:text-[12px] font-mono font-bold text-[#2563EB] uppercase tracking-widest">
              ECOSYSTEM &amp; 20+ PLUGINS
            </span>
          </div>
          <h2 className="text-2xl sm:text-4xl md:text-[44px] font-extrabold tracking-[-0.035em] text-[#0A2540] leading-[1.15] mb-3">
            Connects With Everything You Already Run.
          </h2>
          <p className="text-sm sm:text-base text-[#425466] leading-relaxed max-w-2xl font-normal">
            Zero vendor lock-in. Instrument your Kubernetes clusters, serverless workloads, databases, and microservice runtimes with 1-line installation. Click any integration below to see instant setup commands.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 sm:mb-8 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? "bg-[#0A2540] text-white shadow-sm"
                  : "bg-white text-[#425466] border border-slate-200/80 hover:border-slate-300 hover:text-[#0A2540]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 20+ Integrations Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-3.5 mb-8 sm:mb-10">
          {filtered.map((item) => {
            const isSelected = activeIntegration.id === item.id;
            return (
              <div
                key={item.id}
                onClick={() => setActiveIntegration(item)}
                className={`p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-white border cursor-pointer transition-all duration-200 text-left relative flex flex-col justify-between ${
                  isSelected
                    ? "border-[#2563EB] ring-2 ring-blue-500/20 shadow-md bg-blue-50/20 -translate-y-0.5"
                    : "border-slate-200/80 hover:border-slate-300 hover:shadow-xs shadow-[0_1px_4px_rgba(10,37,64,0.02)]"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <div className={`w-8 h-8 rounded-lg ${item.iconBg} text-white flex items-center justify-center font-black text-xs font-mono shadow-2xs`}>
                      {item.name.slice(0, 2).toUpperCase()}
                    </div>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                      {item.badge}
                    </span>
                  </div>
                  <h3 className="text-sm font-extrabold text-[#0A2540] leading-snug">
                    {item.name}
                  </h3>
                  <p className="text-[11px] text-[#425466] font-medium leading-tight mt-0.5">
                    {item.tag}
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold">
                  <span className={isSelected ? "text-[#2563EB]" : "text-slate-400"}>
                    {isSelected ? "Active View" : "View Code"}
                  </span>
                  <ChevronRight size={13} className={isSelected ? "text-[#2563EB] translate-x-0.5" : "text-slate-400"} />
                </div>
              </div>
            );
          })}
        </div>

        {/* ── INTERACTIVE 2-LINE QUICK INSTALL DRAWER ── */}
        <div className="rounded-2xl sm:rounded-3xl bg-[#030712] border border-[#1C2E4A] p-5 sm:p-7 text-left shadow-xl relative overflow-hidden">
          
          {/* Subtle neon top line */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-400" />

          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-4 border-b border-[#1C2E4A] mb-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl ${activeIntegration.iconBg} text-white flex items-center justify-center font-black font-mono shadow-xs`}>
                {activeIntegration.name.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-base sm:text-lg font-black text-white">
                    {activeIntegration.name} Quick Installation
                  </h4>
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-900/60 text-blue-300 border border-blue-700/50 text-[10.5px] font-mono font-bold">
                    {activeIntegration.badge}
                  </span>
                </div>
                <p className="text-xs sm:text-[13px] text-slate-400 font-normal mt-0.5">
                  {activeIntegration.description}
                </p>
              </div>
            </div>

            <button
              onClick={handleCopy}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                copied
                  ? "bg-emerald-500 text-white shadow-md"
                  : "bg-[#1C2E4A] hover:bg-[#273F63] text-white border border-slate-700 hover:border-slate-500"
              }`}
            >
              {copied ? <CheckCheck size={14} /> : <Copy size={14} />}
              <span>{copied ? "Copied Command!" : "Copy Code"}</span>
            </button>
          </div>

          {/* Terminal Code Display */}
          <div className="relative rounded-xl bg-[#090D1A] p-3.5 sm:p-4 border border-[#17253D] font-mono text-xs sm:text-sm text-slate-200 overflow-x-auto">
            <pre className="whitespace-pre-wrap leading-relaxed text-blue-200">
              <code>{activeIntegration.command}</code>
            </pre>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-3.5 text-xs text-slate-400 font-mono">
            <div className="flex items-center gap-2 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Zero-code overhead verified via eBPF probes</span>
            </div>
            <span>Protocol: OpenTelemetry v1.32+ Compatible</span>
          </div>

        </div>

      </div>
    </section>
  );
}
