// lib/flashcard-data.ts
import type {
  Flashcard,
  FlashcardSet,
  FetchFlashcardsResponse,
} from "@/types/flashcard";

// Mock React Hooks Quiz Data
const reactHooksFlashcards: Flashcard[] = [
  {
    id: "1",
    question:
      "Which React Hook is used to manage state in functional components?",
    options: [
      { id: "a", label: "A", text: "useContext" },
      { id: "b", label: "B", text: "useState" },
      { id: "c", label: "C", text: "useEffect" },
      { id: "d", label: "D", text: "useReducer" },
    ],
    correctAnswerId: "b",
    explanation:
      "useState is the React Hook used to manage state in functional components, allowing you to add stateful logic without writing a class component.",
  },
  {
    id: "2",
    question: "What does the useEffect Hook do?",
    options: [
      { id: "a", label: "A", text: "Manages component state" },
      { id: "b", label: "B", text: "Handles form validation" },
      { id: "c", label: "C", text: "Performs side effects" },
      { id: "d", label: "D", text: "Creates context providers" },
    ],
    correctAnswerId: "c",
    explanation:
      "useEffect lets you perform side effects in functional components, such as data fetching, subscriptions, or manually changing the DOM.",
  },
  {
    id: "3",
    question:
      "Which React Hook is used to perform side effects in functional components?",
    options: [
      { id: "a", label: "A", text: "useState" },
      { id: "b", label: "B", text: "useEffect" },
      { id: "c", label: "C", text: "useContext" },
      { id: "d", label: "D", text: "useReducer" },
    ],
    correctAnswerId: "b",
    explanation:
      "useEffect is the React Hook used to perform side effects in functional components, such as data fetching, subscriptions, or manually changing the DOM.",
  },
  {
    id: "4",
    question: "What is the purpose of the dependency array in useEffect?",
    options: [
      { id: "a", label: "A", text: "To define component props" },
      { id: "b", label: "B", text: "To control when the effect runs" },
      { id: "c", label: "C", text: "To handle error boundaries" },
      { id: "d", label: "D", text: "To manage component lifecycle" },
    ],
    correctAnswerId: "b",
    explanation:
      "The dependency array controls when the useEffect runs. The effect only re-runs when one of the dependencies changes.",
  },
  {
    id: "5",
    question: "Which Hook is used for accessing context values?",
    options: [
      { id: "a", label: "A", text: "useState" },
      { id: "b", label: "B", text: "useEffect" },
      { id: "c", label: "C", text: "useContext" },
      { id: "d", label: "D", text: "useCallback" },
    ],
    correctAnswerId: "c",
    explanation:
      "useContext is used to access values from a React Context, allowing components to consume context without nesting.",
  },
  {
    id: "6",
    question: "What does useReducer help you manage?",
    options: [
      { id: "a", label: "A", text: "Simple boolean state" },
      { id: "b", label: "B", text: "Complex state logic" },
      { id: "c", label: "C", text: "Side effects" },
      { id: "d", label: "D", text: "Component refs" },
    ],
    correctAnswerId: "b",
    explanation:
      "useReducer is usually preferable to useState when you have complex state logic that involves multiple sub-values or when the next state depends on the previous one.",
  },
  {
    id: "7",
    question: "Which Hook is used to create mutable refs?",
    options: [
      { id: "a", label: "A", text: "useState" },
      { id: "b", label: "B", text: "useRef" },
      { id: "c", label: "C", text: "useEffect" },
      { id: "d", label: "D", text: "useMemo" },
    ],
    correctAnswerId: "b",
    explanation:
      "useRef returns a mutable ref object whose .current property is initialized to the passed argument and persists for the full lifetime of the component.",
  },
  {
    id: "8",
    question: "What is the main purpose of useMemo?",
    options: [
      { id: "a", label: "A", text: "Managing component state" },
      { id: "b", label: "B", text: "Memoizing expensive calculations" },
      { id: "c", label: "C", text: "Handling side effects" },
      { id: "d", label: "D", text: "Creating context providers" },
    ],
    correctAnswerId: "b",
    explanation:
      "useMemo is used to memoize expensive calculations so they only re-run when their dependencies change, helping optimize performance.",
  },
  {
    id: "9",
    question: "Which Hook is used to memoize callback functions?",
    options: [
      { id: "a", label: "A", text: "useMemo" },
      { id: "b", label: "B", text: "useCallback" },
      { id: "c", label: "C", text: "useEffect" },
      { id: "d", label: "D", text: "useState" },
    ],
    correctAnswerId: "b",
    explanation:
      "useCallback returns a memoized version of the callback that only changes if one of the dependencies has changed, useful for preventing unnecessary re-renders.",
  },
  {
    id: "10",
    question: "What happens when you call useState with the same value?",
    options: [
      { id: "a", label: "A", text: "Component always re-renders" },
      { id: "b", label: "B", text: "React may skip the re-render" },
      { id: "c", label: "C", text: "An error is thrown" },
      { id: "d", label: "D", text: "State gets reset" },
    ],
    correctAnswerId: "b",
    explanation:
      "If you update a state Hook to the same value as the current state, React will bail out without rendering the children or firing effects.",
  },
];

