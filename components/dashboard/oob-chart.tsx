"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import type { OobStatistics } from "@/lib/types";

interface Props { data: OobStatistics }

const COLORS = ["#1155AA", "#4A90D9", "#88B8E8", "#C5D8F0"];

export function OobChart({ data }: Props) {
  const isEmpty = data.total_enrolled === 0;

  const chartData = isEmpty
    ? [{ name: "미등록", value: 1 }]
    : [
        { name: "프로비저닝 완료", value: data.oob_provisioned },
        { name: "프로비저닝 미완료", value: data.oob_unprovisioned },
        { name: "기타", value: data.oob_misc },
        { name: "미등록", value: data.total_enrolled - data.oob_provisioned - data.oob_unprovisioned - data.oob_misc },
      ].filter((d) => d.value > 0);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-border p-5">
      <div className="mb-2">
        <h2 className="text-sm font-semibold text-foreground">원격 지원 장치</h2>
        <p className="text-muted-foreground text-xs mt-0.5">등록된 장치: {data.total_enrolled}대</p>
      </div>

      {isEmpty ? (
        <div className="flex flex-col items-center justify-center h-36 text-muted-foreground text-xs gap-2">
          <div className="w-16 h-16 rounded-full border-4 border-secondary flex items-center justify-center text-lg font-bold text-muted-foreground/40">
            0
          </div>
          <p>등록된 장치가 없습니다</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={160}>
          <PieChart>
            <Pie data={chartData} cx="50%" cy="50%" innerRadius={45} outerRadius={65} dataKey="value" paddingAngle={2}>
              {chartData.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number, name: string) => [value + "대", name]}
              contentStyle={{ fontSize: 11, borderRadius: 8 }}
            />
            <Legend iconSize={8} wrapperStyle={{ fontSize: 10 }} />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
