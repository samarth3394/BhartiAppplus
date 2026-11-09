"use client";

import React, { useState } from "react";
import { ChevronDown, HelpCircle, MessageSquare, ArrowRight } from "lucide-react";
import Link from "next/link";

interface FaqItem {
  questionMarathi: string;
  questionEnglish: string;
  category: string;
  answer: string;
  technicalBullet: string;
}

export function BrexalFaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs: FaqItem[] = [
    {
      questionMarathi: "माझ्या सर्व्हरवर CPU लोड वाढेल का?",
      questionEnglish: "Will CPU overhead increase on our production servers?",
      category: "Performance & Overhead",
      answer:
        "नाही. पारंपारिक APM टूल्स (जसे की Datadog किंवा New Relic) सर्व्हरवर 4% ते 8% CPU आणि अतिरिक्त मेमरी वाया घालवतात. BREXAL हे आधुनिक eBPF (Extended Berkeley Packet Filter) तंत्रज्ञानावर चालते, जे थेट Linux कर्नल लेव्हलवरून अत्यंत हलक्या सँडबॉक्समध्ये टेलिमेट्री गोळा करते. यामुळे CPU चा लोड 0.8% पेक्षा कमी आणि मेमरी अवघी 40MB लागते. या '0% CPU Penalty' मुळे तुमचे सर्व्हर कायम सुपरफास्ट आणि हलके राहतात.",
      technicalBullet: "Benchmark: < 0.8% CPU utilization under 120,000 req/sec on Linux kernel 5.15+."
    },
    {
      questionMarathi: "डेटा आमच्याच क्लाउड VPC मध्ये सुरक्षित राहील का?",
      questionEnglish: "Will telemetry data remain strictly inside our own cloud VPC?",
      category: "Security & Sovereignty",
      answer:
        "होय, १००% सुरक्षित. BREXAL मध्ये 'Bring Your Own Cloud' (BYOC) आणि 'Self-Hosted VPC' पर्याय उपलब्ध आहे. तुमचे सर्व ऑडिट लॉग्स, नेटवर्क ट्रेसेस आणि कस्टमर टेलिमेट्री थेट तुमच्या स्वतःच्या AWS, GCP किंवा Azure Private VPC मध्ये राहतात. कोणताही कच्चा PII (Personal Identifiable Information) किंवा संवेदनशील डेटा तुमच्या नेटवर्कच्या बाहेर जात नाही. याशिवाय सर्व डेटा AES-256 GCM ने एन्क्रिप्टेड राहतो.",
      technicalBullet: "Guarantees: SOC-2 Type II audited, HIPAA BAA compliant, and zero cross-border telemetry egress."
    },
    {
      questionMarathi: "जुने Prometheus/Grafana एजंट्स रिप्लेस करावे लागतील का?",
      questionEnglish: "Do we need to replace our existing Prometheus / Grafana agents?",
      category: "Ecosystem & Migration",
      answer:
        "मुळीच नाही. BREXAL हे १००% OpenTelemetry (OTel) आणि Prometheus Native आहे. तुमचे सध्याचे PromQL डॅशबोर्ड्स, ग्राफाना व्हिज्युअलायझेशन्स आणि ॲलर्ट रूल्स थेट BREXAL च्या हाय-स्पीड टाइम-सिरीज इंजिनला जोडले जातात. तुम्हाला कोणतीही जुनी इन्फ्रास्ट्रक्चर मोडून काढण्याची गरज नाही; पहिल्याच दिवशी 'Zero Disruption' सह BREXAL चे AI फीचर्स सुरू करता येतात.",
      technicalBullet: "Drop-in: 100% PromQL syntax compatibility + native OTLP v1.32 gRPC/HTTP endpoints."
    },
    {
      questionMarathi: "BREXAL चे AI फॉल्स ॲलर्ट्स (Alert Fatigue) कसे थांबवते?",
      questionEnglish: "How does the AI Neural Engine eliminate false alert fatigue?",
      category: "AI & Root Cause",
      answer:
        "पारंपारिक थ्रेशोल्ड ॲलर्ट्स (उदा. 'CPU > 80%') शेकडो अनावश्यक नोटिफिकेशन्स पाठवून ऑन-कॉल इंजिनिअर्सना हैराण करतात. BREXAL चे न्यूरल इंजिन मायक्रोसर्व्हिसेसची 'Dynamic Topology Causal Graph' तयार करते. इन्सिडंट घडल्यास 100 वेगवेगळे ॲलर्ट्स पाठवण्याऐवजी AI नेमके मूळ कारण (Root Cause - उदा. 'Database Connection Pool Exhaustion on Pod auth-svc-78f') शोधून फक्त १ ॲक्शनेबल Slack किंवा PagerDuty इन्सिडंट पाठवते.",
      technicalBullet: "Efficacy: 95% reduction in notification noise with sub-90-second automated root cause isolation."
    },
    {
      questionMarathi: "सेटअप करण्यासाठी किती वेळ लागतो आणि कोड बदलावा लागतो का?",
      questionEnglish: "How long does setup take and are code modifications required?",
      category: "Developer Experience",
      answer:
        "सेटअप पूर्ण होण्यासाठी फक्त ३ मिनिटे लागतात! BREXAL च्या eBPF ऑटो-इन्स्ट्रुमेंटेशनमुळे कोणत्याही सोर्स कोडमध्ये बदल (No SDK imports, no bytecode manipulation) करण्याची गरज नाही. तुमच्या कुबरनेटीस क्लस्टरमध्ये फक्त १ साधा 'helm install' चालवल्यास सर्व पॉड्स, नेटवर्क कॉल्स, एरर्स आणि ट्रेसेस त्वरित आपोआप डिटेक्ट होतात.",
      technicalBullet: "Installation: Single Helm command or Docker daemonset with immediate zero-code trace discovery."
    },
    {
      questionMarathi: "Datadog किंवा New Relic मधून मायग्रेट कसे करावे?",
      questionEnglish: "How seamless is migrating away from Datadog or New Relic?",
      category: "Switching & Billing",
      answer:
        "तुम्ही BREXAL तुमच्या विद्यमान Datadog किंवा New Relic सोबत समांतर (Side-by-Side) चालवून चाचणी घेऊ शकता. दोन्हीचा परफॉर्मन्स आणि 10x कमी खर्चाची खात्री पटल्यानंतर तुम्ही जुने महागडे एजंट्स कधीही बंद करू शकता. आमच्याकडे 1-क्लिक OTel डेटा इनजेशन आणि स्वयंचलित डॅशबोर्ड इम्पोर्टर उपलब्ध आहे.",
      technicalBullet: "Flexibility: Parallel side-by-side trial with automated Grafana and PromQL dashboard imports."
    }
  ];

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-16 sm:py-20 md:py-26 px-4 sm:px-10 bg-white border-b border-slate-200/80 relative overflow-hidden font-sans">
      
      <div className="max-w-[1100px] mx-auto text-left relative z-10">
        
        {/* Eyebrow & Headline */}
        <div className="max-w-3xl mb-10 sm:mb-14">
          <div className="flex items-center gap-2 mb-2.5">
            <span className="w-6 h-[1.5px] bg-[#2563EB]" />
            <span className="text-[11px] sm:text-[12px] font-mono font-bold text-[#2563EB] uppercase tracking-widest">
              FREQUENTLY ASKED QUESTIONS
            </span>
          </div>
          <h2 className="text-2xl sm:text-4xl md:text-[44px] font-extrabold tracking-[-0.035em] text-[#0A2540] leading-[1.15] mb-3">
            Everything You Need to Know Before Switching.
          </h2>
          <p className="text-sm sm:text-base text-[#425466] leading-relaxed max-w-2xl font-normal">
            Direct, transparent technical answers for enterprise CTOs, engineering leads, and platform teams evaluating BREXAL.
          </p>
        </div>

        {/* ── INTERACTIVE FAQ ACCORDION LIST ── */}
        <div className="space-y-3.5 sm:space-y-4 mb-12 sm:mb-16">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? "border-[#2563EB] bg-[#F8FAFF] shadow-sm ring-1 ring-blue-500/20"
                    : "border-slate-200/90 bg-white hover:border-slate-300"
                }`}
              >
                {/* Accordion Header (Click to Toggle) */}
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full p-5 sm:p-6 text-left flex items-start sm:items-center justify-between gap-4 cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <div className="flex flex-col gap-1 pr-2">
                    <span className="text-[11px] font-mono font-bold text-[#2563EB] uppercase tracking-wider">
                      {faq.category}
                    </span>
                    <h3 className="text-base sm:text-lg font-extrabold text-[#0A2540] leading-snug">
                      {faq.questionMarathi}
                    </h3>
                    <div className="text-xs sm:text-[13px] text-slate-500 font-medium font-sans">
                      {faq.questionEnglish}
                    </div>
                  </div>

                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${
                      isOpen
                        ? "bg-[#2563EB] text-white rotate-180"
                        : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                    }`}
                  >
                    <ChevronDown size={17} />
                  </div>
                </button>

                {/* Accordion Body */}
                {isOpen && (
                  <div className="px-5 sm:px-6 pb-5 sm:pb-6 pt-1 border-t border-blue-100/80 text-left animate-fadeIn">
                    <p className="text-sm sm:text-[14.5px] text-[#425466] leading-relaxed mb-3.5 font-normal">
                      {faq.answer}
                    </p>
                    <div className="p-3 rounded-xl bg-white border border-blue-200/70 text-xs font-mono text-[#1D4ED8] flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB]" />
                      <span>{faq.technicalBullet}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ── STILL HAVE QUESTIONS BANNER ── */}
        <div className="p-6 sm:p-8 rounded-2xl sm:rounded-3xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 text-left">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-[#0A2540] text-white flex items-center justify-center shrink-0">
              <MessageSquare size={20} />
            </div>
            <div>
              <h4 className="text-base font-extrabold text-[#0A2540]">
                Have a specialized cluster architecture question?
              </h4>
              <p className="text-xs sm:text-sm text-[#425466]">
                Chat directly with a Senior Solutions Architect on our team.
              </p>
            </div>
          </div>

          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0A2540] hover:bg-[#2563EB] text-white text-xs sm:text-sm font-bold transition-all shadow-xs shrink-0 cursor-pointer"
          >
            <span>Book a Technical Architecture Review</span>
            <ArrowRight size={14} />
          </Link>
        </div>

      </div>
    </section>
  );
}
