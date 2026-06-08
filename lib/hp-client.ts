/**
 * HP API 클라이언트 - 서버 전용
 * 절대로 클라이언트 컴포넌트에서 import 금지
 */

import { getAccessToken } from "./hp-token";

const BASE = "https://api-us.workforceexperience.hp.com";
const TENANT_A = process.env.HP_TENANT_ID!;   // faa0b75f-...
const TENANT_B = process.env.HP_TENANT_ID_B!; // 76263522-...

async function headers() {
  const token = await getAccessToken(); // 자동 갱신
  return {
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json",
    "accept": "application/json",
    "accept-language": "ko",
    "x-requested-with": "XMLHttpRequest",
    "origin": "https://workforceexperience.hp.com",
    "referer": "https://workforceexperience.hp.com/",
  };
}

async function hpFetch<T>(url: string, body?: object): Promise<T> {
  const h = await headers();
  const res = body
    ? await fetch(url, { method: "POST", headers: h, body: JSON.stringify(body) })
    : await fetch(url, { method: "GET", headers: h, next: { revalidate: 60 } });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`HP API ${res.status} ${res.statusText} — ${url}\n${text}`);
  }
  return res.json() as Promise<T>;
}

// ─── 경험지수 ──────────────────────────────────────────────────────
export async function getExperienceScore() {
  return hpFetch<{
    scores?: Array<{ name: string; score: number; percentChange?: number; distribution?: unknown }>;
    data?:   Array<{ name: string; score: number; percentChange?: number; distribution?: unknown }>;
  }>(`${BASE}/api/v1/reports/1.0/tenants/${TENANT_B}/experience-score`);
}

// ─── 경험 추이 ─────────────────────────────────────────────────────
export async function getExperienceOverTime(days = 90) {
  return hpFetch<{
    data?: Array<{ date: string; good?: number; fair?: number; poor?: number; score?: number }>;
  }>(`${BASE}/api/v1/reports/1.0/tenants/${TENANT_B}/experience-over-time?days=${days}`);
}

// ─── 알림 ─────────────────────────────────────────────────────────
export async function getAlerts(userId?: string) {
  const innerQuery = {
    query: {
      bool: {
        must: [
          { bool: { should: [{ match: { type: "alerts" } }] } },
          { bool: { should: [{ match: { deleted: false } }] } },
          { bool: { should: [{ match: { dismissed: false } }] } },
          ...(userId
            ? [{ bool: { should: [{ match: { "userId.keyword": userId } }] } }]
            : []),
        ],
      },
    },
    from: 0,
    size: 20,
    sort: [{ createdAt: { order: "DESC", unmapped_type: "long" } }],
  };

  return hpFetch<{
    hits?: {
      total?: number | { value: number };
      hits?: Array<{
        _source?: {
          title?: string;
          severity?: string;
          affectedDevices?: number;
          deviceCount?: number;
          createdAt?: string;
          percentage?: number;
          description?: string;
        };
      }>;
    };
  }>(
    `${BASE}/services/ccc-search/1.3/tenants/${TENANT_A}/multitenanted/_search?type=alerts`,
    {
      index_list: ["alerts"],
      query: JSON.stringify(innerQuery),
      search_type: "tenanted",
      tenant_ids: [TENANT_A],
    }
  );
}

// ─── 앱 충돌 ──────────────────────────────────────────────────────
export async function getAppCrashes() {
  return hpFetch<{
    total?: unknown;
    records?: Array<{
      count?: { lowerBound?: number };
      facet?: {
        facetResult?: {
          buckets?: Array<{
            key?: string;
            appName?: string;
            docCount?: number;
            appCrashCount?: number;
            impactedDeviceCount?: number;
          }>;
        };
      };
    }>;
  }>(
    `${BASE}/services/amqs/1.0/tenants/${TENANT_A}/assets/search/facets`,
    {
      index_list: ["assets"],
      query: JSON.stringify({
        query: { match_all: {} },
        from: 0,
        size: 10,
        aggs: {
          top_crashes: {
            terms: { field: "appCrashes.appName.keyword", size: 10 },
          },
        },
      }),
      search_type: "tenanted",
      tenant_ids: [TENANT_A],
    }
  );
}

// ─── 직원 응답 ────────────────────────────────────────────────────
export async function getEmployeeResponses() {
  return hpFetch<{
    targetedAudiencesCount?: number;
    responseCount?: number;
    sentimentPulseCount?: number;
    customPulseCount?: number;
  }>(`${BASE}/services/experience_campaign_service/1.0/tenants/${TENANT_B}/adhoc/dashboard/employee-responses`);
}

// ─── 감정 임계값 ──────────────────────────────────────────────────
export async function getSentimentThreshold() {
  return hpFetch<{
    sentimentThreshold?: number;
    totalResponses?: number;
    threshold?: number;
  }>(`${BASE}/services/ee-datasync-engine/1.0/tenants/${TENANT_B}/sentiment-threshold`);
}

// ─── 테넌트 정보 ──────────────────────────────────────────────────
export async function getTenantInfo() {
  return hpFetch<{ id: string; name: string; status: string }>(
    `${BASE}/api/2.0/tenants/${TENANT_A}`
  );
}

// ─── 기기 검색 ───────────────────────────────────────────────────
export async function searchDevices() {
  return hpFetch<{ hits?: { total?: { value?: number }; hits?: unknown[] } }>(
    `${BASE}/services/ccc-search/1.3/tenants/${TENANT_A}/multitenanted/_search`,
    {
      index_list: ["devices"],
      query: JSON.stringify({
        query: { match_all: {} },
        from: 0,
        size: 20,
      }),
      search_type: "tenanted",
      tenant_ids: [TENANT_A],
    }
  );
}
