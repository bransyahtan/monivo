import Link from "next/link";

export const QuickActions = () => {
  return (
    <div className="p-4 rounded-3xl bg-surface/30 border border-white/5 backdrop-blur-xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="text-left w-full sm:w-auto px-2">
        <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block">
          Quick Operations
        </span>
        <h3 className="text-xs font-extrabold text-text-primary mt-0.5">
          Execute fast financial actions
        </h3>
      </div>

      <div className="grid grid-cols-3 gap-3 w-full sm:w-auto sm:flex sm:items-center">
        <Link
          href="/transactions"
          className="px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-primary text-text-primary hover:text-background text-[11px] font-black tracking-wide transition-all duration-300 shadow-sm hover:shadow-primary/20 text-center block"
        >
          Transaction
        </Link>
        <Link
          href="/accounts"
          className="px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-primary text-text-primary hover:text-background text-[11px] font-black tracking-wide transition-all duration-300 shadow-sm hover:shadow-primary/20 text-center block"
        >
          Account
        </Link>
        <Link
          href="/transfers"
          className="px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-primary text-text-primary hover:text-background text-[11px] font-black tracking-wide transition-all duration-300 shadow-sm hover:shadow-primary/20 text-center block"
        >
          Transfer
        </Link>
      </div>
    </div>
  );
};
