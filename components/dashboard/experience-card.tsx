"use client";

import { formatScore, getScoreColor, getScoreLabel, cn } from "@/lib/utils";
import type { ExperienceMetric } from "@/lib/types";
import { metricLabels } from "@/lib/mock-data";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface Props {
  metrics: ExperienceMetric[];
}

const metricOrder = ["experience", "systemHealth", "osPerformance", "network", "security", "applications"];

export function ExperienceCard({ metrics }: Props) {
  const mainMetric = metrics.find((m) => m.name === "experience");
  const mainScore = mainMetric ? formatScore(mainMetric.score) : 0;
  const subMetrics = metricOrder.slice(1).map((name) => metrics.find((m) => m.name === name)).filter(Boolean) as ExperienceMetric[];

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-border p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-foreground">경험지수</h2>
        <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium", getScoreLabel(mainScore) === "우수" ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400" : getScoreLabel(mainScore) === "양호" ? "bg-amber-50 text-amber-700" : "bg-red-50 text-red-700")}>
          {getScoreLabel(mainScore)}
        </span>
      </div>

      {/* Main score */}
      <div className="flex items-end gap-3">
        <span className={cn("text-6xl font-bold leading-none", getScoreColor(mainScore))}>
          {mainScore}
        </span>
        <span className="text-muted-foreground text-sm mb-2">/ 100</span>
      </div>

      {/* Sub-metrics */}
      <div className="space-y-2.5 pt-1 border-t border-border">
        {subMetrics.map((metric) => {
          const score = formatScore(metric.score);
          const change = metric.percentChange ?? 0;
          return (
            <div key={metric.name} className="flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-muted-foreground truncate">{metricLabels[metric.name] ?? metric.name}</span>
                  <div className="flex items-center gap-1.5 ml-2 flex-shrink-0">
                    {change > 0 ? (
                      <TrendingUp size={10} className="text-green-500" />
                    ) : change < 0 ? (
                      <TrendingDown size={10} className="text-red-500" />
                    ) : (
                      <Minus size={10} className="text-muted-foreground" />
                    )}
                    <span className={cn("text-xs font-semibold", getScoreColor(score))}>{score}</span>
                  </div>
                </div>
                <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                  <div
                    className={cn("h-full rounded-full transition-all", score >= 80 ? "bg-green-500" : score >= 60 ? "bg-amber-400" : "bg-red-500")}
                    style={{ width: `${score}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
