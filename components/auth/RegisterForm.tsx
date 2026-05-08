"use client";

import { Eye, EyeOff, Lock, Mail, Phone, User } from "lucide-react";
import { useState } from "react";

interface RegisterFormProps {
  onToggle: () => void;
}

export const RegisterForm = ({ onToggle }: RegisterFormProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="space-y-2 text-center lg:text-left">
        <h2 className="text-4xl font-bold text-text-primary tracking-tight">
          Create Account
        </h2>
        <p className="text-text-secondary text-lg">
          Join Monivo and start your financial journey.
        </p>
      </div>

      <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
        <div className="space-y-2">
          <label
            className="text-sm font-medium text-text-secondary ml-1"
            htmlFor="name"
          >
            Full Name
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-text-secondary group-focus-within:text-primary transition-colors">
              <User className="w-5 h-5" />
            </div>
            <input
              id="name"
              type="text"
              placeholder="John Doe"
              className="w-full bg-surface/50 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all outline-hidden"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label
            className="text-sm font-medium text-text-secondary ml-1"
            htmlFor="username"
          >
            Username
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-text-secondary group-focus-within:text-primary transition-colors">
              <User className="w-5 h-5" />
            </div>
            <input
              id="username"
              type="username"
              placeholder="Username"
              className="w-full bg-surface/50 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all outline-hidden"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label
            className="text-sm font-medium text-text-secondary ml-1"
            htmlFor="phone"
          >
            Phone Number
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-text-secondary group-focus-within:text-primary transition-colors">
              <Phone className="w-5 h-5" />
            </div>
            <input
              id="phone"
              type="text"
              placeholder="0823......."
              className="w-full bg-surface/50 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all outline-hidden"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label
            className="text-sm font-medium text-text-secondary ml-1"
            htmlFor="email"
          >
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
          <label
            className="text-sm font-medium text-text-secondary ml-1"
            htmlFor="password"
          >
            Password
          </label>
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
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <label
            className="text-sm font-medium text-text-secondary ml-1"
            htmlFor="password-confirmation"
          >
            Confirm Password
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-text-secondary group-focus-within:text-primary transition-colors">
              <Lock className="w-5 h-5" />
            </div>
            <input
              id="password-confirmation"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className="w-full bg-surface/50 border border-white/10 rounded-2xl py-4 pl-12 pr-12 text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all outline-hidden"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-text-secondary hover:text-primary transition-colors cursor-pointer"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        <div className="text-xs text-text-secondary px-1 py-1">
          By signing up, you agree to our{" "}
          <button
            type="button"
            className="text-primary hover:underline cursor-pointer"
          >
            Terms of Service
          </button>{" "}
          and{" "}
          <button
            type="button"
            className="text-primary hover:underline cursor-pointer"
          >
            Privacy Policy
          </button>
          .
        </div>

        <button className="w-full bg-primary hover:bg-primary-light text-background font-bold py-4 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-primary/20 cursor-pointer">
          Create Account
        </button>
      </form>

      <p className="text-center text-text-secondary">
        Already have an account?{" "}
        <button
          onClick={onToggle}
          className="text-primary font-bold hover:text-primary-light transition-colors cursor-pointer"
        >
          Sign in
        </button>
      </p>
    </div>
  );
};
