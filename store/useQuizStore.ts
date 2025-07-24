// zustand funcs
import { create } from "zustand"; // Imports the 'create' function from Zustand to create a new store.
import { persist } from "zustand/middleware"; // Imports the 'persist' middleware to enable state persistence (e.g., in localStorage).

// types
import type {
  Flashcard, // Type definition for a single flashcard.
  UserAnswer, // Type definition for a user's answer to a flashcard.
  QuizState, // Type definition for the core state of the quiz.
  QuizProgress, // Type definition for the quiz progress metrics.
} from "@/types/flashcard"; // Imports custom types from a shared types file.

/**
 * Defines the interface for the QuizStore, extending the base QuizState.
 * This interface outlines all the data, computed values, actions, and helper methods
 * available in the Zustand store.
 */
interface QuizStore extends QuizState {
  // --- Data ---
  // An array of all flashcards loaded for the quiz.
  flashcards: Flashcard[];

  // --- Computed values (derived from state, not directly stored) ---
  // The flashcard currently displayed to the user.
  currentFlashcard: Flashcard | null;
  // Object containing progress metrics like current question, total, percentage, etc.
  progress: QuizProgress;

  // --- Actions (functions that modify the store's state) ---
  /**
   * Initializes the quiz with a given set of flashcards.
   * Resets all quiz-related state to its initial values.
   * @param flashcards An array of Flashcard objects to be used for the quiz.
   */
  initializeQuiz: (flashcards: Flashcard[]) => void;
  /**
   * Records the user's selected answer for the current flashcard.
   * Updates user answers, calculates correctness, and updates progress.
   * @param optionId The ID of the option selected by the user.
   */
  selectAnswer: (optionId: string) => void;
  /**
   * Advances the quiz to the next question.
   * If the quiz is completed, sets the 'isCompleted' flag.
   */
  nextQuestion: () => void;
  /**
   * Moves the quiz back to the previous question.
   * Ensures the index does not go below 0.
   */
  previousQuestion: () => void;
  /**
   * Jumps the quiz to a specific question by its index.
   * Updates the current flashcard and results visibility based on whether it's answered.
   * @param index The 0-based index of the question to jump to.
   */
  jumpToQuestion: (index: number) => void;
  /**
   * Sets the 'showResults' flag to true, displaying the results for the current question.
   */
  showCurrentResults: () => void;
  /**
   * Sets the 'showResults' flag to false, hiding the results for the current question.
   */
  hideCurrentResults: () => void;
  /**
   * Resets the entire quiz state, but keeps the original flashcards loaded.
   * Useful for replaying the quiz.
   */
  resetQuiz: () => void;

  // --- Helpers (functions that read state but do not modify it) ---
  /**
   * Returns a Set of 0-based indices of questions that have been answered by the user.
   */
  getAnsweredQuestions: () => Set<number>;
  /**
   * Returns a Set of 0-based indices of questions that have been answered correctly.
   */
  getCorrectAnswers: () => Set<number>;
  /**
   * Retrieves the UserAnswer object for the current question, if it exists.
   * @returns The UserAnswer object or undefined if not answered.
   */
  getCurrentAnswer: () => UserAnswer | undefined;
  /**
   * Checks if the current question has already been answered by the user.
   * @returns True if the current question is answered, false otherwise.
   */
  isCurrentQuestionAnswered: () => boolean;
}

/**
 * Defines the initial state for the core quiz properties.
 * This is used both at store initialization and when resetting the quiz.
 */
const initialState: QuizState = {
  currentQuestionIndex: 0, // The 0-based index of the currently displayed question.
  userAnswers: [], // An array to store all user answers.
  isCompleted: false, // Flag indicating if the quiz has been completed.
  showResults: false, // Flag to control visibility of results for the current question.
  totalQuestions: 0, // Total number of questions in the quiz.
};

/**
 * Creates the Zustand store for the quiz.
 * It uses the 'persist' middleware to save and load state from localStorage.
 */
