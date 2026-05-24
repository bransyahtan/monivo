import { getAccounts } from "@/app/actions/account";
import { getCategories, getTransfers } from "@/app/actions/transaction";
import { RecentTransactions } from "@/components/RecentTransactions";
import { TransactionPagination } from "@/components/TransactionPagination";
import { TransferForm } from "@/components/TransferForm";
import { Account, Category } from "@/lib/types/finance";

export default async function TransfersPage({
  searchParams: searchParamsPromise,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const searchParams = await searchParamsPromise;
  const page = Number(searchParams.page) || 1;
  const limit = 20;

  const accounts = (await getAccounts()) as Account[];
  const categories = (await getCategories()) as Category[];
  const { data: transfers, total } = await getTransfers(limit, page);
  const totalPages = Math.ceil(total / limit);

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in duration-700 pb-20 px-4 md:px-0">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-10">
        <div className="space-y-4">
          <h1 className="text-3xl md:text-5xl font-black text-text-primary tracking-tight uppercase">
            Internal Transfers
          </h1>
          <p className="text-text-secondary text-xs md:text-base max-w-2xl leading-relaxed">
            Execute and audit internal liquidity movements between your
            financial structures. This protocol ensures perfect balance parity
            across your registry.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-16">
        {/* Form Section */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 px-1">
            <div className="w-1.5 h-6 bg-primary rounded-full"></div>
            <h2 className="text-[10px] md:text-xs font-bold text-text-secondary uppercase tracking-[0.2em]">
              Liquidity Movement Protocol
            </h2>
          </div>
          <div className="w-full lg:max-w-4xl">
            <TransferForm accounts={accounts} categories={categories} />
          </div>
        </section>

        {/* List Section */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 px-1">
            <div className="w-1.5 h-6 bg-primary rounded-full"></div>
            <h2 className="text-[10px] md:text-xs font-bold text-text-secondary uppercase tracking-[0.2em]">
              Inter-Account Audit Trail
            </h2>
          </div>
          <div className="space-y-4">
            <RecentTransactions
              transactions={transfers}
              title="Transfer Statement"
              description="Historical log of verified internal account movements."
            />
            <TransactionPagination
              currentPage={page}
              totalPages={totalPages}
              totalCount={total}
            />
          </div>
        </section>
      </div>
    </div>
  );
}
