"use client";

import { ProfileState, updateProfile } from "@/app/actions/user";
import { HelpCircle, Loader2, Save } from "lucide-react";
import { useActionState, useEffect, useState } from "react";

import { UserProfile } from "@/types/user";

export const ProfileEditForm = ({ profile }: { profile: UserProfile }) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [state, action, isPending] = useActionState(updateProfile, {
    success: false,
    message: "",
  } as ProfileState);

  useEffect(() => {
    if (state.success || state.message) {
      setTimeout(() => setShowConfirm(false), 0);
    }
  }, [state.success, state.message]);

  return (
    <>
      <form
        id="profile-form"
        action={action}
        className="p-8 rounded-4xl bg-surface/30 border border-white/5 backdrop-blur-xl shadow-xl space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em] px-1">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              defaultValue={profile.name}
              required
              className="w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/10 text-text-primary focus:border-primary outline-none transition-all"
              placeholder="Your full name"
            />
          </div>

          {/* Username */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em] px-1">
              Username
            </label>
            <input
              type="text"
              name="username"
              defaultValue={profile.username}
              required
              className="w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/10 text-text-primary focus:border-primary outline-none transition-all"
              placeholder="@username"
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em] px-1">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              defaultValue={profile.email}
              required
              className="w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/10 text-text-primary focus:border-primary outline-none transition-all"
              placeholder="email@example.com"
            />
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em] px-1">
              Phone Number <span className="opacity-40">(optional)</span>
            </label>
            <input
              type="tel"
              name="phone_number"
              defaultValue={profile.phone_number ?? ""}
              className="w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/10 text-text-primary focus:border-primary outline-none transition-all"
              placeholder="+62 ..."
            />
          </div>
        </div>

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
          className="w-full py-4 rounded-2xl bg-primary hover:bg-primary-light text-background font-black flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
        >
          {isPending ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <Save className="w-5 h-5" />
              Save Changes
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
                Update Profile?
              </h3>
              <p className="text-text-secondary text-sm">
                Are you sure you want to save these changes to your profile?
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
                form="profile-form"
                type="submit"
                disabled={isPending}
                className="flex-1 py-4 rounded-2xl bg-primary text-background font-black hover:bg-primary-light transition-all shadow-lg shadow-primary/20 cursor-pointer disabled:opacity-50 flex items-center justify-center"
              >
                {isPending ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  "Yes, Save"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
