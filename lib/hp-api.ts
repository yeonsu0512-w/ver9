/**
 * HP API 서버 전용 클라이언트
 * 절대 클라이언트 컴포넌트에서 import 금지
 */

const HP_API_BASE = process.env.HP_API_BASE_URL!;
const HP_TOKEN = process.env.HP_ACCESS_TOKEN!;
const HP_TENANT = process.env.HP_TENANT_ID!;

async function hpFetch<T>(path: string): Promise<T> {
  const url = `${HP_API_BASE}${path}`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${HP_TOKEN}`,
      "X-Tenant-Id": HP_TENANT,
      "Content-Type": "application/json",
    },
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error(`HP API error: ${res.status} ${res.statusText} for ${path}`);
  }

  return res.json();
}

export const hpApi = {
  getExperienceScores: () =>
    hpFetch<Array<{ name: string; score: number }>>("/v1/experience/scores"),

  getAlerts: () =>
    hpFetch<Array<{ title: string; affectedDevices: number; severity: string }>>("/v1/alerts"),

  getAppCrashes: () =>
    hpFetch<{ totalRecords: number; data: Array<{ appName: string; appCrashCount: number; impactedDeviceCount: number; deviceAppScore: number }> }>(
      "/v1/app-crashes?limit=10"
    ),

  getOobStatistics: () =>
    hpFetch<{ total_enrolled: number; oob_provisioned: number; oob_unprovisioned: number; oob_misc: number }>(
      "/v1/oob/statistics"
    ),

  getEmployeeEngagement: () =>
    hpFetch<{ targetedAudiencesCount: number; responseCount: number; sentimentPulseCount: number; customPulseCount: number }>(
      "/v1/employee-engagement"
    ),

  getSentiment: () =>
    hpFetch<{ sentimentThreshold: number; totalResponses: number }>("/v1/sentiment/summary"),

  getExperienceTrend: () =>
    hpFetch<Array<{ date: string; score: number }>>("/v1/experience/trend?days=30"),
};
