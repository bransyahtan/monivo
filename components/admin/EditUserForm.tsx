"use client";

import { useActionState, useEffect, useRef } from "react";
import { updateUser } from "@/app/actions/user";
import { Loader2, Save, X } from "lucide-react";
import Link from "next/link";

interface EditUserFormProps {
  userToEdit: {
    id: number;
    name: string;
    role: string;
  };
}

export const EditUserForm = ({ userToEdit }: EditUserFormProps) => {
  const formRef = useRef<HTMLFormElement>(null);
  const actionFn = updateUser.bind(null, userToEdit.id);
  const [state, formAction, isPending] = useActionState(actionFn, {
    success: false,
    message: "",
  });

  useEffect(() => {
    if (state?.success) {
      const params = new URLSearchParams(window.location.search);
      params.delete("editUser");
      const newSearch = params.toString();
      window.location.href = window.location.pathname + (newSearch ? `?${newSearch}` : "");
    }
  }, [state]);

  return (
    <form
      ref={formRef}
      action={formAction}
      className="space-y-4 bg-surface border border-white/5 p-6 rounded-xl w-full max-w-md"
    >
      <div>
        <h3 className="text-lg font-bold text-text-primary tracking-tight">
          Edit User Profile
        </h3>
        <p className="text-[11px] text-text-secondary mt-0.5 leading-normal">
          Modify administrative and general role permissions for this user.
        </p>
      </div>

      {state?.message && (
        <div
          className={`p-3 rounded-lg text-xs font-semibold transition-all ${
            state.success
              ? "bg-green-500/10 border border-green-500/20 text-green-400"
              : "bg-red-500/10 border border-red-500/20 text-red-400"
          }`}
        >
          {state.message}
        </div>
      )}

      <div className="space-y-4">
        <div className="space-y-1">
          <label
            htmlFor="name"
            className="text-[10px] text-text-secondary uppercase tracking-wider font-bold"
          >
            Full Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            defaultValue={userToEdit.name}
            className="w-full px-3 py-2 bg-background/40 border border-white/5 rounded-lg focus:border-primary focus:outline-none transition-all text-text-primary text-xs"
          />
        </div>

        <div className="space-y-1 relative">
          <label
            htmlFor="role"
            className="text-[10px] text-text-secondary uppercase tracking-wider font-bold"
          >
            System Role
          </label>
          <div className="relative">
            <select
              id="role"
              name="role"
              required
              defaultValue={userToEdit.role}
              className="w-full px-3 py-2 bg-background/40 border border-white/5 rounded-lg focus:border-primary focus:outline-none transition-all text-text-primary text-xs cursor-pointer appearance-none"
            >
              <option value="customer" className="bg-surface text-text-primary">
                Customer (Regular user)
              </option>
              <option value="admin" className="bg-surface text-text-primary">
                Administrator
              </option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-text-secondary">
              <svg className="fill-current h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <Link
          href="?tab=users"
          className="px-4 py-2 bg-white/5 border border-white/5 text-text-secondary hover:text-text-primary hover:bg-white/10 font-bold rounded-lg transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer text-xs"
        >
          <X className="w-3.5 h-3.5" />
          <span>Cancel</span>
        </Link>
        <button
          type="submit"
          disabled={isPending}
          className="flex-1 py-2.5 px-4 bg-primary hover:bg-primary/90 text-background font-bold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-xs"
        >
          {isPending ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Save className="w-3.5 h-3.5" />
              <span>Save Changes</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};
