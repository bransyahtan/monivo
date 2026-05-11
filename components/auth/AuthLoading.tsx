"use client";

import { Wallet } from "lucide-react";
import Link from "next/link";

export const AuthLoading = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden font-sans">
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-primary/10 rounded-full blur-[150px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-secondary/5 rounded-full blur-[150px] animate-pulse delay-700" />
      </div>

      <div className="relative z-10 flex flex-col items-center">
        <div className="relative mb-12">
          <div className="absolute inset-0 bg-primary/20 rounded-3xl blur-2xl animate-pulse scale-150" />
          <div className="relative p-5 bg-surface border border-primary/20 rounded-4xl shadow-2xl shadow-primary/10">
            <Wallet className="w-12 h-12 text-primary" />
          </div>

          <div className="absolute inset-[-10px] border-2 border-primary/10 rounded-[2.5rem]" />
          <div className="absolute inset-[-10px] border-2 border-primary border-t-transparent rounded-[2.5rem] animate-spin" />
        </div>

        <div className="text-center space-y-4 mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h2 className="text-3xl font-bold text-text-primary tracking-tight">
            Preparing your vault
          </h2>
          <p className="text-text-secondary max-w-[280px] mx-auto leading-relaxed">
            Synchronizing your assets and securing your financial workspace...
          </p>
        </div>
        <Link
          href="/auth"
          className="group relative px-8 py-4 bg-surface hover:bg-surface-light border border-white/10 rounded-2xl transition-all duration-300 hover:scale-105 active:scale-95 shadow-xl"
        >
          <span className="relative z-10 flex items-center gap-3 text-text-primary font-semibold">
            Take me to Login
            <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary transition-colors">
              <svg
                className="w-3 h-3 text-primary group-hover:text-background transition-colors"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </span>
        </Link>

        <div className="mt-16 text-[10px] uppercase tracking-[0.3em] text-text-secondary/40 font-bold">
          Monivo Security Protocol v2.4
        </div>
      </div>

      <style jsx>{`
        @keyframes progress {
          0% {
            transform: translateX(-100%);
          }
          50% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(-100%);
          }
        }
      `}</style>
    </div>
  );
};
