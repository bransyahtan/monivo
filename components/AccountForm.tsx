"use client";

import { AccountState, addAccount } from "@/app/actions/account";
import { Bank } from "@/types/finance";
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
      setTimeout(() => {
        setShowConfirm(false);
        setIsOpen(false);
      }, 0);
    } else if (state.message) {
      setTimeout(() => setShowConfirm(false), 0);
    }
  }, [state.success, state.message]);

  return (
    <div className="w-full">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="w-full btn-primary py-5 rounded-2xl shadow-lg border border-primary/20"
        >
          <Plus className="w-5 h-5 text-background" />
          <span>Register New Liquidity Cluster</span>
        </button>
      ) : (
        <div className="card-formal p-6 md:p-8 space-y-6 animate-in zoom-in duration-300">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div>
              <h3 className="text-lg font-semibold text-text-primary uppercase tracking-tight">
                Asset Allocation
              </h3>
              <p className="text-[11px] text-text-secondary mt-1 font-medium">
                Internal Registry: Liquidity Source Inception
              </p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-lg hover:bg-white/5 text-text-secondary transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form id="account-form" action={action} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest pl-1">
                  Cluster Nomenclature
                </label>
                <input
                  type="text"
                  name="account_name"
                  required
                  placeholder="e.g. Primary Operational Fund"
                  className="input-formal w-full"
                />
                {state.errors?.account_name && (
                  <p className="text-[10px] text-red-400 font-bold px-1 mt-1">
                    {state.errors.account_name[0]}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest pl-1">
                  Corporate Institution
                </label>
                <select
                  name="bank_id"
                  required
                  className="input-formal w-full appearance-none bg-surface"
                >
                  <option value="">Select Institution</option>
                  {banks.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name} ({b.type.toUpperCase()})
                    </option>
                  ))}
                </select>
                {state.errors?.bank_id && (
                  <p className="text-[10px] text-red-400 font-bold px-1 mt-1">
                    {state.errors.bank_id[0]}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest pl-1">
                  Inception Balance
                </label>
                <CurrencyInput name="balance" required />
                {state.errors?.balance && (
                  <p className="text-[10px] text-red-400 font-bold px-1 mt-1">
                    {state.errors.balance[0]}
                  </p>
                )}
              </div>
            </div>

            {state.message && (
              <div
                className={`p-4 rounded-lg text-xs font-semibold ${state.success ? "bg-primary/10 text-primary border border-primary/20" : "bg-red-500/10 text-red-400 border border-red-500/20"}`}
              >
                {state.message}
              </div>
            )}

            <button
              type="button"
              onClick={() => setShowConfirm(true)}
              disabled={isPending}
              className="btn-primary w-full py-4"
            >
              {isPending ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Plus className="w-5 h-5 text-background" />
                  Commit Account Registry
                </>
              )}
            </button>
          </form>
        </div>
      )}

      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="w-full max-w-sm p-8 rounded-2xl bg-surface border border-border shadow-2xl space-y-6 animate-in zoom-in-95 duration-300 text-center">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2 border border-primary/20">
              <HelpCircle className="w-7 h-7 text-primary" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-text-primary uppercase tracking-tight">
                Authorize Registry?
              </h3>
              <p className="text-text-secondary text-sm font-medium">
                Certify that the financial institution and inception balance
                have been audited before committing to the global ledger.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowConfirm(false)}
                disabled={isPending}
                className="btn-secondary flex-1 py-3"
              >
                Re-Audit
              </button>
              <button
                form="account-form"
                type="submit"
                disabled={isPending}
                className="btn-primary flex-1 py-3"
              >
                {isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Yes, Authorize"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
