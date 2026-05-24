"use client";

import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function PrivacyPage() {
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
            Privacy Policy
          </motion.h1>
          <p className="text-text-secondary">Last Updated: May 24, 2026</p>
        </section>

        <div className="space-y-10 text-text-secondary leading-relaxed">
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-text-primary">
              1. Data Collection
            </h2>
            <p>
              We collect your name, email address, and financial records (such
              as transactions and account balances) that you explicitly provide.
              This data is used solely to provide and improve the Monivo
              service.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-text-primary">
              2. Security
            </h2>
            <p>
              Security is our top priority. We use AES-256 encryption and
              JWT-based secure sessions to ensure that your data is protected
              during transmission and at rest.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-text-primary">
              3. Third-Party Access
            </h2>
            <p>
              We do not sell, trade, or otherwise transfer your personally
              identifiable information to outside parties. Your data is strictly
              used for your own analysis and tracking within the application.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-text-primary">
              4. Your Rights
            </h2>
            <p>
              You have the right to access, correct, or delete your personal
              data at any time. You can manage your profile settings directly
              through the application dashboard.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
