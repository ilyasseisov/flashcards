interface PageProps {
  params: {
    category: string;
    subcategory: string;
  };
}

export default async function Page({ params }: PageProps) {
  const { category, subcategory } = await params;

  return (
    <main className="container py-8">
      <h1>Quiz</h1>
      <p>Category: {category}</p>
      <p>Subcategory: {subcategory}</p>
    </main>
  );
}
