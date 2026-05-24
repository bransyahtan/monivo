import {
  getAccounts,
  getCategories,
  getTransactions,
} from "@/app/actions/transaction";
import { RecentTransactions } from "@/components/RecentTransactions";
import { TransactionForm } from "@/components/TransactionForm";
import { Account, Category } from "@/lib/types/finance";

export default async function TransactionsPage() {
  const transactions = await getTransactions(20);
  const categories = (await getCategories()) as Category[];
  const accounts = (await getAccounts()) as Account[];

  return (
    <div className="max-w-6xl mx-auto space-y-8 md:space-y-12 animate-in fade-in duration-700 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-4 md:px-0 border-b border-white/5 pb-10">
        <div className="space-y-4">
          <h1 className="text-3xl md:text-5xl font-black text-text-primary tracking-tight uppercase">
            Transactions
          </h1>
          <p className="text-text-secondary text-xs md:text-base max-w-2xl leading-relaxed">
            The master registry of all financial movements. This statement
            provides a comprehensive audit trail of your fiscal activity,
            ensuring total transparency in your wealth management.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-10 md:gap-16 px-4 md:px-0">
        {/* Form Section */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 px-1">
            <div className="w-1.5 h-6 bg-primary rounded-full"></div>
            <h2 className="text-[10px] md:text-xs font-bold text-text-secondary uppercase tracking-[0.2em]">
              New Registry Entry
            </h2>
          </div>
          <div className="w-full lg:max-w-4xl">
            <TransactionForm categories={categories} accounts={accounts} />
          </div>
        </section>

        {/* List Section */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 px-1">
            <div className="w-1.5 h-6 bg-primary rounded-full"></div>
            <h2 className="text-[10px] md:text-xs font-bold text-text-secondary uppercase tracking-[0.2em]">
              Operational Audit Trail
            </h2>
          </div>
          <RecentTransactions
            transactions={transactions}
            title="Registry Statement"
            description="Historical record of verified transactions."
          />
        </section>
      </div>
    </div>
  );
}
