import { NextResponse } from "next/server";
import { mockSentiment } from "@/lib/mock-data";

export async function GET() {
  try {
    const { getSentimentThreshold } = await import("@/lib/hp-client");
    const raw = await getSentimentThreshold();
    return NextResponse.json({
      sentimentThreshold: raw.sentimentThreshold ?? raw.threshold ?? 24,
      totalResponses: raw.totalResponses ?? 0,
    });
  } catch (err) {
    console.error("[HP /sentiment]", err);
    return NextResponse.json(mockSentiment);
  }
}
