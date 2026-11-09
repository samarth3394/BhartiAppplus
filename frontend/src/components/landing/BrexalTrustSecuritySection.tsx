"use client";

import React from "react";
import { CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";

export function BrexalTrustSecuritySection() {
  const certifications = [
    {
      badge: "SOC-2 Type II",
      title: "SOC-2 Type II Certified",
      subtitle: "AICPA Independent Audit",
      desc: "Audited annually across all Trust Services Criteria: Security, Availability, and Confidentiality. Verified controls for production access and zero-trust perimeter.",
      logo: "/badges/soc2.svg"
    },
    {
      badge: "ISO/IEC 27001",
      title: "ISO 27001 Certified",
      subtitle: "Information Security ISMS",
      desc: "Internationally standardized Information Security Management System covering continuous code scanning, secret isolation, vulnerability disclosure, and infrastructure hardening.",
      logo: "/badges/iso27001.svg"
    },
    {
      badge: "HIPAA Ready",
      title: "HIPAA & HITECH Compliant",
      subtitle: "Healthcare BAA Available",
      desc: "Formal Business Associate Agreements (BAAs) signed for healthcare and life-sciences teams. Automatic ePHI identification and kernel-level masking before packet transmission.",
      logo: "/badges/hipaa.svg"
    },
    {
      badge: "GDPR & CCPA",
      title: "GDPR & CCPA Verified",
      subtitle: "EU Sovereign Residency",
      desc: "Strict compliance with EU and California privacy frameworks. Guaranteed EU/US data residency options with dedicated localized time-series storage nodes.",
      logo: "/badges/gdpr.svg"
    },
    {
      badge: "AES-256 & TLS 1.3",
      title: "End-to-End Encryption",
      subtitle: "CMEK / Vault Key Support",
      desc: "AES-256 GCM encryption at rest with automated key rotation. Mutual TLS 1.3 (mTLS) with pinned client certificates for all telemetry in flight.",
      logo: "/badges/aes256.svg"
    },
    {
      badge: "Zero-PII Redaction",
      title: "Kernel-Level Sanitization",
      subtitle: "eBPF In-Memory Masking",
      desc: "Authentication tokens, Authorization headers, credit cards, and social security formats are scrubbed in Linux kernel memory before any payload touches disk.",
      logo: "/badges/zeropii.svg"
    }
  ];

  return (
    <section id="security" className="py-16 sm:py-20 md:py-26 bg-[#FAFCFF] border-b border-slate-200/80 relative overflow-hidden font-sans">
      
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[550px] bg-gradient-to-r from-blue-100/30 via-slate-100/40 to-emerald-50/30 rounded-full blur-[140px] pointer-events-none" />

      {/* Main Container: Header & 6 Certification Cards */}
      <div className="max-w-[1320px] mx-auto px-4 sm:px-10 text-left relative z-10">
        
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

        {/* 6 Certification Badges & Cards with 100% OFFICIAL BRAND BADGE LOGOS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 mb-2">
          {certifications.map((item, idx) => {
            return (
              <div
                key={idx}
                className="p-6 sm:p-7 rounded-2xl sm:rounded-3xl bg-white border border-slate-200/90 shadow-[0_2px_12px_rgba(10,37,64,0.03)] hover:shadow-md hover:border-slate-300 transition-all text-left flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    {/* Official Seal / Badge Logo */}
                    <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200/90 p-1 flex items-center justify-center shadow-xs">
                      <img
                        src={item.logo}
                        alt={item.title}
                        className="w-full h-full object-contain"
                      />
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

      </div>

      {/* ── FULL SCREEN EDGE-TO-EDGE ORIGINAL DARK NAVY SECURITY REPORT CTA STRIPE ── */}
      <div className="w-full bg-[#0A2540] border-y border-[#1E3A8A]/50 py-7 sm:py-9 text-white shadow-md text-left mt-8 sm:mt-10">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            {/* Official Report Binder Badge */}
            <div className="w-13 h-13 rounded-2xl bg-white/10 border border-white/20 p-1.5 flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
              <img
                src="/badges/soc2-report.svg"
                alt="SOC-2 Audit Package"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="text-white">
              <h3
                style={{ color: "#FFFFFF" }}
                className="text-lg sm:text-xl font-extrabold !text-white mb-1"
              >
                Need our SOC-2 Type II Report or Security Whitepaper?
              </h3>
              <p
                style={{ color: "#CBD5E1" }}
                className="text-xs sm:text-sm !text-slate-300 max-w-2xl leading-relaxed"
              >
                Our InfoSec team provides full audit packages, penetration testing summaries, and architecture diagrams under standard NDA within 1 business day.
              </p>
            </div>
          </div>

          <Link
            href="/login"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] !text-white font-bold text-xs sm:text-sm transition-all shadow-md shrink-0 whitespace-nowrap cursor-pointer"
          >
            <span style={{ color: "#FFFFFF" }}>Request Security Audit Kit</span>
            <ArrowRight size={14} className="text-white" />
          </Link>
        </div>
      </div>

    </section>
  );
}

export default BrexalTrustSecuritySection;
