"use client";

import { deleteCategory } from "@/app/actions/category";

interface DeleteCategoryButtonProps {
  id: number;
  name: string;
}

export const DeleteCategoryButton = ({ id, name }: DeleteCategoryButtonProps) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (!confirm(`Are you sure you want to delete the category "${name}"?`)) {
      e.preventDefault();
    }
  };

  return (
    <form
      action={async (formData) => {
        await deleteCategory(formData);
      }}
      onSubmit={handleSubmit}
      className="inline"
    >
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        className="text-red-400 hover:text-red-300 font-bold text-xs transition-colors cursor-pointer bg-transparent border-none p-0 inline"
      >
        Delete
      </button>
    </form>
  );
};
