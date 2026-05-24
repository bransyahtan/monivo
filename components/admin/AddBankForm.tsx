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
    }
    if (state?.message && !state?.success) {
      setShowConfirm(false);
    }
  }, [state, bankToEdit]);

  return (
    <>
      <form
        id="bank-form"
        key={bankToEdit?.id || "add"}
        ref={formRef}
        action={formAction}
        className="space-y-4 bg-surface border border-white/5 p-6 rounded-xl"
      >
        <div>
          <h3 className="text-lg font-bold text-text-primary tracking-tight">
            {bankToEdit ? "Edit Asset Source" : "Add Asset Source"}
          </h3>
          <p className="text-[11px] text-text-secondary mt-0.5 leading-normal">
            {bankToEdit
              ? `Modify configuration for ${bankToEdit.name}`
              : "Register a new financial institution, e-wallet, or cash storage."}
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
              Institution Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              defaultValue={bankToEdit?.name || ""}
              placeholder="e.g. Bank Central Asia, GoPay"
              className="w-full px-3 py-2 bg-background/40 border border-white/5 rounded-lg focus:border-primary focus:outline-none transition-all text-text-primary placeholder:text-text-secondary/20 text-xs"
            />
            {state?.errors?.name && (
              <p className="text-[10px] text-red-400 mt-0.5">
                {state.errors.name[0]}
              </p>
            )}
          </div>

          <div className="space-y-1 relative">
            <label
              htmlFor="type"
              className="text-[10px] text-text-secondary uppercase tracking-wider font-bold"
            >
              Type Classification
            </label>
            <div className="relative">
              <select
                id="type"
                name="type"
                required
                defaultValue={bankToEdit?.type || "bank"}
                className="w-full px-3 py-2 bg-background/40 border border-white/5 rounded-lg focus:border-primary focus:outline-none transition-all text-text-primary text-xs cursor-pointer appearance-none"
              >
                <option value="bank" className="bg-surface text-text-primary">
                  Bank (BCA, Mandiri, etc)
                </option>
                <option
                  value="e-wallet"
                  className="bg-surface text-text-primary"
                >
                  E-Wallet (OVO, GoPay, etc)
                </option>
                <option value="cash" className="bg-surface text-text-primary">
                  Cash (Physical currency)
                </option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-text-secondary">
                <svg
                  className="fill-current h-3.5 w-3.5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
            {state?.errors?.type && (
              <p className="text-[10px] text-red-400 mt-0.5">
                {state.errors.type[0]}
              </p>
            )}
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          {bankToEdit && (
            <Link
              href="/admin"
              className="px-4 py-2 bg-white/5 border border-white/5 text-text-secondary hover:text-text-primary hover:bg-white/10 font-bold rounded-lg transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer text-xs"
            >
              <X className="w-3.5 h-3.5" />
              <span>Cancel</span>
            </Link>
          )}
          <button
            type="button"
            onClick={() => setShowConfirm(true)}
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
                {bankToEdit ? (
                  <Save className="w-3.5 h-3.5" />
                ) : (
                  <Plus className="w-3.5 h-3.5" />
                )}
                <span>{bankToEdit ? "Save Changes" : "Add Source"}</span>
              </>
            )}
          </button>
        </div>
      </form>

      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="w-full max-w-sm p-8 rounded-[2.5rem] bg-surface border border-white/10 shadow-2xl space-y-6 animate-in zoom-in-95 duration-300">
            <div className="space-y-2 text-center">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4 border border-primary/30">
                <HelpCircle className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-black text-text-primary uppercase tracking-tight">
                {bankToEdit ? "Update Source?" : "Add Source?"}
              </h3>
              <p className="text-text-secondary text-sm">
                Confirm{" "}
                {bankToEdit ? "changes to this" : "registration of this"}{" "}
                financial asset source.
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
                form="bank-form"
                type="submit"
                disabled={isPending}
                className="flex-1 py-4 rounded-2xl bg-primary text-background font-black hover:bg-primary-light transition-all shadow-lg shadow-primary/20 cursor-pointer disabled:opacity-50 flex items-center justify-center"
              >
                {isPending ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
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
