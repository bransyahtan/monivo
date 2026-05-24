"use client";

import { registerUser } from "@/app/actions/auth";
import { RegisterState } from "@/types/auth";
import {
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  HelpCircle,
  Loader2,
  Lock,
  Mail,
  Phone,
  User,
} from "lucide-react";
import { useActionState, useEffect, useState } from "react";

interface RegisterFormProps {
  onToggle: () => void;
}

export const RegisterForm = ({ onToggle }: RegisterFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const [state, action, isPending] = useActionState(registerUser, {
    success: false,
    message: "",
  } as RegisterState);

  useEffect(() => {
    if (state.message || state.errors) {
      setTimeout(() => {
        setShowConfirmModal(false);
      }, 0);
    }
  }, [state]);

  useEffect(() => {
    if (state.success) {
      setTimeout(() => {
        onToggle();
      }, 2000);
    }
  }, [state, onToggle]);

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

      {/* Alert Error Umum */}
      {state.message && !state.success && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-2xl text-center flex items-center justify-center gap-2 animate-in shake-1 duration-300">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p className="text-sm font-medium">{state.message}</p>
        </div>
      )}

      {/* Alert Sukses */}
      {state.success && (
        <div className="bg-green-500/10 border border-green-500/50 text-green-500 p-4 rounded-2xl text-center flex items-center justify-center gap-2">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <p className="text-sm font-medium">{state.message} Redirecting...</p>
        </div>
      )}

      <form id="register-form" className="space-y-5" action={action}>
        {/* Full Name */}
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
              name="name"
              type="text"
              placeholder="John Doe"
              required
              className="w-full bg-surface/50 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all outline-hidden"
            />
          </div>
          {state.errors?.name && (
            <p className="text-xs text-red-400 mt-1 ml-1 font-medium italic">
              *{state.errors.name[0]}
            </p>
          )}
        </div>

        {/* Username */}
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
              name="username"
              type="text"
              placeholder="your_username"
              required
              className="w-full bg-surface/50 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all outline-hidden"
            />
          </div>
          {state.errors?.username && (
            <p className="text-xs text-red-400 mt-1 ml-1 font-medium italic">
              *{state.errors.username[0]}
            </p>
          )}
        </div>

        {/* Phone Number */}
        <div className="space-y-2">
          <label
            className="text-sm font-medium text-text-secondary ml-1"
            htmlFor="phone_number"
          >
            Phone Number
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-text-secondary group-focus-within:text-primary transition-colors">
              <Phone className="w-5 h-5" />
            </div>
            <input
              id="phone_number"
              name="phone_number"
              type="text"
              placeholder="0823......."
              className="w-full bg-surface/50 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all outline-hidden"
            />
          </div>
          {state.errors?.phone_number && (
            <p className="text-xs text-red-400 mt-1 ml-1 font-medium italic">
              *{state.errors.phone_number[0]}
            </p>
          )}
        </div>

        {/* Email Address */}
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
              name="email"
              type="email"
              placeholder="name@example.com"
              required
              className="w-full bg-surface/50 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all outline-hidden"
            />
          </div>
          {state.errors?.email && (
            <p className="text-xs text-red-400 mt-1 ml-1 font-medium italic">
              *{state.errors.email[0]}
            </p>
          )}
        </div>

        {/* Password */}
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
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              required
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
          {state.errors?.password && (
            <p className="text-xs text-red-400 mt-1 ml-1 font-medium italic">
              *{state.errors.password[0]}
            </p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="space-y-2">
          <label
            className="text-sm font-medium text-text-secondary ml-1"
            htmlFor="confirmPassword"
          >
            Confirm Password
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-text-secondary group-focus-within:text-primary transition-colors">
              <Lock className="w-5 h-5" />
            </div>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              required
              className="w-full bg-surface/50 border border-white/10 rounded-2xl py-4 pl-12 pr-12 text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all outline-hidden"
            />
          </div>
          {state.errors?.confirmPassword && (
            <p className="text-xs text-red-400 mt-1 ml-1 font-medium italic">
              *{state.errors.confirmPassword[0]}
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={() => setShowConfirmModal(true)}
          disabled={isPending}
          className="w-full bg-primary hover:bg-primary-light text-background font-bold py-4 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-primary/20 cursor-pointer flex items-center justify-center gap-2"
        >
          {isPending ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Processing...
            </>
          ) : (
            "Create Account"
          )}
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

      {/* --- CONFIRMATION MODAL --- */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="w-full max-w-sm p-8 rounded-3xl bg-surface border border-white/10 shadow-2xl space-y-6 animate-in zoom-in-95 duration-300">
            <div className="space-y-2 text-center">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4 border border-primary/30">
                <HelpCircle className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-text-primary">
                Confirmation
              </h3>
              <p className="text-text-secondary text-balance">
                Are you sure the data you entered is correct?
              </p>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                disabled={isPending}
                className="flex-1 py-3 rounded-xl border border-white/10 text-text-secondary hover:bg-white/5 transition-colors font-medium cursor-pointer disabled:opacity-50"
              >
                Review
              </button>
              <button
                form="register-form"
                type="submit"
                disabled={isPending}
                className="flex-1 py-3 rounded-xl bg-primary text-background font-bold hover:bg-primary-light transition-all shadow-lg shadow-primary/20 cursor-pointer disabled:opacity-50 flex items-center justify-center"
              >
                {isPending ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  "Yes, Submit"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
