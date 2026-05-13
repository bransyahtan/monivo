"use client";

import { loginUser } from "@/app/actions/auth";
import { Eye, EyeOff, Loader2, Lock, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";

interface LoginFormProps {
  onToggle: () => void;
}

export const LoginForm = ({ onToggle }: LoginFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const [state, action, isPending] = useActionState(loginUser, {});

  useEffect(() => {
    if (state.success) {
      setTimeout(() => {
        router.push("/");
      }, 1000);
    }
  }, [state, router]);

  return (
    <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="space-y-2 text-center lg:text-left">
        <h2 className="text-4xl font-bold text-text-primary tracking-tight">
          Welcome Back
        </h2>
        <p className="text-text-secondary text-lg">
          Please enter your details to sign in.
        </p>
      </div>

      {state.message && (
        <div
          className={`p-4 rounded-2xl text-center border ${
            state.success
              ? "bg-green-500/10 border-green-500/50 text-green-500"
              : "bg-red-500/10 border-red-500/50 text-red-500"
          }`}
        >
          {state.message} {state.success && "Redirecting..."}
        </div>
      )}

      <form className="space-y-6" action={action}>
        <div className="space-y-2">
          <label
            className="text-sm font-medium text-text-secondary ml-1"
            htmlFor="identifier"
          >
            Username or Email
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-text-secondary group-focus-within:text-primary transition-colors">
              <User className="w-5 h-5" />
            </div>
            <input
              id="identifier"
              name="identifier"
              type="text"
              placeholder="username or email"
              required
              className="w-full bg-surface/50 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all outline-hidden"
            />
          </div>
          {state.errors?.identifier && (
            <p className="text-xs text-red-500 ml-1">
              {state.errors.identifier[0]}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center ml-1">
            <label
              className="text-sm font-medium text-text-secondary"
              htmlFor="password"
            >
              Password
            </label>
            <button
              type="button"
              className="text-xs text-primary hover:text-primary-light transition-colors cursor-pointer"
            >
              Forgot password?
            </button>
          </div>
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
            <p className="text-xs text-red-500 ml-1">
              {state.errors.password[0]}
            </p>
          )}
        </div>

        <div className="flex items-center space-x-2 ml-1">
          <input
            type="checkbox"
            id="remember"
            className="w-4 h-4 rounded border-white/10 bg-surface/50 text-primary focus:ring-primary cursor-pointer"
          />
          <label
            htmlFor="remember"
            className="text-sm text-text-secondary cursor-pointer"
          >
            Remember for 30 days
          </label>
        </div>

        <button
          disabled={isPending}
          className="w-full bg-primary hover:bg-primary-light text-background font-bold py-4 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-primary/20 cursor-pointer flex items-center justify-center gap-2"
        >
          {isPending ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Signing in...
            </>
          ) : (
            "Sign In"
          )}
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
