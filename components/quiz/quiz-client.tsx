// components/quiz/quiz-client.tsx
"use client";

import { useEffect, useState } from "react";
import { useQuizStore } from "@/stores/quizStore"; // Import our Zustand store
import { IFlashcardProgress } from "@/lib/models/flashcard-progress"; // Import the type
import { IFlashcard } from "@/lib/models/flashcard"; // Import the type
import Link from "next/link";

// Define the props this component will receive from the Server Component
interface QuizClientProps {
  initialFlashcards: IFlashcard[];
  initialProgress: IFlashcardProgress[];
}

// Our main interactive component
const QuizClient = ({
  initialFlashcards,
  initialProgress,
}: QuizClientProps) => {
  // Use local state to manage the UI for the current flashcard, like showing the answer.
  const [showAnswer, setShowAnswer] = useState(false);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(
    null,
  );

  // Add hydration state to prevent SSR mismatch
  const [isHydrated, setIsHydrated] = useState(false);

  // --- 1. Connect to the Zustand Store (FIXED) ---
  // Use a more stable selector pattern
  const flashcards = useQuizStore((state) => state.flashcards);
  const currentFlashcardIndex = useQuizStore(
    (state) => state.currentFlashcardIndex,
  );
  const quizStatus = useQuizStore((state) => state.quizStatus);

  // Get actions separately
  const initializeQuiz = useQuizStore((state) => state.initializeQuiz);
  const nextFlashcard = useQuizStore((state) => state.nextFlashcard);
  const setFlashcardProgress = useQuizStore(
    (state) => state.setFlashcardProgress,
  );

  // --- 2. Handle hydration and initialization ---
  useEffect(() => {
    // Mark as hydrated first
    setIsHydrated(true);

    // Initialize the quiz only once with the server data
    if (initialFlashcards.length > 0) {
      console.log("Initializing Zustand store with server data.");
      initializeQuiz(initialFlashcards, initialProgress);
    }
  }, []); // Empty dependency array - run only once

  // Handle the click event for an option
  const handleAnswerClick = (optionIndex: number) => {
    // If the answer is already shown, do nothing.
    if (showAnswer) return;

    // Set the user's selected option
    setSelectedOptionIndex(optionIndex);

    // Get the current flashcard to check the correct answer.
    const currentFlashcard = flashcards[currentFlashcardIndex];
    if (!currentFlashcard) return;

    const isCorrect = optionIndex === currentFlashcard.correctAnswerIndex;
    setShowAnswer(true); // Show the answer feedback.

    // Update the progress in our Zustand store.
    // In a later step, we'll also trigger a Server Action here to save this to the DB.
    setFlashcardProgress(
      currentFlashcard._id,
      isCorrect ? "correct" : "incorrect",
    );
  };

  // Handle next question button click
  const handleNextQuestion = () => {
    setShowAnswer(false);
    setSelectedOptionIndex(null);
    nextFlashcard();
  };

  // --- 3. Render Logic based on Quiz Status ---

  // Show loading until hydrated and quiz is initialized
  if (!isHydrated || quizStatus === "loading" || flashcards.length === 0) {
    return (
      <div className="p-8 text-center text-lg text-gray-500">
        Loading flashcards...
      </div>
    );
  }

  // Quiz completed state
  if (quizStatus === "completed") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
        <div className="w-full max-w-lg rounded-lg bg-white p-8 text-center shadow-xl">
          <h2 className="mb-4 text-3xl font-bold text-green-600">
            Quiz Completed!
          </h2>
          <p className="mb-6 text-gray-700">
            You&apos;ve reviewed all the flashcards in this set.
          </p>
          <Link
            href="/flashcards"
            className="rounded-full bg-indigo-600 px-6 py-3 font-bold text-white shadow-lg transition-colors hover:bg-indigo-700"
          >
            Return to Flashcards
          </Link>
        </div>
      </div>
    );
  }

  // Playing state
  const currentFlashcard = flashcards[currentFlashcardIndex];
  if (!currentFlashcard) {
    return (
      <div className="p-8 text-center text-lg text-red-500">
        Error: Could not find flashcard.
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4 font-sans">
      <div className="w-full max-w-2xl rounded-lg bg-white p-8 shadow-xl">
        <h2 className="mb-6 text-xl font-bold text-gray-800">
          Question {currentFlashcardIndex + 1} of {flashcards.length}
        </h2>
        <div className="mb-6 rounded-lg bg-gray-50 p-6">
          <p className="text-lg text-gray-900">{currentFlashcard.question}</p>
        </div>

        <ul className="space-y-4">
          {currentFlashcard.options.map((option, index) => (
            <li
              key={index}
              onClick={() => handleAnswerClick(index)}
              className={`cursor-pointer rounded-lg border-2 p-4 transition-all duration-300 ${showAnswer && index === currentFlashcard.correctAnswerIndex ? "border-green-500 bg-green-100 font-bold" : ""} ${showAnswer && index !== currentFlashcard.correctAnswerIndex && index === selectedOptionIndex ? "border-red-500 bg-red-100 text-gray-500 line-through" : ""} ${!showAnswer ? "border-gray-200 bg-white hover:bg-gray-50" : ""} `}
            >
              {option}
            </li>
          ))}
        </ul>

        {showAnswer && (
          <div className="mt-6 rounded-lg border-2 border-blue-200 bg-blue-50 p-4">
            <h3 className="font-bold text-blue-800">Explanation:</h3>
            <p className="text-gray-700">{currentFlashcard.explanation}</p>
          </div>
        )}

        {showAnswer && (
          <div className="mt-6 text-center">
            <button
              onClick={handleNextQuestion}
              className="rounded-full bg-indigo-600 px-6 py-3 font-bold text-white shadow-lg transition-colors hover:bg-indigo-700"
            >
              Next Question
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizClient;
