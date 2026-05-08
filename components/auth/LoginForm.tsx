"use client";

import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";

interface LoginFormProps {
  onToggle: () => void;
}

export const LoginForm = ({ onToggle }: LoginFormProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="space-y-2 text-center lg:text-left">
        <h2 className="text-4xl font-bold text-text-primary tracking-tight">Welcome Back</h2>
        <p className="text-text-secondary text-lg">Please enter your details to sign in.</p>
      </div>

      <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
        <div className="space-y-2">
          <label className="text-sm font-medium text-text-secondary ml-1" htmlFor="email">
            Email Address
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-text-secondary group-focus-within:text-primary transition-colors">
              <Mail className="w-5 h-5" />
            </div>
            <input
              id="email"
              type="email"
              placeholder="name@example.com"
              className="w-full bg-surface/50 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all outline-hidden"
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center ml-1">
            <label className="text-sm font-medium text-text-secondary" htmlFor="password">
              Password
            </label>
            <button type="button" className="text-xs text-primary hover:text-primary-light transition-colors cursor-pointer">
              Forgot password?
            </button>
          </div>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-text-secondary group-focus-within:text-primary transition-colors">
              <Lock className="w-5 h-5" />
            </div>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className="w-full bg-surface/50 border border-white/10 rounded-2xl py-4 pl-12 pr-12 text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all outline-hidden"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-text-secondary hover:text-primary transition-colors cursor-pointer"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-2 ml-1">
          <input
            type="checkbox"
            id="remember"
            className="w-4 h-4 rounded border-white/10 bg-surface/50 text-primary focus:ring-primary cursor-pointer"
          />
          <label htmlFor="remember" className="text-sm text-text-secondary cursor-pointer">
            Remember for 30 days
          </label>
        </div>

        <button className="w-full bg-primary hover:bg-primary-light text-background font-bold py-4 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-primary/20 cursor-pointer">
          Sign In
        </button>
      </form>

      <p className="text-center text-text-secondary">
        Don't have an account?{" "}
        <button
          onClick={onToggle}
          className="text-primary font-bold hover:text-primary-light transition-colors cursor-pointer"
        >
          Create account
        </button>
      </p>
    </div>
  );
};
