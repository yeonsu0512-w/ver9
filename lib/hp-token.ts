/**
 * HP 토큰 자동 갱신 - 서버 전용
 * 절대로 클라이언트 컴포넌트에서 import 금지
 */

interface TokenCache {
  value: string;
  expiresAt: number; // ms
}

// 서버 메모리에 캐시 (Next.js dev는 재시작 시 초기화)
let cache: TokenCache = { value: "", expiresAt: 0 };

const TOKEN_URL =
  `https://workforceexperience.hp.com/services/oauth_handler/indirectAccessToken` +
  `?tenantId=${process.env.HP_TENANT_ID_B}`;

async function fetchNewToken(): Promise<string> {
  console.log("[HP Token] 토큰 갱신 중...");

  const res = await fetch(TOKEN_URL, {
    method: "GET",
    headers: {
      "accept": "application/json",
      "accept-language": "ko",
      "origin": "https://workforceexperience.hp.com",
      "referer": "https://workforceexperience.hp.com/",
      // 포털 세션 쿠키가 있어야 동작 — 환경변수로 관리
      "cookie": process.env.HP_SESSION_COOKIE ?? "",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`토큰 갱신 실패: ${res.status} ${res.statusText}`);
  }

  const data = await res.json() as {
    access_token: string;
    expires_in: number;   // 초 단위 (보통 899초 ≈ 15분)
    token_type: string;
  };

  console.log(`[HP Token] 갱신 성공 — ${data.expires_in}초 후 만료`);

  cache = {
    value: data.access_token,
    expiresAt: Date.now() + (data.expires_in - 60) * 1000, // 만료 60초 전에 갱신
  };

  return cache.value;
}

/**
 * 유효한 액세스 토큰 반환
 * 만료 1분 전이면 자동으로 새 토큰 발급
 */
export async function getAccessToken(): Promise<string> {
  // 1. 캐시된 토큰이 아직 유효하면 그대로 반환
  if (cache.value && Date.now() < cache.expiresAt) {
    return cache.value;
  }

  // 2. 환경변수에 토큰이 있고 아직 유효하면 사용 (초기 부팅)
  const envToken = process.env.HP_ACCESS_TOKEN;
  if (envToken && !cache.value) {
    // JWT exp 파싱해서 유효성 확인
    try {
      const payload = JSON.parse(
        Buffer.from(envToken.split(".")[1], "base64url").toString()
      ) as { exp: number };
      const expiresAt = payload.exp * 1000;

      if (Date.now() < expiresAt - 60_000) {
        console.log("[HP Token] 환경변수 토큰 사용 중");
        cache = { value: envToken, expiresAt };
        return envToken;
      }
      console.log("[HP Token] 환경변수 토큰 만료 → 자동 갱신 시도");
    } catch {
      // JWT 파싱 실패 시 그냥 갱신 시도
    }
  }

  // 3. 새 토큰 발급
  return fetchNewToken();
}
