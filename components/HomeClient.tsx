"use client";

import { UserSession } from "@/types/user";
import { motion } from "framer-motion";
import {
  Activity,
  ArrowRight,
  PieChart,
  Shield,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface HomeClientProps {
  session: UserSession | null;
}

export default function HomeClient({ session }: HomeClientProps) {
  return (
    <div className="min-h-screen bg-background text-text-primary overflow-x-hidden font-sans selection:bg-primary/30">
      {/* Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
          className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-primary/10 rounded-full blur-[150px]"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 1,
          }}
          className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-secondary/5 rounded-full blur-[150px]"
        />
      </div>

      {/* Navigation Header */}
      <nav className="relative z-50 max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2.5"
        >
          <div className="p-1 bg-surface border border-white/5 rounded-lg shadow-lg shadow-primary/5">
            <Image
              src="/images/icon_monivo.png"
              alt="Monivo Icon"
              width={32}
              height={32}
              className="w-8 h-8 object-contain"
            />
          </div>
          <span className="font-bold text-xl tracking-tight">Monivo</span>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          {session ? (
            <Link
              href="/dashboard"
              className="px-5 py-2 rounded-xl bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20 transition-colors font-bold text-sm cursor-pointer"
            >
              Go to Dashboard
            </Link>
          ) : (
            <Link
              href="/auth"
              className="px-5 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors font-bold text-sm cursor-pointer"
            >
              Sign In
            </Link>
          )}
        </motion.div>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32 flex flex-col items-center">
        {/* Hero Section */}
        <div className="text-center space-y-8 max-w-4xl relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Professional Portfolio Oversight</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-8xl font-black tracking-tight leading-[1.1]"
          >
            Unified Financial <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-primary-light">
              Management Suite.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed"
          >
            Monivo provides a professional-grade environment for tracking
            personal assets and managing transactions. Maintain total control
            over your financial ecosystem through clear data visualization and
            secure record-keeping.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <Link
              href={session ? "/dashboard" : "/auth"}
              className="group relative px-10 py-5 bg-primary hover:bg-primary-light text-background rounded-2xl font-black text-lg flex items-center gap-3 transition-all duration-300 shadow-[0_0_40px_rgba(55,184,155,0.3)] hover:scale-105 active:scale-95 overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 rotate-12" />
              <span>
                {session ? "Launch Dashboard" : "Access Your Dashboard"}
              </span>
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-40 w-full">
          {[
            {
              icon: TrendingUp,
              title: "Portfolio Tracking",
              desc: "Consolidated views of your accounts and total net worth. Track balance movements across diverse asset sources with reliable accuracy.",
            },
            {
              icon: PieChart,
              title: "Financial Insights",
              desc: "Detailed breakdown of income and spending categories. Gain a clearer understanding of your cash flow distribution patterns.",
            },
            {
              icon: Shield,
              title: "Data Security",
              desc: "Designed with privacy as a priority. Your personal financial records remain encrypted and exclusive to your authorized access.",
            },
          ].map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group p-10 rounded-[2.5rem] bg-surface/20 border border-white/5 backdrop-blur-xl hover:border-primary/40 transition-all duration-500 hover:-translate-y-2"
            >
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-primary/20 transition-all">
                <feature.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
              <p className="text-text-secondary leading-relaxed">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Trust Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-40 text-center w-full max-w-4xl py-12 border-y border-white/5"
        >
          <div className="flex flex-wrap justify-center gap-12 md:gap-24 opacity-30 grayscale hover:grayscale-0 transition-all duration-700">
            {[
              "SYSTEM-STABLE",
              "ISO-COMPLIANT",
              "AES-ENCRYPTED",
              "PRIVATE-ACCESS",
            ].map((label, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={
                  i === 0
                    ? "flex items-center gap-2 font-bold text-sm tracking-[0.2em]"
                    : "font-bold text-sm tracking-[0.2em]"
                }
              >
                {i === 0 && <Activity className="w-5 h-5 text-primary" />}
                {label}
              </motion.div>
            ))}
          </div>
        </motion.div>

        <footer className="mt-40 text-center text-text-secondary space-y-4">
          <p className="text-xs font-bold tracking-widest uppercase opacity-40">
            &copy; {new Date().getFullYear()} Monivo Financial Systems. All
            Rights Reserved.
          </p>
          <div className="flex flex-col items-center gap-2">
            <div className="h-px w-12 bg-primary/20" />
            <p className="text-[10px] font-medium tracking-loose opacity-60">
              Handcrafted by{" "}
              <span className="text-primary font-bold">Sultan Bransyah</span>
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}
