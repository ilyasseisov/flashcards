// app/flashcards/[category]/[subcategory]/page.tsx
// Mongoose Schemas & DB connection
import dbConnect from "@/lib/db";
import CategoryModel, { ICategory } from "@/lib/models/category";
import SubcategoryModel, { ISubcategory } from "@/lib/models/subcategory";
import FlashcardModel, { IFlashcard } from "@/lib/models/flashcard";
import FlashcardProgressModel, {
  IFlashcardProgress,
} from "@/lib/models/flashcard-progress";

// Next.js specific imports
import { notFound, redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

// Our new client component
import QuizClient from "@/components/quiz/quiz-client";

// Type definition for props
interface QuizPageProps {
  params: {
    category: string; // Category slug (e.g., 'html')
    subcategory: string; // Subcategory slug (e.g., 'forms')
  };
}

// This is an Async Server Component
export default async function SubcategoryPage({ params }: QuizPageProps) {
  // --- 1. Authentication Check & Debug Logging (FIXED) ---
  // The `auth()` function is async and must be awaited.
  const { userId: clerkId } = await auth();
  console.log("Clerk User ID:", clerkId || "No user ID found"); // Log the Clerk ID

  if (!clerkId) {
    // If the user is not authenticated, we redirect them.
    console.log("No user ID, redirecting to /sign-in");
    redirect("/sign-in");
  }

  // Fetch the slugs from the URL params.
  const categorySlug = params.category;
  const subcategorySlug = params.subcategory;

  console.log(
    `Processing request for category: "${categorySlug}" and subcategory: "${subcategorySlug}"`,
  );

  // 2. Connect to the database
  await dbConnect();
  console.log("Database connected.");

  let flashcards = [];
  let progress = [];

  try {
    // 3. Find the Category document using its slug
    const category = (await CategoryModel.findOne({ slug: categorySlug })
      .select("_id name slug")
      .lean()) as ICategory | null; // <-- ADDED TYPE ASSERTION HERE

    // If category not found, return 404
    if (!category) {
      console.log(`Category "${categorySlug}" not found. Calling notFound().`);
      notFound();
    }
    console.log(`Found Category: ${category.name} (ID: ${category._id})`);

    // 4. Find the Subcategory document using its slug AND the found categoryId
    const subcategory = (await SubcategoryModel.findOne({
      slug: subcategorySlug,
      categoryId: category._id,
    })
      .select("_id name slug categoryId")
      .lean()) as ISubcategory | null; // <-- ADDED TYPE ASSERTION HERE

    // If subcategory not found, return 404
    if (!subcategory) {
      console.log(
        `Subcategory "${subcategorySlug}" not found under category "${category.name}". Calling notFound().`,
      );
      notFound();
    }
    console.log(
      `Found Subcategory: ${subcategory.name} (ID: ${subcategory._id})`,
    );

    // 5. Fetch Flashcards and User Progress
    flashcards = (await FlashcardModel.find({ subcategoryId: subcategory._id })
      .sort({ order: 1 })
      .lean()) as IFlashcard[]; // <-- ADDED TYPE ASSERTION HERE

    // If no flashcards are found, we'll return an empty state.
    if (flashcards.length === 0) {
      console.log(`No flashcards found for subcategory "${subcategory.name}".`);
      return (
        <main className="container mx-auto p-4 text-center text-lg text-gray-600 md:p-8">
          No flashcards found for this subcategory yet.
        </main>
      );
    }

    console.log(
      `Fetched ${flashcards.length} flashcards for subcategory "${subcategory.name}".`,
    );

    progress = (await FlashcardProgressModel.find({
      clerkId: clerkId,
      flashcardId: { $in: flashcards.map((f) => f._id) },
    }).lean()) as IFlashcardProgress[]; // <-- ADDED TYPE ASSERTION HERE

    console.log(
      `Fetched ${flashcards.length} flashcards and ${progress.length} progress records for Clerk ID: ${clerkId}.`,
    );
  } catch (error) {
    console.error("Database error fetching quiz data:", error);
    return (
      <div className="p-8 text-center text-red-500">
        An error occurred while fetching quiz data.
      </div>
    );
  }

  // --- 6. Render the Client Component with Fetched Data ---
  return (
    <QuizClient
      initialFlashcards={JSON.parse(JSON.stringify(flashcards))}
      initialProgress={JSON.parse(JSON.stringify(progress))}
      categorySlug={categorySlug}
      subcategorySlug={subcategorySlug}
    />
  );
}
