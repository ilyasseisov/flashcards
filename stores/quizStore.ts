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
  selectedOptionIndex?: number; // Add this to track which option user selected
  createdAt: Date;
  updatedAt: Date;
}

interface QuizState {
  flashcards: Flashcard[];
  progress: FlashcardProgress[];
  currentFlashcardIndex: number;
  quizStatus: "loading" | "playing" | "completed";
  isInitialized: boolean; // Add this to track initialization state
  currentSubcategoryId: string | null; // Track which subcategory is loaded
}

interface QuizActions {
  initializeQuiz: (
    flashcards: Flashcard[],
    progress: FlashcardProgress[],
  ) => void;
  nextFlashcard: () => void;
  goToFlashcard: (index: number) => void;
  setFlashcardProgress: (
    flashcardId: string,
    status: "correct" | "incorrect",
    selectedOptionIndex?: number, // Add optional parameter for selected option
  ) => void;
  resetQuiz: () => void;
  clearStore: () => void;
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
    currentSubcategoryId: null,

    // --- Actions ---
    initializeQuiz: (initialFlashcards, initialProgress) => {
      const { currentSubcategoryId } = get();

      // Get the subcategory ID from the first flashcard
      const newSubcategoryId =
        initialFlashcards.length > 0
          ? initialFlashcards[0].subcategoryId
          : null;

      // Always reinitialize if it's a different subcategory or first time
      if (currentSubcategoryId !== newSubcategoryId) {
        console.log("Initializing quiz store with new subcategory data:", {
          flashcardsCount: initialFlashcards.length,
          progressCount: initialProgress.length,
          subcategoryId: newSubcategoryId,
        });

        set({
          flashcards: initialFlashcards,
          progress: initialProgress,
          currentFlashcardIndex: 0,
          quizStatus: initialFlashcards.length > 0 ? "playing" : "completed",
          isInitialized: true,
          currentSubcategoryId: newSubcategoryId,
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

    goToFlashcard: (index) => {
      const { flashcards } = get();
      if (index >= 0 && index < flashcards.length) {
        set({
          currentFlashcardIndex: index,
          quizStatus: "playing", // Ensure we're in playing state
        });
      }
    },

    setFlashcardProgress: (flashcardId, status, selectedOptionIndex) => {
      set(
        produce((state: QuizState) => {
          const progressRecord = state.progress.find(
            (p) => p.flashcardId === flashcardId,
          );
          if (progressRecord) {
            progressRecord.status = status;
            progressRecord.updatedAt = new Date();
            if (selectedOptionIndex !== undefined) {
              progressRecord.selectedOptionIndex = selectedOptionIndex;
            }
          } else {
            state.progress.push({
              flashcardId,
              clerkId: "",
              status,
              selectedOptionIndex,
              createdAt: new Date(),
              updatedAt: new Date(),
            });
          }
        }),
      );
    },

    resetQuiz: () => {
      console.log(
        "Resetting quiz - clearing all progress and going to first question",
      );
      set({
        currentFlashcardIndex: 0,
        quizStatus: "playing",
        progress: [], // This is the key - completely clear all progress
      });
    },

    clearStore: () => {
      set({
        flashcards: [],
        progress: [],
        currentFlashcardIndex: 0,
        quizStatus: "loading",
        isInitialized: false,
        currentSubcategoryId: null,
      });
    },
  })),
);
