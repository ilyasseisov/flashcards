// db connect
import dbConnect from "@/lib/db";
// models
import CategoryModel, { ICategory } from "@/lib/models/category";
import SubcategoryModel, { ISubcategory } from "@/lib/models/subcategory";
import FlashcardModel, { IFlashcard } from "@/lib/models/flashcard"; // Import the Flashcard model
// mongoose
import { Types } from "mongoose";
// next
import { notFound } from "next/navigation";
import Link from "next/link"; // Assuming you might want to link back or to other flashcards

// type
interface PageProps {
  params: {
    category: string; // Category slug (e.g., 'html')
    subcategory: string; // Subcategory slug (e.g., 'forms')
  };
}

// This is an Async Server Component
export default async function SubcategoryPage({ params }: PageProps) {
  const categorySlug = await params.category;
  const subcategorySlug = await params.subcategory;

  let category: ICategory | null = null;
  let subcategory: ISubcategory | null = null;
  let flashcards: IFlashcard[] = [];

  // 1. Connect to the database
  await dbConnect();

  // 2. Find the Category document using its slug
  // IMPORTANT: Keep this OUTSIDE of try-catch so notFound() can work properly
  category = await CategoryModel.findOne({ slug: categorySlug })
    .select("_id name slug")
    .lean();

  // If category not found, return 404
  if (!category) {
    console.log("Category not found, calling notFound()");
    notFound();
  }

  // 3. Find the Subcategory document using its slug AND the found categoryId
  // IMPORTANT: Keep this OUTSIDE of try-catch so notFound() can work properly
  subcategory = await SubcategoryModel.findOne({
    slug: subcategorySlug,
    categoryId: category._id, // Crucial for correct lookup
  })
    .select("_id name slug categoryId")
    .lean();

  // If subcategory not found, return 404
  if (!subcategory) {
    console.log("Subcategory not found, calling notFound()");
    notFound();
  }

  // 4. Only wrap flashcard fetching in try-catch
  try {
    // Fetch all Flashcards linked to this Subcategory's _id
    flashcards = await FlashcardModel.find({ subcategoryId: subcategory._id })
      .sort({ order: 1 }) // Sort by 'order' field if available
      .lean();

    console.log(
      `Fetched ${flashcards.length} flashcards for subcategory "${subcategory.name}"`,
    );
  } catch (error) {
    // This catch block will only handle actual database errors for flashcards
    console.error("Database error fetching flashcards:", error);
    // You can handle flashcard fetch errors here if needed
    // For example, you might want to show an empty list or a different error message
  }

  return (
    <main className="container mx-auto p-4 md:p-8">
      {/* Navigation/Breadcrumbs (Optional, but good UX) */}
      <nav className="mb-4 text-sm text-gray-600">
        <Link
          href={`/flashcards/${categorySlug}`}
          className="text-indigo-600 hover:underline"
        >
          {category?.name}
        </Link>
        <span className="mx-2">/</span>
        <span className="font-semibold">{subcategory?.name}</span>
      </nav>

      {/* Page Header */}
      <h1 className="mb-6 text-center text-4xl font-bold text-gray-800">
        Quiz:{" "}
        <span className="text-indigo-600 capitalize">{subcategory?.name}</span>
      </h1>

      {/* Flashcards List */}
      <section className="mx-auto mt-10 max-w-2xl">
        {flashcards.length > 0 ? (
          <div className="space-y-6">
            {flashcards.map((flashcard, index) => (
              <div
                key={(flashcard._id as Types.ObjectId).toString()}
                className="rounded-lg bg-white p-6 shadow-md"
              >
                <h3 className="mb-4 text-xl font-semibold text-gray-900">
                  Question {index + 1}: {flashcard.question}
                </h3>
                <div className="mb-4 space-y-2">
                  {flashcard.options.map((option, optIndex) => (
                    <p key={optIndex} className="text-gray-700">
                      <strong>{String.fromCharCode(65 + optIndex)}.</strong>{" "}
                      {option}
                    </p>
                  ))}
                </div>
                <div className="border-t border-gray-200 pt-4">
                  <p className="mb-2 font-medium text-green-700">
                    Correct Answer:{" "}
                    {String.fromCharCode(65 + flashcard.correctAnswerIndex)}.{" "}
                    {flashcard.options[flashcard.correctAnswerIndex]}
                  </p>
                  <p className="text-sm text-gray-800">
                    Explanation: {flashcard.explanation}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-lg text-gray-600">
            No flashcards found for this subcategory yet.
          </p>
        )}
      </section>
    </main>
  );
}
