"use client";

const recentTransactions = [
  {
    id: 1,
    title: "Salary Payment",
    account: "Bank Central Asia",
    type: "income",
    category: "Salary",
    amount: 8000000,
    date: "18 May 2026",
  },
  {
    id: 2,
    title: "Indomaret Grocery",
    account: "GoPay Wallet",
    type: "expense",
    category: "Food & Beverages",
    amount: 150000,
    date: "18 May 2026",
  },
  {
    id: 3,
    title: "BCA to GoPay Transfer",
    account: "Internal Transfer",
    type: "transfer",
    category: "Transfer",
    amount: 500000,
    date: "17 May 2026",
  },
  {
    id: 4,
    title: "Gasoline Shell",
    account: "Physical Cash",
    type: "expense",
    category: "Transportation",
    amount: 50000,
    date: "16 May 2026",
  },
  {
    id: 5,
    title: "Electricity Token",
    account: "Bank Mandiri",
    type: "expense",
    category: "Utilities & Bills",
    amount: 200000,
    date: "15 May 2026",
  },
];

export const RecentTransactions = () => {
  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="p-6 rounded-3xl bg-surface/30 border border-white/5 backdrop-blur-xl shadow-xl space-y-6">
      <div className="flex items-center justify-between pb-2">
        <div>
          <h2 className="text-base font-extrabold text-text-primary">
            Recent Transactions
          </h2>
          <p className="text-xs text-text-secondary mt-0.5">
            The details of your latest financial operations.
          </p>
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
          {recentTransactions.map((tx) => (
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
                    {tx.title}
                  </h4>
                  <p className="text-[10px] text-text-secondary mt-0.5 md:hidden">
                    {tx.account} • {tx.category} • {tx.date}
                  </p>
                  <p className="text-[9px] text-text-secondary mt-0.5 hidden md:block">
                    {tx.date}
                  </p>
                </div>
              </div>

              <div className="hidden md:block col-span-3">
                <span className="text-xs text-text-secondary font-medium">
                  {tx.category}
                </span>
              </div>

              <div className="hidden md:block col-span-2">
                <span className="text-xs text-text-secondary font-medium">
                  {tx.account}
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
          ))}
        </div>
      </div>
    </div>
  );
};
