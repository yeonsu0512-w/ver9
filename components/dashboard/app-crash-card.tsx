"use client";

import type { AppCrashResponse } from "@/lib/types";
import { Zap, ChevronRight } from "lucide-react";

interface Props { data: AppCrashResponse }

export function AppCrashCard({ data }: Props) {
  const maxCrash = Math.max(...data.data.map((d) => d.appCrashCount), 1);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-border p-5 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold text-foreground">상위 앱 충돌</h2>
          <span className="bg-secondary text-muted-foreground text-[10px] px-1.5 py-0.5 rounded-full">
            총 {data.totalRecords}건
          </span>
        </div>
        <button className="text-xs text-primary hover:underline flex items-center gap-0.5">
          모두 보기 <ChevronRight size={12} />
        </button>
      </div>

      <div className="space-y-3">
        {data.data.map((app, i) => (
          <div key={i} className="space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-5 h-5 rounded bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center flex-shrink-0">
                  <Zap size={11} className="text-orange-600 dark:text-orange-400" />
                </div>
                <span className="text-xs font-medium text-foreground truncate">{app.appName}</span>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0 ml-2">
                <span className="text-[11px] text-muted-foreground">장치 {app.impactedDeviceCount}대</span>
                <span className="text-xs font-semibold text-orange-600 dark:text-orange-400">{app.appCrashCount}회</span>
              </div>
            </div>
            <div className="h-1 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-orange-400 rounded-full"
                style={{ width: `${(app.appCrashCount / maxCrash) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