// Mock HTML/APIs Quiz Data
const htmlApisFlashcards: Flashcard[] = [
  {
    id: "11",
    question: "Which method is used to select an element by its ID?",
    options: [
      { id: "a", label: "A", text: "document.querySelector()" },
      { id: "b", label: "B", text: "document.getElementById()" },
      { id: "c", label: "C", text: "document.getElementsByClassName()" },
      { id: "d", label: "D", text: "document.getElementsByTagName()" },
    ],
    correctAnswerId: "b",
    explanation:
      "document.getElementById() is the most direct method to select an element by its unique ID attribute.",
  },
  {
    id: "12",
    question: "What does the Fetch API return?",
    options: [
      { id: "a", label: "A", text: "JSON data directly" },
      { id: "b", label: "B", text: "A Promise" },
      { id: "c", label: "C", text: "An XMLHttpRequest object" },
      { id: "d", label: "D", text: "A callback function" },
    ],
    correctAnswerId: "b",
    explanation:
      "The Fetch API returns a Promise that resolves to the Response object representing the response to the request.",
  },
  {
    id: "13",
    question: "Which HTML5 API is used for storing data locally?",
    options: [
      { id: "a", label: "A", text: "Web Storage API" },
      { id: "b", label: "B", text: "Geolocation API" },
      { id: "c", label: "C", text: "Canvas API" },
      { id: "d", label: "D", text: "File API" },
    ],
    correctAnswerId: "a",
    explanation:
      "The Web Storage API provides localStorage and sessionStorage for storing data locally in the browser.",
  },
];

// Mock flashcard sets
const mockFlashcardSets: FlashcardSet[] = [
  {
    id: "react-hooks",
    title: "React Hooks",
    category: "react",
    subcategory: "hooks",
    flashcards: reactHooksFlashcards,
  },
  {
    id: "html-apis",
    title: "HTML APIs Quiz",
    category: "html",
    subcategory: "apis",
    flashcards: htmlApisFlashcards,
  },
];

// Utility functions
export const getFlashcardSet = (
  category: string,
  subcategory: string,
): FlashcardSet | null => {
  return (
    mockFlashcardSets.find(
      (set) => set.category === category && set.subcategory === subcategory,
    ) || null
  );
};

export const fetchFlashcards = async (
  category: string,
  subcategory: string,
): Promise<FetchFlashcardsResponse> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  const flashcardSet = getFlashcardSet(category, subcategory);

  if (!flashcardSet) {
    throw new Error(`No flashcards found for ${category}/${subcategory}`);
  }

  return {
    flashcards: flashcardSet.flashcards,
    total: flashcardSet.flashcards.length,
    category: flashcardSet.category,
    subcategory: flashcardSet.subcategory,
  };
};

// Shuffle utility for randomizing questions
export const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Get available categories and subcategories
export const getAvailableCategories = () => {
  const categories = mockFlashcardSets.reduce(
    (acc, set) => {
      if (!acc[set.category]) {
        acc[set.category] = [];
      }
      acc[set.category].push({
        subcategory: set.subcategory,
        title: set.title,
        count: set.flashcards.length,
      });
      return acc;
    },
    {} as Record<
      string,
      Array<{ subcategory: string; title: string; count: number }>
    >,
  );

  return categories;
};

// Export individual quiz data for direct access
export { reactHooksFlashcards, htmlApisFlashcards, mockFlashcardSets };
