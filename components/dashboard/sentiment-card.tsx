"use client";

import type { SentimentScore, EmployeeEngagement } from "@/lib/types";
import { MessageSquare, Users, Smile } from "lucide-react";

interface Props {
  sentiment: SentimentScore;
  engagement: EmployeeEngagement;
}

export function SentimentCard({ sentiment, engagement }: Props) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-border p-5 space-y-3">
      <h2 className="text-sm font-semibold text-foreground">직원 참여 / 감정 점수</h2>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-secondary rounded-lg p-3 space-y-1">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Users size={12} />
            <span className="text-[10px]">대상 고객</span>
          </div>
          <p className="text-lg font-bold text-foreground">{engagement.targetedAudiencesCount}</p>
        </div>

        <div className="bg-secondary rounded-lg p-3 space-y-1">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <MessageSquare size={12} />
            <span className="text-[10px]">응답 수</span>
          </div>
          <p className="text-lg font-bold text-foreground">{engagement.responseCount}</p>
        </div>

        <div className="bg-secondary rounded-lg p-3 space-y-1">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Smile size={12} />
            <span className="text-[10px]">감정 임계값</span>
          </div>
          <p className="text-lg font-bold text-foreground">{sentiment.sentimentThreshold}</p>
        </div>

        <div className="bg-secondary rounded-lg p-3 space-y-1">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <MessageSquare size={12} />
            <span className="text-[10px]">총 응답</span>
          </div>
          <p className="text-lg font-bold text-foreground">{sentiment.totalResponses}</p>
        </div>
      </div>
    </div>
  );
}
