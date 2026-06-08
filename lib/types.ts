export interface ExperienceMetric {
  name: string;
  score: number;
  percentChange?: number;
}

export interface Alert {
  title: string;
  severity: "HIGH" | "MEDIUM" | "LOW";
  affectedDevices: number;
}

export interface AppCrash {
  appName: string;
  appCrashCount: number;
  impactedDeviceCount: number;
  deviceAppScore?: number;
}

export interface AppCrashResponse {
  totalRecords: number;
  data: AppCrash[];
}

export interface OobStatistics {
  total_enrolled: number;
  oob_provisioned: number;
  oob_unprovisioned: number;
  oob_misc: number;
}

export interface EmployeeEngagement {
  targetedAudiencesCount: number;
  responseCount: number;
  sentimentPulseCount: number;
  customPulseCount: number;
}

export interface SentimentScore {
  sentimentThreshold: number;
  totalResponses: number;
}

export interface TrendPoint {
  date: string;
  score: number;
}
