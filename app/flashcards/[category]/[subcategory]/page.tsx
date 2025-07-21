interface PageProps {
  params: {
    category: string;
    subcategory: string;
  };
}

export default async function Page({ params }: PageProps) {
  const { category, subcategory } = await params;

  // Now you can use category and subcategory to:
  // - Fetch relevant flashcards
  // - Display the right content
  // - Set page titles, etc.

  return (
    <div>
      <h1>
        Flashcards for {category} - {subcategory}
      </h1>
      {/* Your flashcard content here */}
    </div>
  );
}
