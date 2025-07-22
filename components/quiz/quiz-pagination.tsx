import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { QuizPaginationProps } from "@/types/flashcard";

export function QuizPagination({
  currentQuestion,
  totalQuestions,
  answeredQuestions,
  correctAnswers,
  onQuestionSelect,
}: QuizPaginationProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {Array.from({ length: totalQuestions }, (_, index) => {
        const questionNumber = index + 1;
        const isAnswered = answeredQuestions.has(index);
        const isCorrect = correctAnswers.has(index);
        const isCurrent = currentQuestion === index;

        return (
          <Button
            key={index}
            variant={isCurrent ? "default" : "outline"}
            size="sm"
            className={cn(
              "h-8 w-8 p-0",
              isAnswered &&
                isCorrect &&
                "bg-green-50 text-green-700 hover:bg-green-100",
              isAnswered &&
                !isCorrect &&
                "bg-red-50 text-red-700 hover:bg-red-100",
              isCurrent && "ring-primary ring-2",
            )}
            onClick={() => onQuestionSelect(index)}
          >
            {questionNumber}
          </Button>
        );
      })}
    </div>
  );
}
