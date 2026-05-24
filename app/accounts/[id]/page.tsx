import { getAccountById } from "@/app/actions/account";
import { getTransactions } from "@/app/actions/transaction";
import { BalanceChart } from "@/components/BalanceChart";
import { CategoryPieChart } from "@/components/CategoryPieChart";
import { RecentTransactions } from "@/components/RecentTransactions";
import { TransactionPagination } from "@/components/TransactionPagination";
import { Account } from "@/types/finance";
import { ArrowLeft, Coins, Landmark, Wallet } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function AccountDetailPage({
  params: paramsPromise,
  searchParams: searchParamsPromise,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await paramsPromise;
  const searchParams = await searchParamsPromise;
  const accountId = params.id;
  const page = Number(searchParams.page) || 1;
  const limit = 10;

  const account = (await getAccountById(accountId)) as Account;

  if (!account) {
    notFound();
  }

  const { data: transactions, total } = await getTransactions(
    limit,
    accountId,
    page,
  );
  const totalPages = Math.ceil(total / limit);

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20 px-4 md:px-0">
      {/* Header / Breadcrumb */}
      <div className="flex flex-col gap-6">
        <Link
          href="/accounts"
          className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary hover:text-primary transition-colors w-fit"
        >
          <ArrowLeft className="w-3 h-3" />
          Back to Asset Registry
        </Link>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-10">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-primary/10 text-primary shadow-lg shadow-primary/5">
                {account.bank_type === "bank" && (
                  <Landmark className="w-8 h-8" />
                )}
                {account.bank_type === "e-wallet" && (
                  <Wallet className="w-8 h-8" />
                )}
                {account.bank_type === "cash" && <Coins className="w-8 h-8" />}
              </div>
              <div>
                <h1 className="text-3xl md:text-5xl font-black text-text-primary tracking-tight uppercase">
                  {account.account_name}
                </h1>
                <p className="text-text-secondary text-xs font-bold uppercase tracking-widest mt-1">
                  {account.bank_name} • Audit ID #{account.id}
                </p>
              </div>
            </div>
          </div>

          <div className="text-left md:text-right">
            <p className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em] mb-1">
              Current Liquid Solvency
            </p>
            <p className="text-4xl font-black text-primary tracking-tighter">
              {formatRupiah(account.balance)}
            </p>
          </div>
        </div>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-6">
          <BalanceChart accountId={accountId} />
        </div>
        <div className="lg:col-span-6">
          <CategoryPieChart accountId={accountId} />
        </div>
      </div>

      {/* Transaction History */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 px-1">
          <div className="w-1.5 h-6 bg-primary rounded-full"></div>
          <h2 className="text-[10px] font-bold text-text-secondary uppercase tracking-[0.2em]">
            Specific Transaction Logs
          </h2>
        </div>
        <div className="space-y-4">
          <RecentTransactions
            transactions={transactions}
            title={`Activity Log - ${account.account_name}`}
            description="Detailed execution history for this specific asset structure."
          />
          <TransactionPagination
            currentPage={page}
            totalPages={totalPages}
            totalCount={total}
          />
        </div>
      </div>
    </div>
  );
}
