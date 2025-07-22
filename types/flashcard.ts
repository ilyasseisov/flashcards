export interface AnswerOption {
  id: string;
  label: string; // 'A', 'B', 'C', 'D'
  text: string;
}

export interface Flashcard {
  id: string;
  question: string;
  options: AnswerOption[];
  correctAnswerId: string;
  explanation: string;
}

export interface UserAnswer {
  questionId: string;
  selectedOptionId: string;
  isCorrect: boolean;
}

export interface QuizState {
  currentQuestionIndex: number;
  userAnswers: UserAnswer[];
  isCompleted: boolean;
  showResults: boolean; // for current question
  totalQuestions: number;
}

export interface QuizProgress {
  current: number;
  total: number;
  percentage: number;
  answeredCount: number;
  correctCount: number;
}

export interface FlashcardSet {
  id: string;
  title: string;
  category: string;
  subcategory: string;
  flashcards: Flashcard[];
}

// Component Props Types
export interface AnswerOptionProps {
  option: AnswerOption;
  isSelected: boolean;
  isCorrect?: boolean;
  isRevealed: boolean;
  isDisabled: boolean;
  onClick: () => void;
}

export interface QuizPaginationProps {
  currentQuestion: number;
  totalQuestions: number;
  answeredQuestions: Set<number>;
  correctAnswers: Set<number>;
  onQuestionSelect: (index: number) => void;
}

export interface ProgressIndicatorProps {
  current: number;
  total: number;
  className?: string;
}

// Utility Types
export type AnswerState = "unanswered" | "correct" | "incorrect";

// API Response Types
export interface FetchFlashcardsResponse {
  flashcards: Flashcard[];
  total: number;
  category: string;
  subcategory: string;
}
