"use client";

import { UserSession } from "@/types/user";
import { motion, useScroll, useTransform, Variants } from "framer-motion";
import {
  Activity,
  ArrowRight,
  CreditCard,
  Globe,
  Lock,
  Sparkles,
  TrendingUp,
  Zap,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

interface HomeClientProps {
  session: UserSession | null;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function HomeClient({ session }: HomeClientProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-[#020617] text-slate-50 overflow-x-hidden font-sans selection:bg-emerald-500/30"
    >
      {/* Dynamic Background System */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* Modern Grid Pattern */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
        <div
          className="absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage: `linear-gradient(#1e293b 1px, transparent 1px), linear-gradient(90deg, #1e293b 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        ></div>

        {/* Ethereal Glows */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-1/4 -left-1/4 w-full h-full bg-emerald-500/10 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2],
            x: [0, -100, 0],
            y: [0, 50, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-1/4 -right-1/4 w-full h-full bg-blue-500/10 rounded-full blur-[120px]"
        />
      </div>

      {/* Navigation Header */}
      <nav className="relative z-50 max-w-7xl mx-auto px-6 h-24 flex items-center justify-between border-b border-white/5 backdrop-blur-md bg-transparent">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
        >
          <div className="relative group p-1.5 bg-slate-900 border border-white/10 rounded-xl shadow-2xl overflow-hidden">
            <div className="absolute inset-0 bg-emerald-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            <Image
              src="/images/icon_monivo.webp"
              alt="Monivo Icon"
              width={34}
              height={34}
              className="relative z-10 w-8.5 h-8.5 object-contain"
            />
          </div>
          <span className="font-black text-2xl tracking-tighter text-white">
            MONIVO
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-4"
        >
          {session ? (
            <Link
              href="/dashboard"
              className="relative px-6 py-2.5 rounded-xl bg-emerald-500 text-slate-950 hover:bg-emerald-400 transition-all font-bold text-sm shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:scale-105 active:scale-95"
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/auth"
                className="hidden md:block text-sm font-bold text-slate-400 hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/auth"
                className="px-6 py-2.5 rounded-xl bg-white/10 border border-white/10 hover:bg-white/20 transition-all font-bold text-sm backdrop-blur-sm"
              >
                Get Started
              </Link>
            </>
          )}
        </motion.div>
      </nav>

      <main className="relative z-10">
        {/* Hero Section */}
        <motion.section
          style={{ scale: heroScale, opacity: heroOpacity }}
          className="max-w-7xl mx-auto px-6 pt-32 pb-48 flex flex-col items-center text-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8 p-1 rounded-full bg-linear-to-r from-emerald-500/20 to-blue-500/20 border border-white/10"
          >
            <div className="px-5 py-1.5 rounded-full bg-[#020617] flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-[10px] uppercase font-black tracking-widest text-emerald-400/80">
                Next-Gen Asset Authority
              </span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="text-6xl md:text-[7rem] font-black tracking-tight leading-[0.9] mb-8"
          >
            Refined{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-b from-white to-slate-500">
              Wealth
            </span>
            <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-400 via-emerald-200 to-emerald-500 animate-gradient-x">
              Engineering.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-lg md:text-2xl text-slate-400 max-w-3xl mx-auto leading-relaxed mb-12 font-medium"
          >
            Monivo orchestrates your entire financial ecosystem into a singular,
            high-fidelity experience. Precision tracking for the modern capital
            commander.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center gap-6"
          >
            <Link
              href={session ? "/dashboard" : "/auth"}
              className="group relative px-12 py-6 bg-white text-slate-950 rounded-2xl font-black text-xl flex items-center gap-4 transition-all duration-500 shadow-[0_0_50px_rgba(255,255,255,0.15)] hover:scale-105 hover:shadow-emerald-500/25 overflow-hidden"
            >
              <div className="absolute inset-0 bg-emerald-500 opacity-0 group-hover:opacity-10 transition-opacity" />
              <span>
                {session ? "Enter Command Center" : "Initialize Portfolio"}
              </span>
              <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-500" />
            </Link>
          </motion.div>
        </motion.section>

        {/* Bento-Style Showcase Section */}
        <section className="max-w-7xl mx-auto px-6 pb-40">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-12 gap-6"
          >
            {/* Header Column */}
            <motion.div
              variants={itemVariants}
              className="md:col-span-12 mb-12"
            >
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-6">
                The New{" "}
                <span className="text-emerald-500 underline decoration-emerald-500/30 underline-offset-8">
                  Standard
                </span>{" "}
                in Clarity.
              </h2>
              <p className="text-xl text-slate-400 max-w-xl">
                Every pixel engineered for zero-friction financial decision
                making.
              </p>
            </motion.div>

            {/* Main Feature - Dashboard */}
            <motion.div
              variants={itemVariants}
              className="md:col-span-8 group relative aspect-video md:aspect-auto md:h-[600px] rounded-4xl overflow-hidden bg-slate-900 border border-white/10 shadow-2xl"
            >
              <div className="absolute inset-0 bg-linear-to-br from-emerald-500/10 via-transparent to-blue-500/10 pointer-events-none z-10" />
              <Image
                src="/screenshot/dashboard.webp"
                alt="Monivo Dashboard"
                fill
                className="object-cover object-top group-hover:scale-[1.02] transition-transform duration-1000 ease-out p-1"
              />
              <div className="absolute bottom-0 left-0 right-0 p-10 bg-linear-to-t from-[#020617] to-transparent z-20">
                <div className="flex items-center gap-3 mb-2">
                  <Activity className="w-5 h-5 text-emerald-400" />
                  <span className="text-xs font-bold uppercase tracking-[0.3em] text-emerald-400">
                    Live Synthesis
                  </span>
                </div>
                <h4 className="text-3xl font-black">
                  Holistic Operational Overview
                </h4>
              </div>
            </motion.div>

            {/* Sidebar Feature - Accounts */}
            <motion.div
              variants={itemVariants}
              className="md:col-span-4 group relative aspect-square md:aspect-auto md:h-[600px] rounded-4xl overflow-hidden bg-slate-900 border border-white/10 shadow-2xl"
            >
              <div className="absolute inset-0 bg-linear-to-bl from-blue-500/10 to-transparent pointer-events-none z-10" />
              <Image
                src="/screenshot/accounts.webp"
                alt="Account Management"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-1000 ease-out p-1"
              />
              <div className="absolute bottom-0 left-0 right-0 p-10 bg-linear-to-t from-[#020617] to-transparent z-20">
                <CreditCard className="w-5 h-5 text-blue-400 mb-4" />
                <h4 className="text-2xl font-black">Liquidity Mapping</h4>
              </div>
            </motion.div>

            {/* Bottom Full Feature - Transactions */}
            <motion.div
              variants={itemVariants}
              className="md:col-span-12 group relative h-[400px] md:h-[500px] rounded-4xl overflow-hidden bg-slate-900 border border-white/10 shadow-2xl"
            >
              <div className="absolute inset-0 bg-linear-to-tr from-emerald-500/5 to-transparent pointer-events-none z-10" />
              <Image
                src="/screenshot/transactions.webp"
                alt="Transaction History"
                fill
                className="object-cover group-hover:scale-[1.01] transition-transform duration-1000 p-1"
              />
              <div className="absolute inset-0 bg-linear-to-r from-[#020617]/80 via-[#020617]/20 to-transparent z-20 flex flex-col justify-center p-12">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-px w-8 bg-emerald-500" />
                  <span className="text-xs font-bold uppercase tracking-[0.3em] text-emerald-500">
                    Atomic Precision
                  </span>
                </div>
                <h4 className="text-4xl font-black max-w-md">
                  Granular Transactional Intelligence
                </h4>
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* High-Performance Features */}
        <section className="max-w-7xl mx-auto px-6 py-40 border-t border-white/5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-8 leading-tight">
                Engineered for the <br />
                <span className="text-slate-400">Ambitious Curator.</span>
              </h2>
              <div className="space-y-12">
                {[
                  {
                    icon: Zap,
                    title: "Real-Time Velocity",
                    desc: "Instant data propagation across all nodes. Watch your net worth evolve as it happens.",
                    color: "emerald",
                  },
                  {
                    icon: Globe,
                    title: "Global Liquidity",
                    desc: "Manage assets across borders and currencies with unified command architecture.",
                    color: "blue",
                  },
                  {
                    icon: Lock,
                    title: "Fortified Sovereignty",
                    desc: "Your data is strictly yours. AES-256 encryption ensures total privacy at the core.",
                    color: "slate",
                  },
                ].map((f) => (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    key={f.title}
                    className="flex gap-6 group"
                  >
                    <div className="shrink-0 w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-emerald-500/50 group-hover:bg-emerald-500/5 transition-all">
                      <f.icon className="w-6 h-6 text-slate-200 group-hover:text-emerald-400" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold mb-2 text-white">
                        {f.title}
                      </h4>
                      <p className="text-slate-400 leading-relaxed font-medium">
                        {f.desc}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              className="relative aspect-square bg-linear-to-br from-emerald-500/10 to-transparent rounded-[3rem] border border-white/5 p-12 overflow-hidden"
            >
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
              <div className="relative h-full w-full flex items-center justify-center">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-emerald-500/20 blur-[100px] animate-pulse" />
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="w-full h-full border-2 border-dashed border-white/10 rounded-full flex items-center justify-center"
                >
                  <div className="w-2/3 h-2/3 border-2 border-dashed border-white/20 rounded-full flex items-center justify-center" />
                </motion.div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="p-8 rounded-[2.5rem] bg-slate-900 border border-white/20 shadow-2xl backdrop-blur-xl hover:scale-110 transition-transform duration-500">
                    <TrendingUp className="w-16 h-16 text-emerald-400" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Global Access Footer */}
        <footer className="relative bg-[#020617] border-t border-white/5 pt-32 pb-16 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-emerald-500/10 blur-[120px] pointer-events-none" />

          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-start gap-16 mb-24">
              <div className="max-w-sm">
                <div className="flex items-center gap-3 mb-6">
                  <Image
                    src="/images/icon_monivo.webp"
                    alt="Monivo Icon"
                    width={28}
                    height={28}
                    className="opacity-80"
                  />
                  <span className="font-black text-xl tracking-tighter">
                    MONIVO
                  </span>
                </div>
                <p className="text-slate-500 font-medium leading-relaxed">
                  The definitive platform for ultra high net worth individual
                  asset management and capital command.
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-16">
                <div>
                  <h5 className="text-xs font-black uppercase tracking-widest text-emerald-500 mb-6">
                    Governance
                  </h5>
                  <ul className="space-y-4 text-sm font-bold text-slate-400">
                    <li>
                      <Link
                        href="/about"
                        className="hover:text-white transition-colors"
                      >
                        About Us
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/privacy"
                        className="hover:text-white transition-colors"
                      >
                        Privacy Policy
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/terms"
                        className="hover:text-white transition-colors"
                      >
                        Terms of Service
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="pt-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
                &copy; {new Date().getFullYear()} Monivo Financial Systems.
                Operational Excellence.
              </p>
              <div className="flex items-center gap-4">
                <div className="h-[2px] w-8 bg-emerald-500/30" />
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
                  Curated by{" "}
                  <span className="text-emerald-500">Sultan Bransyah</span>
                </p>
              </div>
            </div>
          </div>
        </footer>
      </main>

      <style jsx global>{`
        @keyframes gradient-x {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 5s ease infinite;
        }
      `}</style>
    </div>
  );
}
