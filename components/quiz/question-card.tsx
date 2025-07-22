import * as React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { useQuizStore } from "@/store/useQuizStore";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { AnswerOption } from "./answer-option";

export function QuestionCard() {
  const {
    currentFlashcard,
    getCurrentAnswer,
    selectAnswer,
    nextQuestion,
    showResults,
    isCurrentQuestionAnswered,
  } = useQuizStore();

  if (!currentFlashcard) {
    return null;
  }

  const currentAnswer = getCurrentAnswer();
  const isAnswered = isCurrentQuestionAnswered();

  return (
    <Card className="w-full">
      <CardHeader className="text-xl font-semibold">
        {currentFlashcard.question}
      </CardHeader>

      <CardContent className="space-y-4">
        {currentFlashcard.options.map((option) => (
          <AnswerOption
            key={option.id}
            option={option}
            isSelected={currentAnswer?.selectedOptionId === option.id}
            isCorrect={
              showResults && option.id === currentFlashcard.correctAnswerId
            }
            isRevealed={showResults}
            isDisabled={isAnswered}
            onClick={() => selectAnswer(option.id)}
          />
        ))}
      </CardContent>

      {showResults && (
        <CardFooter className="bg-muted/50 flex flex-col space-y-4 border-t p-6">
          <p className="text-muted-foreground">
            {currentFlashcard.explanation}
          </p>
          <Button className="ml-auto" onClick={nextQuestion}>
            Next Question
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
