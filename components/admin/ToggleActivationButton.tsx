"use client";

import { toggleUserActivation } from "@/app/actions/user";
import { useTransition } from "react";

interface ToggleActivationButtonProps {
  userId: number;
  isActive: boolean;
}

export const ToggleActivationButton = ({ userId, isActive }: ToggleActivationButtonProps) => {
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    startTransition(async () => {
      const result = await toggleUserActivation(userId, isActive);
      if (!result.success) {
        alert(result.message);
      }
    });
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      className={`px-2.5 py-1 text-[10px] font-bold rounded transition-colors ${
        isActive
          ? "bg-green-500/10 border border-green-500/20 text-green-400 hover:bg-green-500/20"
          : "bg-zinc-500/10 border border-zinc-500/20 text-zinc-400 hover:bg-zinc-500/20"
      } disabled:opacity-50 cursor-pointer`}
    >
      {isPending ? "Updating..." : isActive ? "Active" : "Inactive"}
    </button>
  );
};
