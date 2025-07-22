import * as React from "react";
import { useQuizStore } from "@/store/useQuizStore";
import { QuizPagination } from "./quiz-pagination";
import { ProgressIndicator } from "./progress-indicator";

export function QuizHeader() {
  const {
    currentQuestionIndex,
    totalQuestions,
    getAnsweredQuestions,
    getCorrectAnswers,
    jumpToQuestion,
    progress,
  } = useQuizStore();

  return (
    <div className="space-y-6">
      <ProgressIndicator
        current={progress.current}
        total={progress.total}
        className="w-full"
      />

      <QuizPagination
        currentQuestion={currentQuestionIndex}
        totalQuestions={totalQuestions}
        answeredQuestions={getAnsweredQuestions()}
        correctAnswers={getCorrectAnswers()}
        onQuestionSelect={jumpToQuestion}
      />
    </div>
  );
}
