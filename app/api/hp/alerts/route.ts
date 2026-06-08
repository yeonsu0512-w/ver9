import { NextResponse } from "next/server";
import { mockAlerts } from "@/lib/mock-data";

export async function GET() {
  try {
    const { getAlerts } = await import("@/lib/hp-client");
    const raw = await getAlerts();

    const hits = raw?.hits?.hits ?? [];

    if (hits.length === 0) {
      console.log("[HP /alerts] 응답은 성공했지만 결과 0건 → 목 데이터 사용");
      return NextResponse.json(mockAlerts);
    }

    const alerts = hits.map((h) => {
      const s = h._source ?? {};
      return {
        title: s.title ?? "알 수 없는 알림",
        severity: (s.severity ?? "MEDIUM") as "HIGH" | "MEDIUM" | "LOW",
        affectedDevices: s.affectedDevices ?? s.deviceCount ?? 0,
        percentage: s.percentage ?? 0,
        createdAt: s.createdAt ?? "",
      };
    });

    return NextResponse.json(alerts);
  } catch (err) {
    console.error("[HP /alerts]", err);
    return NextResponse.json(mockAlerts);
  }
}
