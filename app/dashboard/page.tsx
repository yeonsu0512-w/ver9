import {
  mockExperienceMetrics,
  mockTrend,
  mockAlerts,
  mockAppCrashes,
} from "@/lib/mock-data";
import {
  getExperienceScore,
  getExperienceOverTime,
  getAlerts,
  getAppCrashes,
} from "@/lib/hp-client";

export default async function DashboardPage() {
  const [scoreRes, trendRes, alertRes, crashRes] = await Promise.allSettled([
    getExperienceScore(),
    getExperienceOverTime(90),
    getAlerts(),
    getAppCrashes(),
  ]);

  // 경험지수
  const metrics =
    scoreRes.status === "fulfilled"
      ? (scoreRes.value.scores ?? scoreRes.value.data ?? mockExperienceMetrics)
      : mockExperienceMetrics;

  // 추이
  const trend =
    trendRes.status === "fulfilled" && trendRes.value.data?.length
      ? trendRes.value.data.map((d) => ({ date: d.date, score: d.good ?? 0 }))
      : mockTrend;

  // 알림
  const alerts =
    alertRes.status === "fulfilled" &&
    alertRes.value.hits?.hits &&
    alertRes.value.hits.hits.length > 0
      ? alertRes.value.hits.hits.map((h) => ({
          title: h._source?.title ?? "알 수 없는 알림",
          severity: (h._source?.severity ?? "MEDIUM") as
            | "HIGH"
            | "MEDIUM"
            | "LOW",
          affectedDevices:
            h._source?.affectedDevices ?? h._source?.deviceCount ?? 0,
          percentage: h._source?.percentage ?? 0,
          createdAt: h._source?.createdAt ?? "",
        }))
      : mockAlerts;

  // 앱 충돌
  const crashes =
    crashRes.status === "fulfilled" &&
    crashRes.value.records?.[0]?.facet?.facetResult?.buckets?.length
      ? {
          totalRecords:
            crashRes.value.records[0].facet!.facetResult!.buckets!.length,
          data: crashRes.value.records[0].facet!.facetResult!.buckets!.map(
            (b) => ({
              appName: b.key ?? b.appName ?? "Unknown",
              appCrashCount: b.docCount ?? b.appCrashCount ?? 0,
              impactedDeviceCount: b.impactedDeviceCount ?? 0,
            }),
          ),
        }
      : mockAppCrashes;

  return (
    <div className="dashboard-page">
      <div className="top-section">
        <ExperienceSection metrics={metrics} />
        <TrendSection data={trend} />
      </div>
      <AlertSection alerts={alerts} />
      <div className="bottom-section">
        <FleetSection />
        <AppCrashSection data={crashes} />
      </div>
    </div>
  );
}

