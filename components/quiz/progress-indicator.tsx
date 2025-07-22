import * as React from "react";
import { Progress } from "@/components/ui/progress";
import type { ProgressIndicatorProps } from "@/types/flashcard";

export function ProgressIndicator({
  current,
  total,
  className,
}: ProgressIndicatorProps) {
  const percentage = Math.round((current / total) * 100);

  return (
    <div className={className}>
      <Progress value={percentage} className="h-2" />
      <div className="text-muted-foreground mt-2 flex justify-between text-sm">
        <span>
          Question {current} of {total}
        </span>
        <span>{percentage}%</span>
      </div>
    </div>
  );
}
