// The `create` function from Zustand is the core of our store. It lets us create
// a state management store that our React components can use.
import { create } from "zustand";

// `immer` is a library that allows us to write code that looks like it's
// directly modifying state, but it actually handles all the
// complex, immutable updates for us behind the scenes. This prevents bugs.
import { produce } from "immer";

// --- 1. Define the TypeScript types for our data structures ---
// Type interfaces are like blueprints for our data. They ensure consistency
// and provide helpful autocompletion and error checking in your code editor.

// This is the structure of a single flashcard, based on your IFlashcard schema.
interface Flashcard {
  _id: string; // The unique ID of the flashcard, as a string from MongoDB.
  question: string;
  options: string[]; // Array of strings for choices.
  correctAnswerIndex: number; // The index of the correct answer.
  explanation: string;
  subcategoryId: string; // Reference to the parent Subcategory's _id.
  order: number;
}

// This is the structure of a user's progress on a single flashcard,
// based on your IFlashcardProgress schema.
interface FlashcardProgress {
  flashcardId: string; // The ID of the flashcard this progress belongs to.
  clerkId: string; // The ID of the user who owns this progress record.
  status: "correct" | "incorrect"; // The user's last recorded status for this card.
  createdAt: Date;
  updatedAt: Date;
}

// This interface defines the shape of the state that will be stored in our
// Zustand store. These are the values our React components will read.
interface QuizState {
  flashcards: Flashcard[]; // An array of all flashcards for the current quiz.
  progress: FlashcardProgress[]; // An array of the user's progress records for those flashcards.
  currentFlashcardIndex: number; // The index in the `flashcards` array of the card being shown.
  quizStatus: "loading" | "playing" | "completed"; // The current state of the quiz UI.
}

// This interface defines the actions (functions) that our components can call
// to modify the state.
interface QuizActions {
  // `initializeQuiz` is a crucial action that we'll use to populate the store
  // with data fetched from the server. It's the bridge between our database and the UI.
  initializeQuiz: (
    flashcards: Flashcard[],
    progress: FlashcardProgress[],
  ) => void;
  // `nextFlashcard` will be called when the user answers a flashcard.
  nextFlashcard: () => void;
  // `setFlashcardProgress` will update the user's progress for a single flashcard
  // in the client-side state. We now use `status` to align with the schema.
  setFlashcardProgress: (
    flashcardId: string,
    status: "correct" | "incorrect",
  ) => void;
  // `resetQuiz` will allow the user to start the quiz over from the beginning.
  resetQuiz: () => void;
}

// --- 2. Combine the state and actions into a single type for the store ---
// This is a simple way to combine the two interfaces.
type QuizStore = QuizState & QuizActions;

// --- 3. Create the store using Zustand's `create` function ---
// `create` takes a function that returns an object containing both the initial state
// and all the actions that can modify that state.
export const useQuizStore = create<QuizStore>((set, get) => ({
  // --- Initial State ---
  // This is the state of the quiz before it has been initialized with data.
  flashcards: [],
  progress: [],
  currentFlashcardIndex: 0,
  quizStatus: "loading",

  // --- Actions ---

  /**
   * Initializes the quiz with flashcards and progress data from the server.
   * This is the function that will "hydrate" our client-side store.
   * @param initialFlashcards The flashcards for the current subcategory.
   * @param initialProgress The user's saved progress for those flashcards.
   */
  initializeQuiz: (initialFlashcards, initialProgress) => {
    // `set` is a function from Zustand that updates the state. We pass it an
    // object with the new state values, and Zustand will merge them.
    set({
      flashcards: initialFlashcards,
      progress: initialProgress,
      currentFlashcardIndex: 0,
      quizStatus: "playing", // The quiz is now ready to be played.
    });
  },

  /**
   * Moves to the next flashcard in the list.
   * If all flashcards have been seen, it updates the quiz status to 'completed'.
   */
  nextFlashcard: () => {
    // `get` is a function from Zustand that allows us to read the current state
    // from within an action without causing a re-render.
    const { flashcards, currentFlashcardIndex } = get();
    const nextIndex = currentFlashcardIndex + 1;

    // Check if we have more flashcards to show.
    if (nextIndex < flashcards.length) {
      set({ currentFlashcardIndex: nextIndex }); // Update the index to show the next card.
    } else {
      set({ quizStatus: "completed" }); // We've reached the end of the list.
    }
  },

  /**
   * Updates the progress of a specific flashcard in the store's state.
   * @param flashcardId The ID of the flashcard to update.
   * @param status The new progress status ('correct' or 'incorrect').
   */
  setFlashcardProgress: (flashcardId, status) => {
    // We use `produce` from `immer` here because we're modifying an array
    // of objects (`state.progress`), which can be tricky to do immutably.
    // This makes the code much cleaner and safer.
    set(
      produce((state: QuizState) => {
        // Find the existing progress record for this flashcard.
        const progressRecord = state.progress.find(
          (p) => p.flashcardId === flashcardId,
        );
        if (progressRecord) {
          // If a record exists, we can "mutably" update its status and timestamp.
          progressRecord.status = status;
          progressRecord.updatedAt = new Date();
        } else {
          // If no record exists, this is a new flashcard for the user.
          // We push a new record to the array.
          state.progress.push({
            flashcardId,
            clerkId: "", // We don't have the clerkId here; it's added by the Server Action later.
            status,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        }
      }),
    );
  },

  /**
   * Resets the quiz to its initial state, allowing the user to start over.
   */
  resetQuiz: () => {
    set({
      currentFlashcardIndex: 0,
      quizStatus: "playing",
    });
  },
}));
