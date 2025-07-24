import { FlashcardQuiz } from "@/components/quiz/flashcard-quiz";
import { getFlashcardSet } from "@/lib/flashcard-data";
import { notFound } from "next/navigation";

interface PageProps {
  params: {
    category: string;
    subcategory: string;
  };
}

export default async function Page({ params }: PageProps) {
  const { category, subcategory } = await params;

  const flashcardSet = getFlashcardSet(category, subcategory);

  if (!flashcardSet) {
    notFound();
  }

  return (
    <main className="container py-8">
      <h1 className="mb-8 bg-amber-50 text-center text-2xl font-bold">
        {flashcardSet.title}
      </h1>
      <FlashcardQuiz flashcards={flashcardSet.flashcards} />
    </main>
  );
}
