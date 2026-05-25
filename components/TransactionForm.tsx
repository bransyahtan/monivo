"use client";

import { addTransaction } from "@/app/actions/transaction";
import { ActionState } from "@/types/api";
import { Account, Category } from "@/types/finance";
import { HelpCircle, Loader2, Plus, X } from "lucide-react";
import { useActionState, useEffect, useState } from "react";
import { CurrencyInput } from "./CurrencyInput";

interface TransactionFormProps {
  categories: Category[];
  accounts: Account[];
}

export const TransactionForm = ({
  categories,
  accounts,
}: TransactionFormProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [type, setType] = useState<"expense" | "income">("expense");
  const [state, action, isPending] = useActionState(addTransaction, {
    success: false,
    message: "",
  } as ActionState);

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
          Initialize New Record
        </button>
      ) : (
        <div className="card-formal p-6 md:p-8 space-y-6 animate-in zoom-in duration-300">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div>
              <h3 className="text-lg font-semibold text-text-primary uppercase tracking-tight">
                Record Entry
              </h3>
              <p className="text-[11px] text-text-secondary mt-1 font-medium">
                Internal Audit: Financial Operation Logging
              </p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-lg hover:bg-white/5 text-text-secondary transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form id="transaction-form" action={action} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Type Selection */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest pl-1">
                  Operation Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <label
                    className={`
                    flex items-center justify-center gap-2 px-4 py-3 rounded-lg border cursor-pointer transition-all text-xs font-semibold
                    ${
                      type === "expense"
                        ? "bg-primary text-background border-primary"
                        : "bg-white/3 border-border text-text-secondary hover:border-primary/50"
                    }
                  `}
                  >
                    <input
                      type="radio"
                      name="type"
                      value="expense"
                      checked={type === "expense"}
                      onChange={() => setType("expense")}
                      className="hidden"
                    />
                    Debit / Expense
                  </label>
                  <label
                    className={`
                    flex items-center justify-center gap-2 px-4 py-3 rounded-lg border cursor-pointer transition-all text-xs font-semibold
                    ${
                      type === "income"
                        ? "bg-primary text-background border-primary"
                        : "bg-white/3 border-border text-text-secondary hover:border-primary/50"
                    }
                  `}
                  >
                    <input
                      type="radio"
                      name="type"
                      value="income"
                      checked={type === "income"}
                      onChange={() => setType("income")}
                      className="hidden"
                    />
                    Credit / Income
                  </label>
                </div>
              </div>

              {/* Amount */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest pl-1">
                  Valuation (IDR)
                </label>
                <CurrencyInput name="amount" required />
              </div>

              {/* Account */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest pl-1">
                  Source Account
                </label>
                <select
                  name="from_account_id"
                  required
                  className="input-formal w-full appearance-none bg-surface"
                >
                  <option value="">Select Structure</option>
                  {accounts.map((acc) => (
                    <option key={acc.id} value={acc.id}>
                      {acc.account_name} ({acc.bank_name})
                    </option>
                  ))}
                </select>
              </div>

              {/* Category */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest pl-1">
                  Classification
                </label>
                <select
                  name="category_id"
                  required
                  className="input-formal w-full appearance-none bg-surface"
                >
                  <option value="">Choose Category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest pl-1">
                  Effective Date
                </label>
                <input
                  type="date"
                  name="transaction_date"
                  defaultValue={new Date().toISOString().split("T")[0]}
                  required
                  className="input-formal w-full"
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest pl-1">
                  Memo / Description
                </label>
                <input
                  type="text"
                  name="description"
                  placeholder="Internal reference details..."
                  className="input-formal w-full"
                />
              </div>
            </div>

            {state.message && (
              <div
                className={`p-4 rounded-lg text-xs font-semibold ${
                  state.success
                    ? "bg-primary/10 border border-primary/20 text-primary"
                    : "bg-red-500/10 border border-red-500/20 text-red-400"
                }`}
              >
                {state.message}
              </div>
            )}

            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="btn-secondary flex-1 py-4"
              >
                Discard
              </button>
              <button
                type="button"
                onClick={() => setShowConfirm(true)}
                disabled={isPending}
                className="btn-primary flex-2 py-4"
              >
                {isPending ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  "Commit Entry"
                )}
              </button>
            </div>
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
                Final Verification
              </h3>
              <p className="text-text-secondary text-sm font-medium">
                Verify that this entry complies with your current financial
                audit requirements before proceeding.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                disabled={isPending}
                onClick={() => setShowConfirm(false)}
                className="btn-secondary flex-1 py-3"
              >
                Re-Audit
              </button>
              <button
                form="transaction-form"
                type="submit"
                disabled={isPending}
                className="btn-primary flex-1 py-3"
              >
                {isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Authorize"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
