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
      setShowConfirm(false);
      if (!categoryToEdit) {
        if (formRef.current) {
          formRef.current.reset();
        }
        setTimeout(() => {
          setName("");
          setSlug("");
        }, 0);
      } else {
        const params = new URLSearchParams(window.location.search);
        params.delete("editCategory");
        const newSearch = params.toString();
        window.location.href =
          window.location.pathname + (newSearch ? `?${newSearch}` : "");
      }
    }
    if (state?.message && !state?.success) {
      setShowConfirm(false);
    }
  }, [state, categoryToEdit]);

  return (
    <>
      <form
        id="category-form"
        key={categoryToEdit?.id || "add-category"}
        ref={formRef}
        action={formAction}
        className="space-y-4 bg-surface border border-white/5 p-6 rounded-xl w-full"
      >
        <div>
          <h3 className="text-lg font-bold text-text-primary tracking-tight">
            {categoryToEdit ? "Edit Category" : "Add Category"}
          </h3>
          <p className="text-[11px] text-text-secondary mt-0.5 leading-normal">
            {categoryToEdit
              ? `Modify configuration for category "${categoryToEdit.name}"`
              : "Define a new category to classify transactions (e.g. Food, Transport)."}
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
              Category Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={name}
              onChange={handleNameChange}
              placeholder="e.g. Food & Beverages"
              className="w-full px-3 py-2 bg-background/40 border border-white/5 rounded-lg focus:border-primary focus:outline-none transition-all text-text-primary placeholder:text-text-secondary/20 text-xs"
            />
            {state?.errors?.name && (
              <p className="text-[10px] text-red-400 mt-0.5">
                {state.errors.name[0]}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <label
              htmlFor="slug"
              className="text-[10px] text-text-secondary uppercase tracking-wider font-bold"
            >
              Slug (URL Identifier)
            </label>
            <input
              type="text"
              id="slug"
              name="slug"
              required
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="e.g. food-beverages"
              className="w-full px-3 py-2 bg-background/40 border border-white/5 rounded-lg focus:border-primary focus:outline-none transition-all text-text-primary placeholder:text-text-secondary/20 text-xs font-mono"
            />
            {state?.errors?.slug && (
              <p className="text-[10px] text-red-400 mt-0.5">
                {state.errors.slug[0]}
              </p>
            )}
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          {categoryToEdit ? (
            <Link
              href="?tab=categories"
              className="px-4 py-2 bg-white/5 border border-white/5 text-text-secondary hover:text-text-primary hover:bg-white/10 font-bold rounded-lg transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer text-xs"
            >
              <X className="w-3.5 h-3.5" />
              <span>Cancel</span>
            </Link>
          ) : (
            <Link
              href="?tab=categories"
              className="px-4 py-2 bg-white/5 border border-white/5 text-text-secondary hover:text-text-primary hover:bg-white/10 font-bold rounded-lg transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer text-xs"
            >
              <X className="w-3.5 h-3.5" />
              <span>Close</span>
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
                {categoryToEdit ? (
                  <Save className="w-3.5 h-3.5" />
                ) : (
                  <Plus className="w-3.5 h-3.5" />
                )}
                <span>{categoryToEdit ? "Save Changes" : "Add Category"}</span>
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
                {categoryToEdit ? "Update Category?" : "Add Category?"}
              </h3>
              <p className="text-text-secondary text-sm">
                Confirm{" "}
                {categoryToEdit ? "changes to this" : "registration of this"}{" "}
                category classification.
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
                form="category-form"
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
