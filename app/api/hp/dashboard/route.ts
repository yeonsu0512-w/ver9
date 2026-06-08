import { NextResponse } from "next/server";
import { mockExperienceMetrics, mockTrend } from "@/lib/mock-data";

export async function GET() {
  try {
    const { getExperienceScore, getExperienceOverTime } = await import("@/lib/hp-client");

    const [scoreRes, trendRes] = await Promise.allSettled([
      getExperienceScore(),
      getExperienceOverTime(90),
    ]);

    // 경험지수 파싱
    let metrics = mockExperienceMetrics;
    if (scoreRes.status === "fulfilled") {
      const raw = scoreRes.value;
      // API가 { scores: [...] } 또는 배열 자체로 올 수 있음
      const arr = Array.isArray(raw) ? raw : (raw as { scores?: typeof mockExperienceMetrics }).scores;
      if (arr && arr.length > 0) metrics = arr;
    }

    // 추이 파싱
    let trend = mockTrend;
    if (trendRes.status === "fulfilled") {
      const raw = trendRes.value;
      if (raw.data && raw.data.length > 0) {
        trend = raw.data.map((d) => ({
          date: d.date,
          score: d.good ?? 0,
          good: d.good,
          fair: d.fair,
          poor: d.poor,
        }));
      }
    }

    return NextResponse.json({ metrics, trend });
  } catch (err) {
    console.error("[HP /dashboard]", err);
    return NextResponse.json({ metrics: mockExperienceMetrics, trend: mockTrend });
  }
}
