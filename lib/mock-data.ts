/**
 * 개발/데모용 목 데이터
 * HP_ACCESS_TOKEN이 없을 때 사용
 */

import type { ExperienceMetric, Alert, AppCrashResponse, OobStatistics, EmployeeEngagement, SentimentScore, TrendPoint } from "./types";

export const mockExperienceMetrics: ExperienceMetric[] = [
  { name: "experience",     score: 89.40824,  percentChange: 1.2 },
  { name: "systemHealth",   score: 99.347824, percentChange: 0.1 },
  { name: "osPerformance",  score: 89.35217,  percentChange: -0.5 },
  { name: "network",        score: 99.26087,  percentChange: 0.3 },
  { name: "security",       score: 38.913044, percentChange: -5.2 },
  { name: "applications",   score: 89.78,     percentChange: 2.1 },
];

export const mockAlerts: Alert[] = [
  { title: "방화벽 비활성화",          affectedDevices: 1,  severity: "HIGH" },
  { title: "BitLocker 비활성화",       affectedDevices: 23, severity: "HIGH" },
  { title: "Windows 보안 업데이트 누락", affectedDevices: 3,  severity: "MEDIUM" },
  { title: "BIOS 만료",               affectedDevices: 3,  severity: "MEDIUM" },
];

export const mockAppCrashes: AppCrashResponse = {
  totalRecords: 21,
  data: [
    { appCrashCount: 13, appName: "Snipping Tool",                  deviceAppScore: 97.5, impactedDeviceCount: 3 },
    { appCrashCount: 3,  appName: "Seckhpcinfo",                    deviceAppScore: 97.5, impactedDeviceCount: 3 },
    { appCrashCount: 2,  appName: "Insights Analytics Service",     deviceAppScore: 87.5, impactedDeviceCount: 2 },
    { appCrashCount: 1,  appName: "Microsoft Teams",                deviceAppScore: 95.0, impactedDeviceCount: 1 },
    { appCrashCount: 1,  appName: "Chrome",                         deviceAppScore: 98.0, impactedDeviceCount: 1 },
  ],
};

export const mockOob: OobStatistics = {
  total_enrolled: 0, oob_provisioned: 0, oob_unprovisioned: 0, oob_misc: 0,
};

export const mockEmployeeEngagement: EmployeeEngagement = {
  targetedAudiencesCount: 0, responseCount: 0, sentimentPulseCount: 0, customPulseCount: 0,
};

export const mockSentiment: SentimentScore = {
  sentimentThreshold: 24, totalResponses: 0,
};

export const mockTrend: TrendPoint[] = [
  { date: "1월", score: 82 }, { date: "2월", score: 85 }, { date: "3월", score: 83 },
  { date: "4월", score: 87 }, { date: "5월", score: 86 }, { date: "6월", score: 89 },
  { date: "7월", score: 88 }, { date: "8월", score: 90 }, { date: "9월", score: 89 },
  { date: "10월", score: 91 }, { date: "11월", score: 90 }, { date: "12월", score: 89 },
];

export const metricLabels: Record<string, string> = {
  experience:    "종합 경험지수",
  systemHealth:  "시스템 상태",
  osPerformance: "OS 성능",
  network:       "네트워크 상태",
  security:      "보안",
  applications:  "설치된 애플리케이션",
};
