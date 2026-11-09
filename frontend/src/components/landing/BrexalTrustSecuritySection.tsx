"use client";

import React from "react";
import { ShieldCheck, Lock, Globe, Server, CheckCircle2, FileText, ArrowRight } from "lucide-react";
import Link from "next/link";

export function BrexalTrustSecuritySection() {
  const certifications = [
    {
      badge: "SOC-2 Type II",
      title: "SOC-2 Type II Certified",
      subtitle: "AICPA Independent Audit",
      desc: "Audited annually across all Trust Services Criteria: Security, Availability, and Confidentiality. Verified controls for production access and zero-trust perimeter.",
      icon: ShieldCheck,
      color: "text-blue-600",
      bg: "bg-blue-50 border-blue-200"
    },
    {
      badge: "ISO/IEC 27001",
      title: "ISO 27001 Certified",
      subtitle: "Information Security ISMS",
      desc: "Internationally standardized Information Security Management System covering continuous code scanning, secret isolation, vulnerability disclosure, and infrastructure hardening.",
      icon: Lock,
      color: "text-emerald-600",
      bg: "bg-emerald-50 border-emerald-200"
    },
    {
      badge: "HIPAA Ready",
      title: "HIPAA & HITECH Compliant",
      subtitle: "Healthcare BAA Available",
      desc: "Formal Business Associate Agreements (BAAs) signed for healthcare and life-sciences teams. Automatic ePHI identification and kernel-level masking before packet transmission.",
      icon: ShieldCheck,
      color: "text-indigo-600",
      bg: "bg-indigo-50 border-indigo-200"
    },
    {
      badge: "GDPR & CCPA",
      title: "GDPR & CCPA Verified",
      subtitle: "EU Sovereign Residency",
      desc: "Strict compliance with EU and California privacy frameworks. Guaranteed EU/US data residency options with dedicated localized time-series storage nodes.",
      icon: Globe,
      color: "text-amber-600",
      bg: "bg-amber-50 border-amber-200"
    },
    {
      badge: "AES-256 & TLS 1.3",
      title: "End-to-End Encryption",
      subtitle: "CMEK / Vault Key Support",
      desc: "AES-256 GCM encryption at rest with automated key rotation. Mutual TLS 1.3 (mTLS) with pinned client certificates for all telemetry in flight.",
      icon: Lock,
      color: "text-sky-600",
      bg: "bg-sky-50 border-sky-200"
    },
    {
      badge: "Zero-PII Redaction",
      title: "Kernel-Level Sanitization",
      subtitle: "eBPF In-Memory Masking",
      desc: "Authentication tokens, Authorization headers, credit cards, and social security formats are scrubbed in Linux kernel memory before any payload touches disk.",
      icon: Server,
      color: "text-purple-600",
      bg: "bg-purple-50 border-purple-200"
    }
  ];

  return (
    <section id="security" className="py-16 sm:py-20 md:py-26 px-4 sm:px-10 bg-[#FAFCFF] border-b border-slate-200/80 relative overflow-hidden font-sans">
      
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[550px] bg-gradient-to-r from-blue-100/30 via-slate-100/40 to-emerald-50/30 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-[1320px] mx-auto text-left relative z-10">
        
        {/* Eyebrow & Headline */}
        <div className="max-w-3xl mb-10 sm:mb-14">
          <div className="flex items-center gap-2 mb-2.5">
            <span className="w-6 h-[1.5px] bg-[#2563EB]" />
            <span className="text-[11px] sm:text-[12px] font-mono font-bold text-[#2563EB] uppercase tracking-widest">
              ENTERPRISE TRUST &amp; COMPLIANCE
            </span>
          </div>
          <h2 className="text-2xl sm:text-4xl md:text-[44px] font-extrabold tracking-[-0.035em] text-[#0A2540] leading-[1.15] mb-3">
            Zero-Trust Security. Bank-Grade Compliance.
          </h2>
          <p className="text-sm sm:text-base text-[#425466] leading-relaxed max-w-2xl font-normal">
            Designed for regulated financial institutions, healthcare providers, and high-throughput enterprise systems. Your operational telemetry stays governed by your cryptographic boundaries.
          </p>
        </div>

        {/* 6 Certification Badges & Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 mb-10 sm:mb-12">
          {certifications.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-6 sm:p-7 rounded-2xl sm:rounded-3xl bg-white border border-slate-200/90 shadow-[0_2px_12px_rgba(10,37,64,0.03)] hover:shadow-md hover:border-slate-300 transition-all text-left flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-11 h-11 rounded-xl ${item.bg} border ${item.color} flex items-center justify-center`}>
                      <Icon size={22} />
                    </div>
                    <span className="px-3 py-1 rounded-full bg-slate-100 text-[#0A2540] text-[11px] font-mono font-extrabold tracking-wide">
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-extrabold text-[#0A2540] mb-0.5 leading-snug">
                    {item.title}
                  </h3>
                  <div className="text-xs font-mono font-bold text-[#2563EB] mb-2.5">
                    {item.subtitle}
                  </div>
                  <p className="text-xs sm:text-[13px] text-[#425466] leading-relaxed font-normal">
                    {item.desc}
                  </p>
                </div>

                <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                  <CheckCircle2 size={14} />
                  <span>Verified &amp; Certified Active</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── SECURITY REPORT CTA BANNER ── */}
        <div className="rounded-2xl sm:rounded-3xl bg-[#0A2540] p-6 sm:p-8 text-white flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 shadow-xl">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/20 text-blue-400 border border-blue-400/30 flex items-center justify-center shrink-0 mt-0.5">
              <FileText size={24} />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-extrabold text-white mb-1">
                Need our SOC-2 Type II Report or Security Whitepaper?
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                Our InfoSec team provides full audit packages, penetration testing summaries, and architecture diagrams under standard NDA within 1 business day.
              </p>
            </div>
          </div>

          <Link
            href="/login"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs sm:text-sm transition-all shadow-md shrink-0 whitespace-nowrap cursor-pointer"
          >
            <span>Request Security Audit Kit</span>
            <ArrowRight size={14} />
          </Link>
        </div>

      </div>
    </section>
  );
}

