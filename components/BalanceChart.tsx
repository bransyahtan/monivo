"use client";

import { getBalanceHistory } from "@/app/actions/account";
import { ArrowDownRight, ArrowUpRight, Loader2 } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";

export const BalanceChart = ({
  accountId,
}: {
  accountId?: string | number;
}) => {
  const [mounted, setMounted] = useState(false);
  const [data, setData] = useState<{ name: string; value: number }[]>([]);
  const [isPending, startTransition] = useTransition();

  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().setDate(new Date().getDate() - 30))
      .toISOString()
      .split("T")[0],
    end: new Date().toISOString().split("T")[0],
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempDateRange, setTempDateRange] = useState(dateRange);

  useEffect(() => {
    setMounted(true);
    fetchData();
  }, []);

  const fetchData = () => {
    startTransition(async () => {
      const history = await getBalanceHistory(
        dateRange.start,
        dateRange.end,
        accountId,
      );
      setData(history as { name: string; value: number }[]);
    });
  };

  useEffect(() => {
    if (mounted) fetchData();
  }, [dateRange]);

  const handleApply = () => {
    setDateRange(tempDateRange);
    setIsModalOpen(false);
  };

  if (!mounted) {
    return (
      <div className="animate-pulse bg-surface/30 border border-white/5 rounded-4xl h-[480px] w-full" />
    );
  }

  const firstVal = data[0]?.value || 0;
  const lastVal = data[data.length - 1]?.value || 0;
  const isTrendUp = lastVal >= firstVal;

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="p-8 rounded-4xl bg-surface/30 border border-white/10 backdrop-blur-xl shadow-2xl flex flex-col justify-between h-[480px] group transition-all duration-500 hover:border-white/20 relative">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 items-start">
          <div className="space-y-1">
            <span className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em] block">
              Liquidity Trajectory
            </span>
            <div className="flex items-baseline gap-3">
              <h2 className="text-2xl sm:text-3xl font-black text-text-primary tracking-tighter">
                {formatRupiah(lastVal)}
              </h2>
              <div
                className={`inline-flex items-center px-2 py-0.5 rounded-lg text-[10px] font-black ${
                  isTrendUp
                    ? "bg-primary/10 text-primary"
                    : "bg-red-500/10 text-[#E05B69]"
                }`}
              >
                {isTrendUp ? (
                  <ArrowUpRight className="w-3 h-3 mr-0.5" />
                ) : (
                  <ArrowDownRight className="w-3 h-3 mr-0.5" />
                )}
                {firstVal === 0
                  ? "100"
                  : (((lastVal - firstVal) / Math.abs(firstVal)) * 100).toFixed(
                      1,
                    )}
                %
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setTempDateRange(dateRange);
                setIsModalOpen(true);
              }}
              className="flex items-center gap-3 px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all cursor-pointer group/btn"
            >
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-text-secondary group-hover/btn:text-text-primary transition-colors">
                <span>{formatDate(dateRange.start)}</span>
                <span className="opacity-30">—</span>
                <span>{formatDate(dateRange.end)}</span>
              </div>
            </button>
            {isPending && (
              <Loader2 className="w-4 h-4 animate-spin text-primary" />
            )}
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-6 animate-in fade-in zoom-in-95 duration-200">
          <div className="absolute inset-0 bg-background/60 backdrop-blur-md rounded-4xl" />
          <div className="relative w-full max-w-sm bg-surface border border-white/10 p-6 rounded-3xl shadow-2xl space-y-6">
            <div className="space-y-1">
              <h3 className="text-sm font-black text-text-primary uppercase tracking-wider">
                Select Range
              </h3>
              <p className="text-[10px] text-text-secondary font-bold">
                Tailor your liquidity audit timeframe.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest px-1">
                  From
                </label>
                <input
                  type="date"
                  value={tempDateRange.start}
                  onChange={(e) =>
                    setTempDateRange(
                      (prev: { start: string; end: string }) => ({
                        ...prev,
                        start: e.target.value,
                      }),
                    )
                  }
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-3 text-xs font-bold text-text-primary scheme-dark outline-none focus:border-primary/50 transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest px-1">
                  To
                </label>
                <input
                  type="date"
                  value={tempDateRange.end}
                  onChange={(e) =>
                    setTempDateRange(
                      (prev: { start: string; end: string }) => ({
                        ...prev,
                        end: e.target.value,
                      }),
                    )
                  }
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-3 text-xs font-bold text-text-primary scheme-dark outline-none focus:border-primary/50 transition-colors"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex-1 px-4 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest text-text-secondary hover:bg-white/5 transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleApply}
                className="flex-1 px-4 py-3 bg-primary text-background rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
              >
                Apply Changes
              </button>
            </div>
          </div>
        </div>
      )}

      <div
        className="flex-1 w-full h-[280px] min-h-[280px] mt-8 relative"
        style={{ touchAction: "none", outline: "none" }}
      >
        {data.length < 2 && !isPending && (
          <div className="absolute inset-0 flex items-center justify-center text-xs text-text-secondary/50 font-bold uppercase tracking-widest">
            Insufficient data for trajectory visualization
          </div>
        )}
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="balanceTrendGrad" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={isTrendUp ? "#37b89b" : "#E05B69"}
                  stopOpacity={0.3}
                />
                <stop
                  offset="95%"
                  stopColor={isTrendUp ? "#37b89b" : "#E05B69"}
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="name"
              stroke="#a1a1aa"
              fontSize={9}
              tickLine={false}
              axisLine={false}
              dy={10}
              interval={Math.floor(data.length / 6)}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="p-4 bg-surface/90 border border-white/10 backdrop-blur-xl rounded-2xl shadow-2xl animate-in zoom-in-95">
                      <p className="text-[10px] text-text-secondary font-black uppercase tracking-wider">
                        {payload[0].payload.rawDate}
                      </p>
                      <p className="text-sm font-black mt-1 text-text-primary">
                        {formatRupiah(Number(payload[0].value))}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke={isTrendUp ? "#37b89b" : "#E05B69"}
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#balanceTrendGrad)"
              animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
