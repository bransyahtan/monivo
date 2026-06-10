"use client";

import { addTransaction } from "@/app/actions/transaction";
import { ActionState } from "@/types/api";
import { Account, Category } from "@/types/finance";
import { ArrowRightLeft, HelpCircle, Loader2, X } from "lucide-react";
import { useActionState, useEffect, useState } from "react";
import { CurrencyInput } from "./CurrencyInput";

interface TransferFormProps {
  accounts: Account[];
  categories: Category[];
}

export const TransferForm = ({ accounts, categories }: TransferFormProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-full">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="w-full btn-primary py-5 rounded-2xl shadow-lg"
        >
          <ArrowRightLeft className="w-6 h-6 text-background" />
          <span>New Logistics Transfer</span>
        </button>
      ) : (
        <TransferFormInner
          accounts={accounts}
          categories={categories}
          onClose={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

interface TransferFormInnerProps extends TransferFormProps {
  onClose: () => void;
}

const TransferFormInner = ({
  accounts,
  categories,
  onClose,
}: TransferFormInnerProps) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [fromAccountId, setFromAccountId] = useState("");
  const [amount, setAmount] = useState(0);
  const [clientError, setClientError] = useState("");
  const [state, action, isPending] = useActionState(addTransaction, {
    success: false,
    message: "",
  } as ActionState);

  const fromAccount = accounts.find((a) => String(a.id) === fromAccountId);
  const availableDestinations = accounts.filter(
    (a) => String(a.id) !== fromAccountId,
  );

  useEffect(() => {
    if (state.success) {
      setTimeout(() => {
        setShowConfirm(false);
        onClose();
      }, 0);
    } else if (state.message) {
      setTimeout(() => setShowConfirm(false), 0);
    }
  }, [state.success, state.message, onClose]);

  const handleOpenConfirm = () => {
    setClientError("");
    if (!fromAccount) {
      setClientError("Please select a source account.");
      return;
    }
    if (amount <= 0) {
      setClientError("Please enter a valid transfer amount.");
      return;
    }
    if (amount > fromAccount.balance) {
      setClientError(
        `Insufficient balance. ${fromAccount.account_name} only has Rp ${new Intl.NumberFormat("id-ID").format(fromAccount.balance)} available.`,
      );
      return;
    }
    setShowConfirm(true);
  };

  return (
    <div className="card-formal p-6 md:p-8 space-y-6 animate-in zoom-in duration-300">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
            <ArrowRightLeft className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-text-primary uppercase tracking-tight">
              Asset Relocation
            </h3>
            <p className="text-[11px] text-text-secondary mt-1 font-medium italic">
              Internal Ledger: Movement of credit between repositories.
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-lg hover:bg-white/5 text-text-secondary transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <form
        id="transfer-form"
        action={action}
        className="space-y-6"
      >
        <input type="hidden" name="type" value="transfer" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest pl-1">
              Originating Account
            </label>
            <select
              name="from_account_id"
              required
              value={fromAccountId}
              onChange={(e) => {
                setFromAccountId(e.target.value);
                setClientError("");
              }}
              className="input-formal w-full appearance-none bg-surface"
            >
              <option value="">Select Origin</option>
              {accounts.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.account_name} (Rp{" "}
                  {new Intl.NumberFormat("id-ID").format(a.balance)})
                </option>
              ))}
            </select>
            {fromAccount && (
              <p className="text-[10px] text-text-secondary font-medium px-1">
                Available:{" "}
                <span className="text-primary font-bold">
                  Rp{" "}
                  {new Intl.NumberFormat("id-ID").format(fromAccount.balance)}
                </span>
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest pl-1">
              Destination Repository
            </label>
            <select
              name="to_account_id"
              required
              className="input-formal w-full appearance-none bg-surface"
            >
              <option value="">Select Destination</option>
              {availableDestinations.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.account_name} (Rp{" "}
                  {new Intl.NumberFormat("id-ID").format(a.balance)})
                </option>
              ))}
            </select>
            {fromAccountId && availableDestinations.length === 0 && (
              <p className="text-[10px] text-amber-400 font-bold px-1">
                No other accounts available as destination.
              </p>
            )}
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest pl-1">
            Classification / Logic
          </label>
          <select
            name="category_id"
            className="input-formal w-full appearance-none bg-surface"
          >
            <option value="">— No Specific Logic —</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest pl-1">
              Valuation Magnitude
            </label>
            <CurrencyInput
              name="amount"
              required
              onChange={(val) => {
                setAmount(val);
                setClientError("");
              }}
            />
            {state.errors?.amount && (
              <p className="text-[10px] text-red-400 font-bold px-1 mt-1">
                {state.errors.amount[0]}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest pl-1">
              Execution Timestamp
            </label>
            <input
              type="datetime-local"
              name="transaction_date"
              required
              defaultValue={new Date().toISOString().slice(0, 16)}
              className="input-formal w-full scheme-dark text-xs"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest pl-1">
            Audit Memorandum
          </label>
          <textarea
            name="description"
            placeholder="Internal justification for capital movement..."
            required
            rows={2}
            className="input-formal w-full resize-none text-[13px]"
          />
        </div>

        {clientError && (
          <div className="p-4 rounded-lg text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/20">
            {clientError}
          </div>
        )}

        {state.message && !clientError && (
          <div
            className={`p-4 rounded-lg text-xs font-semibold ${state.success ? "bg-primary/10 text-primary border border-primary/20" : "bg-red-500/10 text-red-400 border border-red-500/20"}`}
          >
            {state.message}
          </div>
        )}

        <button
          type="button"
          onClick={handleOpenConfirm}
          disabled={isPending}
          className="btn-primary w-full py-4"
        >
          {isPending ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <ArrowRightLeft className="w-5 h-5 text-background" />
              Authorize Relocation
            </>
          )}
        </button>
      </form>

      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="w-full max-w-sm p-8 rounded-2xl bg-surface border border-border shadow-2xl space-y-6 animate-in zoom-in-95 duration-300 text-center">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2 border border-primary/20">
              <HelpCircle className="w-7 h-7 text-primary" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-text-primary uppercase tracking-tight">
                Certify Movement?
              </h3>
              <p className="text-text-secondary text-sm font-medium">
                Ensure all ledger accounts and magnitude values are audited
                before finalizing relocation.
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
                form="transfer-form"
                type="submit"
                disabled={isPending}
                className="btn-primary flex-1 py-3"
              >
                {isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Yes, Finalize"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
