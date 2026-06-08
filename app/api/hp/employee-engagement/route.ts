import { NextResponse } from "next/server";
import { mockEmployeeEngagement } from "@/lib/mock-data";

export async function GET() {
  try {
    const { getEmployeeResponses } = await import("@/lib/hp-client");
    const raw = await getEmployeeResponses();
    return NextResponse.json({
      targetedAudiencesCount: raw.targetedAudiencesCount ?? 0,
      responseCount: raw.responseCount ?? 0,
      sentimentPulseCount: raw.sentimentPulseCount ?? 0,
      customPulseCount: raw.customPulseCount ?? 0,
    });
  } catch (err) {
    console.error("[HP /employee-engagement]", err);
    return NextResponse.json(mockEmployeeEngagement);
  }
}
