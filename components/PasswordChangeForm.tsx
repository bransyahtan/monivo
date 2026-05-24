"use client";

import { ProfileState, updatePassword } from "@/app/actions/user";
import { Eye, EyeOff, HelpCircle, Loader2, ShieldCheck } from "lucide-react";
import { useActionState, useEffect, useState } from "react";

export const PasswordChangeForm = () => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [state, action, isPending] = useActionState(updatePassword, {
    success: false,
    message: "",
  } as ProfileState);

  useEffect(() => {
    if (state.success || state.message) {
      setTimeout(() => setShowConfirm(false), 0);
    }
  }, [state.success, state.message]);

  const [show, setShow] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const toggle = (field: "current" | "new" | "confirm") =>
    setShow((prev) => ({ ...prev, [field]: !prev[field] }));

  const fields = [
    {
      key: "current",
      name: "current_password",
      label: "Current Password",
      placeholder: "Enter current password",
    },
    {
      key: "new",
      name: "new_password",
      label: "New Password",
      placeholder: "Min. 8 characters",
    },
    {
      key: "confirm",
      name: "confirm_password",
      label: "Confirm New Password",
      placeholder: "Repeat new password",
    },
  ] as const;

  return (
    <>
      <form
        id="password-form"
        action={action}
        className="p-8 rounded-4xl bg-surface/30 border border-white/5 backdrop-blur-xl shadow-xl space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {fields.map(({ key, name, label, placeholder }) => (
            <div key={key} className="space-y-2">
              <label className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em] px-1">
                {label}
              </label>
              <div className="relative">
                <input
                  type={show[key] ? "text" : "password"}
                  name={name}
                  required
                  placeholder={placeholder}
                  className="w-full px-5 py-4 pr-12 rounded-2xl bg-white/5 border border-white/10 text-text-primary focus:border-primary outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => toggle(key)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
                >
                  {show[key] ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Password strength hint */}
        <p className="text-[10px] text-text-secondary opacity-50 px-1">
          Password must be at least 8 characters. Use a mix of letters, numbers,
          and symbols for stronger security.
        </p>

        {state?.message && (
          <p
            className={`text-xs font-bold text-center ${state.success ? "text-primary" : "text-red-400"}`}
          >
            {state.message}
          </p>
        )}

        <button
          type="button"
          onClick={() => setShowConfirm(true)}
          disabled={isPending}
          className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-primary hover:border-primary hover:text-background text-text-primary font-black flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer group"
        >
          {isPending ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <ShieldCheck className="w-5 h-5" />
              Update Password
            </>
          )}
        </button>
      </form>

      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="w-full max-w-sm p-8 rounded-[2.5rem] bg-surface border border-white/10 shadow-2xl space-y-6 animate-in zoom-in-95 duration-300">
            <div className="space-y-2 text-center">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4 border border-primary/30">
                <HelpCircle className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-black text-text-primary uppercase tracking-tight">
                Update Password?
              </h3>
              <p className="text-text-secondary text-sm">
                Are you sure you want to change your login password?
              </p>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowConfirm(false)}
                disabled={isPending}
                className="flex-1 py-4 rounded-2xl border border-white/10 text-text-secondary hover:bg-white/5 transition-colors font-bold cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                form="password-form"
                type="submit"
                disabled={isPending}
                className="flex-1 py-4 rounded-2xl bg-primary text-background font-black hover:bg-primary-light transition-all shadow-lg shadow-primary/20 cursor-pointer disabled:opacity-50 flex items-center justify-center"
              >
                {isPending ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  "Yes, Update"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
