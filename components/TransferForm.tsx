"use client";

import { addTransaction, TransactionState } from "@/app/actions/transaction";
import { Account, Category } from "@/lib/types/finance";
import { ArrowRightLeft, HelpCircle, Loader2, X } from "lucide-react";
import { useActionState, useEffect, useState } from "react";
import { CurrencyInput } from "./CurrencyInput";

interface TransferFormProps {
  accounts: Account[];
  categories: Category[];
}

export const TransferForm = ({ accounts, categories }: TransferFormProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [state, action, isPending] = useActionState(addTransaction, {
    success: false,
    message: "",
  } as TransactionState);

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
          className="w-full py-5 rounded-3xl bg-primary hover:bg-primary-light text-background font-black flex items-center justify-center gap-3 transition-all duration-300 shadow-xl shadow-primary/20 hover:scale-[1.01] active:scale-95 cursor-pointer uppercase tracking-wider"
        >
          <ArrowRightLeft className="w-6 h-6" />
          New Internal Transfer
        </button>
      ) : (
        <div className="p-8 rounded-[2.5rem] bg-surface/30 border border-white/10 backdrop-blur-xl shadow-2xl space-y-8 animate-in zoom-in duration-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-primary/10 text-primary">
                <ArrowRightLeft className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-black text-text-primary uppercase tracking-tight">
                  Internal Transfer
                </h3>
                <p className="text-xs text-text-secondary">
                  Execute liquidity movement between accounts.
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-xl hover:bg-white/5 text-text-secondary transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form id="transfer-form" action={action} className="space-y-6">
            <input type="hidden" name="type" value="transfer" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em] px-1">
                  Source Account
                </label>
                <select
                  name="from_account_id"
                  required
                  className="w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/10 text-text-primary focus:border-primary outline-none transition-all appearance-none cursor-pointer"
                >
                  <option value="" className="bg-surface">
                    Select Source
                  </option>
                  {accounts.map((a) => (
                    <option key={a.id} value={a.id} className="bg-surface">
                      {a.account_name} (Rp{" "}
                      {new Intl.NumberFormat("id-ID").format(a.balance)})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em] px-1">
                  Destination Account
                </label>
                <select
                  name="to_account_id"
                  required
                  className="w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/10 text-text-primary focus:border-primary outline-none transition-all appearance-none cursor-pointer"
                >
                  <option value="" className="bg-surface">
                    Select Destination
                  </option>
                  {accounts.map((a) => (
                    <option key={a.id} value={a.id} className="bg-surface">
                      {a.account_name} (Rp{" "}
                      {new Intl.NumberFormat("id-ID").format(a.balance)})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em] px-1">
                Category
              </label>
              <select
                name="category_id"
                className="w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/10 text-text-primary focus:border-primary outline-none transition-all appearance-none cursor-pointer"
              >
                <option value="" className="bg-surface">
                  — No Category —
                </option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id} className="bg-surface">
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em] px-1">
                  Transfer Amount
                </label>
                <div className="relative">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 text-text-secondary font-black text-sm">
                    IDR
                  </span>
                  <CurrencyInput
                    name="amount"
                    required
                    className="w-full pl-14 pr-5 py-4 rounded-2xl bg-white/5 border border-white/10 text-text-primary focus:border-primary outline-none transition-all font-mono"
                  />
                </div>
                {state.errors?.amount && (
                  <p className="text-[10px] text-red-500 font-bold px-1">
                    {state.errors.amount[0]}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em] px-1">
                  Execution Date
                </label>
                <input
                  type="datetime-local"
                  name="transaction_date"
                  required
                  defaultValue={new Date().toISOString().slice(0, 16)}
                  className="w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/10 text-text-primary focus:border-primary outline-none transition-all cursor-pointer scheme-dark"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em] px-1">
                Registry Memo
              </label>
              <textarea
                name="description"
                placeholder="Brief reason for internal movement..."
                required
                rows={2}
                className="w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/10 text-text-primary focus:border-primary outline-none transition-all resize-none"
              />
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
              className="w-full py-5 rounded-2xl bg-primary hover:bg-primary-light text-background font-black transition-all flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-50"
            >
              {isPending ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <ArrowRightLeft className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                  Execute Transfer
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
                Execute Transfer?
              </h3>
              <p className="text-text-secondary text-sm">
                Ensure source and destination accounts are correct before
                liquidity movement.
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
                form="transfer-form"
                type="submit"
                disabled={isPending}
                className="flex-1 py-4 rounded-2xl bg-primary text-background font-black hover:bg-primary-light transition-all shadow-lg shadow-primary/20 cursor-pointer disabled:opacity-50 flex items-center justify-center"
              >
                {isPending ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  "Yes, Execute"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
