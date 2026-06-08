import { NextResponse } from "next/server";
import { mockOob } from "@/lib/mock-data";

export async function GET() {
  try {
    const { searchDevices } = await import("@/lib/hp-client");
    const raw = await searchDevices();
    const total = raw?.hits?.total?.value ?? 0;
    return NextResponse.json({ total_enrolled: total, oob_provisioned: 0, oob_unprovisioned: 0, oob_misc: 0 });
  } catch (err) {
    console.error("[HP /oob]", err);
    return NextResponse.json(mockOob);
  }
}