// ─── Experience Section ───────────────────────────────────────────
function ExperienceSection({
  metrics,
}: {
  metrics: typeof mockExperienceMetrics;
}) {
  type MetricWithExtra = {
    name: string;
    score: number;
    percentChange?: number;
    distribution?: {
      totalDeviceCount: number;
      greatDeviceCount: number;
      fairDeviceCount: number;
      poorDeviceCount: number;
    };
  };

  function getScore(name: string) {
    const m = metrics.find((m) => m.name === name) as
      | MetricWithExtra
      | undefined;
    return m ? Math.round(m.score) : 0;
  }
  function getChange(name: string): string | null {
    const m = metrics.find((m) => m.name === name) as
      | MetricWithExtra
      | undefined;
    if (!m?.percentChange) return null;
    const v = Math.round(m.percentChange * 10) / 10;
    return v > 0 ? `+${v}` : `${v}`;
  }

  const main = metrics.find((m) => m.name === "experience") as
    | MetricWithExtra
    | undefined;
  const score = main ? Math.round(main.score) : 89;
  const mainChange = getChange("experience");
  const dist = main?.distribution;

  const rows = [
    { name: "감정", key: "sentiment", score: 0, isSetup: true, change: null },
    {
      name: "시스템 상태",
      key: "systemHealth",
      score: getScore("systemHealth"),
      change: getChange("systemHealth"),
    },
    {
      name: "OS 성능",
      key: "osPerformance",
      score: getScore("osPerformance"),
      change: getChange("osPerformance"),
    },
    {
      name: "네트워크 상태",
      key: "network",
      score: getScore("network"),
      change: getChange("network"),
    },
  ];

  const right = [
    {
      name: "보안",
      key: "security",
      score: getScore("security"),
      change: getChange("security"),
      color: "#ef4444",
    },
    {
      name: "설치된 애플리케이션",
      key: "applications",
      score: getScore("applications"),
      change: getChange("applications"),
      color: "#22c55e",
    },
    { name: "웹 애플리케이션", key: "webApp", score: 0, isSetup: true },
  ];

  function getBarColor(score: number) {
    if (score >= 85) return "#22c55e";
    if (score >= 55) return "#f97316";
    return "#ef4444";
  }

  return (
    <div className="exp-card">
      <div className="exp-header">
        <span className="exp-title">경험지수</span>
        <span className="exp-user-btn">사용자 정의 ⓘ</span>
      </div>
      <div className="exp-body">
        <div className="exp-main">
          <div className="exp-main-label">종합 점수</div>
          <div className="exp-main-score-row">
            <div className="exp-main-score-wrap">
              {mainChange && (
                <span
                  className="exp-change-label"
                  style={{
                    color: mainChange.startsWith("+") ? "#22c55e" : "#ef4444",
                  }}
                >
                  {mainChange.startsWith("+") ? "▲" : "▼"}
                  {mainChange.replace("+", "").replace("-", "")}
                </span>
              )}
              <span className="exp-main-score">{score}</span>
              <span className="exp-arrow-icon">›</span>
            </div>
            <div className="exp-great-badge">
              {score >= 85 ? "Great" : score >= 55 ? "Fair" : "Poor"}
            </div>
          </div>
          <div className="exp-bench-row">
            <span>업계 벤치마크</span>
            <span className="exp-bench-num">93</span>
          </div>
          <div className="exp-bench-row">
            <span>글로벌 벤치마크</span>
            <span className="exp-bench-num">91</span>
          </div>
          {dist && (
            <div className="exp-bench-row" style={{ marginTop: 4 }}>
              <span style={{ color: "#9ca3af", fontSize: 11 }}>
                총 {dist.totalDeviceCount}대 · 우수 {dist.greatDeviceCount} ·
                양호 {dist.fairDeviceCount} · 불량 {dist.poorDeviceCount}
              </span>
            </div>
          )}
          <div className="exp-divider" />
          {rows.map((row) => (
            <div className="exp-metric-row" key={row.key}>
              <div className="exp-metric-left">
                <span className="exp-metric-name">{row.name}</span>
                {row.isSetup ? (
                  <span className="exp-setup-btn">설정 ›</span>
                ) : (
                  <div className="exp-metric-score-wrap">
                    {row.change && (
                      <span className="exp-mini-change">{row.change}</span>
                    )}
                    <span className="exp-metric-score">{row.score} ›</span>
                  </div>
                )}
              </div>
              {!row.isSetup && (
                <div className="exp-bar-wrap">
                  <div
                    className="exp-bar"
                    style={{
                      width: `${row.score}%`,
                      background: getBarColor(row.score),
                    }}
                  />
                  <div className="exp-bar-red" style={{ width: "4%" }} />
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="exp-right">
          {right.map((item) => (
            <div className="exp-metric-row" key={item.key}>
              <div className="exp-metric-left">
                <span className="exp-metric-name">{item.name}</span>
                {item.isSetup ? (
                  <span className="exp-setup-btn">설정 ›</span>
                ) : (
                  <div className="exp-metric-score-wrap">
                    {item.change && (
                      <span className="exp-mini-change">{item.change}</span>
                    )}
                    <span
                      className="exp-metric-score"
                      style={{ color: item.color }}
                    >
                      {item.score} ›
                    </span>
                  </div>
                )}
              </div>
              {!item.isSetup && (
                <div className="exp-bar-wrap">
                  <div
                    className="exp-bar"
                    style={{ width: `${item.score}%`, background: item.color }}
                  />
                  {item.key === "security" && (
                    <div className="exp-bar-orange" style={{ width: "30%" }} />
                  )}
                </div>
              )}
            </div>
          ))}
          <div className="exp-legend">
            <span className="legend-dot green" />
            우수 (85-100)
            <span className="legend-dot orange" />
            보통 (55-84)
            <span className="legend-dot red" />
            나쁨 (0-54)
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Trend Section ────────────────────────────────────────────────
function TrendSection({ data }: { data: { date: string; score: number }[] }) {
  const w = 460,
    h = 200,
    px = 40,
    py = 20;
  const dates = ["5월 24일", "5월 31일", "6월 7일"];
  const greenPoints = [
    { x: px, y: h - py - 10 },
    { x: px + (w - px * 2) * 0.5, y: h - py - 10 },
    { x: w - px, y: h - py - 120 },
  ];
  const orangePoints = [
    { x: px, y: h - py - 10 },
    { x: px + (w - px * 2) * 0.5, y: h - py - 10 },
    { x: w - px, y: h - py - 30 },
  ];
  const redPoints = [
    { x: px, y: h - py - 10 },
    { x: px + (w - px * 2) * 0.5, y: h - py - 10 },
    { x: w - px, y: h - py - 10 },
  ];
  function pts(points: { x: number; y: number }[]) {
    return points.map((p) => `${p.x},${p.y}`).join(" ");
  }

  return (
    <div className="trend-card">
      <div className="trend-header">시간 경과에 따른 경험</div>
      <svg viewBox={`0 0 ${w} ${h}`} className="trend-svg">
        {[0, 5, 10, 15, 20].map((v, i) => (
          <text
            key={v}
            x="32"
            y={h - py - i * ((h - py * 2) / 4) + 4}
            fontSize="10"
            fill="#9ca3af"
            textAnchor="end"
          >
            {v}
          </text>
        ))}
        {[0, 1, 2, 3, 4].map((i) => (
          <line
            key={i}
            x1={px}
            y1={h - py - i * ((h - py * 2) / 4)}
            x2={w - px}
            y2={h - py - i * ((h - py * 2) / 4)}
            stroke="#e5e7eb"
            strokeWidth="1"
          />
        ))}
        {dates.map((d, i) => (
          <text
            key={d}
            x={px + i * ((w - px * 2) / 2)}
            y={h - 4}
            fontSize="10"
            fill="#9ca3af"
            textAnchor="middle"
          >
            {d}
          </text>
        ))}
        <polyline
          points={pts(greenPoints)}
          fill="none"
          stroke="#22c55e"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <polyline
          points={pts(orangePoints)}
          fill="none"
          stroke="#f97316"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <polyline
          points={pts(redPoints)}
          fill="none"
          stroke="#ef4444"
          strokeWidth="2.5"
          strokeLinejoin="round"
          strokeDasharray="4 3"
        />
        {greenPoints.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="4" fill="#22c55e" />
        ))}
        {orangePoints.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="4" fill="#f97316" />
        ))}
      </svg>
      <div className="trend-legend">
        <span>
          <span className="dot green" />
          우수
        </span>
        <span>
          <span className="dot orange" />
          양호
        </span>
        <span>
          <span className="dot red" />
          불량
        </span>
      </div>
    </div>
  );
}

// ─── Alert Section ────────────────────────────────────────────────
function AlertSection({ alerts }: { alerts: typeof mockAlerts }) {
  type AlertItem = {
    title: string;
    severity: string;
    affectedDevices: number;
    percentage?: number;
    ago?: string;
  };
  function severityLabel(s: string) {
    return s === "HIGH" ? "높음" : s === "MEDIUM" ? "보통" : "낮음";
  }
  function severityColor(s: string) {
    return s === "HIGH" ? "#ef4444" : s === "MEDIUM" ? "#f97316" : "#3b82f6";
  }
  function severityBg(s: string) {
    return s === "HIGH" ? "#fef2f2" : s === "MEDIUM" ? "#fff7ed" : "#eff6ff";
  }
  const cards: AlertItem[] =
    Array.isArray(alerts) && alerts.length > 0 ? alerts : [];
  const top3 = cards.slice(0, 3);
  const rest = cards.slice(3, 5);

  return (
    <div className="alert-section">
      {top3.map((c, i) => (
        <div className="alert-card" key={i}>
          <div
            className="alert-badge"
            style={{
              background: severityBg(c.severity),
              color: severityColor(c.severity),
            }}
          >
            <span
              className="alert-badge-dot"
              style={{ background: severityColor(c.severity) }}
            />
            {severityLabel(c.severity)}
          </div>
          <div className="alert-title">{c.title}</div>
          <div className="alert-arrow">›</div>
          <div className="alert-meta">
            {c.ago && <span className="alert-meta-item">🕐 {c.ago}</span>}
            <span className="alert-meta-item">
              🖥 {c.affectedDevices}대
              {c.percentage ? ` | 모니터링 중인 장치의 ${c.percentage}%` : ""}
            </span>
          </div>
        </div>
      ))}
      <div style={{ gridColumn: "1 / -1", display: "flex", gap: "1rem" }}>
        {rest.map((c, i) => (
          <div className="alert-card alert-card-wide" key={i}>
            <div
              className="alert-badge"
              style={{
                background: severityBg(c.severity),
                color: severityColor(c.severity),
              }}
            >
              <span
                className="alert-badge-dot"
                style={{ background: severityColor(c.severity) }}
              />
              {severityLabel(c.severity)}
            </div>
            <div className="alert-title">{c.title}</div>
            <div className="alert-arrow">›</div>
            <div className="alert-meta">
              {c.ago && <span className="alert-meta-item">🕐 {c.ago}</span>}
              <span className="alert-meta-item">🖥 {c.affectedDevices}대</span>
            </div>
          </div>
        ))}
        <div className="alert-card alert-card-wide alert-card-more">
          <a href="#" className="alert-more-link">
            모든 경고 보기 ›
          </a>
        </div>
      </div>
    </div>
  );
}

// ─── Fleet Section ────────────────────────────────────────────────
function FleetSection() {
  const cx = 90,
    cy = 90,
    r = 60,
    stroke = 22;
  const circ = 2 * Math.PI * r;
  const segments = [
    { pct: 75, color: "#312e81", label: "HP" },
    { pct: 15, color: "#e879f9", label: "SAMSUNG" },
    { pct: 10, color: "#f43f5e", label: "APPLE" },
  ];
  let offset = 0;
  const arcs = segments.map((s) => {
    const dash = (s.pct / 100) * circ;
    const gap = circ - dash;
    const arc = { ...s, dash, gap, offset };
    offset += dash;
    return arc;
  });

  return (
    <div className="fleet-card">
      <div className="fleet-header">플릿 인벤토리</div>
      <div className="fleet-body">
        <div className="fleet-list">
          <div className="fleet-item fleet-item-active">
            <span className="fleet-item-icon">🖥</span>
            <span className="fleet-item-name">PC</span>
            <span className="fleet-item-count">32</span>
          </div>
          <div className="fleet-item">
            <span className="fleet-item-icon">☁️</span>
            <span className="fleet-item-name">가상 머신</span>
            <span className="fleet-item-count" style={{ color: "#9ca3af" }}>
              --
            </span>
          </div>
        </div>
        <div className="fleet-donut-wrap">
          <svg width="180" height="180" viewBox="0 0 180 180">
            {arcs.map((a, i) => (
              <circle
                key={i}
                cx={cx}
                cy={cy}
                r={r}
                fill="none"
                stroke={a.color}
                strokeWidth={stroke}
                strokeDasharray={`${a.dash} ${a.gap}`}
                strokeDashoffset={-a.offset + circ * 0.25}
                transform="rotate(-90 90 90)"
              />
            ))}
            <text
              x={cx}
              y={cy - 8}
              textAnchor="middle"
              fontSize="26"
              fontWeight="700"
              fill="#1f2937"
            >
              32
            </text>
            <text
              x={cx}
              y={cy + 14}
              textAnchor="middle"
              fontSize="11"
              fill="#6b7280"
            >
              PC
            </text>
          </svg>
          <div className="fleet-tooltip">HP : 24 (75%)</div>
          <div className="fleet-legend">
            {segments.map((s) => (
              <span key={s.label} className="fleet-legend-item">
                <span
                  className="fleet-legend-dot"
                  style={{ background: s.color }}
                />
                {s.label}
              </span>
            ))}
          </div>
          <div className="fleet-link">PC 목록 보기</div>
        </div>
      </div>
    </div>
  );
}

// ─── App Crash Section ────────────────────────────────────────────
function AppCrashSection({ data }: { data: typeof mockAppCrashes }) {
  const HIDDEN_APPS = ["Hp Insights Analytics Service", "Seckhpcinfo"];
  const leftApps = data.data
    .filter((a) => !HIDDEN_APPS.includes(a.appName))
    .slice(0, 5);
  const rightApps = [
    { appName: "Snippingtool.exe", impactedDeviceCount: 1 },
    { appName: "앱 선택", impactedDeviceCount: 1 },
    { appName: "Touchen Key", impactedDeviceCount: 1 },
    { appName: "Microsoft Excel", impactedDeviceCount: 1 },
    { appName: "Wehagoagent.exe", impactedDeviceCount: 1 },
  ];

  return (
    <div className="crash-card">
      <div className="crash-header">
        <span>상위 앱 충돌</span>
        <span className="crash-arrow">→</span>
      </div>
      <div className="crash-body">
        <div className="crash-col">
          <div className="crash-col-header">
            <span>앱</span>
            <span>영향받은 장치</span>
          </div>
          {leftApps.map((app, i) => (
            <div className="crash-row" key={i}>
              <span className="crash-app-name">{app.appName}</span>
              <div className="crash-right">
                <span className="crash-count">{app.impactedDeviceCount} ›</span>
                <div className="crash-bar-wrap">
                  <div
                    className="crash-bar"
                    style={{ width: `${(app.appCrashCount / 13) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="crash-col">
          <div className="crash-col-header">
            <span>앱</span>
            <span>영향받은 장치</span>
          </div>
          {rightApps.map((app, i) => (
            <div className="crash-row" key={i}>
              <span className="crash-app-name">{app.appName}</span>
              <div className="crash-right">
                <span className="crash-count">{app.impactedDeviceCount} ›</span>
                <div className="crash-bar-wrap">
                  <div className="crash-bar" style={{ width: "25%" }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
