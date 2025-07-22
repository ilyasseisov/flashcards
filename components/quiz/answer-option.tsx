import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { AnswerOptionProps } from "@/types/flashcard";

export function AnswerOption({
  option,
  isSelected,
  isCorrect,
  isRevealed,
  isDisabled,
  onClick,
}: AnswerOptionProps) {
  return (
    <Button
      variant="outline"
      className={cn(
        "w-full justify-start gap-4 p-4 text-left text-lg transition-all",
        isSelected && !isRevealed && "ring-primary ring-2",
        isRevealed &&
          isSelected &&
          isCorrect &&
          "bg-green-50 text-green-700 ring-2 ring-green-600",
        isRevealed &&
          isSelected &&
          !isCorrect &&
          "bg-red-50 text-red-700 ring-2 ring-red-600",
        isRevealed &&
          !isSelected &&
          isCorrect &&
          "bg-green-50 text-green-700 ring-2 ring-green-600",
      )}
      disabled={isDisabled}
      onClick={onClick}
    >
      <span className="flex h-8 w-8 items-center justify-center rounded-full border-2">
        {option.label}
      </span>
      {option.text}
    </Button>
  );
}
