"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Square } from "lucide-react";

type Lang = "nextjs" | "python" | "go" | "docker";

interface TerminalLine {
  text: string;
  type: "cmd" | "success" | "error" | "packet" | "info" | "muted";
}

const LANG_TABS: { id: Lang; label: string }[] = [
  { id: "nextjs", label: "Next.js" },
  { id: "python", label: "Python" },
  { id: "go", label: "Go" },
  { id: "docker", label: "Docker" },
];

const INSTALL_LINES: Record<Lang, TerminalLine[]> = {
  nextjs: [
    { text: "$ npm install @brexal/sdk", type: "cmd" },
    { text: "✓ SDK linked (0.2s)", type: "success" },
    { text: "$ npx brexal init --auto", type: "cmd" },
    { text: "→ Framework detected: Next.js 16 (App Router)", type: "info" },
    { text: "→ Telemetry ingestion: Active", type: "success" },
    { text: "→ Handshake latency: 8.4ms", type: "info" },
    { text: "✓ Ready. All runtime telemetry streaming.", type: "success" },
  ],
  python: [
    { text: "$ pip install brexal-sdk", type: "cmd" },
    { text: "✓ brexal-sdk 2.4.1 installed", type: "success" },
    { text: "$ brexal init --framework fastapi", type: "cmd" },
    { text: "→ Framework detected: FastAPI 0.111 (Uvicorn)", type: "info" },
    { text: "→ ASGI middleware hooked", type: "info" },
    { text: "→ Telemetry ingestion: Active", type: "success" },
    { text: "✓ Ready. All runtime telemetry streaming.", type: "success" },
  ],
  go: [
    { text: "$ go get github.com/brexal/sdk-go", type: "cmd" },
    { text: "✓ brexal/sdk-go v2.4.1 fetched", type: "success" },
    { text: "$ brexal init --framework gin", type: "cmd" },
    { text: "→ Framework detected: Gin v1.9 (net/http)", type: "info" },
    { text: "→ Middleware injected via gin.Use()", type: "info" },
    { text: "→ Telemetry ingestion: Active", type: "success" },
    { text: "✓ Ready. All runtime telemetry streaming.", type: "success" },
  ],
  docker: [
    { text: "$ docker pull brexal/agent:latest", type: "cmd" },
    { text: "✓ latest: Digest sha256:9c2e...4f81", type: "success" },
    { text: "$ docker run --env-file .env brexal/agent", type: "cmd" },
    { text: "→ Container: brexal-agent (healthy)", type: "info" },
    { text: "→ eBPF probe attached to PID 1", type: "info" },
    { text: "→ Telemetry ingestion: Active", type: "success" },
    { text: "✓ Ready. All runtime telemetry streaming.", type: "success" },
  ],
};

const INGESTION_LINES: TerminalLine[] = [
  { text: "$ brexal ingestion-test --live", type: "cmd" },
  { text: "→ Initiating mTLS handshake with BREXAL Edge...", type: "info" },
  { text: "→ TLS Certificate: ✓ Verified (sha256:4f81...9c2e)", type: "success" },
  { text: "→ Client Auth: ✓ Mutual", type: "success" },
  { text: "◉ Streaming telemetry packets...", type: "info" },
  { text: "[PKT-001] 14ms  SYS-event  heap_alloc=48MB  region=us-east-1", type: "packet" },
  { text: "[PKT-002]  1ms  NET-event  conn_pool=24     latency_p99=1.4ms", type: "packet" },
  { text: "[PKT-003]  8ms  ERR-event  trace_id=8f2a1b9  severity=WARN", type: "error" },
  { text: "[PKT-004]  2ms  SYS-event  heap_alloc=50MB  region=eu-central-1", type: "packet" },
  { text: "[PKT-005]  6ms  NET-event  conn_pool=18     latency_p99=1.1ms", type: "packet" },
  { text: "→ Ingestion rate: 3,840 events/sec", type: "info" },
  { text: "✓ BREXAL pipeline active. All runtime telemetry streaming.", type: "success" },
];

const LINE_COLOR: Record<TerminalLine["type"], string> = {
  cmd: "text-zinc-300",
  success: "text-emerald-400",
  error: "text-red-400",
  packet: "text-cyan-400",
  info: "text-zinc-400",
  muted: "text-zinc-600",
};

