"use client";

import { motion } from "framer-motion";
import { ArrowLeft, ShieldCheck, Target, Users } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-text-primary px-6 py-20 font-sans">
      <div className="max-w-4xl mx-auto space-y-16">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-primary hover:text-primary-light transition-colors font-bold mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Home
        </Link>

        <section className="space-y-6">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-black tracking-tight"
          >
            About <span className="text-primary">Monivo</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-text-secondary leading-relaxed"
          >
            Monivo is a premium financial management suite built for individuals
            who take their personal finances seriously. We believe that clarity
            is the first step toward financial freedom.
          </motion.p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: Target,
              title: "Our Mission",
              desc: "To empower users with professional-grade tools to track, analyze, and optimize their financial ecosystem.",
            },
            {
              icon: ShieldCheck,
              title: "Our Values",
              desc: "Privacy, security, and integrity. Your financial data is yours alone, and we keep it that way through encryption.",
            },
            {
              icon: Users,
              title: "Our Community",
              desc: "Built for the meticulous, the planners, and the dreamers who want a clear view of their financial horizon.",
            },
          ].map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className="p-8 rounded-3xl bg-surface/30 border border-white/5"
            >
              <item.icon className="w-10 h-10 text-primary mb-6" />
              <h3 className="text-xl font-bold mb-4">{item.title}</h3>
              <p className="text-text-secondary">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        <section className="pt-20 border-t border-white/5 space-y-8">
          <h2 className="text-3xl font-bold">The Vision</h2>
          <p className="text-text-secondary leading-relaxed italic">
            "Financial management shouldn't feel like a chore. It should feel
            like high-performance engineering for your life. We built Monivo to
            give YOU the dashboard you deserve."
          </p>
          <p className="font-bold text-primary">— Sultan Bransyah, Founder</p>
        </section>
      </div>
    </div>
  );
}
