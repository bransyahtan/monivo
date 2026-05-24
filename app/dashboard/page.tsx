import { BalanceChart } from "@/components/BalanceChart";
import { CategoryPieChart } from "@/components/CategoryPieChart";
import { QuickActions } from "@/components/QuickActions";
import { RecentTransactions } from "@/components/RecentTransactions";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

import { getTransactions } from "@/app/actions/transaction";

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) {
    redirect("/auth");
  }

  const transactions = await getTransactions(5);

  return (
    <div className="space-y-6 font-sans max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-text-primary tracking-tight">
            Welcome back, {session.name}!
          </h1>
          <p className="text-text-secondary text-xs mt-1">
            Here is the summary of your overall financial standing and cash
            flow.
          </p>
        </div>
      </div>

      <QuickActions />

      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <BalanceChart />
          <CategoryPieChart />
        </div>
        <RecentTransactions transactions={transactions} />
      </div>
    </div>
  );
}
