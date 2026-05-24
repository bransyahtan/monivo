import { getSession } from "@/lib/auth";
import {
  Activity,
  ArrowRight,
  PieChart,
  Shield,
  Sparkles,
  TrendingUp,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getSession();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-background text-text-primary overflow-x-hidden font-sans selection:bg-primary/30">
      {/* Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-primary/10 rounded-full blur-[150px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-secondary/5 rounded-full blur-[150px] animate-pulse delay-1000" />
      </div>

      {/* Navigation Header */}
      <nav className="relative z-50 max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-primary/10 border border-primary/20 rounded-lg">
            <Wallet className="w-5 h-5 text-primary" />
          </div>
          <span className="font-black text-xl tracking-tight">Monivo</span>
        </div>
        <Link
          href="/auth"
          className="px-5 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors font-bold text-sm cursor-pointer"
        >
          Sign In
        </Link>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32 flex flex-col items-center">
        {/* Hero Section */}
        <div className="text-center space-y-8 max-w-4xl relative">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold animate-in fade-in slide-in-from-top-4 duration-700">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Master Your Financial Future</span>
          </div>

          <h1 className="text-5xl md:text-8xl font-black tracking-tight leading-[1.1] animate-in fade-in slide-in-from-bottom-8 duration-700">
            Intelligent Wealth <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-primary-light">
              Command Center.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
            Monivo transforms how you manage money. Track assets, visualize
            insights, and secure your prosperity with our enterprise-grade
            dashboard tailored to your personal goals.
          </p>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-6 animate-in fade-in zoom-in duration-1000 delay-500">
            <Link
              href="/auth"
              className="group relative px-10 py-5 bg-primary hover:bg-primary-light text-background rounded-2xl font-black text-lg flex items-center gap-3 transition-all duration-300 shadow-[0_0_40px_rgba(55,184,155,0.3)] hover:scale-105 active:scale-95 overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 rotate-12" />
              <span>Launch Your Dashboard</span>
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-40 w-full animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-700">
          <div className="group p-10 rounded-[2.5rem] bg-surface/20 border border-white/5 backdrop-blur-xl hover:border-primary/40 transition-all duration-500 hover:-translate-y-2">
            <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-primary/20 transition-all">
              <TrendingUp className="w-7 h-7 text-primary" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Performance Tracking</h3>
            <p className="text-text-secondary leading-relaxed">
              Real-time visualization of your net worth and asset growth. Watch
              your wealth evolve with surgical precision.
            </p>
          </div>

          <div className="group p-10 rounded-[2.5rem] bg-surface/20 border border-white/5 backdrop-blur-xl hover:border-primary/40 transition-all duration-500 hover:-translate-y-2">
            <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-primary/20 transition-all">
              <PieChart className="w-7 h-7 text-primary" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Deep Analytics</h3>
            <p className="text-text-secondary leading-relaxed">
              AI-driven insights into your spending habits and category
              distributions. Discover exactly where your money goes.
            </p>
          </div>

          <div className="group p-10 rounded-[2.5rem] bg-surface/20 border border-white/5 backdrop-blur-xl hover:border-primary/40 transition-all duration-500 hover:-translate-y-2">
            <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-primary/20 transition-all">
              <Shield className="w-7 h-7 text-primary" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Privacy First</h3>
            <p className="text-text-secondary leading-relaxed">
              Your financial data is encrypted and isolated. We believe your
              assets are your business, and our security makes it so.
            </p>
          </div>
        </div>

        {/* Trust Section */}
        <div className="mt-40 text-center w-full max-w-4xl py-12 border-y border-white/5">
          <div className="flex flex-wrap justify-center gap-12 md:gap-24 opacity-30 grayscale hover:grayscale-0 transition-all duration-700">
            <div className="flex items-center gap-2 font-bold text-sm tracking-[0.2em]">
              <Activity className="w-5 h-5 text-primary" />
              BANK-GRADE
            </div>
            <div className="font-bold text-sm tracking-[0.2em]">ISO-27001</div>
            <div className="font-bold text-sm tracking-[0.2em]">AES-256</div>
            <div className="font-bold text-sm tracking-[0.2em]">
              SECURE-LOCK
            </div>
          </div>
        </div>

        <footer className="mt-40 text-center text-text-secondary">
          <p className="text-xs font-bold tracking-widest uppercase opacity-40">
            &copy; {new Date().getFullYear()} Monivo Financial Systems. All
            Rights Reserved.
          </p>
        </footer>
      </main>
    </div>
  );
}
