"use client";

import { addBank, AddBankState, updateBank } from "@/app/actions/bank";
import { HelpCircle, Loader2, Plus, Save, X } from "lucide-react";
import Link from "next/link";
import { useActionState, useEffect, useRef, useState } from "react";

interface AddBankFormProps {
  bankToEdit?: {
    id: number;
    name: string;
    type: string;
  } | null;
}

export const AddBankForm = ({ bankToEdit = null }: AddBankFormProps) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const actionFn = bankToEdit ? updateBank.bind(null, bankToEdit.id) : addBank;

  const [state, formAction, isPending] = useActionState(actionFn, {
    success: false,
    message: "",
  } as AddBankState);

  useEffect(() => {
    if (state?.success) {
      setTimeout(() => {
        setShowConfirm(false);
        if (!bankToEdit) {
          if (formRef.current) {
            formRef.current.reset();
          }
        } else {
          const params = new URLSearchParams(window.location.search);
          params.delete("edit");
          const newSearch = params.toString();
          window.location.href =
            window.location.pathname + (newSearch ? `?${newSearch}` : "");
        }
      }, 0);
    } else if (state?.message) {
      setTimeout(() => setShowConfirm(false), 0);
    }
  }, [state?.success, state?.message, bankToEdit]);

  return (
    <>
      <form
        id="bank-form"
        key={bankToEdit?.id || "add"}
        ref={formRef}
        action={formAction}
        className="card-formal p-6 space-y-5"
      >
        <div>
          <h3 className="text-base font-semibold text-text-primary uppercase tracking-wider">
            {bankToEdit ? "Modify Asset Class" : "Define New Asset Class"}
          </h3>
          <p className="text-[11px] text-text-secondary mt-1 font-medium leading-relaxed opacity-80">
            {bankToEdit
              ? "Update the parameters for this financial institution or liquidity source."
              : "Register a new financial institution, digital wallet, or physical cash storage to the registry."}
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest pl-1">
              Institution Name
            </label>
            <input
              type="text"
              name="name"
              defaultValue={bankToEdit?.name || ""}
              required
              placeholder="e.g. Bank Central Asia"
              className="input-formal w-full"
            />
            {state?.errors?.name && (
              <p className="text-[10px] text-red-400 font-bold mt-1 px-1">
                {state.errors.name[0]}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest pl-1">
              Source Classification
            </label>
            <div className="relative">
              <select
                name="type"
                required
                defaultValue={bankToEdit?.type || "bank"}
                className="input-formal w-full appearance-none cursor-pointer"
              >
                <option value="bank" className="bg-surface">
                  Standard Banking
                </option>
                <option value="e-wallet" className="bg-surface">
                  Digital E-Wallet
                </option>
                <option value="cash" className="bg-surface">
                  Physical Assets / Cash
                </option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-text-secondary">
                <svg
                  className="fill-current h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
            {state?.errors?.type && (
              <p className="text-[10px] text-red-400 font-bold mt-1 px-1">
                {state.errors.type[0]}
              </p>
            )}
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          {bankToEdit && (
            <Link href="/admin" className="btn-secondary px-5 py-2.5">
              <X className="w-4 h-4" />
              <span>Cancel</span>
            </Link>
          )}
          <button
            type="button"
            onClick={() => setShowConfirm(true)}
            disabled={isPending}
            className="btn-primary flex-1 py-2.5"
          >
            {isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                {bankToEdit ? (
                  <Save className="w-4 h-4" />
                ) : (
                  <Plus className="w-4 h-4" />
                )}
                <span>{bankToEdit ? "Commit Changes" : "Register Asset"}</span>
              </>
            )}
          </button>
        </div>
      </form>

      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="w-full max-w-sm p-8 rounded-2xl bg-surface border border-border shadow-2xl space-y-6 animate-in zoom-in-95 duration-300">
            <div className="space-y-3 text-center">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2 border border-primary/20">
                <HelpCircle className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-text-primary uppercase tracking-tight">
                {bankToEdit ? "Update Source?" : "Confirm Registration?"}
              </h3>
              <p className="text-text-secondary text-sm font-medium">
                Verify that all institution parameters are correct before
                committing to the registry.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowConfirm(false)}
                disabled={isPending}
                className="btn-secondary flex-1 py-3"
              >
                Go Back
              </button>
              <button
                form="bank-form"
                type="submit"
                disabled={isPending}
                className="btn-primary flex-1 py-3"
              >
                {isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Yes, Proceed"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
