import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatScore(score: number): number {
  return Math.round(score);
}

export function getSeverityColor(severity: string) {
  switch (severity) {
    case "HIGH":   return "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400";
    case "MEDIUM": return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400";
    case "LOW":    return "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400";
    default:       return "bg-gray-50 text-gray-700 border-gray-200";
  }
}

export function getScoreColor(score: number) {
  if (score >= 80) return "text-green-600 dark:text-green-400";
  if (score >= 60) return "text-amber-600 dark:text-amber-400";
  return "text-red-600 dark:text-red-400";
}

export function getScoreLabel(score: number) {
  if (score >= 80) return "우수";
  if (score >= 60) return "양호";
  return "불량";
}
