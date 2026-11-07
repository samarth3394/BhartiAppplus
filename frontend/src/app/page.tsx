"use client";

import Link from "next/link";
import { 
  ArrowRight, Command, Zap, Layers, Lock, GitBranch, Terminal, User,
  LayoutDashboard, MessageSquare, Users, KanbanSquare, Bug, Map, 
  Activity, Server, Wrench, Settings, ChevronDown, ChevronRight, Plus, Check, MousePointer2
} from "lucide-react";
import { motion, AnimatePresence, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { Logo } from "@/components/Logo";

/* ──────────────────────────── DATA ──────────────────────────── */

const faqs = [
  {
    q: "How does the AI prediction work?",
    a: "BREXAL uses historical log data and anomaly detection models to identify patterns that typically precede system failures, alerting you before an outage occurs."
  },
  {
    q: "Can I self-host BREXAL?",
    a: "Currently, BREXAL is a fully managed cloud solution. We provide dedicated VPC peering and single-tenant architecture for Enterprise customers who require strict data compliance."
  },
  {
    q: "Do you have a free tier?",
    a: "Yes, our Starter plan is completely free forever. It includes 3 team members, 2 apps, and basic uptime monitoring with no credit card required."
  },
  {
    q: "How fast is the integration?",
    a: "You can integrate BREXAL in under two minutes. Our SDK automatically detects your framework (Next.js, Python, Go) and instruments the necessary telemetry without manual configuration."
  }
];

const reviewsData = [
  {
    quote: "BREXAL has completely transformed how we monitor our infrastructure. The zero-configuration setup and the sub-millisecond overhead mean we get enterprise-grade observability without sacrificing any performance. The AI Copilot caught three critical memory leaks before they even reached production.",
    name: "Ganesh Vanave",
    title: "Founder of Next Career Steps & Data Engineer in Germany",
    initials: "GV",
    gradient: "from-indigo-500 to-purple-600",
    image: "/founders/ganesh-dada.png"
  },
  {
    quote: "As a founder, I need to know my application is stable 24/7. BREXAL gives us that peace of mind. The automated root cause analysis is like having an extra senior engineer on the team who never sleeps. It's an absolute game-changer for modern startups.",
    name: "Dhanaji Choudhar",
    title: "Founder of Polivate Technologies",
    initials: "DC",
    gradient: "from-emerald-500 to-teal-600",
    image: "/founders/dhanaji-choudhar.jpeg"
  },
  {
    quote: "We migrated from Datadog to BREXAL, and the difference is night and day. The interface is breathtakingly fast, and the telemetry streaming is flawless. The way it ties issues directly to commits using AI has cut our debugging time in half.",
    name: "Pururaj Varpe",
    title: "Founder and CTO, Xpersify",
    initials: "PV",
    gradient: "from-blue-500 to-cyan-600",
    image: "/founders/puru-varpe.jpeg"
  },
  {
    quote: "From a financial and operational perspective, BREXAL is incredibly cost-effective. We get end-to-end encryption, predictive AI failure warnings, and a gorgeous dashboard that the whole team actually loves using. It's the best investment we've made in our tech stack.",
    name: "Kunal Tambe",
    title: "Founder and CFO of Xpersify",
    initials: "KT",
    gradient: "from-orange-500 to-red-600",
    image: "/founders/kunal-tambe.jpeg"
  },
  {
    quote: "We built BREXAL at Bharti Nexus Technologies to solve our own observability nightmares. Now, it's the very foundation that keeps our entire ecosystem running flawlessly. We designed it for engineers who refuse to compromise on speed and precision.",
    name: "Samarth Choudhar",
    title: "Founder and CTO of Bharti Nexus Technologies",
    initials: "SC",
    gradient: "from-purple-500 to-indigo-600",
    image: "/founders/samarth-choudhar.png"
  }
];

const trustedBy = [
  "Next Career Steps", "Polivate Technologies", "Xpersify", "Bharti Nexus"
];

/* ──────────────────────────── ANIMATIONS ──────────────────────────── */

const sectionReveal = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] }
  }
};

const stagger = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 }
  }
};

const itemReveal = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] }
  }
};

/* ──────────────────────────── REVIEWS SECTION ──────────────────────────── */

function ReviewsSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={sectionReveal}
      className="w-full px-6 md:px-12 lg:px-24 mt-36 relative z-10"
      id="reviews"
    >
      <div className="flex flex-col border-y border-white/[0.08]">
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full py-8 md:py-12 flex flex-col md:flex-row items-start md:items-center justify-between text-left group focus:outline-none"
        >
          <div>
            <div className="text-[11px] font-mono uppercase tracking-wider text-zinc-500 mb-2">Executive Perspectives</div>
            <h2 className="text-2xl md:text-4xl font-medium tracking-tight mb-2 text-white group-hover:text-zinc-200 transition-colors">Trusted by engineering leaders worldwide.</h2>
            <p className="text-zinc-400 text-sm md:text-base max-w-2xl font-normal">Real-world production feedback from CTOs and engineering directors running mission-critical workloads.</p>
          </div>
          <div className="mt-6 md:mt-0 ml-0 md:ml-8 flex items-center justify-center w-10 h-10 rounded-full border border-white/[0.1] group-hover:bg-white/[0.05] transition-all flex-shrink-0">
            <motion.div animate={{ rotate: isExpanded ? 45 : 0 }} transition={{ duration: 0.2 }}>
              <Plus size={18} className={isExpanded ? "text-white" : "text-zinc-400"} />
            </motion.div>
          </div>
        </button>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >
              <div className="py-16 flex flex-col items-center border-t border-white/[0.06]">
                <div className="relative w-full max-w-4xl min-h-[260px] md:min-h-[220px] flex items-center justify-center text-center">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeIndex}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      transition={{ duration: 0.35 }}
                      className="flex flex-col items-center justify-center"
                    >
                      <h3 className="text-xl md:text-2xl lg:text-3xl font-normal leading-relaxed tracking-tight text-zinc-200 mb-8 max-w-3xl">
                        &ldquo;{reviewsData[activeIndex].quote}&rdquo;
                      </h3>
                      <div className="flex flex-col items-center gap-3">
                        {reviewsData[activeIndex].image ? (
                          <img 
                            src={reviewsData[activeIndex].image} 
                            alt={reviewsData[activeIndex].name} 
                            className="w-14 h-14 rounded-full object-cover object-top border border-white/15 shadow-md"
                          />
                        ) : (
                          <div className="w-14 h-14 rounded-full flex items-center justify-center text-white font-mono text-base bg-zinc-800 border border-white/10 shadow-md">
                            {reviewsData[activeIndex].initials}
                          </div>
                        )}
                        <div className="flex flex-col items-center">
                          <div className="font-medium text-white text-base">{reviewsData[activeIndex].name}</div>
                          <div className="text-zinc-500 text-xs md:text-sm mt-0.5">{reviewsData[activeIndex].title}</div>
                        </div>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Avatars */}
                <div className="flex items-center gap-4 mt-12 pt-6 border-t border-white/[0.05] w-full max-w-xl justify-center">
                  {reviewsData.map((review, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveIndex(idx)}
                      className={`relative w-11 h-11 rounded-full flex items-center justify-center text-white font-medium text-sm transition-all duration-200 overflow-hidden ${
                        activeIndex === idx 
                          ? "ring-2 ring-white scale-110 shadow-md z-10" 
                          : "opacity-50 hover:opacity-90 scale-95 hover:scale-100"
                      } bg-zinc-800 border border-white/10`}
                    >
                      {review.image ? (
                        <img src={review.image} alt={review.name} className="w-full h-full object-cover object-top" />
                      ) : (
                        review.initials
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.section>
  );
}

/* ──────────────────────────── MAIN PAGE ──────────────────────────── */

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [activeTerminalStep, setActiveTerminalStep] = useState(1);
  const [copilotState, setCopilotState] = useState<'initial' | 'generating' | 'fixed'>('initial');
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    Overview: true,
    Communication: true,
    Planning: true,
    Operations: true,
    System: true
  });
  const [navScrolled, setNavScrolled] = useState(false);

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  const heroImgY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroImgScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const heroContentY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const heroOverlayOpacity = useTransform(scrollYProgress, [0, 0.6], [0, 0.75]);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setNavScrolled(window.scrollY > 80);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleGroup = (title: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [title]: !prev[title]
    }));
  };

  const navGroups = [
    {
      title: "Overview",
      items: [
        { name: "Dashboard", icon: LayoutDashboard },
        { name: "AI Copilot", icon: Zap },
      ]
    },
    {
      title: "Communication",
      items: [
        { name: "Inbox", icon: MessageSquare },
        { name: "Teams", icon: Users },
      ]
    },
    {
      title: "Planning",
      items: [
        { name: "Kanban", icon: KanbanSquare },
        { name: "Issues & Bugs", icon: Bug },
        { name: "Roadmap", icon: Map },
      ]
    },
    {
      title: "Operations",
      items: [
        { name: "Uptime", icon: Activity },
        { name: "Infrastructure", icon: Server },
        { name: "Maintenance", icon: Wrench },
      ]
    },
    {
      title: "System",
      items: [
        { name: "Settings", icon: Settings },
      ]
    }
  ];

  /* ── Mockup content renderer (same logic) ── */
  const renderMockupContent = () => {
    switch (activeTab) {
      case "Dashboard":
        return (
          <>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-lg font-medium text-white tracking-tight">System Overview</h2>
              <div className="flex -space-x-2">
                <div className="w-7 h-7 rounded-full bg-zinc-800 border-2 border-[#090b0e] flex items-center justify-center text-[10px] font-mono text-zinc-300">JD</div>
                <div className="w-7 h-7 rounded-full bg-zinc-700 border-2 border-[#090b0e] flex items-center justify-center text-[10px] font-mono text-zinc-200">AS</div>
                <div className="w-7 h-7 rounded-full bg-zinc-900 border-2 border-[#090b0e] flex items-center justify-center text-[10px] font-mono text-zinc-400">MK</div>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="h-28 rounded-xl bg-white/[0.02] border border-white/[0.05] p-5 flex flex-col justify-between hover:bg-white/[0.04] transition-colors cursor-pointer">
                <div className="text-zinc-500 text-[12px] font-mono uppercase tracking-wider">Active Incidents</div>
                <div className="text-3xl font-semibold text-white tracking-tight">0</div>
              </div>
              <div className="h-28 rounded-xl bg-white/[0.02] border border-white/[0.05] p-5 flex flex-col justify-between hover:bg-white/[0.04] transition-colors cursor-pointer">
                <div className="text-zinc-500 text-[12px] font-mono uppercase tracking-wider">Resolved (7d)</div>
                <div className="text-3xl font-semibold text-white tracking-tight">48</div>
              </div>
              <div className="h-28 rounded-xl bg-white/[0.02] border border-white/[0.05] p-5 flex flex-col justify-between hover:bg-white/[0.04] transition-colors cursor-pointer">
                <div className="text-zinc-500 text-[12px] font-mono uppercase tracking-wider">Telemetry Uptime</div>
                <div className="text-3xl font-semibold text-zinc-200 tracking-tight flex items-center gap-2">
                  <span>99.98%</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                </div>
              </div>
            </div>
            <div className="flex-1 rounded-xl border border-white/[0.05] bg-white/[0.01] p-5 flex flex-col">
                <div className="text-[12px] text-zinc-500 font-mono uppercase tracking-wider mb-4">Request Latency (p99 • Last 30 Days)</div>
                <div className="flex-1 border-b border-l border-white/[0.06] relative flex items-end ml-4 mb-2">
                  <svg className="absolute inset-0 w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
                    <defs>
                      <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.15"/>
                        <stop offset="100%" stopColor="#ffffff" stopOpacity="0"/>
                      </linearGradient>
                    </defs>
                    <path d="M0,80 L15,70 L30,75 L45,45 L60,50 L75,20 L90,25 L100,5" fill="none" stroke="#e4e4e7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M0,80 L15,70 L30,75 L45,45 L60,50 L75,20 L90,25 L100,5 L100,100 L0,100 Z" fill="url(#chartGradient)" stroke="none" />
                  </svg>
                  <div className="absolute -bottom-6 left-0 text-[10px] font-mono text-zinc-500">Oct 1</div>
                  <div className="absolute -bottom-6 right-0 text-[10px] font-mono text-zinc-500">Oct 30</div>
                  <div className="absolute top-0 -left-8 text-[10px] font-mono text-zinc-500">12ms</div>
                  <div className="absolute bottom-0 -left-8 text-[10px] font-mono text-zinc-500">0ms</div>
                </div>
            </div>
          </>
        );
      case "AI Copilot":
        return (
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between mb-6 shrink-0">
              <h2 className="text-lg font-medium text-white tracking-tight flex items-center gap-2">
                <Zap size={16} className="text-zinc-400" /> Copilot Agent
              </h2>
              <div className="flex items-center gap-2 text-xs font-mono bg-white/[0.04] border border-white/[0.08] px-3 py-1.5 rounded-md text-zinc-300">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
                Standby • Listening
              </div>
            </div>
            <div className="flex-1 bg-[#07080a] border border-white/[0.05] rounded-xl flex flex-col overflow-hidden">
              <div className="flex-1 p-5 overflow-y-auto custom-scrollbar flex flex-col gap-6">
                <div className="flex gap-4 opacity-60">
                   <div className="w-8 h-8 rounded-full bg-zinc-800 border border-white/[0.08] flex items-center justify-center text-zinc-400 shrink-0 text-xs font-mono">JD</div>
                   <div className="flex-1 bg-zinc-900/60 border border-white/[0.05] p-3 rounded-xl rounded-tl-none text-[13px] text-zinc-400">
                     Can you check the latency spikes on the payment gateway?
                   </div>
                </div>
                <div className="flex gap-4 opacity-60">
                   <div className="w-8 h-8 rounded-full bg-white/[0.05] border border-white/[0.1] flex items-center justify-center text-zinc-300 shrink-0">
                     <Zap size={14} />
                   </div>
                   <div className="flex-1 bg-zinc-900/60 border border-white/[0.05] p-3 rounded-xl rounded-tl-none text-[13px] text-zinc-400">
                     Analysis complete. High disk-wait on transaction journal write. Query index recommendation applied.
                   </div>
                </div>
                <div className="flex gap-4">
                   <div className="w-8 h-8 rounded-full bg-zinc-800 border border-white/[0.08] flex items-center justify-center text-zinc-200 shrink-0 text-xs font-mono">JD</div>
                   <div className="flex-1 bg-zinc-900/80 border border-white/[0.08] p-3 rounded-xl rounded-tl-none text-[13px] text-zinc-200">
                     Verify recent commit to <code className="text-zinc-300 font-mono bg-white/[0.06] px-1 py-0.5 rounded">auth_service.py</code>
                   </div>
                </div>
                <div className="flex gap-4">
                   <div className="w-8 h-8 rounded-full bg-white/[0.08] border border-white/[0.15] flex items-center justify-center text-white shrink-0">
                     <Zap size={14} />
                   </div>
                   <div className="flex-1 flex flex-col gap-3">
                     <div className="bg-zinc-900/90 border border-white/[0.1] p-4 rounded-xl rounded-tl-none shadow-md">
                       <div className="text-[13px] text-zinc-200 mb-3 leading-relaxed font-normal">
                         Unhandled NoneType exception detected on token retrieval:
                       </div>
                       <div className="bg-black border border-white/[0.06] p-3 rounded-lg font-mono text-[12px] text-zinc-400 overflow-x-auto mb-4">
                         <span className="text-zinc-500">def</span> <span className="text-white">login</span>(user_id):<br/>
                         &nbsp;&nbsp;&nbsp;&nbsp;user = db.get(user_id)<br/>
                         <div className="bg-rose-500/10 -mx-3 px-3 py-0.5 border-l-2 border-rose-500 mt-1">
                           &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-rose-400">return user.token # user can be None</span>
                         </div>
                       </div>
                       {copilotState === 'initial' && (
                         <div className="flex flex-wrap gap-2">
                           <button 
                             onClick={() => {
                               setCopilotState('generating');
                               setTimeout(() => setCopilotState('fixed'), 1500);
                             }}
                             className="px-3 py-1.5 bg-white text-black text-[12px] font-medium rounded-md hover:bg-zinc-200 transition-colors flex items-center gap-1.5"
                           >
                             <Wrench size={13} /> Generate Safe Patch
                           </button>
                           <button className="px-3 py-1.5 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-zinc-300 text-[12px] font-medium rounded-md transition-colors">
                             Create Linear Issue
                           </button>
                         </div>
                       )}
                       {copilotState === 'generating' && (
                         <div className="flex items-center gap-3 text-[13px] text-zinc-300 font-mono">
                           <div className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                           Synthesizing patch...
                         </div>
                       )}
                       {copilotState === 'fixed' && (
                         <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="flex flex-col gap-3">
                           <div className="text-[13px] text-emerald-400 font-mono flex items-center gap-2">
                             <Check size={14} /> Patch synthesized and verified against test suite
                           </div>
                           <div className="bg-black border border-white/[0.06] p-3 rounded-lg font-mono text-[12px] text-zinc-400 overflow-x-auto">
                             <div className="text-emerald-400/90 border-l-2 border-emerald-500 px-3 -mx-3 bg-emerald-500/10">
                               + &nbsp;&nbsp;&nbsp;&nbsp;if not user:<br/>
                               + &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;raise AuthError(&quot;User not found&quot;)<br/>
                             </div>
                             &nbsp;&nbsp;&nbsp;&nbsp;return user.token
                           </div>
                           <div className="flex gap-2 mt-1">
                             <button 
                               onClick={() => setCopilotState('initial')}
                               className="px-3 py-1.5 bg-white text-black hover:bg-zinc-200 text-[12px] font-medium rounded-md transition-colors flex items-center gap-1.5"
                             >
                               <GitBranch size={13} /> Create Pull Request
                             </button>
                           </div>
                         </motion.div>
                       )}
                     </div>
                   </div>
                </div>
              </div>
              <div className="p-4 border-t border-white/[0.06] bg-[#090b0e] shrink-0">
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Ask Copilot to analyze telemetry, check memory profiles, or draft fixes..." 
                    className="w-full bg-black border border-white/[0.08] text-white rounded-lg py-2.5 pl-4 pr-10 text-[13px] outline-none focus:border-white/30 transition-colors placeholder:text-zinc-600 font-normal"
                    readOnly
                  />
                  <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-white/[0.05] hover:bg-white/[0.1] rounded-md transition-colors text-zinc-400 hover:text-white">
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="flex-1 flex flex-col items-center justify-center text-[#555]">
            <div className="w-16 h-16 rounded-2xl bg-white/[0.02] border border-white/[0.05] mb-4 flex items-center justify-center">
              <Command size={24} className="text-[#333]" />
            </div>
            <p className="text-[14px]">Select a feature from the sidebar to explore.</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#080808] text-[#EDEDED] font-sans overflow-x-hidden selection:bg-white/20 selection:text-white">
      
      {/* ═══════════════════ CLEAN TRANSPARENT TOP NAVBAR ═══════════════════ */}
      <motion.nav
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
        className={`fixed top-0 left-0 right-0 w-full z-50 flex items-center justify-between px-6 sm:px-12 md:px-16 transition-all duration-300 ${
          navScrolled
            ? "py-4 bg-black/80 backdrop-blur-md border-b border-white/[0.08]"
            : "py-6 sm:py-7 bg-transparent border-b border-transparent"
        }`}
      >
        {/* Left Corner: BREXAL Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <Logo className="h-4 sm:h-[18px] text-white tracking-widest transition-opacity group-hover:opacity-80" />
        </Link>

        {/* Right Corner: Nav links + Login Button */}
        <div className="flex items-center gap-6 sm:gap-8">
          <div className="hidden md:flex items-center gap-6 lg:gap-8 text-[13px] font-medium tracking-wide">
            <Link href="#features" className="text-zinc-400 hover:text-white transition-colors">Features</Link>
            <Link href="#method" className="text-zinc-400 hover:text-white transition-colors">Method</Link>
            <Link href="#pricing" className="text-zinc-400 hover:text-white transition-colors">Pricing</Link>
            <Link href="#faq" className="text-zinc-400 hover:text-white transition-colors">FAQ</Link>
          </div>
          <Link
            href="/login"
            className="bg-white text-black px-4 sm:px-5 py-2 rounded-full text-[13px] font-semibold hover:bg-zinc-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:shadow-[0_0_25px_rgba(255,255,255,0.3)]"
          >
            Login
          </Link>
        </div>
      </motion.nav>

      {/* ═══════════════════ HERO SECTION ═══════════════════ */}
      <section ref={heroRef} className="relative h-screen w-full overflow-hidden flex flex-col">
        
        {/* Background Image with Parallax — eagle sits in center-right of frame */}
        <motion.div
          className="absolute inset-0 z-0 select-none pointer-events-none"
          style={{ y: heroImgY, scale: heroImgScale }}
        >
          <img
            src="/hero-landscape.png?v=2"
            alt="Eagle soaring over misty mountain ridges at dusk"
            className="w-full h-full object-cover object-[center_35%]"
          />
        </motion.div>

        {/* Overlay system — keeps text crisp up top, lets the eagle + mountains breathe below */}
        {/* Top: strong fade for navbar + headline legibility */}
        <div className="absolute inset-x-0 top-0 h-[45%] z-[1] bg-gradient-to-b from-black/90 via-black/60 to-transparent pointer-events-none" />
        {/* Bottom: seamless blend into page bg */}
        <div className="absolute inset-x-0 bottom-0 h-48 z-[1] bg-gradient-to-t from-[#080808] to-transparent pointer-events-none" />
        {/* Scroll darken */}
        <motion.div
          className="absolute inset-0 z-[2] bg-[#080808] pointer-events-none"
          style={{ opacity: heroOverlayOpacity }}
        />

        {/* ── Content: pinned to the upper third ── */}
        <motion.div
          className="relative z-10 flex flex-col items-center text-center px-6 pt-32 sm:pt-36 md:pt-40"
          style={{ y: heroContentY }}
        >
          {/* Headline — short, decisive, no gradient gimmicks */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={mounted ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.36, 1], delay: 0.45 }}
            className="text-[clamp(2.25rem,6vw,5rem)] font-semibold tracking-[-0.04em] leading-[1.08] text-white max-w-3xl"
          >
            Ship reliable software, faster.
          </motion.h1>

          {/* Sub-copy — one sentence, human voice */}
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={mounted ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.36, 1], delay: 0.6 }}
            className="mt-4 text-[15px] sm:text-[17px] text-zinc-400 max-w-lg leading-relaxed font-normal"
          >
            Uptime monitoring, AI root-cause analysis, and team workflows — in one place.
          </motion.p>

          {/* CTAs — clean, two buttons, no over-design */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={mounted ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.36, 1], delay: 0.75 }}
            className="mt-8 flex items-center gap-3"
          >
            <Link
              href="/register"
              className="px-6 py-2.5 rounded-lg bg-white text-[#080808] text-[13px] font-semibold hover:bg-zinc-200 transition-colors"
            >
              Get started free
            </Link>
            <Link
              href="#features"
              className="px-5 py-2.5 rounded-lg border border-white/[0.12] text-[13px] font-medium text-zinc-300 hover:text-white hover:border-white/25 transition-colors"
            >
              See how it works
            </Link>
          </motion.div>
        </motion.div>

        {/* ── Scroll indicator — minimal mouse icon ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={mounted ? { opacity: 1 } : {}}
          transition={{ delay: 1.6, duration: 0.8 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 pointer-events-none"
        >
          <div className="w-[18px] h-[28px] rounded-full border border-white/25 flex justify-center pt-1.5">
            <motion.div
              animate={{ y: [0, 6, 0], opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
              className="w-[2px] h-[6px] rounded-full bg-white/70"
            />
          </div>
        </motion.div>
      </section>

      {/* ═══════════════════ TRUSTED BY BANNER ═══════════════════ */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
        variants={sectionReveal}
        className="w-full py-16 border-b border-white/[0.06] bg-[#07080a]"
      >
        <div className="flex flex-col items-center gap-6 px-6">
          <p className="text-[11px] text-zinc-500 tracking-[0.25em] uppercase font-mono">Trusted by high-growth engineering teams</p>
          <div className="flex items-center gap-10 md:gap-16 flex-wrap justify-center">
            {trustedBy.map((name) => (
              <span key={name} className="text-zinc-500 text-sm md:text-base font-medium tracking-wide hover:text-zinc-300 transition-colors cursor-default">
                {name}
              </span>
            ))}
          </div>
        </div>
      </motion.section>

      <main className="pb-24 flex flex-col">
        
        {/* ═══════════════════ APP MOCKUP SECTION ═══════════════════ */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={sectionReveal}
          className="w-full px-6 md:px-12 lg:px-24 mt-36 relative"
        >
          {/* Section heading */}
          <div className="text-center mb-16">
            <motion.div variants={itemReveal} className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-[11px] font-mono tracking-wider text-zinc-400 mb-6 uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
              Live Workspace Preview
            </motion.div>
            <motion.h2 variants={itemReveal} className="text-3xl md:text-5xl font-medium tracking-tight mb-4 text-white">
              The operational command center.
            </motion.h2>
            <motion.p variants={itemReveal} className="text-base sm:text-lg text-zinc-400 font-normal max-w-2xl mx-auto leading-relaxed">
              Every service, telemetry pulse, and team issue orchestrated in real time with zero configuration.
            </motion.p>
          </div>

          <motion.div 
            initial={{ opacity: 0, rotateX: 10, y: 60 }}
            whileInView={{ opacity: 1, rotateX: 0, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            className="w-full aspect-[16/10] bg-[#090b0e] rounded-2xl border border-white/[0.08] shadow-[0_24px_80px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden relative"
            style={{ perspective: "1000px" }}
          >
            {/* Mockup Header */}
            <div className="h-10 w-full border-b border-white/[0.06] bg-[#0c0e12] flex items-center px-4 justify-between shrink-0">
              <div className="flex gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-white/10"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-white/10"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-white/10"></div>
              </div>
              <div className="flex items-center gap-2 bg-black/40 px-3 py-1 rounded-md border border-white/[0.06]">
                <Command size={12} className="text-zinc-500" />
                <span className="text-zinc-400 text-xs font-mono">BREXAL / {activeTab}</span>
              </div>
              <div></div>
            </div>
            
            {/* Mockup Body */}
            <div className="flex-1 flex overflow-hidden">
              {/* Sidebar */}
              <div className="w-56 border-r border-white/[0.06] bg-[#08090c] flex flex-col font-sans overflow-y-auto custom-scrollbar shrink-0">
                <nav className="flex-1 px-3 py-4 space-y-4">
                  {navGroups.map((group, idx) => {
                    const isExpanded = expandedGroups[group.title];
                    return (
                      <div key={idx} className="flex flex-col mb-1">
                        <button 
                          onClick={() => toggleGroup(group.title)}
                          className="w-full px-2 py-1 flex justify-between items-center text-zinc-500 hover:text-zinc-300 transition-colors rounded-md"
                        >
                          <span className="text-[10px] font-mono tracking-wider uppercase text-zinc-500">{group.title}</span>
                          {isExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                        </button>
                        <div className={`grid transition-all duration-200 ease-in-out ${isExpanded ? "grid-rows-[1fr] opacity-100 mt-0.5" : "grid-rows-[0fr] opacity-0"}`}>
                          <div className="overflow-hidden space-y-0.5">
                            {group.items.map((item) => {
                              const Icon = item.icon;
                              const isActive = activeTab === item.name;
                              return (
                                <button
                                  key={item.name}
                                  onClick={() => setActiveTab(item.name)}
                                  className={`
                                    w-full flex items-center gap-2.5 px-2 py-1.5 rounded-md text-[13px] font-medium transition-all duration-150 whitespace-nowrap overflow-hidden
                                    ${isActive 
                                      ? "bg-white/[0.08] text-white" 
                                      : "text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.03]"}
                                  `}
                                >
                                  <Icon size={14} className={`shrink-0 ${isActive ? "text-white" : "text-zinc-600"}`} />
                                  <span>{item.name}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </nav>
              </div>
              
              {/* Main Content Area */}
              <div className="flex-1 bg-[#090b0e] font-sans flex flex-col relative overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.div 
                    key={activeTab}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.15 }}
                    className="absolute inset-0 p-8 flex flex-col overflow-y-auto custom-scrollbar"
                  >
                    {renderMockupContent()}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </motion.section>

        {/* ═══════════════════ BREXAL ARCHITECTURE SECTION ═══════════════════ */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={stagger}
          className="w-full px-6 md:px-12 lg:px-24 mt-36 relative z-10"
          id="method"
        >
          <motion.div variants={sectionReveal} className="text-center md:text-left mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-[11px] font-mono tracking-wider text-zinc-400 uppercase mb-6">
              Architecture & Capabilities
            </div>
            <h2 className="text-3xl md:text-5xl font-medium tracking-tight mb-4 text-white">Engineered for absolute resilience.</h2>
            <p className="text-base sm:text-lg text-zinc-400 max-w-2xl font-normal leading-relaxed">Six foundational telemetry pillars designed to withstand peak production load.</p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { letter: "B", num: "01", title: "Bug Intelligence", desc: "Automated regression isolation and commit correlation before user impact." },
              { letter: "R", num: "02", title: "Runtime Telemetry", desc: "Continuous sub-millisecond execution monitoring across services." },
              { letter: "E", num: "03", title: "Error Diagnostics", desc: "Automated root-cause deduction with pinpoint stack trace analysis." },
              { letter: "X", num: "04", title: "Execution Pipeline", desc: "Deterministic deployment verification and synthetic health probes." },
              { letter: "A", num: "05", title: "Analytics Engine", desc: "Deep operational metrics without the bloat of legacy APMs." },
              { letter: "L", num: "06", title: "Logic & Copilot", desc: "Autonomous AI orchestration that drafts patches for immediate review." },
            ].map((item, i) => (
              <motion.div
                key={item.letter}
                variants={itemReveal}
                className="relative overflow-hidden rounded-2xl bg-[#090b0e] border border-white/[0.06] p-6 hover:border-white/15 transition-all group"
              >
                <div className="absolute -right-3 -bottom-6 text-[100px] font-mono font-bold text-white/[0.02] group-hover:text-white/[0.04] transition-colors pointer-events-none select-none">{item.letter}</div>
                <div className="text-zinc-500 font-mono text-[11px] mb-4 tracking-wider">{item.num} / CORE</div>
                <h3 className="text-lg md:text-xl font-medium text-white tracking-tight mb-2">{item.title}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed relative z-10">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ═══════════════════ BENTO GRID FEATURES ═══════════════════ */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={stagger}
          className="w-full px-6 md:px-12 lg:px-24 mt-36"
          id="features"
        >
          <motion.div variants={sectionReveal} className="text-center md:text-left mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-[11px] font-mono tracking-wider text-zinc-400 uppercase mb-6">
              Precision Telemetry
            </div>
            <h2 className="text-3xl md:text-5xl font-medium tracking-tight mb-4 text-white">Engineered for speed and discretion.</h2>
            <p className="text-base sm:text-lg text-zinc-400 font-normal max-w-2xl leading-relaxed">Integrated telemetry, issue escalation, and developer tooling without performance penalty.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            {/* Feature 1 - Large: Real-time Sync */}
            <motion.div variants={itemReveal} className="md:col-span-4 rounded-2xl bg-[#090b0e] border border-white/[0.06] p-8 relative overflow-hidden group hover:border-white/15 transition-all">
              <div className="relative z-10 flex flex-col h-full">
                <div className="w-10 h-10 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center mb-4">
                  <Zap size={18} className="text-zinc-200" />
                </div>
                <h3 className="text-xl font-medium mb-2 text-white">Sub-second State Synchronization</h3>
                <p className="text-zinc-400 mb-6 max-w-md text-sm leading-relaxed">Every event, status change, and deployment signal propagates across all active peers instantly via low-latency telemetry mesh.</p>
                
                {/* Telemetry Task Stream */}
                <div className="w-full rounded-xl bg-black border border-white/[0.06] mt-auto flex flex-col relative overflow-hidden font-sans">
                   <div className="h-9 border-b border-white/[0.06] bg-[#0c0e12] flex items-center px-4 gap-3 text-[11px] font-mono text-zinc-500 tracking-wider uppercase">
                     <div className="w-16">ID</div>
                     <div className="flex-1">Task / Incident</div>
                     <div className="w-24">State</div>
                   </div>
                   <div className="flex flex-col">
                     {[
                       { id: 'SYS-201', title: 'Verify TLS cert auto-renewal trigger', status: 'Active', color: 'text-zinc-300', dot: 'bg-zinc-400' },
                       { id: 'SYS-202', title: 'Drain worker pod pool on us-east', status: 'Healthy', color: 'text-zinc-400', dot: 'bg-emerald-400' },
                       { id: 'SYS-203', title: 'Cluster memory headroom rebalance', status: 'Queued', color: 'text-zinc-500', dot: 'bg-zinc-600' }
                     ].map((issue, i) => (
                       <div key={i} className="flex items-center px-4 py-2.5 border-b border-white/[0.03] text-[12px] bg-white/[0.01] hover:bg-white/[0.03] transition-colors cursor-pointer">
                         <div className="w-16 text-zinc-500 font-mono text-[11px]">{issue.id}</div>
                         <div className="flex-1 text-zinc-300 font-normal truncate pr-3">{issue.title}</div>
                         <div className={`w-24 ${issue.color} flex items-center gap-1.5 text-[11px] font-mono`}>
                           <div className={`w-1.5 h-1.5 rounded-full ${issue.dot}`}></div>
                           {issue.status}
                         </div>
                       </div>
                     ))}
                   </div>
                </div>
              </div>
            </motion.div>

            {/* Feature 2 - Command K */}
            <motion.div variants={itemReveal} className="md:col-span-2 rounded-2xl bg-[#090b0e] border border-white/[0.06] p-8 flex flex-col relative overflow-hidden group hover:border-white/15 transition-all">
              <div className="w-10 h-10 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center mb-4">
                <Terminal size={18} className="text-zinc-200" />
              </div>
              <h3 className="text-xl font-medium mb-2 text-white">Command Palette</h3>
              <p className="text-zinc-400 mb-6 text-sm leading-relaxed">Direct keyboard access to all resources, apps, logs, and services with fuzzy search.</p>
              <div className="mt-auto h-40 rounded-xl bg-black border border-white/[0.06] flex flex-col overflow-hidden relative font-sans">
                 <div className="h-10 border-b border-white/[0.06] flex items-center px-3 gap-2 bg-[#0c0e12]">
                   <span className="text-zinc-500"><Command size={13} /></span>
                   <span className="text-zinc-300 text-[12px] font-mono">Jump to service...</span>
                 </div>
                 <div className="flex-1 p-2 flex flex-col gap-1">
                   <div className="px-2 py-1 text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Quick Actions</div>
                   <div className="px-2.5 py-1.5 bg-white/[0.06] rounded-md flex items-center justify-between text-[12px]">
                     <span className="text-white font-normal">Inspect active trace</span>
                     <span className="text-zinc-400 font-mono text-[10px] bg-white/[0.06] px-1.5 py-0.5 rounded">T</span>
                   </div>
                   <div className="px-2.5 py-1.5 text-zinc-400 flex items-center justify-between text-[12px]">
                     <span className="font-normal">Tail gateway logs</span>
                     <span className="text-zinc-500 font-mono text-[10px] bg-white/[0.03] px-1.5 py-0.5 rounded">L</span>
                   </div>
                 </div>
                 <div className="absolute bottom-0 left-0 w-full h-10 bg-gradient-to-t from-black to-transparent pointer-events-none"></div>
              </div>
            </motion.div>

            {/* Feature 3 - RBAC */}
            <motion.div variants={itemReveal} className="md:col-span-2 rounded-2xl bg-[#090b0e] border border-white/[0.06] p-8 flex flex-col relative overflow-hidden group hover:border-white/15 transition-all">
              <div className="w-10 h-10 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center mb-4">
                <Lock size={18} className="text-zinc-200" />
              </div>
              <h3 className="text-xl font-medium mb-2 text-white">Granular Access Control</h3>
              <p className="text-zinc-400 mb-6 text-sm leading-relaxed">Role-based scoping for multi-environment safety across dev, staging, and production.</p>
              
              <div className="mt-auto rounded-xl bg-black border border-white/[0.06] flex flex-col overflow-hidden p-2.5 gap-1.5 font-sans">
                 <div className="flex items-center justify-between p-2 rounded-lg hover:bg-white/[0.02] transition-colors cursor-pointer">
                   <div className="flex items-center gap-3">
                     <div className="w-7 h-7 rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center text-[10px] font-mono text-zinc-200">JD</div>
                     <span className="text-zinc-200 text-[13px] font-medium">John Doe</span>
                   </div>
                   <span className="text-zinc-400 bg-white/[0.04] border border-white/[0.06] px-2 py-0.5 rounded-md text-[10px] font-mono">Admin</span>
                 </div>
                 <div className="flex items-center justify-between p-2 rounded-lg hover:bg-white/[0.02] transition-colors cursor-pointer">
                   <div className="flex items-center gap-3">
                     <div className="w-7 h-7 rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center text-[10px] font-mono text-zinc-300">AS</div>
                     <span className="text-zinc-200 text-[13px] font-medium">Alice Smith</span>
                   </div>
                   <span className="text-zinc-500 bg-white/[0.03] border border-white/[0.04] px-2 py-0.5 rounded-md text-[10px] font-mono">Operator</span>
                 </div>
                 <div className="flex items-center justify-between p-2 rounded-lg hover:bg-white/[0.02] transition-colors cursor-pointer">
                   <div className="flex items-center gap-3">
                     <div className="w-7 h-7 rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center text-[10px] font-mono text-zinc-400">MK</div>
                     <span className="text-zinc-300 text-[13px] font-medium">Marcus Kim</span>
                   </div>
                   <span className="text-zinc-500 bg-white/[0.03] border border-white/[0.04] px-2 py-0.5 rounded-md text-[10px] font-mono">Auditor</span>
                 </div>
              </div>
            </motion.div>

            {/* Feature 4 - AI Copilot */}
            <motion.div variants={itemReveal} className="md:col-span-4 rounded-2xl bg-[#090b0e] border border-white/[0.06] p-8 flex flex-col relative overflow-hidden group hover:border-white/15 transition-all">
              <div className="w-10 h-10 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center mb-4">
                <GitBranch size={18} className="text-zinc-200" />
              </div>
              <h3 className="text-xl font-medium mb-2 text-white">Root-Cause Deductions</h3>
              <p className="text-zinc-400 mb-6 max-w-md text-sm leading-relaxed">Automated telemetry analysis matches anomalous stack traces directly to offending Git commits.</p>
              
              <div className="w-full rounded-xl bg-black border border-white/[0.06] flex flex-col overflow-hidden p-5 font-sans mt-auto">
                 <div className="flex gap-3 mb-4">
                   <div className="w-7 h-7 rounded-full bg-white/[0.08] text-zinc-200 flex items-center justify-center shrink-0 border border-white/10">
                     <Zap size={13} />
                   </div>
                   <div className="bg-zinc-900 border border-white/[0.06] rounded-xl rounded-tl-none p-3.5 text-[13px] text-zinc-300 max-w-[85%] leading-relaxed font-normal">
                     Memory leak footprint in <code className="text-zinc-200 font-mono bg-white/[0.06] px-1.5 py-0.5 rounded">websocket_handler.py</code>. Suggested buffer purge patch ready.
                   </div>
                 </div>
                 <div className="flex gap-3 self-end flex-row-reverse">
                   <div className="w-7 h-7 rounded-full bg-zinc-800 border border-white/10 text-zinc-400 flex items-center justify-center shrink-0 text-[10px] font-mono">
                     DEV
                   </div>
                   <div className="bg-white text-black rounded-xl rounded-tr-none p-3 text-[13px] max-w-[85%] leading-relaxed font-medium">
                     Approve patch and run automated staging check.
                   </div>
                 </div>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* ═══════════════════ AGENT INTEGRATION ═══════════════════ */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={sectionReveal}
          className="w-full px-6 md:px-12 lg:px-24 mt-36 relative z-10"
          id="agent"
        >
          <div className="text-center md:text-left mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-[11px] font-mono tracking-wider text-zinc-400 uppercase mb-6">
              Deployment & Ingestion
            </div>
            <h2 className="text-3xl md:text-5xl font-medium tracking-tight mb-4 text-white">The Zero-Friction Agent.</h2>
            <p className="text-zinc-400 text-base sm:text-lg max-w-2xl font-normal leading-relaxed">Connect any Python, Node, or Go service with our lightweight SDK. Sub-millisecond latency with end-to-end telemetry encryption.</p>
          </div>

          <div className="flex flex-col lg:flex-row items-stretch gap-6">
            {/* Architecture Diagram */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="flex-1 rounded-2xl bg-[#090b0e] border border-white/[0.06] p-8 flex flex-col justify-center items-center relative overflow-hidden"
            >
              {/* Subtle architectural ambient background */}
              <div className="absolute inset-0 pointer-events-none opacity-[0.03] select-none [background-image:radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
              <div className="absolute w-72 h-72 rounded-full bg-white/[0.02] blur-3xl pointer-events-none" />

              <div className="flex items-center justify-between w-full max-w-md relative z-10 py-8">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-16 h-16 rounded-2xl bg-black border border-white/10 flex items-center justify-center shadow-md">
                    <Server size={22} className="text-zinc-400" />
                  </div>
                  <span className="text-xs font-mono text-zinc-400">Target Stack</span>
                </div>
                <div className="flex-1 flex items-center justify-center mx-6">
                  <div className="relative w-full">
                    <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-zinc-700 via-white/30 to-zinc-700"></div>
                    <motion.div
                      animate={{ x: ["0%", "100%"] }}
                      transition={{ duration: 2.2, repeat: Infinity, ease: "linear" }}
                      className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]"
                    />
                  </div>
                </div>
                <div className="flex flex-col items-center gap-3">
                  <div className="w-16 h-16 rounded-2xl bg-black border border-white/15 flex items-center justify-center shadow-md">
                    <Zap size={22} className="text-white" />
                  </div>
                  <span className="text-xs font-mono text-white">BREXAL API</span>
                </div>
              </div>
              <div className="mt-4 text-center relative z-10">
                <div className="text-[12px] font-mono text-zinc-500 uppercase tracking-wider">mTLS Encrypted • eBPF Fast • Zero Downtime</div>
              </div>
            </motion.div>

            {/* Terminal */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
              className="flex-1 rounded-2xl bg-[#090b0e] border border-white/[0.06] overflow-hidden flex flex-col"
            >
              <div className="h-10 border-b border-white/[0.06] bg-[#0c0e12] flex items-center px-4 gap-3 shrink-0">
                <div className="flex gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-white/10"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-white/10"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-white/10"></div>
                </div>
                <span className="text-zinc-500 text-[11px] font-mono ml-2">bash — 80x24</span>
              </div>
              <div className="flex-1 p-6 font-mono text-[13px] leading-relaxed bg-black">
                <div className="text-zinc-400">
                  <span className="text-zinc-600">$</span> npm install @brexal/sdk
                </div>
                <div className="text-zinc-600 mt-1.5">✓ SDK linked (0.2s)</div>
                <div className="text-zinc-400 mt-4">
                  <span className="text-zinc-600">$</span> brexal init --auto
                </div>
                <div className="mt-2 text-zinc-300">
                  <span className="text-zinc-500">→</span> Framework detected: <span className="text-white">Next.js 16 (App Router)</span>
                </div>
                <div className="mt-1 text-zinc-300">
                  <span className="text-zinc-500">→</span> Telemetry ingestion: <span className="text-emerald-400">Active</span>
                </div>
                <div className="mt-1 text-zinc-300">
                  <span className="text-zinc-500">→</span> Handshake latency: <span className="text-white">8.4ms</span>
                </div>
                <div className="mt-4 text-emerald-400">✓ Ready. All runtime telemetry streaming to BREXAL.</div>
                <div className="mt-4 inline-block w-2 h-4 bg-white/60 animate-pulse"></div>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* ═══════════════════ REVIEWS ═══════════════════ */}
        <ReviewsSection />

        {/* ═══════════════════ FAQ SECTION ═══════════════════ */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={sectionReveal}
          className="w-full px-6 md:px-12 lg:px-24 mt-36 relative z-10"
          id="faq"
        >
          <div className="text-center md:text-left mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-[11px] font-mono tracking-wider text-zinc-400 uppercase mb-6">
              Inquiries & Answers
            </div>
            <h2 className="text-3xl md:text-5xl font-medium tracking-tight mb-4 text-white">Frequently asked questions.</h2>
          </div>
          <div className="max-w-3xl flex flex-col divide-y divide-white/[0.06]">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                variants={itemReveal}
                className="py-6"
              >
                <button
                  onClick={() => setOpenFaqIndex(openFaqIndex === i ? null : i)}
                  className="w-full flex items-center justify-between text-left group focus:outline-none"
                >
                  <span className="text-base sm:text-lg font-normal text-zinc-300 group-hover:text-white transition-colors pr-8">{faq.q}</span>
                  <motion.div
                    animate={{ rotate: openFaqIndex === i ? 45 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="w-8 h-8 rounded-full border border-white/[0.1] flex items-center justify-center shrink-0 group-hover:bg-white/[0.05] transition-colors"
                  >
                    <Plus size={14} className="text-zinc-400" />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {openFaqIndex === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="text-zinc-400 text-sm leading-relaxed mt-4 pr-12 font-normal">{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ═══════════════════ PRICING SECTION ═══════════════════ */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={stagger}
          className="w-full px-6 md:px-12 lg:px-24 mt-36 relative z-10"
          id="pricing"
        >
          <motion.div variants={sectionReveal} className="text-center md:text-left mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-[11px] font-mono tracking-wider text-zinc-400 uppercase mb-6">
              Pricing Plans
            </div>
            <h2 className="text-3xl md:text-5xl font-medium tracking-tight mb-4 text-white">Transparent scale. Zero surprise fees.</h2>
            <p className="text-base sm:text-lg text-zinc-400 font-normal max-w-2xl leading-relaxed">Start on the free starter tier. Expand as your engineering throughput multiplies.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Starter Plan */}
            <motion.div variants={itemReveal} className="rounded-2xl bg-[#090b0e] border border-white/[0.06] p-8 flex flex-col hover:border-white/15 transition-all">
              <h3 className="text-lg font-medium mb-1 text-white">Starter</h3>
              <p className="text-zinc-400 text-[13px] mb-6 min-h-[36px]">Ideal for independent engineers and early prototypes.</p>
              <div className="mb-8">
                <span className="text-4xl font-semibold text-white tracking-tight">$0</span>
                <span className="text-zinc-500 font-normal text-sm"> / month</span>
              </div>
              <Link href="/register" className="w-full bg-white/[0.05] border border-white/10 text-white px-4 py-2.5 rounded-full font-medium hover:bg-white/[0.1] transition-colors text-center text-sm mb-8">
                Start Free
              </Link>
              <div className="flex flex-col gap-3.5 mt-auto">
                <div className="text-[11px] font-mono tracking-wider uppercase text-zinc-500">Tier Capabilities</div>
                {["2 Monitored Services", "15m Synthetic Probes", "Email & Webhook Alerts", "3 Workspace Seats", "Basic Issue Board"].map(f => (
                  <div key={f} className="flex items-center gap-2.5 text-[13px] text-zinc-300">
                    <Check size={14} className="text-zinc-400" /> {f}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Pro Plan */}
            <motion.div variants={itemReveal} className="rounded-2xl bg-[#0c0e12] border border-white/20 p-8 flex flex-col relative shadow-[0_12px_40px_rgba(0,0,0,0.7)] hover:border-white/30 transition-all">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white text-black text-[10px] font-mono tracking-wider uppercase px-3.5 py-0.5 rounded-full font-semibold shadow-sm">
                Most Deployed
              </div>
              <div className="relative z-10 flex flex-col h-full">
                <h3 className="text-lg font-medium mb-1 text-white">Pro Platform</h3>
                <p className="text-zinc-400 text-[13px] mb-6 min-h-[36px]">For high-velocity startups requiring continuous telemetry & root-cause deduction.</p>
                <div className="mb-8">
                  <span className="text-4xl font-semibold text-white tracking-tight">$49</span>
                  <span className="text-zinc-400 font-normal text-sm"> / mo + $10/seat</span>
                </div>
                <Link href="/register" className="w-full bg-white text-black px-4 py-2.5 rounded-full font-medium hover:bg-zinc-200 transition-colors text-center text-sm mb-8 shadow-sm">
                  Deploy Pro Workspace
                </Link>
                <div className="flex flex-col gap-3.5 mt-auto">
                  <div className="text-[11px] font-mono tracking-wider uppercase text-zinc-400">Everything in Starter, plus</div>
                  {["10 Monitored Services", "1m Probing Frequency", "WhatsApp, Slack, Discord Alerts", "Automated Root Cause AI", "30-Day Metric Retention"].map(f => (
                    <div key={f} className="flex items-center gap-2.5 text-[13px] text-white">
                      <Check size={14} className="text-white" /> {f}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Enterprise Plan */}
            <motion.div variants={itemReveal} className="rounded-2xl bg-[#090b0e] border border-white/[0.06] p-8 flex flex-col hover:border-white/15 transition-all">
              <h3 className="text-lg font-medium mb-1 text-white">Enterprise</h3>
              <p className="text-zinc-400 text-[13px] mb-6 min-h-[36px]">Dedicated VPC peering, compliance guarantees, and high-volume workloads.</p>
              <div className="mb-8">
                <span className="text-4xl font-semibold text-white tracking-tight">$299+</span>
                <span className="text-zinc-500 font-normal text-sm"> / month</span>
              </div>
              <Link href="/register" className="w-full bg-white/[0.05] border border-white/10 text-white px-4 py-2.5 rounded-full font-medium hover:bg-white/[0.1] transition-colors text-center text-sm mb-8">
                Inquire With Sales
              </Link>
              <div className="flex flex-col gap-3.5 mt-auto">
                <div className="text-[11px] font-mono tracking-wider uppercase text-zinc-500">Everything in Pro, plus</div>
                {["Predictive Failure Warnings", "1-Year Full Trace Retention", "SAML SSO & Audit Logs", "24/7 Dedicated SRE Line", "Custom SLA & BAA"].map(f => (
                  <div key={f} className="flex items-center gap-2.5 text-[13px] text-zinc-300">
                    <Check size={14} className="text-zinc-400" /> {f}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* ═══════════════════ CTA SECTION (With Mountain Callback) ═══════════════════ */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={sectionReveal}
          className="w-full px-6 md:px-12 lg:px-24 mt-40"
        >
          <div className="relative rounded-3xl bg-[#07080a] border border-white/[0.08] p-12 md:p-24 text-center overflow-hidden">
            {/* Ambient image background reflection */}
            <div className="absolute inset-0 pointer-events-none opacity-20 select-none">
              <img
                src="/hero-landscape.png?v=2"
                alt=""
                className="w-full h-full object-cover object-[center_35%]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#07080a] via-[#07080a]/80 to-[#07080a]" />
            </div>

            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="text-3xl sm:text-5xl md:text-6xl font-medium tracking-tight mb-6 text-white text-balance">
                Total visibility starts now.
              </h2>
              <p className="text-zinc-400 text-base sm:text-lg mb-10 leading-relaxed font-normal">
                Join forward-thinking software organizations maintaining high availability with zero alert noise.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/register"
                  className="w-full sm:w-auto bg-white text-black px-7 py-3 rounded-full font-medium hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2 text-[14px]"
                >
                  Start Free Workspace <ArrowRight size={15} />
                </Link>
                <Link
                  href="#features"
                  className="w-full sm:w-auto px-6 py-3 rounded-full border border-white/[0.12] text-zinc-300 hover:text-white hover:border-white/25 transition-colors text-[14px]"
                >
                  Explore Documentation
                </Link>
              </div>
            </div>
          </div>
        </motion.section>

      </main>

      {/* ═══════════════════ FOOTER ═══════════════════ */}
      <footer className="w-full border-t border-white/[0.06] bg-[#07080a] py-10">
        <div className="w-full px-6 md:px-12 lg:px-24 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <Logo className="h-3.5 text-zinc-400" />
            <span className="text-zinc-600 font-mono text-xs">|</span>
            <span className="text-zinc-500 text-xs font-mono">v2.4 Telemetry Engine</span>
          </div>
          <div className="flex flex-col items-center gap-1 text-center md:text-left">
            <p className="text-xs text-zinc-500">© {new Date().getFullYear()} BREXAL. All rights reserved.</p>
            <p className="text-[11px] text-zinc-600">A product by <span className="font-medium text-zinc-400">Bharti Nexus Technologies</span>.</p>
          </div>
          <div className="flex gap-6 text-xs font-mono text-zinc-500">
            <Link href="#" className="hover:text-zinc-300 transition-colors">Documentation</Link>
            <Link href="#" className="hover:text-zinc-300 transition-colors">GitHub</Link>
            <Link href="#" className="hover:text-zinc-300 transition-colors">Status</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
