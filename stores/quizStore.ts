// stores/quizStore.ts
import { create } from "zustand";
import { produce } from "immer";
import { subscribeWithSelector } from "zustand/middleware";

// --- 1. Define the TypeScript types for our data structures ---
interface Flashcard {
  _id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  subcategoryId: string;
  order: number;
}

interface FlashcardProgress {
  flashcardId: string;
  clerkId: string;
  status: "correct" | "incorrect";
  createdAt: Date;
  updatedAt: Date;
}

interface QuizState {
  flashcards: Flashcard[];
  progress: FlashcardProgress[];
  currentFlashcardIndex: number;
  quizStatus: "loading" | "playing" | "completed";
  isInitialized: boolean; // Add this to track initialization state
}

interface QuizActions {
  initializeQuiz: (
    flashcards: Flashcard[],
    progress: FlashcardProgress[],
  ) => void;
  nextFlashcard: () => void;
  setFlashcardProgress: (
    flashcardId: string,
    status: "correct" | "incorrect",
  ) => void;
  resetQuiz: () => void;
}

type QuizStore = QuizState & QuizActions;

// --- 2. Create the store with subscribeWithSelector middleware for better performance ---
export const useQuizStore = create<QuizStore>()(
  subscribeWithSelector((set, get) => ({
    // --- Initial State ---
    flashcards: [],
    progress: [],
    currentFlashcardIndex: 0,
    quizStatus: "loading",
    isInitialized: false,

    // --- Actions ---
    initializeQuiz: (initialFlashcards, initialProgress) => {
      const { isInitialized } = get();

      // Only initialize once
      if (!isInitialized) {
        console.log("Initializing quiz store with data:", {
          flashcardsCount: initialFlashcards.length,
          progressCount: initialProgress.length,
        });

        set({
          flashcards: initialFlashcards,
          progress: initialProgress,
          currentFlashcardIndex: 0,
          quizStatus: initialFlashcards.length > 0 ? "playing" : "completed",
          isInitialized: true,
        });
      }
    },

    nextFlashcard: () => {
      const { flashcards, currentFlashcardIndex } = get();
      const nextIndex = currentFlashcardIndex + 1;

      if (nextIndex < flashcards.length) {
        set({ currentFlashcardIndex: nextIndex });
      } else {
        set({ quizStatus: "completed" });
      }
    },

    setFlashcardProgress: (flashcardId, status) => {
      set(
        produce((state: QuizState) => {
          const progressRecord = state.progress.find(
            (p) => p.flashcardId === flashcardId,
          );
          if (progressRecord) {
            progressRecord.status = status;
            progressRecord.updatedAt = new Date();
          } else {
            state.progress.push({
              flashcardId,
              clerkId: "",
              status,
              createdAt: new Date(),
              updatedAt: new Date(),
            });
          }
        }),
      );
    },

    resetQuiz: () => {
      set({
        currentFlashcardIndex: 0,
        quizStatus: "playing",
      });
    },
  })),
);