export const useQuizStore = create<QuizStore>()(
  // The 'persist' middleware wraps the store logic to enable state persistence.
  persist(
    // The main store logic, defining state and actions.
    // 'set' is used to update the state.
    // 'get' is used to read the current state.
    (set, get) => ({
      // --- Initial State ---
      // Spreads the 'initialState' defined above.
      ...initialState,
      flashcards: [], // Initially empty array for flashcards.
      currentFlashcard: null, // No flashcard selected initially.
      progress: {
        current: 0, // Current question number (1-based).
        total: 0, // Total questions.
        percentage: 0, // Percentage of questions answered.
        answeredCount: 0, // Number of questions answered.
        correctCount: 0, // Number of questions answered correctly.
      },

      // --- Actions Implementation ---

      /**
       * Initializes the quiz.
       * Resets all quiz-related state and sets up initial flashcards and progress.
       * @param flashcards The array of flashcards for the quiz.
       */
      initializeQuiz: (flashcards: Flashcard[]) => {
        set({
          flashcards, // Sets the flashcards for the quiz.
          totalQuestions: flashcards.length, // Sets the total number of questions.
          currentQuestionIndex: 0, // Resets to the first question.
          userAnswers: [], // Clears all previous answers.
          isCompleted: false, // Marks quiz as not completed.
          showResults: false, // Hides results.
          currentFlashcard: flashcards[0] || null, // Sets the first flashcard as current.
          progress: {
            current: 1, // Starts current question count at 1.
            total: flashcards.length, // Sets total questions in progress.
            percentage: 0, // Resets percentage.
            answeredCount: 0, // Resets answered count.
            correctCount: 0, // Resets correct count.
          },
        });
      },

      /**
       * Handles user answer selection.
       * @param optionId The ID of the selected option.
       */
      selectAnswer: (optionId: string) => {
        const state = get(); // Gets the current state.
        const currentFlashcard = state.currentFlashcard; // Gets the current flashcard.

        // If no current flashcard or already answered, do nothing.
        if (!currentFlashcard || state.isCurrentQuestionAnswered()) {
          return;
        }

        // Determines if the selected answer is correct.
        const isCorrect = optionId === currentFlashcard.correctAnswerId;

        // Creates a new UserAnswer object.
        const newAnswer: UserAnswer = {
          questionId: currentFlashcard.id,
          selectedOptionId: optionId,
          isCorrect,
        };

        // Adds the new answer to the existing user answers.
        const updatedAnswers = [...state.userAnswers, newAnswer];
        // Calculates the number of answered questions.
        const answeredCount = updatedAnswers.length;
        // Calculates the number of correct answers.
        const correctCount = updatedAnswers.filter(
          (answer) => answer.isCorrect,
        ).length;

        // Updates the state with new answers, shows results, and updates progress.
        set({
          userAnswers: updatedAnswers, // Updates the array of user answers.
          showResults: true, // Shows the results for the current question.
          progress: {
            current: state.currentQuestionIndex + 1, // Updates current question number (1-based).
            total: state.totalQuestions, // Keeps total questions.
            percentage: Math.round(
              (answeredCount / state.totalQuestions) * 100, // Calculates percentage answered.
            ),
            answeredCount, // Updates answered count.
            correctCount, // Updates correct count.
          },
        });
      },

      /**
       * Moves to the next question.
       */
      nextQuestion: () => {
        const state = get(); // Gets the current state.
        const nextIndex = state.currentQuestionIndex + 1; // Calculates the next question index.

        // If the next index is beyond total questions, mark quiz as completed.
        if (nextIndex >= state.totalQuestions) {
          set({ isCompleted: true });
          return;
        }

        // Updates the state to move to the next question.
        set({
          currentQuestionIndex: nextIndex, // Sets the new current question index.
          currentFlashcard: state.flashcards[nextIndex], // Sets the next flashcard as current.
          showResults: false, // Hides results for the new question.
          progress: {
            ...state.progress, // Keeps existing progress metrics.
            current: nextIndex + 1, // Updates current question number (1-based).
          },
        });
      },

      /**
       * Moves to the previous question.
       */
      previousQuestion: () => {
        const state = get(); // Gets the current state.
        // Calculates the previous index, ensuring it doesn't go below 0.
        const prevIndex = Math.max(0, state.currentQuestionIndex - 1);

        // Updates the state to move to the previous question.
        set({
          currentQuestionIndex: prevIndex, // Sets the new current question index.
          currentFlashcard: state.flashcards[prevIndex], // Sets the previous flashcard as current.
          // Shows results if the previous question was already answered, hides otherwise.
          showResults: state.isCurrentQuestionAnswered(),
        });
      },

      /**
       * Jumps to a specific question by index.
       * @param index The 0-based index of the question to jump to.
       */
      jumpToQuestion: (index: number) => {
        const state = get(); // Gets the current state.

        // Validates the index to ensure it's within bounds.
        if (index < 0 || index >= state.totalQuestions) {
          return;
        }

        // Gets the target flashcard.
        const targetFlashcard = state.flashcards[index];
        // Checks if the target question has already been answered.
        const hasAnswered = state.userAnswers.some(
          (answer) => answer.questionId === targetFlashcard.id,
        );

        // Updates the state to jump to the specified question.
        set({
          currentQuestionIndex: index, // Sets the new current question index.
          currentFlashcard: targetFlashcard, // Sets the target flashcard as current.
          showResults: hasAnswered, // Shows results if already answered, hides otherwise.
          progress: {
            ...state.progress, // Keeps existing progress metrics.
            current: index + 1, // Updates current question number (1-based).
          },
        });
      },

      /**
       * Shows the results for the current question.
       */
      showCurrentResults: () => set({ showResults: true }),

      /**
       * Hides the results for the current question.
       */
      hideCurrentResults: () => set({ showResults: false }),

      /**
       * Resets the quiz to its initial state, keeping the same set of flashcards.
       */
      resetQuiz: () => {
        const state = get(); // Gets the current state to retain flashcards.
        set({
          ...initialState, // Resets core quiz state to initial values.
          flashcards: state.flashcards, // Retains the original flashcards.
          totalQuestions: state.flashcards.length, // Recalculates total questions.
          currentFlashcard: state.flashcards[0] || null, // Sets the first flashcard as current.
          progress: {
            current: 1, // Resets current question number.
            total: state.flashcards.length, // Resets total questions in progress.
            percentage: 0, // Resets percentage.
            answeredCount: 0, // Resets answered count.
            correctCount: 0, // Resets correct count.
          },
        });
      },

      // --- Helper Methods Implementation ---

      /**
       * Returns a Set of indices for all questions that have been answered.
       */
      getAnsweredQuestions: () => {
        const state = get(); // Gets the current state.
        const answeredSet = new Set<number>(); // Initializes a new Set to store answered question indices.

        // Iterates through user answers to find the index of each answered question.
        state.userAnswers.forEach((answer) => {
          const questionIndex = state.flashcards.findIndex(
            (flashcard) => flashcard.id === answer.questionId,
          );
          if (questionIndex !== -1) {
            answeredSet.add(questionIndex); // Adds the index to the set if found.
          }
        });

        return answeredSet; // Returns the set of answered question indices.
      },

      /**
       * Returns a Set of indices for all questions that have been answered correctly.
       */
      getCorrectAnswers: () => {
        const state = get(); // Gets the current state.
        const correctSet = new Set<number>(); // Initializes a new Set to store correctly answered question indices.

        // Filters user answers for correct ones and then finds their indices.
        state.userAnswers
          .filter((answer) => answer.isCorrect) // Filters for correct answers.
          .forEach((answer) => {
            const questionIndex = state.flashcards.findIndex(
              (flashcard) => flashcard.id === answer.questionId,
            );
            if (questionIndex !== -1) {
              correctSet.add(questionIndex); // Adds the index to the set if found.
            }
          });

        return correctSet; // Returns the set of correctly answered question indices.
      },

      /**
       * Retrieves the UserAnswer object for the current question.
       */
      getCurrentAnswer: () => {
        const state = get(); // Gets the current state.
        if (!state.currentFlashcard) return undefined; // If no current flashcard, return undefined.

        // Finds and returns the user answer corresponding to the current flashcard's ID.
        return state.userAnswers.find(
          (answer) => answer.questionId === state.currentFlashcard!.id,
        );
      },

      /**
       * Checks if the current question has been answered.
       */
      isCurrentQuestionAnswered: () => {
        const state = get(); // Gets the current state.
        // Returns true if 'getCurrentAnswer' returns a truthy value (i.e., an answer exists).
        return !!state.getCurrentAnswer();
      },
    }),
    {
      name: "quiz-storage", // The key used to store the state in localStorage.
      // 'partialize' specifies which parts of the state should be persisted.
      // Computed values (like currentFlashcard, progress) are excluded as they can be re-derived.
      partialize: (state) => ({
        currentQuestionIndex: state.currentQuestionIndex, // Persist the current question index.
        userAnswers: state.userAnswers, // Persist the user's answers.
        isCompleted: state.isCompleted, // Persist the quiz completion status.
        totalQuestions: state.totalQuestions, // Persist the total number of questions.
      }),
    },
  ),
);
