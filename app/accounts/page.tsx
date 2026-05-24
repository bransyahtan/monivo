import { getAccounts, getBanks } from "@/app/actions/account";
import { AccountForm } from "@/components/AccountForm";
import { Account, Bank } from "@/lib/types/finance";
import { Coins, Landmark, Wallet } from "lucide-react";
import Link from "next/link";

export default async function AccountsPage() {
  const accounts = (await getAccounts()) as Account[];
  const banks = (await getBanks()) as Bank[];

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in duration-700 pb-20 px-4 md:px-0">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-10">
        <div className="space-y-4">
          <h1 className="text-3xl md:text-5xl font-black text-text-primary tracking-tight uppercase">
            Accounts
          </h1>
          <p className="text-text-secondary text-xs md:text-base max-w-2xl leading-relaxed">
            Manage your financial institutions and liquid assets. This registry
            tracks the current solvency of each account, providing a snapshot of
            your immediate architectural wealth.
          </p>
        </div>
      </div>

      <div className="space-y-16 px-4 md:px-0">
        {/* Form Section */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 px-1">
            <div className="w-1.5 h-6 bg-primary rounded-full"></div>
            <h2 className="text-[10px] md:text-xs font-bold text-text-secondary uppercase tracking-[0.2em]">
              New Asset Registry
            </h2>
          </div>
          <div className="w-full lg:max-w-4xl">
            <AccountForm banks={banks} />
          </div>
        </section>

        {/* List Section */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 px-1">
            <div className="w-1.5 h-6 bg-primary rounded-full"></div>
            <h2 className="text-[10px] md:text-xs font-bold text-text-secondary uppercase tracking-[0.2em]">
              Operational Audit - Active Assets
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {accounts.length === 0 ? (
              <div className="col-span-full py-16 text-center rounded-4xl bg-surface/20 border border-dotted border-white/10">
                <p className="text-sm text-text-secondary font-medium italic">
                  Critical: No active financial structures detected in the
                  registry.
                </p>
              </div>
            ) : (
              accounts.map((acc) => (
                <Link
                  key={acc.id}
                  href={`/accounts/${acc.id}`}
                  className="group relative p-8 rounded-4xl bg-surface/30 border border-white/5 backdrop-blur-xl hover:border-primary/40 hover:bg-surface/40 transition-all duration-500 overflow-hidden shadow-xl cursor-pointer"
                >
                  <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.1] transition-opacity duration-500 transform rotate-12">
                    {acc.bank_type === "bank" && (
                      <Landmark className="w-32 h-32" />
                    )}
                    {acc.bank_type === "e-wallet" && (
                      <Wallet className="w-32 h-32" />
                    )}
                    {acc.bank_type === "cash" && (
                      <Coins className="w-32 h-32" />
                    )}
                  </div>

                  <div className="relative space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="p-3 rounded-2xl bg-white/5 text-primary shadow-inner">
                        {acc.bank_type === "bank" && (
                          <Landmark className="w-6 h-6" />
                        )}
                        {acc.bank_type === "e-wallet" && (
                          <Wallet className="w-6 h-6" />
                        )}
                        {acc.bank_type === "cash" && (
                          <Coins className="w-6 h-6" />
                        )}
                      </div>
                      <span className="text-[9px] font-black text-text-secondary uppercase tracking-[0.15em] px-3 py-1.5 rounded-full bg-white/5 border border-white/5">
                        {acc.bank_type}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-xl font-black text-text-primary group-hover:text-primary transition-colors tracking-tight">
                        {acc.account_name}
                      </h3>
                      <p className="text-xs text-text-secondary font-bold uppercase tracking-wider mt-1">
                        {acc.bank_name}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-white/5">
                      <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-1.5">
                        Liquid Balance
                      </p>
                      <p className="text-2xl font-black text-text-primary tracking-tighter">
                        {formatRupiah(acc.balance)}
                      </p>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
