"use client";

import { LoginForm } from "@/components/auth/LoginForm";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { Wallet } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export const AuthPageContainer = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="flex min-h-screen bg-background overflow-x-hidden relative font-sans">
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-secondary/5 rounded-full blur-[120px]" />
      </div>

      <div className="flex w-full min-h-screen relative z-10 flex-col lg:flex-row">
        <div
          className={`w-full lg:w-1/2 flex flex-col justify-between p-8 lg:p-16 transition-all duration-1000 ease-in-out z-20 lg:z-10 min-h-screen lg:min-h-0 ${
            isLogin ? "lg:translate-x-0" : "lg:translate-x-full"
          }`}
        >
          <div className="flex items-center gap-3 mb-12 relative z-30">
            <div className="p-1.5 bg-surface border border-white/5 rounded-xl shadow-lg shadow-primary/5 flex items-center justify-center">
              <Image
                src="/image/icon_monivo.png"
                alt="Monivo Logo"
                width={36}
                height={36}
                className="object-contain"
              />
            </div>
            <span className="text-3xl font-bold text-text-primary tracking-tight">
              Monivo
            </span>
          </div>

          <div className="flex-1 flex items-center justify-center relative z-30 py-8 lg:py-0">
            <div className="w-full">
              {isLogin ? (
                <LoginForm onToggle={() => setIsLogin(false)} />
              ) : (
                <RegisterForm onToggle={() => setIsLogin(true)} />
              )}
            </div>
          </div>

          <div className="mt-12 text-sm text-text-secondary text-center lg:text-left relative z-30">
            © 2026 Monivo. Smart financial management.
          </div>
        </div>

        <div
          className={`hidden lg:block lg:w-1/2 relative transition-all duration-1000 ease-in-out h-screen overflow-hidden ${
            isLogin ? "lg:translate-x-0" : "lg:-translate-x-full"
          }`}
        >
          <div
            className={`absolute inset-0 transition-opacity duration-1000 ${isLogin ? "opacity-100" : "opacity-0"}`}
          >
            <Image
              src="/images/auth-bg.png"
              alt="Monivo Login"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-linear-to-t from-background/90 via-background/20 to-transparent z-10" />

            <div className="absolute bottom-20 left-20 right-20 z-20 p-10 rounded-3xl bg-surface/30 backdrop-blur-xl border border-white/10 shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-1000">
              <h3 className="text-2xl font-bold text-text-primary mb-3">
                Master Your Portfolio
              </h3>
              <p className="text-text-secondary text-lg leading-relaxed italic">
                "Monivo transformed how I track my investments. The real-time
                insights are a game changer for my financial freedom."
              </p>
              <div className="mt-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
                  <Wallet className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <div className="text-base font-bold text-text-primary">
                    Alex Rivera
                  </div>
                  <div className="text-sm text-text-secondary">
                    Portfolio Manager
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            className={`absolute inset-0 transition-opacity duration-1000 ${!isLogin ? "opacity-100" : "opacity-0"}`}
          >
            <Image
              src="/images/register-bg.png"
              alt="Monivo Register"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-background/90 via-background/20 to-transparent z-10" />

            <div className="absolute bottom-20 left-20 right-20 z-20 p-10 rounded-3xl bg-surface/30 backdrop-blur-xl border border-white/10 shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-1000">
              <h3 className="text-2xl font-bold text-text-primary mb-3">
                Join the Future
              </h3>
              <p className="text-text-secondary text-lg leading-relaxed italic">
                "Signing up was the best decision for my savings. The community
                and tools here are second to none."
              </p>
              <div className="mt-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center border border-secondary/30">
                  <div className="w-4 h-4 rounded-full bg-secondary" />
                </div>
                <div>
                  <div className="text-base font-bold text-text-primary">
                    Sarah Chen
                  </div>
                  <div className="text-sm text-text-secondary">
                    Tech Entrepreneur
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
