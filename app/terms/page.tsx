"use client";

import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background text-text-primary px-6 py-20 font-sans">
      <div className="max-w-4xl mx-auto space-y-12">
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
            className="text-4xl md:text-5xl font-black tracking-tight"
          >
            Terms of Use
          </motion.h1>
          <p className="text-text-secondary">Effective Date: May 24, 2026</p>
        </section>

        <div className="space-y-10 text-text-secondary leading-relaxed">
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-text-primary">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing and using Monivo, you agree to comply with and be
              bound by these Terms of Use. If you do not agree, please do not
              use the service.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-text-primary">
              2. User Accounts
            </h2>
            <p>
              You are responsible for maintaining the confidentiality of your
              account credentials and for all activities that occur under your
              account.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-text-primary">
              3. Prohibited Use
            </h2>
            <p>
              You may not use Monivo for any illegal activities or to infringe
              upon the rights of others. Unauthorized attempts to access the
              system or data are strictly prohibited.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-text-primary">
              4. Limitation of Liability
            </h2>
            <p>
              Monivo provides tools for financial tracking but is not a licensed
              financial advisor. We are not liable for any financial decisions
              made based on the data provided by the application.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
