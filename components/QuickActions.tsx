"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export const QuickActions = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="card-formal p-5 flex flex-col sm:flex-row items-center justify-between gap-4"
    >
      <div className="text-left w-full sm:w-auto px-2">
        <span className="text-[10px] font-bold text-text-secondary uppercase tracking-[0.2em] block">
          Operational Center
        </span>
        <h3 className="text-sm font-semibold text-text-primary mt-1">
          Fast Access Controls
        </h3>
      </div>

      <div className="grid grid-cols-3 gap-3 w-full sm:w-auto sm:flex sm:items-center">
        {[
          { label: "Add Record", href: "/transactions" },
          { label: "New Asset", href: "/accounts" },
          { label: "Transfer", href: "/transfers" },
        ].map((action) => (
          <motion.div
            key={action.label}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex-1 sm:flex-none"
          >
            <Link
              href={action.href}
              className="w-full px-5 py-2.5 rounded-lg border border-border bg-white/3 hover:bg-primary text-text-primary hover:text-background text-[12px] font-semibold tracking-wide transition-all duration-200 text-center block"
            >
              {action.label}
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
