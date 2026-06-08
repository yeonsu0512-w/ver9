import { NextResponse } from "next/server";
import { mockAppCrashes } from "@/lib/mock-data";

export async function GET() {
  try {
    const { getAppCrashes } = await import("@/lib/hp-client");
    const raw = await getAppCrashes();

    // 실제 응답: { total, records: [{ count, facet: { facetResult: { buckets[] } } }] }
    const buckets = raw?.records?.[0]?.facet?.facetResult?.buckets ?? [];

    if (buckets.length === 0) {
      console.log("[HP /app-crashes] 결과 0건 → 목 데이터 사용");
      return NextResponse.json(mockAppCrashes);
    }

    const data = buckets.map((b) => ({
      appName: b.key ?? b.appName ?? "Unknown",
      appCrashCount: b.docCount ?? b.appCrashCount ?? 0,
      impactedDeviceCount: b.impactedDeviceCount ?? 0,
    }));

    return NextResponse.json({ totalRecords: data.length, data });
  } catch (err) {
    console.error("[HP /app-crashes]", err);
    return NextResponse.json(mockAppCrashes);
  }
}
