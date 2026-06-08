# SINSUNG CNS – Workforce Experience Portal

HP Workforce Experience 플랫폼을 신성씨앤에스 브랜드 포털로 재구성한 Next.js 앱.

## 시작하기

```bash
npm install
npm run dev
```

브라우저에서 http://localhost:3000 접속

## 환경 변수 설정

`.env.local` 파일에 HP API 토큰을 설정하세요:

```env
HP_API_BASE_URL=https://api-us.workforceexperience.hp.com
HP_ACCESS_TOKEN=your_actual_token_here
HP_TENANT_ID=your_tenant_id_here
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

- 토큰 없이 실행하면 **목 데이터(Mock Data)** 로 동작합니다.
- 토큰 설정 시 실제 HP API를 호출합니다.

## 보안 구조

```
Browser → /api/hp/* (Next.js Route Handler) → HP API
```

- 클라이언트에서 HP API 직접 호출 **절대 금지**
- HP 토큰은 서버 환경변수에서만 관리
- `lib/hp-client.ts` 는 서버 전용

## 기술 스택

- Next.js 15 (App Router)
- TypeScript strict mode
- TailwindCSS + shadcn/ui 스타일
- Recharts (차트)
- TanStack React Query

## 폴더 구조

```
app/
  dashboard/page.tsx     ← 메인 대시보드
  alerts/page.tsx
  devices/page.tsx
  analytics/page.tsx
  settings/page.tsx
  api/hp/
    dashboard/route.ts   ← HP 경험지수 프록시
    alerts/route.ts
    app-crashes/route.ts
    oob/route.ts
    sentiment/route.ts
    employee-engagement/route.ts

components/
  layout/
    topbar.tsx           ← 신성씨앤에스 헤더
    sidebar.tsx          ← 좌측 사이드바
  dashboard/
    experience-card.tsx  ← 경험지수 카드
    alerts-card.tsx      ← 알림 카드
    app-crash-card.tsx   ← 앱 충돌 카드
    trend-chart.tsx      ← 경험 추이 라인차트
    oob-chart.tsx        ← 원격 지원 도넛차트
    sentiment-card.tsx   ← 직원 참여 카드

lib/
  hp-client.ts           ← HP API 클라이언트 (서버 전용)
  mock-data.ts           ← 개발용 목 데이터
  types.ts               ← TypeScript 타입 정의
  utils.ts               ← 유틸리티 함수
  query-client.tsx       ← React Query 프로바이더
```
