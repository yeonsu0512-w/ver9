"use client";

import type { Alert } from "@/lib/types";
import { getSeverityColor } from "@/lib/utils";
import { AlertTriangle, ChevronRight } from "lucide-react";

const severityLabel: Record<string, string> = {
  HIGH: "높음", MEDIUM: "중간", LOW: "낮음",
};

interface Props { alerts: Alert[] }

export function AlertsCard({ alerts }: Props) {
  const high = alerts.filter((a) => a.severity === "HIGH").length;

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-border p-5 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold text-foreground">알림</h2>
          {high > 0 && (
            <span className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 text-[10px] font-semibold px-1.5 py-0.5 rounded-full">
              {high} 높음
            </span>
          )}
        </div>
        <button className="text-xs text-primary hover:underline flex items-center gap-0.5">
          모두 보기 <ChevronRight size={12} />
        </button>
      </div>

      <div className="space-y-2">
        {alerts.map((alert, i) => (
          <div
            key={i}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg border ${getSeverityColor(alert.severity)}`}
          >
            <AlertTriangle size={14} className="flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium truncate">{alert.title}</p>
              <p className="text-[11px] opacity-70">영향받은 장치: {alert.affectedDevices}대</p>
            </div>
            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded border border-current/20 flex-shrink-0">
              {severityLabel[alert.severity]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
