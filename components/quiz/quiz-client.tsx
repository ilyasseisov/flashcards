"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuizStore } from "@/stores/quizStore"; // Import our Zustand store
import { IFlashcardProgress } from "@/lib/models/flashcard-progress"; // Import the type
import { IFlashcard } from "@/lib/models/flashcard"; // Import the type
import { saveQuizProgress } from "@/lib/actions/save-quiz-progress"; // Import our server action
import Link from "next/link";

// Define the props this component will receive from the Server Component
interface QuizClientProps {
  initialFlashcards: IFlashcard[];
  initialProgress: IFlashcardProgress[];
  categorySlug?: string; // Add category slug for navigation
  subcategorySlug?: string; // Add subcategory slug for navigation
}

// Our main interactive component
const QuizClient = ({
  initialFlashcards,
  initialProgress,
  categorySlug,
  subcategorySlug,
}: QuizClientProps) => {
  // Use local state to manage the UI for the current flashcard, like showing the answer.
  const [showAnswer, setShowAnswer] = useState(false);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(
    null,
  );

  // Add hydration state to prevent SSR mismatch
  const [isHydrated, setIsHydrated] = useState(false);
  const [isSavingProgress, setIsSavingProgress] = useState(false);

  const router = useRouter();

  // Get state and actions from store
  const flashcards = useQuizStore((state) => state.flashcards);
  const currentFlashcardIndex = useQuizStore(
    (state) => state.currentFlashcardIndex,
  );
  const quizStatus = useQuizStore((state) => state.quizStatus);
  const progress = useQuizStore((state) => state.progress);

  // Get actions separately
  const initializeQuiz = useQuizStore((state) => state.initializeQuiz);
  const nextFlashcard = useQuizStore((state) => state.nextFlashcard);
  const goToFlashcard = useQuizStore((state) => state.goToFlashcard);
  const setFlashcardProgress = useQuizStore(
    (state) => state.setFlashcardProgress,
  );
  const clearStore = useQuizStore((state) => state.clearStore);
  const resetQuiz = useQuizStore((state) => state.resetQuiz);

  // Helper function to get question status based on progress
  const getQuestionStatus = (flashcardId: string) => {
    const progressRecord = progress.find((p) => p.flashcardId === flashcardId);
    return progressRecord?.status || null;
  };

  // Calculate quiz statistics
  const getQuizStats = () => {
    const totalQuestions = flashcards.length;
    const correctAnswers = progress.filter(
      (p) => p.status === "correct",
    ).length;
    const incorrectAnswers = progress.filter(
      (p) => p.status === "incorrect",
    ).length;
    const percentage =
      totalQuestions > 0
        ? Math.round((correctAnswers / totalQuestions) * 100)
        : 0;

    return {
      totalQuestions,
      correctAnswers,
      incorrectAnswers,
      percentage,
    };
  };

  // Navigate to specific question
  const goToQuestion = (questionIndex: number) => {
    // Reset current question state when navigating
    setShowAnswer(false);
    setSelectedOptionIndex(null);

    // Update the current flashcard index in store
    goToFlashcard(questionIndex);
  };

  // Handle try again button click
  const handleTryAgain = () => {
    resetQuiz();
    setShowAnswer(false);
    setSelectedOptionIndex(null);
  };

  // Handle go to subcategory button click
  const handleGoToSubcategory = async () => {
    if (!categorySlug) {
      console.error("Category slug not provided");
      return;
    }

    setIsSavingProgress(true);

    try {
      // Prepare progress data for saving
      const progressData = progress.map((p) => ({
        flashcardId: p.flashcardId,
        status: p.status,
      }));

      // Save progress to database
      await saveQuizProgress(progressData);

      // Navigate to category page (subcategory listing)
      router.push(`/flashcards/${categorySlug}`);
    } catch (error) {
      console.error("Error saving progress:", error);
      // Still navigate even if save fails
      router.push(`/flashcards/${categorySlug}`);
    } finally {
      setIsSavingProgress(false);
    }
  };

  // --- 2. Handle hydration and initialization ---
  useEffect(() => {
    // Mark as hydrated first
    setIsHydrated(true);

    // Clear store and initialize with new data every time
    if (initialFlashcards.length > 0) {
      console.log("Initializing Zustand store with server data.");
      clearStore(); // Clear old data first
      initializeQuiz(initialFlashcards, initialProgress);
    }
  }, [initialFlashcards, initialProgress, initializeQuiz, clearStore]); // Include dependencies to reinitialize on route change

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

  // Quiz completed state with statistics
  if (quizStatus === "completed") {
    const stats = getQuizStats();

    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
        <div className="w-full max-w-md rounded-lg bg-white p-8 text-center shadow-xl">
          <h2 className="mb-6 text-3xl font-bold text-gray-800">
            Quiz Complete!
          </h2>

          <div className="mb-6 text-lg text-gray-600">
            You scored {stats.percentage}% ({stats.correctAnswers} out of{" "}
            {stats.totalQuestions})
          </div>

          <div className="mb-8 space-y-3 text-left">
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Total Questions:</span>
              <span className="font-semibold">{stats.totalQuestions}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-700">Correct Answers:</span>
              <span className="font-semibold text-green-600">
                {stats.correctAnswers}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-700">Incorrect Answers:</span>
              <span className="font-semibold text-red-600">
                {stats.incorrectAnswers}
              </span>
            </div>
          </div>

          <button
            onClick={handleTryAgain}
            disabled={isSavingProgress}
            className="mb-4 w-full rounded-lg bg-green-500 py-3 font-bold text-white shadow-lg transition-colors hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            🔄 Try Again
          </button>

          <button
            onClick={handleGoToSubcategory}
            disabled={isSavingProgress}
            className="block w-full rounded-lg bg-blue-600 py-3 font-bold text-white shadow-lg transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSavingProgress
              ? "Saving Progress..."
              : `Go to ${categorySlug?.toUpperCase() || "Subcategory"}`}
          </button>
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
        {/* Question Navigation */}
        <div className="mb-8">
          <div className="flex flex-wrap justify-center gap-2">
            {flashcards.map((flashcard, index) => {
              const status = getQuestionStatus(flashcard._id);
              const isActive = index === currentFlashcardIndex;

              return (
                <button
                  key={flashcard._id}
                  onClick={() => goToQuestion(index)}
                  className={`h-8 w-8 rounded-full text-sm font-bold transition-all duration-200 ${isActive ? "ring-2 ring-blue-500 ring-offset-2" : ""} ${
                    status === "correct"
                      ? "bg-green-500 text-white hover:bg-green-600"
                      : status === "incorrect"
                        ? "bg-red-500 text-white hover:bg-red-600"
                        : "border-2 border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                  } `}
                >
                  {index + 1}
                </button>
              );
            })}
          </div>
        </div>

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
