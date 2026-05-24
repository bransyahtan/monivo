"use client";

import { TransactionData } from "@/types/finance";

interface RecentTransactionsProps {
  transactions: TransactionData[];
  title?: string;
  description?: string;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}

export const RecentTransactions = ({
  transactions,
  title = "Recent Transactions",
  description = "The details of your latest financial operations.",
  currentPage = 1,
  totalPages = 1,
  onPageChange,
}: RecentTransactionsProps) => {
  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const formatDate = (dateStr: string | Date) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="card-formal p-6 space-y-6">
      <div className="flex items-center justify-between pb-2 border-b border-border">
        <div>
          <h2 className="text-sm font-semibold text-text-primary uppercase tracking-wider">
            {title}
          </h2>
          <p className="text-[11px] text-text-secondary mt-1 font-medium">
            {description}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="hidden md:grid grid-cols-12 gap-4 pb-2 text-[10px] font-bold text-text-secondary uppercase tracking-widest px-2 opacity-70">
          <div className="col-span-5">Activity Details</div>
          <div className="col-span-3">Classification</div>
          <div className="col-span-2">Source / Target</div>
          <div className="col-span-2 text-right">Magnitude</div>
        </div>

        <div className="divide-y divide-border/50">
          {transactions.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-sm text-text-secondary font-medium italic">
                System Log: No operations recorded in the specified period.
              </p>
            </div>
          ) : (
            transactions.map((tx) => (
              <div
                key={tx.id}
                className="grid grid-cols-12 items-center py-4 first:pt-0 last:pb-0 hover:bg-white/2 px-2 rounded-lg transition-all gap-4"
              >
                <div className="col-span-7 md:col-span-5 flex items-center gap-3">
                  <span
                    className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                      tx.type === "income"
                        ? "bg-primary shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                        : tx.type === "expense"
                          ? "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]"
                          : "bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.5)]"
                    }`}
                  />
                  <div className="min-w-0">
                    <h4 className="text-[13px] font-semibold text-text-primary truncate">
                      {tx.description || "System Transaction"}
                    </h4>
                    <p className="text-[10px] text-text-secondary mt-0.5 md:hidden font-medium">
                      {tx.category_name || "Uncategorized"} •{" "}
                      {formatDate(tx.transaction_date)}
                    </p>
                    <p className="text-[10px] text-text-secondary mt-0.5 hidden md:block font-medium italic">
                      {formatDate(tx.transaction_date)}
                    </p>
                  </div>
                </div>

                <div className="hidden md:block col-span-3">
                  <span className="text-[11px] text-text-secondary font-semibold uppercase tracking-tight">
                    {tx.category_name || "Uncategorized"}
                  </span>
                </div>

                <div className="hidden md:block col-span-2">
                  <span className="text-[11px] text-text-secondary font-medium tracking-tight truncate block">
                    {tx.type === "transfer" ? (
                      <span className="flex items-center gap-1.5 grayscale opacity-70">
                        {tx.from_account_name}
                        <span className="text-[10px]">→</span>
                        {tx.to_account_name}
                      </span>
                    ) : (
                      tx.account_name || "N/A"
                    )}
                  </span>
                </div>

                <div className="col-span-5 md:col-span-2 text-right">
                  <span
                    className={`text-[13px] font-bold ${
                      tx.type === "income"
                        ? "text-primary"
                        : tx.type === "expense"
                          ? "text-red-400"
                          : "text-blue-300"
                    }`}
                  >
                    {tx.type === "income"
                      ? "+"
                      : tx.type === "expense"
                        ? "-"
                        : ""}
                    {formatRupiah(tx.amount)}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {totalPages > 1 && onPageChange && (
        <div className="flex items-center justify-between pt-6 border-t border-border">
          <div className="text-[10px] font-bold text-text-secondary uppercase tracking-widest px-1">
            Log Page {currentPage} / {totalPages}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage <= 1}
              className="px-4 py-1.5 rounded-md bg-white/3 border border-border text-[10px] font-bold uppercase tracking-widest text-text-secondary hover:text-text-primary hover:bg-white/6 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              Previous
            </button>
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="px-4 py-1.5 rounded-md bg-white/3 border border-border text-[10px] font-bold uppercase tracking-widest text-text-secondary hover:text-text-primary hover:bg-white/6 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
