"use client";

import { deleteBank } from "@/app/actions/bank";

interface DeleteBankButtonProps {
  id: number;
  name: string;
}

export const DeleteBankButton = ({ id, name }: DeleteBankButtonProps) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) {
      e.preventDefault();
    }
  };

  return (
    <form action={deleteBank} onSubmit={handleSubmit} className="inline">
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
