interface PageProps {
  params: {
    category: string;
  };
}

export default async function Page({ params }: PageProps) {
  const { category } = await params;

  return (
    <main className="container py-8">
      <h1>Category:</h1>
      <p>{category}</p>
    </main>
  );
}
