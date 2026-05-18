"use client";

import { useActionState, useEffect, useRef } from "react";
import { addBank, updateBank } from "@/app/actions/bank";
import { Plus, Loader2, Save, X } from "lucide-react";
import Link from "next/link";

interface AddBankFormProps {
  bankToEdit?: {
    id: number;
    name: string;
    type: string;
  } | null;
}

export const AddBankForm = ({ bankToEdit = null }: AddBankFormProps) => {
  const formRef = useRef<HTMLFormElement>(null);

  const actionFn = bankToEdit
    ? updateBank.bind(null, bankToEdit.id)
    : addBank;

  const [state, formAction, isPending] = useActionState(actionFn, {});

  useEffect(() => {
    if (state?.success) {
      if (!bankToEdit) {
        if (formRef.current) {
          formRef.current.reset();
        }
      } else {
        const params = new URLSearchParams(window.location.search);
        params.delete("edit");
        const newSearch = params.toString();
        window.location.href = window.location.pathname + (newSearch ? `?${newSearch}` : "");
      }
    }
  }, [state, bankToEdit]);

  return (
    <form
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
            <p className="text-[10px] text-red-400 mt-0.5">{state.errors.name[0]}</p>
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
              <option value="e-wallet" className="bg-surface text-text-primary">
                E-Wallet (OVO, GoPay, etc)
              </option>
              <option value="cash" className="bg-surface text-text-primary">
                Cash (Physical currency)
              </option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-text-secondary">
              <svg className="fill-current h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
              </svg>
            </div>
          </div>
          {state?.errors?.type && (
            <p className="text-[10px] text-red-400 mt-0.5">{state.errors.type[0]}</p>
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
  );
};
