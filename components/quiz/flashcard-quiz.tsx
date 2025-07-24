"use client";

import * as React from "react";
// components
import { QuestionCard } from "./question-card";
import { QuizHeader } from "./quiz-header";
import { QuizComplete } from "./quiz-complete";
// types
import { Flashcard } from "@/types/flashcard";
// store
import { useQuizStore } from "@/store/useQuizStore";

interface FlashcardQuizProps {
  flashcards: Flashcard[];
}

export function FlashcardQuiz({ flashcards }: FlashcardQuizProps) {
  const { initializeQuiz, isCompleted } = useQuizStore();

  React.useEffect(() => {
    initializeQuiz(flashcards);
  }, [flashcards, initializeQuiz]);

  if (isCompleted) {
    return <QuizComplete />;
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8 p-4">
      <QuizHeader />
      <QuestionCard />
    </div>
  );
}
