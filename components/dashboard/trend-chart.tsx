"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer } from "recharts";
import type { TrendPoint } from "@/lib/types";

interface Props { data: TrendPoint[] }

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) => {
  if (!active || !payload?.length) return null;
  const score = payload[0].value;
  return (
    <div className="bg-white dark:bg-gray-800 border border-border rounded-lg px-3 py-2 shadow-lg text-xs">
      <p className="text-muted-foreground">{label}</p>
      <p className="font-semibold text-foreground">점수: {score}</p>
      <p className={score >= 80 ? "text-green-600" : score >= 60 ? "text-amber-600" : "text-red-600"}>
        {score >= 80 ? "우수" : score >= 60 ? "양호" : "불량"}
      </p>
    </div>
  );
};

export function TrendChart({ data }: Props) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-border p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-foreground">경험 추이</h2>
        <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
          <span className="flex items-center gap-1"><span className="w-2 h-0.5 bg-green-500 inline-block rounded" /> 우수 (80+)</span>
          <span className="flex items-center gap-1"><span className="w-2 h-0.5 bg-amber-400 inline-block rounded" /> 양호 (60+)</span>
          <span className="flex items-center gap-1"><span className="w-2 h-0.5 bg-red-400 inline-block rounded" /> 불량</span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
          <XAxis dataKey="date" tick={{ fontSize: 11, fill: "var(--color-muted-foreground, #888)" }} />
          <YAxis domain={[50, 100]} tick={{ fontSize: 11, fill: "var(--color-muted-foreground, #888)" }} />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine y={80} stroke="#22c55e" strokeDasharray="4 4" strokeWidth={1} label={{ value: "우수", position: "right", fontSize: 10, fill: "#22c55e" }} />
          <ReferenceLine y={60} stroke="#f59e0b" strokeDasharray="4 4" strokeWidth={1} label={{ value: "양호", position: "right", fontSize: 10, fill: "#f59e0b" }} />
          <Line
            type="monotone"
            dataKey="score"
            stroke="#1155AA"
            strokeWidth={2}
            dot={{ r: 3, fill: "#1155AA", strokeWidth: 0 }}
            activeDot={{ r: 5, fill: "#1155AA" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
