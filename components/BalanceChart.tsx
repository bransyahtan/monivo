"use client";

import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";

type Timeframe = "1D" | "1M" | "3M" | "6M" | "1Y";

const balanceData: Record<Timeframe, { name: string; value: number }[]> = {
  "1D": [
    { name: "00:00", value: 24200000 },
    { name: "04:00", value: 24200000 },
    { name: "08:00", value: 24150000 },
    { name: "12:00", value: 24400000 },
    { name: "16:00", value: 24350000 },
    { name: "20:00", value: 24500000 },
  ],
  "1M": [
    { name: "W1", value: 23800000 },
    { name: "W2", value: 24100000 },
    { name: "W3", value: 23900000 },
    { name: "W4", value: 24500000 },
  ],
  "3M": [
    { name: "Mar", value: 25100000 },
    { name: "Apr", value: 24800000 },
    { name: "May", value: 24500000 },
  ],
  "6M": [
    { name: "Dec", value: 22800000 },
    { name: "Jan", value: 23400000 },
    { name: "Feb", value: 24100000 },
    { name: "Mar", value: 25100000 },
    { name: "Apr", value: 24800000 },
    { name: "May", value: 24500000 },
  ],
  "1Y": [
    { name: "Jun '25", value: 20500000 },
    { name: "Aug '25", value: 21800000 },
    { name: "Oct '25", value: 22100000 },
    { name: "Dec '25", value: 22800000 },
    { name: "Feb '26", value: 24100000 },
    { name: "Apr '26", value: 24800000 },
    { name: "May '26", value: 24500000 },
  ],
};

export const BalanceChart = () => {
  const [mounted, setMounted] = useState(false);
  const [lineFilter, setLineFilter] = useState<Timeframe>("1M");

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="animate-pulse bg-surface/30 border border-white/5 rounded-3xl h-[380px] w-full" />
    );
  }

  const currentLineData = balanceData[lineFilter];
  const firstVal = currentLineData[0]?.value || 0;
  const lastVal = currentLineData[currentLineData.length - 1]?.value || 0;
  const isTrendUp = lastVal >= firstVal;

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="p-6 rounded-3xl bg-surface/30 border border-white/5 backdrop-blur-xl shadow-xl flex flex-col justify-between h-[380px]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-text-secondary uppercase tracking-wider block">
            Total Balance
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <h2 className="text-2xl font-black text-text-primary">
              {formatRupiah(lastVal)}
            </h2>
            <div
              className={`inline-flex items-center text-xs font-bold ${
                isTrendUp ? "text-primary" : "text-[#E05B69]"
              }`}
            >
              {isTrendUp ? (
                <ArrowUpRight className="w-3.5 h-3.5" />
              ) : (
                <ArrowDownRight className="w-3.5 h-3.5" />
              )}
              {(((lastVal - firstVal) / (firstVal || 1)) * 100).toFixed(1)}%
            </div>
          </div>
        </div>

        <div className="flex bg-white/5 p-1 rounded-xl w-fit">
          {(["1D", "1M", "3M", "6M", "1Y"] as Timeframe[]).map((f) => (
            <button
              key={f}
              onClick={() => setLineFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                lineFilter === f
                  ? "bg-primary text-background shadow-md"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div
        className="flex-1 w-full h-[220px] mt-4"
        style={{ touchAction: "none", outline: "none" }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={currentLineData}
            style={{
              cursor: "default",
              touchAction: "none",
              outline: "none",
            }}
          >
            <defs>
              <linearGradient id="chartTrendGrad" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={isTrendUp ? "#37b89b" : "#E05B69"}
                  stopOpacity={0.2}
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
              fontSize={10}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="p-3 bg-surface/90 border border-white/10 backdrop-blur-md rounded-xl shadow-lg">
                      <p className="text-[10px] text-text-secondary font-bold">
                        {payload[0].payload.name}
                      </p>
                      <p
                        className={`text-xs font-black mt-0.5 ${
                          isTrendUp ? "text-primary" : "text-[#E05B69]"
                        }`}
                      >
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
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#chartTrendGrad)"
              style={{ cursor: "default", outline: "none" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
