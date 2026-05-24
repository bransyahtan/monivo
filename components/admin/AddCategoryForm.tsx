"use client";

import {
  addCategory,
  CategoryState,
  updateCategory,
} from "@/app/actions/category";
import { HelpCircle, Loader2, Plus, Save, X } from "lucide-react";
import Link from "next/link";
import { useActionState, useEffect, useRef, useState } from "react";

interface AddCategoryFormProps {
  categoryToEdit?: {
    id: number;
    name: string;
    slug: string;
  } | null;
}

export const AddCategoryForm = ({
  categoryToEdit = null,
}: AddCategoryFormProps) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const [name, setName] = useState(categoryToEdit?.name || "");
  const [slug, setSlug] = useState(categoryToEdit?.slug || "");

  const actionFn = categoryToEdit
    ? updateCategory.bind(null, categoryToEdit.id)
    : addCategory;

  const [state, formAction, isPending] = useActionState(actionFn, {
    success: false,
    message: "",
  } as CategoryState);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setName(val);
    if (!categoryToEdit) {
      const generated = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
      setSlug(generated);
    }
  };

  useEffect(() => {
    if (state?.success) {
      setTimeout(() => {
        setShowConfirm(false);
        if (!categoryToEdit) {
          if (formRef.current) {
            formRef.current.reset();
          }
          setName("");
          setSlug("");
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
  }, [state?.success, state?.message, categoryToEdit]);

  return (
    <>
      <form
        id="category-form"
        key={categoryToEdit?.id || "add"}
        ref={formRef}
        action={formAction}
        className="card-formal p-6 space-y-5"
      >
        <div>
          <h3 className="text-base font-semibold text-text-primary uppercase tracking-wider">
            {categoryToEdit
              ? "Modify Classification"
              : "Define New Classification"}
          </h3>
          <p className="text-[11px] text-text-secondary mt-1 font-medium leading-relaxed opacity-80">
            Establish a new structural category for transaction audit and
            reporting within the system.
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
              Label Name
            </label>
            <input
              type="text"
              name="name"
              value={name}
              onChange={handleNameChange}
              required
              placeholder="e.g. Corporate Expenses"
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
              System Identifier (Slug)
            </label>
            <input
              type="text"
              name="slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              required
              placeholder="corporate-expenses"
              className="input-formal w-full font-mono bg-white/2"
            />
            {state?.errors?.slug && (
              <p className="text-[10px] text-red-400 font-bold mt-1 px-1">
                {state.errors.slug[0]}
              </p>
            )}
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          {categoryToEdit && (
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
                {categoryToEdit ? (
                  <Save className="w-4 h-4" />
                ) : (
                  <Plus className="w-4 h-4" />
                )}
                <span>
                  {categoryToEdit
                    ? "Commit Classification"
                    : "Initialize Category"}
                </span>
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
                {categoryToEdit ? "Update Mapping?" : "Confirm Category?"}
              </h3>
              <p className="text-text-secondary text-sm font-medium">
                Verify this classification structure before indexing it into the
                system records.
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
                form="category-form"
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