export function SdkTerminal() {
  const [lang, setLang] = useState<Lang>("nextjs");
  const [displayLines, setDisplayLines] = useState<TerminalLine[]>(INSTALL_LINES["nextjs"]);
  const [isRunning, setIsRunning] = useState(false);
  const [testComplete, setTestComplete] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Show install lines instantly when lang changes
  useEffect(() => {
    setDisplayLines(INSTALL_LINES[lang]);
    setTestComplete(false);
    setIsRunning(false);
  }, [lang]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [displayLines]);

  const runIngestionTest = () => {
    if (isRunning) return;
    setIsRunning(true);
    setTestComplete(false);

    const installLines = INSTALL_LINES[lang];
    setDisplayLines([...installLines, { text: "", type: "muted" }]);

    let idx = 0;
    const appendLine = () => {
      if (idx >= INGESTION_LINES.length) {
        setIsRunning(false);
        setTestComplete(true);
        return;
      }
      setDisplayLines((prev) => [...prev, INGESTION_LINES[idx]]);
      idx++;
      timerRef.current = setTimeout(appendLine, 320 + Math.random() * 180);
    };

    timerRef.current = setTimeout(appendLine, 300);
  };

  const stopTest = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setIsRunning(false);
    setDisplayLines((prev) => [
      ...prev,
      { text: "^C  Interrupted.", type: "error" },
    ]);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <div className="h-full flex flex-col rounded-2xl bg-black border border-white/[0.08] overflow-hidden">
      {/* Terminal Header */}
      <div className="h-10 border-b border-white/[0.06] bg-black flex items-center px-4 gap-3 shrink-0">
        {/* Traffic Lights */}
        <div className="flex gap-1.5 shrink-0">
          <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
          <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
          <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
        </div>

        {/* Language Tabs */}
        <div className="flex items-center gap-1 ml-2">
          {LANG_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setLang(tab.id)}
              className={`px-2.5 py-0.5 rounded text-[11px] font-mono transition-all duration-150 ${
                lang === tab.id
                  ? "bg-white/[0.1] text-white border border-white/[0.12]"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Status */}
        <div className="ml-auto flex items-center gap-1.5">
          {isRunning ? (
            <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Streaming
            </span>
          ) : testComplete ? (
            <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Complete
            </span>
          ) : (
            <span className="text-[10px] font-mono text-zinc-600">bash — 80x24</span>
          )}
        </div>
      </div>

      {/* Terminal Body */}
      <div
        ref={bodyRef}
        className="flex-1 p-5 font-mono text-[12.5px] leading-relaxed bg-black overflow-y-auto custom-scrollbar"
        style={{ minHeight: 0 }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={lang}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            {displayLines.map((line, i) => {
              if (!line || !line.type) return null;
              return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.15 }}
                className={`${LINE_COLOR[line.type]} ${
                  line.type === "packet" ? "pl-2 border-l border-cyan-400/20" : ""
                } ${line.type === "error" ? "pl-2 border-l border-red-400/20" : ""}`}
              >
                {line.text === "" ? (
                  <span className="select-none">&nbsp;</span>
                ) : (
                  line.text
                )}
              </motion.div>
              );
            })}
            {/* Blinking cursor */}
            {!isRunning && (
              <div className="mt-2 inline-block w-2 h-[14px] bg-white/60 animate-pulse align-middle" />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer — Run Ingestion Test */}
      <div className="border-t border-white/[0.08] bg-black px-4 py-3 flex items-center justify-between gap-3 shrink-0">
        <div className="text-[11px] font-mono text-zinc-500">
          {testComplete
            ? "→ Ingestion rate: 3,840 events/sec  •  Pipeline active"
            : "Simulate live mTLS ingestion stream →"}
        </div>
        {isRunning ? (
          <button
            onClick={stopTest}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-[12px] font-mono hover:bg-red-500/20 transition-colors"
          >
            <Square size={11} />
            Stop
          </button>
        ) : (
          <button
            onClick={runIngestionTest}
            disabled={testComplete}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-[12px] font-mono transition-colors ${
              testComplete
                ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 cursor-default"
                : "bg-white text-black hover:bg-zinc-200 font-semibold"
            }`}
          >
            <Play size={11} />
            {testComplete ? "✓ Test Passed" : "Run Ingestion Test"}
          </button>
        )}
      </div>
    </div>
  );
}

