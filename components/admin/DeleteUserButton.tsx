"use client";

import { deleteUser } from "@/app/actions/user";

interface DeleteUserButtonProps {
  id: number;
  name: string;
}

export const DeleteUserButton = ({ id, name }: DeleteUserButtonProps) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (!confirm(`Are you sure you want to delete user "${name}"?`)) {
      e.preventDefault();
    }
  };

  return (
    <form
      action={async (formData) => {
        await deleteUser(formData);
      }}
      onSubmit={handleSubmit}
      className="inline"
    >
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        className="text-red-400 hover:text-red-300 font-semibold transition-colors cursor-pointer bg-transparent border-none p-0 inline text-xs"
      >
        Delete
      </button>
    </form>
  );
};
