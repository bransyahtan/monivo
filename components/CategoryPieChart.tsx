"use client";

import { getCategoryData } from "@/app/actions/account";
import { Loader2 } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

type TabType = "income" | "expense";

const CHART_COLORS = [
  "#8F7EA5",
  "#76A082",
  "#CCA473",
  "#BD7C76",
  "#5F7E97",
  "#A39081",
  "#6E8D8A",
  "#B5838D",
  "#7B8A73",
  "#96A5B8",
  "#AC8887",
  "#B3A369",
  "#6E7A8A",
  "#A37B73",
  "#7E9A9B",
  "#9C8F96",
  "#8A9A86",
  "#B8A682",
  "#A6B1A0",
  "#73859E",
];

export const CategoryPieChart = ({
  accountId,
}: {
  accountId?: string | number;
}) => {
  const [mounted, setMounted] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [pieTab, setPieTab] = useState<TabType>("expense");
  const [allData, setAllData] = useState<{ income: any[]; expense: any[] }>({
    income: [],
    expense: [],
  });

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
      const result = await getCategoryData(
        dateRange.start,
        dateRange.end,
        accountId,
      );
      setAllData(result);
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
      <div className="animate-pulse bg-surface/30 border border-white/5 rounded-3xl h-[430px] w-full" />
    );
  }

  const currentPieData = allData[pieTab];
  const pieTotal = currentPieData.reduce((sum, item) => sum + item.value, 0);

  const totalExpense = allData.expense.reduce(
    (sum, item) => sum + item.value,
    0,
  );
  const totalIncome = allData.income.reduce((sum, item) => sum + item.value, 0);
  const netFlow = totalIncome - totalExpense;

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
    <div className="p-6 rounded-3xl bg-surface/30 border border-white/5 backdrop-blur-xl shadow-xl flex flex-col justify-between h-[480px] relative">
      <div className="flex flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex bg-white/5 p-1 rounded-xl w-fit">
            <button
              onClick={() => setPieTab("expense")}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                pieTab === "expense"
                  ? "bg-primary text-background shadow-lg"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              Expenses
            </button>
            <button
              onClick={() => setPieTab("income")}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                pieTab === "income"
                  ? "bg-primary text-background shadow-lg"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              Income
            </button>
          </div>

          <button
            onClick={() => {
              setTempDateRange(dateRange);
              setIsModalOpen(true);
            }}
            className="flex items-center gap-3 px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all cursor-pointer"
          >
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-text-secondary">
              <span>{formatDate(dateRange.start)}</span>
              <span className="opacity-30">—</span>
              <span>{formatDate(dateRange.end)}</span>
            </div>
            {isPending && (
              <Loader2 className="w-3 h-3 animate-spin text-primary" />
            )}
          </button>
        </div>
      </div>

      {isModalOpen && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in zoom-in-95 duration-200">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-md rounded-3xl" />
          <div className="relative w-full max-w-sm bg-surface border border-white/10 p-5 rounded-2xl shadow-2xl space-y-4">
            <h3 className="text-[10px] font-black text-text-primary uppercase tracking-widest">
              Set Analysis Period
            </h3>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[9px] font-black text-text-secondary uppercase">
                  From
                </label>
                <input
                  type="date"
                  value={tempDateRange.start}
                  onChange={(e) =>
                    setTempDateRange((prev: any) => ({
                      ...prev,
                      start: e.target.value,
                    }))
                  }
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-[11px] font-bold text-text-primary scheme-dark outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black text-text-secondary uppercase">
                  To
                </label>
                <input
                  type="date"
                  value={tempDateRange.end}
                  onChange={(e) =>
                    setTempDateRange((prev: any) => ({
                      ...prev,
                      end: e.target.value,
                    }))
                  }
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-[11px] font-bold text-text-primary scheme-dark outline-none"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex-1 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-text-secondary hover:bg-white/5 transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleApply}
                className="flex-1 px-4 py-2.5 bg-primary text-background rounded-xl text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col sm:flex-row items-center justify-center gap-8 mt-6 overflow-hidden">
        <div
          className="relative w-[180px] h-[180px] shrink-0"
          style={{ touchAction: "none", outline: "none" }}
        >
          {currentPieData.length === 0 && !isPending ? (
            <div className="absolute inset-0 flex items-center justify-center text-[10px] text-text-secondary font-bold uppercase tracking-widest text-center px-4">
              No Data Found
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="p-3 bg-surface/90 border border-white/10 backdrop-blur-md rounded-xl shadow-lg">
                          <p className="text-[10px] text-text-secondary font-bold">
                            {payload[0].name}
                          </p>
                          <p className="text-xs font-black text-text-primary mt-0.5">
                            {formatRupiah(Number(payload[0].value))}
                          </p>
                          <p className="text-[10px] text-primary font-bold mt-0.5">
                            {(
                              (Number(payload[0].value) / (pieTotal || 1)) *
                              100
                            ).toFixed(0)}
                            %
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Pie
                  data={currentPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  dataKey="value"
                  paddingAngle={5}
                >
                  {currentPieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={CHART_COLORS[index % CHART_COLORS.length]}
                      stroke="none"
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="flex-1 space-y-2 overflow-y-auto w-full px-2 scrollbar-none max-h-[220px]">
          {currentPieData.map((item, idx) => {
            const itemColor = CHART_COLORS[idx % CHART_COLORS.length];
            return (
              <div
                key={idx}
                className="flex items-center justify-between text-[11px] p-2 rounded-xl hover:bg-white/5 transition-all group border border-transparent hover:border-white/5"
              >
                <div className="flex items-center gap-3">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0 shadow-lg"
                    style={{ backgroundColor: itemColor }}
                  />
                  <span className="font-bold text-text-secondary truncate group-hover:text-text-primary transition-colors">
                    {item.name}
                  </span>
                </div>
                <div className="text-right">
                  <p className="font-black text-text-primary">
                    {formatRupiah(item.value)}
                  </p>
                  <p className="text-[9px] text-text-secondary">
                    {((item.value / (pieTotal || 1)) * 100).toFixed(0)}%
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 mt-2 border-t border-white/5 text-xs">
        <div className="flex items-center gap-4">
          <div>
            <span className="text-[9px] uppercase tracking-wider text-text-secondary font-bold opacity-50">
              Expenses
            </span>
            <p className="text-xs font-black text-[#E05B69] mt-0.5">
              {formatRupiah(totalExpense)}
            </p>
          </div>
          <div className="w-px h-8 bg-white/5" />
          <div>
            <span className="text-[9px] uppercase tracking-wider text-text-secondary font-bold opacity-50">
              Income
            </span>
            <p className="text-xs font-black text-primary mt-0.5">
              {formatRupiah(totalIncome)}
            </p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-[9px] uppercase tracking-wider text-text-secondary font-bold opacity-50">
            Net
          </span>
          <p
            className={`text-xs font-black mt-0.5 ${netFlow >= 0 ? "text-primary" : "text-[#E05B69]"}`}
          >
            {netFlow >= 0 ? "+" : ""}
            {formatRupiah(netFlow)}
          </p>
        </div>
      </div>
    </div>
  );
};
