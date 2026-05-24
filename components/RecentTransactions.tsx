"use client";

import { TransactionData } from "@/lib/types/finance";

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
    <div className="p-6 rounded-3xl bg-surface/30 border border-white/5 backdrop-blur-xl shadow-xl space-y-6">
      <div className="flex items-center justify-between pb-2">
        <div>
          <h2 className="text-base font-extrabold text-text-primary">
            {title}
          </h2>
          <p className="text-xs text-text-secondary mt-0.5">{description}</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="hidden md:grid grid-cols-12 gap-4 pb-2 border-b border-white/5 text-[9px] font-bold text-text-secondary uppercase tracking-wider px-2">
          <div className="col-span-5">Transaction</div>
          <div className="col-span-3">Category</div>
          <div className="col-span-2">Account</div>
          <div className="col-span-2 text-right">Amount</div>
        </div>

        <div className="divide-y divide-white/5">
          {transactions.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-sm text-text-secondary">
                No transactions found.
              </p>
            </div>
          ) : (
            transactions.map((tx) => (
              <div
                key={tx.id}
                className="grid grid-cols-12 items-center py-4 first:pt-0 last:pb-0 hover:bg-white/5 px-2 rounded-xl transition-all gap-4"
              >
                <div className="col-span-7 md:col-span-5 flex items-center gap-3">
                  <span
                    className={`w-2 h-2 rounded-full shrink-0 ${
                      tx.type === "income"
                        ? "bg-primary"
                        : tx.type === "expense"
                          ? "bg-[#E05B69]"
                          : "bg-white/40"
                    }`}
                  />
                  <div className="min-w-0">
                    <h4 className="text-xs font-extrabold text-text-primary truncate">
                      {tx.description || "No description"}
                    </h4>
                    <p className="text-[10px] text-text-secondary mt-0.5 md:hidden">
                      {tx.category_name || "Uncategorized"} •{" "}
                      {formatDate(tx.transaction_date)}
                    </p>
                    <p className="text-[9px] text-text-secondary mt-0.5 hidden md:block">
                      {formatDate(tx.transaction_date)}
                    </p>
                  </div>
                </div>

                <div className="hidden md:block col-span-3">
                  <span className="text-xs text-text-secondary font-medium">
                    {tx.category_name || "Uncategorized"}
                  </span>
                </div>

                <div className="hidden md:block col-span-2">
                  <span className="text-xs text-text-secondary font-medium truncate block">
                    {tx.type === "transfer" ? (
                      <span className="flex items-center gap-1">
                        {tx.from_account_name}
                        <span className="text-[10px] opacity-50">➔</span>
                        {tx.to_account_name}
                      </span>
                    ) : (
                      tx.account_name || "N/A"
                    )}
                  </span>
                </div>

                <div className="col-span-5 md:col-span-2 text-right">
                  <span
                    className={`text-xs font-black ${
                      tx.type === "income"
                        ? "text-primary"
                        : tx.type === "expense"
                          ? "text-[#E05B69]"
                          : "text-text-primary"
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
        <div className="flex items-center justify-between pt-6 border-t border-white/5">
          <div className="text-[10px] font-black text-text-secondary uppercase tracking-[0.15em]">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage <= 1}
              className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-text-secondary hover:text-text-primary hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              Previous
            </button>
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-text-secondary hover:text-text-primary hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
