import Link from "next/link";

export const QuickActions = () => {
  return (
    <div className="card-formal p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="text-left w-full sm:w-auto px-2">
        <span className="text-[10px] font-bold text-text-secondary uppercase tracking-[0.2em] block">
          Operational Center
        </span>
        <h3 className="text-sm font-semibold text-text-primary mt-1">
          Fast Access Controls
        </h3>
      </div>

      <div className="grid grid-cols-3 gap-3 w-full sm:w-auto sm:flex sm:items-center">
        <Link
          href="/transactions"
          className="px-5 py-2.5 rounded-lg border border-border bg-white/3 hover:bg-primary text-text-primary hover:text-background text-[12px] font-semibold tracking-wide transition-all duration-200 text-center block"
        >
          Add Record
        </Link>
        <Link
          href="/accounts"
          className="px-5 py-2.5 rounded-lg border border-border bg-white/3 hover:bg-primary text-text-primary hover:text-background text-[12px] font-semibold tracking-wide transition-all duration-200 text-center block"
        >
          New Asset
        </Link>
        <Link
          href="/transfers"
          className="px-5 py-2.5 rounded-lg border border-border bg-white/3 hover:bg-primary text-text-primary hover:text-background text-[12px] font-semibold tracking-wide transition-all duration-200 text-center block"
        >
          Transfer
        </Link>
      </div>
    </div>
  );
};
