"use client";

import { useRouter } from "next/navigation";

interface TransactionPaginationProps {
  currentPage: number;
  totalPages: number;
  totalCount?: number;
}

export const TransactionPagination = ({
  currentPage,
  totalPages,
  totalCount,
}: TransactionPaginationProps) => {
  const router = useRouter();

  // Show only if more than 1 page
  if (totalPages <= 1) return null;

  const navigate = (page: number) => {
    const url = new URL(window.location.href);
    url.searchParams.set("page", page.toString());
    router.push(url.pathname + url.search);
  };

  return (
    <div className="flex items-center justify-between pt-6 border-t border-white/5 mt-2">
      <div className="space-y-0.5">
        <p className="text-[10px] font-black text-text-secondary uppercase tracking-[0.15em]">
          Page {currentPage} <span className="opacity-40">of</span> {totalPages}
        </p>
        {totalCount !== undefined && (
          <p className="text-[9px] text-text-secondary opacity-40 font-bold">
            {totalCount} total records
          </p>
        )}
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => navigate(currentPage - 1)}
          disabled={currentPage <= 1}
          className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-text-secondary hover:text-text-primary hover:bg-white/10 disabled:opacity-25 disabled:cursor-not-allowed transition-all cursor-pointer"
        >
          ← Prev
        </button>
        <button
          onClick={() => navigate(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-text-secondary hover:text-text-primary hover:bg-white/10 disabled:opacity-25 disabled:cursor-not-allowed transition-all cursor-pointer"
        >
          Next →
        </button>
      </div>
    </div>
  );
};
