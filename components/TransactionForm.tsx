"use client";

import { addTransaction } from "@/app/actions/transaction";
import { Account, Category } from "@/lib/types/finance";
import { Loader2, Plus, X } from "lucide-react";
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
  const [state, action, isPending] = useActionState(addTransaction, {});

  useEffect(() => {
    if (state.success) {
      setIsOpen(false);
    }
  }, [state.success]);

  return (
    <div className="w-full">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="w-full py-4 md:py-6 rounded-2xl md:rounded-3xl bg-primary hover:bg-primary-light text-background font-black flex items-center justify-center gap-2 transition-all duration-300 shadow-xl shadow-primary/20 hover:scale-[1.01] active:scale-95 cursor-pointer"
        >
          <Plus className="w-5 h-5" />
          Add New Transaction
        </button>
      ) : (
        <div className="p-5 md:p-8 rounded-3xl md:rounded-[2.5rem] bg-surface/30 border border-white/10 backdrop-blur-xl shadow-2xl space-y-6 animate-in zoom-in duration-300">
          <div className="flex items-center justify-between">
            <h3 className="text-lg md:text-xl font-black text-text-primary">
              Record Transaction
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-xl hover:bg-white/5 text-text-secondary transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form action={action} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest px-1">
                  Type
                </label>
                <select
                  name="type"
                  required
                  className="w-full px-4 py-3.5 rounded-xl md:rounded-2xl bg-white/5 border border-white/10 text-text-primary focus:border-primary outline-none transition-all appearance-none cursor-pointer"
                >
                  <option
                    value="expense"
                    className="bg-surface text-text-primary"
                  >
                    Expense
                  </option>
                  <option
                    value="income"
                    className="bg-surface text-text-primary"
                  >
                    Income
                  </option>
                  <option
                    value="transfer"
                    className="bg-surface text-text-primary"
                  >
                    Transfer
                  </option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest px-1">
                  Amount
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary font-bold text-sm">
                    Rp
                  </span>
                  <CurrencyInput
                    name="amount"
                    required
                    className="w-full pl-10 pr-4 py-3.5 rounded-xl md:rounded-2xl bg-white/5 border border-white/10 text-text-primary focus:border-primary outline-none transition-all"
                  />
                </div>
                {state.errors?.amount && (
                  <p className="text-[10px] text-red-500 font-bold px-1">
                    {state.errors.amount[0]}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest px-1">
                  Category
                </label>
                <select
                  name="category_id"
                  className="w-full px-4 py-3.5 rounded-xl md:rounded-2xl bg-white/5 border border-white/10 text-text-primary focus:border-primary outline-none transition-all appearance-none cursor-pointer"
                >
                  <option value="" className="bg-surface text-text-primary">
                    Uncategorized
                  </option>
                  {categories.map((c) => (
                    <option
                      key={c.id}
                      value={c.id}
                      className="bg-surface text-text-primary"
                    >
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest px-1">
                  From Account
                </label>
                <select
                  name="from_account_id"
                  className="w-full px-4 py-3.5 rounded-xl md:rounded-2xl bg-white/5 border border-white/10 text-text-primary focus:border-primary outline-none transition-all appearance-none cursor-pointer"
                >
                  <option value="" className="bg-surface text-text-primary">
                    No Account
                  </option>
                  {accounts.map((a) => (
                    <option
                      key={a.id}
                      value={a.id}
                      className="bg-surface text-text-primary"
                    >
                      {a.account_name} ({a.bank_name})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest px-1">
                Date
              </label>
              <input
                type="datetime-local"
                name="transaction_date"
                defaultValue={new Date().toISOString().slice(0, 16)}
                className="w-full px-4 py-3.5 rounded-xl md:rounded-2xl bg-white/5 border border-white/10 text-text-primary focus:border-primary outline-none transition-all cursor-pointer scheme-dark"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest px-1">
                Description
              </label>
              <textarea
                name="description"
                placeholder="What was this for?"
                rows={2}
                className="w-full px-4 py-3.5 rounded-xl md:rounded-2xl bg-white/5 border border-white/10 text-text-primary focus:border-primary outline-none transition-all resize-none"
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
              type="submit"
              disabled={isPending}
              className="w-full py-4 md:py-5 rounded-xl md:rounded-2xl bg-primary hover:bg-primary-light text-background font-black transition-all flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                  Save Transaction
                </>
              )}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
