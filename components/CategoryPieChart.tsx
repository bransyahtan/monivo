"use client";

import { useEffect, useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

type Timeframe = "1D" | "1M" | "3M" | "6M" | "1Y";
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

const categoryData: Record<
  TabType,
  Record<Timeframe, { name: string; value: number }[]>
> = {
  expense: {
    "1D": [
      { name: "Food & Beverages", value: 150000 },
      { name: "Transportation", value: 50000 },
    ],
    "1M": [
      { name: "Food & Beverages", value: 1200000 },
      { name: "Transportation", value: 450000 },
      { name: "Utilities & Bills", value: 800000 },
      { name: "Shopping", value: 1000000 },
    ],
    "3M": [
      { name: "Food & Beverages", value: 3800000 },
      { name: "Transportation", value: 1400000 },
      { name: "Utilities & Bills", value: 2400000 },
      { name: "Shopping", value: 3100000 },
      { name: "Entertainment", value: 1500000 },
    ],
    "6M": [
      { name: "Food & Beverages", value: 7500000 },
      { name: "Transportation", value: 2900000 },
      { name: "Utilities & Bills", value: 4800000 },
      { name: "Shopping", value: 6500000 },
      { name: "Entertainment", value: 3000000 },
    ],
    "1Y": [
      { name: "Food & Beverages", value: 15200000 },
      { name: "Transportation", value: 5800000 },
      { name: "Utilities & Bills", value: 9600000 },
      { name: "Shopping", value: 12400000 },
      { name: "Entertainment", value: 6000000 },
    ],
  },
  income: {
    "1D": [],
    "1M": [
      { name: "Salary", value: 8000000 },
      { name: "Freelance", value: 1500000 },
    ],
    "3M": [
      { name: "Salary", value: 24000000 },
      { name: "Freelance", value: 4200000 },
      { name: "Investments", value: 1800000 },
    ],
    "6M": [
      { name: "Salary", value: 48000000 },
      { name: "Freelance", value: 8500000 },
      { name: "Investments", value: 4200000 },
    ],
    "1Y": [
      { name: "Salary", value: 96000000 },
      { name: "Freelance", value: 19500000 },
      { name: "Investments", value: 10400000 },
    ],
  },
};

export const CategoryPieChart = () => {
  const [mounted, setMounted] = useState(false);
  const [pieFilter, setPieFilter] = useState<Timeframe>("1M");
  const [pieTab, setPieTab] = useState<TabType>("expense");

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setMounted(true);
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  if (!mounted) {
    return (
      <div className="animate-pulse bg-surface/30 border border-white/5 rounded-3xl h-[380px] w-full" />
    );
  }

  const currentPieData = categoryData[pieTab][pieFilter];
  const pieTotal = currentPieData.reduce((sum, item) => sum + item.value, 0);

  const totalExpense = categoryData.expense[pieFilter].reduce((sum, item) => sum + item.value, 0);
  const totalIncome = categoryData.income[pieFilter].reduce((sum, item) => sum + item.value, 0);
  const netFlow = totalIncome - totalExpense;

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="p-6 rounded-3xl bg-surface/30 border border-white/5 backdrop-blur-xl shadow-xl flex flex-col justify-between h-[430px]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex bg-white/5 p-1 rounded-xl w-fit">
          <button
            onClick={() => setPieTab("expense")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              pieTab === "expense"
                ? "bg-primary text-background"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            Expenses
          </button>
          <button
            onClick={() => setPieTab("income")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              pieTab === "income"
                ? "bg-primary text-background"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            Income
          </button>
        </div>

        <div className="flex bg-white/5 p-1 rounded-xl w-fit">
          {(["1D", "1M", "3M", "6M", "1Y"] as Timeframe[]).map((f) => (
            <button
              key={f}
              onClick={() => setPieFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                pieFilter === f
                  ? "bg-primary text-background shadow-md"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col sm:flex-row items-center justify-center gap-6 mt-4 overflow-hidden">
        <div
          className="relative w-[180px] h-[180px] flex items-center justify-center"
          style={{ touchAction: "none", outline: "none" }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart
              style={{
                cursor: "default",
                touchAction: "none",
                outline: "none",
              }}
            >
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
                outerRadius={80}
                dataKey="value"
                style={{ cursor: "default", outline: "none" }}
              >
                {currentPieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={CHART_COLORS[index % CHART_COLORS.length]}
                    style={{ outline: "none" }}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="flex-1 space-y-2 overflow-y-auto max-h-[180px] w-full px-2">
          {currentPieData.map((item, idx) => {
            const itemColor = CHART_COLORS[idx % CHART_COLORS.length];
            return (
              <div
                key={idx}
                className="flex items-center justify-between text-xs p-1.5 rounded-lg hover:bg-white/5 transition-all"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: itemColor }}
                  />
                  <span className="font-bold text-text-secondary truncate max-w-[120px]">
                    {item.name}
                  </span>
                </div>
                <span className="font-black text-text-primary">
                  {((item.value / (pieTotal || 1)) * 100).toFixed(0)}%
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 mt-2 border-t border-white/5 text-xs">
        <div className="flex items-center gap-4">
          <div>
            <span className="text-[9px] uppercase tracking-wider text-text-secondary font-bold">Total Expenses</span>
            <p className="text-xs font-black text-[#E05B69] mt-0.5">{formatRupiah(totalExpense)}</p>
          </div>
          <div className="w-px h-8 bg-white/5" />
          <div>
            <span className="text-[9px] uppercase tracking-wider text-text-secondary font-bold">Total Income</span>
            <p className="text-xs font-black text-primary mt-0.5">{formatRupiah(totalIncome)}</p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-[9px] uppercase tracking-wider text-text-secondary font-bold">Net Flow</span>
          <p className={`text-xs font-black mt-0.5 ${netFlow >= 0 ? "text-primary" : "text-[#E05B69]"}`}>
            {netFlow >= 0 ? "+" : ""}{formatRupiah(netFlow)}
          </p>
        </div>
      </div>
    </div>
  );
};
