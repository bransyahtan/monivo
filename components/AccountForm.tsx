"use client";

import { AccountState, addAccount } from "@/app/actions/account";
import { Bank } from "@/lib/types/finance";
import { HelpCircle, Loader2, Plus, X } from "lucide-react";
import { useActionState, useEffect, useState } from "react";
import { CurrencyInput } from "./CurrencyInput";

interface AccountFormProps {
  banks: Bank[];
}

export const AccountForm = ({ banks }: AccountFormProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [state, action, isPending] = useActionState(addAccount, {
    success: false,
    message: "",
  } as AccountState);

  useEffect(() => {
    if (state.success) {
      setShowConfirm(false);
      const timer = setTimeout(() => setIsOpen(false), 0);
      return () => clearTimeout(timer);
    }
    if (state.message && !state.success) {
      setShowConfirm(false);
    }
  }, [state]);

  return (
    <div className="w-full">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="w-full py-4 rounded-2xl bg-surface/30 border border-white/5 hover:border-primary/50 text-text-primary font-bold flex items-center justify-center gap-2 transition-all duration-300 backdrop-blur-xl cursor-pointer"
        >
          <Plus className="w-5 h-5 text-primary" />
          Add New Account
        </button>
      ) : (
        <div className="p-8 rounded-4xl bg-surface/30 border border-white/10 backdrop-blur-xl shadow-2xl space-y-8 animate-in zoom-in duration-300">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-black text-text-primary tracking-tight uppercase">
                Asset Registration
              </h3>
              <p className="text-xs text-text-secondary mt-1">
                Initialize a new financial cluster in the registry.
              </p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-xl hover:bg-white/5 text-text-secondary transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form id="account-form" action={action} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2 md:col-span-1">
                <label className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em] px-1">
                  Account Identifier
                </label>
                <input
                  type="text"
                  name="account_name"
                  required
                  placeholder="e.g. Primary Savings"
                  className="w-full px-4 py-4 rounded-2xl bg-white/5 border border-white/10 text-text-primary focus:border-primary outline-none transition-all placeholder:text-text-secondary/30"
                />
                {state.errors?.account_name && (
                  <p className="text-[10px] text-red-500 font-bold px-1">
                    {state.errors.account_name[0]}
                  </p>
                )}
              </div>

              <div className="space-y-2 md:col-span-1">
                <label className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em] px-1">
                  Financial Institution
                </label>
                <div className="relative">
                  <select
                    name="bank_id"
                    required
                    className="w-full px-4 py-4 rounded-2xl bg-white/5 border border-white/10 text-text-primary focus:border-primary outline-none transition-all appearance-none cursor-pointer"
                  >
                    <option value="" className="bg-surface text-text-primary">
                      Select Institution
                    </option>
                    {banks.map((b) => (
                      <option
                        key={b.id}
                        value={b.id}
                        className="bg-surface text-text-primary"
                      >
                        {b.name} ({b.type.toUpperCase()})
                      </option>
                    ))}
                  </select>
                </div>
                {state.errors?.bank_id && (
                  <p className="text-[10px] text-red-500 font-bold px-1">
                    {state.errors.bank_id[0]}
                  </p>
                )}
              </div>

              <div className="space-y-2 md:col-span-1">
                <label className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em] px-1">
                  Opening Liquid Balance
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary font-black text-xs">
                    IDR
                  </span>
                  <CurrencyInput
                    name="balance"
                    required
                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/5 border border-white/10 text-text-primary focus:border-primary outline-none transition-all font-mono"
                  />
                </div>
                {state.errors?.balance && (
                  <p className="text-[10px] text-red-500 font-bold px-1">
                    {state.errors.balance[0]}
                  </p>
                )}
              </div>
            </div>

            {state.message && (
              <p
                className={`text-xs font-bold text-center ${state.success ? "text-primary" : "text-red-500"}`}
              >
                {state.message}
              </p>
            )}

            <button
              type="button"
              onClick={() => setShowConfirm(true)}
              disabled={isPending}
              className="w-full py-4 rounded-xl bg-primary hover:bg-primary-light text-background font-black transition-all flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-50"
            >
              {isPending ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                  Register Account
                </>
              )}
            </button>
          </form>
        </div>
      )}

      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="w-full max-w-sm p-8 rounded-[2.5rem] bg-surface border border-white/10 shadow-2xl space-y-6 animate-in zoom-in-95 duration-300">
            <div className="space-y-2 text-center">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4 border border-primary/30">
                <HelpCircle className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-black text-text-primary uppercase tracking-tight">
                Register Account?
              </h3>
              <p className="text-text-secondary text-sm">
                Make sure the balance and institution selected are correct
                before proceeding.
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
                form="account-form"
                type="submit"
                disabled={isPending}
                className="flex-1 py-4 rounded-2xl bg-primary text-background font-black hover:bg-primary-light transition-all shadow-lg shadow-primary/20 cursor-pointer disabled:opacity-50 flex items-center justify-center"
              >
                {isPending ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  "Yes, Register"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
