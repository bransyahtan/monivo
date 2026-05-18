"use client";

import Link from "next/link";
import { DeleteCategoryButton } from "@/components/admin/DeleteCategoryButton";

export interface Category {
  id: number;
  name: string;
  slug: string;
  created_at: Date;
}

interface CategoriesTabProps {
  categories: Category[];
  currentPage: number;
}

export const CategoriesTab = ({ categories, currentPage }: CategoriesTabProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-text-primary tracking-tight">
            Transaction Categories
          </h2>
          <p className="text-xs text-text-secondary">
            Configure classifications for tracking income, expenses, and investment flows.
          </p>
        </div>
        <Link
          href="?tab=categories&addCategory=true"
          className="px-3 py-2 bg-primary hover:bg-primary/90 text-background font-bold rounded-lg transition-all text-xs cursor-pointer"
        >
          + Add Category
        </Link>
      </div>

      {categories.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-white/5 rounded-lg">
          <p className="text-text-secondary text-xs">
            No transaction categories found. Click the button above to register one.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-white/5 text-xs font-bold text-text-secondary uppercase tracking-wider">
                <th className="pb-3 w-16 text-center">ID</th>
                <th className="pb-3 pl-3">Category Name</th>
                <th className="pb-3">Slug</th>
                <th className="pb-3 w-36">Date Created</th>
                <th className="pb-3 w-28 text-right pr-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs">
              {categories.map((cat) => (
                <tr
                  key={cat.id}
                  className="hover:bg-white/5 transition-colors"
                >
                  <td className="py-3 text-center text-text-secondary font-mono">
                    {cat.id}
                  </td>
                  <td className="py-3 pl-3 font-semibold text-text-primary">
                    {cat.name}
                  </td>
                  <td className="py-3 text-text-secondary font-mono">
                    {cat.slug}
                  </td>
                  <td className="py-3 text-text-secondary">
                    {new Date(cat.created_at).toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="py-3 text-right pr-3">
                    <div className="flex justify-end items-center gap-3">
                      <Link
                        href={`?tab=categories&page=${currentPage}&editCategory=${cat.id}`}
                        className="text-primary hover:text-primary-light font-semibold transition-colors"
                      >
                        Edit
                      </Link>
                      <span className="text-white/10">|</span>
                      <DeleteCategoryButton
                        id={Number(cat.id)}
                        name={cat.name}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
