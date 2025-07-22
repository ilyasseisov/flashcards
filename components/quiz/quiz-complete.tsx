import * as React from "react";
import { useQuizStore } from "@/store/useQuizStore";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { RefreshCw } from "lucide-react";

export function QuizComplete() {
  const { progress, resetQuiz } = useQuizStore();
  const score = Math.round((progress.correctCount / progress.total) * 100);

  return (
    <Card className="mx-auto max-w-2xl">
      <CardHeader className="text-center">
        <h2 className="text-2xl font-bold">Quiz Complete!</h2>
        <p className="text-muted-foreground">
          You scored {score}% ({progress.correctCount} out of {progress.total})
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex justify-between text-sm">
          <span>Total Questions:</span>
          <span>{progress.total}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Correct Answers:</span>
          <span className="text-green-600">{progress.correctCount}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Incorrect Answers:</span>
          <span className="text-red-600">
            {progress.total - progress.correctCount}
          </span>
        </div>
      </CardContent>

      <CardFooter>
        <Button className="w-full" onClick={resetQuiz}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Try Again
        </Button>
      </CardFooter>
    </Card>
  );
}
