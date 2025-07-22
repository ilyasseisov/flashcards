import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  Flashcard,
  UserAnswer,
  QuizState,
  QuizProgress,
} from "@/types/flashcard";

interface QuizStore extends QuizState {
  // Data
  flashcards: Flashcard[];

  // Computed values
  currentFlashcard: Flashcard | null;
  progress: QuizProgress;

  // Actions
  initializeQuiz: (flashcards: Flashcard[]) => void;
  selectAnswer: (optionId: string) => void;
  nextQuestion: () => void;
  previousQuestion: () => void;
  jumpToQuestion: (index: number) => void;
  showCurrentResults: () => void;
  hideCurrentResults: () => void;
  resetQuiz: () => void;

  // Helpers
  getAnsweredQuestions: () => Set<number>;
  getCorrectAnswers: () => Set<number>;
  getCurrentAnswer: () => UserAnswer | undefined;
  isCurrentQuestionAnswered: () => boolean;
}

const initialState: QuizState = {
  currentQuestionIndex: 0,
  userAnswers: [],
  isCompleted: false,
  showResults: false,
  totalQuestions: 0,
};

export const useQuizStore = create<QuizStore>()(
  persist(
    (set, get) => ({
      // Initial state
      ...initialState,
      flashcards: [],
      currentFlashcard: null,
      progress: {
        current: 0,
        total: 0,
        percentage: 0,
        answeredCount: 0,
        correctCount: 0,
      },

      // Actions
      initializeQuiz: (flashcards: Flashcard[]) => {
        set({
          flashcards,
          totalQuestions: flashcards.length,
          currentQuestionIndex: 0,
          userAnswers: [],
          isCompleted: false,
          showResults: false,
          currentFlashcard: flashcards[0] || null,
          progress: {
            current: 1,
            total: flashcards.length,
            percentage: 0,
            answeredCount: 0,
            correctCount: 0,
          },
        });
      },

      selectAnswer: (optionId: string) => {
        const state = get();
        const currentFlashcard = state.currentFlashcard;

        if (!currentFlashcard || state.isCurrentQuestionAnswered()) {
          return;
        }

        const isCorrect = optionId === currentFlashcard.correctAnswerId;

        const newAnswer: UserAnswer = {
          questionId: currentFlashcard.id,
          selectedOptionId: optionId,
          isCorrect,
        };

        const updatedAnswers = [...state.userAnswers, newAnswer];
        const answeredCount = updatedAnswers.length;
        const correctCount = updatedAnswers.filter(
          (answer) => answer.isCorrect,
        ).length;

        set({
          userAnswers: updatedAnswers,
          showResults: true,
          progress: {
            current: state.currentQuestionIndex + 1,
            total: state.totalQuestions,
            percentage: Math.round(
              (answeredCount / state.totalQuestions) * 100,
            ),
            answeredCount,
            correctCount,
          },
        });
      },

      nextQuestion: () => {
        const state = get();
        const nextIndex = state.currentQuestionIndex + 1;

        if (nextIndex >= state.totalQuestions) {
          set({ isCompleted: true });
          return;
        }

        set({
          currentQuestionIndex: nextIndex,
          currentFlashcard: state.flashcards[nextIndex],
          showResults: false,
          progress: {
            ...state.progress,
            current: nextIndex + 1,
          },
        });
      },

      previousQuestion: () => {
        const state = get();
        const prevIndex = Math.max(0, state.currentQuestionIndex - 1);

        set({
          currentQuestionIndex: prevIndex,
          currentFlashcard: state.flashcards[prevIndex],
          showResults: state.isCurrentQuestionAnswered(),
        });
      },

      jumpToQuestion: (index: number) => {
        const state = get();

        if (index < 0 || index >= state.totalQuestions) {
          return;
        }

        const targetFlashcard = state.flashcards[index];
        const hasAnswered = state.userAnswers.some(
          (answer) => answer.questionId === targetFlashcard.id,
        );

        set({
          currentQuestionIndex: index,
          currentFlashcard: targetFlashcard,
          showResults: hasAnswered,
          progress: {
            ...state.progress,
            current: index + 1,
          },
        });
      },

      showCurrentResults: () => set({ showResults: true }),

      hideCurrentResults: () => set({ showResults: false }),

      resetQuiz: () => {
        const state = get();
        set({
          ...initialState,
          flashcards: state.flashcards,
          totalQuestions: state.flashcards.length,
          currentFlashcard: state.flashcards[0] || null,
          progress: {
            current: 1,
            total: state.flashcards.length,
            percentage: 0,
            answeredCount: 0,
            correctCount: 0,
          },
        });
      },

      // Helper methods
      getAnsweredQuestions: () => {
        const state = get();
        const answeredSet = new Set<number>();

        state.userAnswers.forEach((answer) => {
          const questionIndex = state.flashcards.findIndex(
            (flashcard) => flashcard.id === answer.questionId,
          );
          if (questionIndex !== -1) {
            answeredSet.add(questionIndex);
          }
        });

        return answeredSet;
      },

      getCorrectAnswers: () => {
        const state = get();
        const correctSet = new Set<number>();

        state.userAnswers
          .filter((answer) => answer.isCorrect)
          .forEach((answer) => {
            const questionIndex = state.flashcards.findIndex(
              (flashcard) => flashcard.id === answer.questionId,
            );
            if (questionIndex !== -1) {
              correctSet.add(questionIndex);
            }
          });

        return correctSet;
      },

      getCurrentAnswer: () => {
        const state = get();
        if (!state.currentFlashcard) return undefined;

        return state.userAnswers.find(
          (answer) => answer.questionId === state.currentFlashcard!.id,
        );
      },

      isCurrentQuestionAnswered: () => {
        const state = get();
        return !!state.getCurrentAnswer();
      },
    }),
    {
      name: "quiz-storage", // localStorage key
      partialize: (state) => ({
        // Only persist essential state, not computed values
        currentQuestionIndex: state.currentQuestionIndex,
        userAnswers: state.userAnswers,
        isCompleted: state.isCompleted,
        totalQuestions: state.totalQuestions,
      }),
    },
  ),
);
