// db connect
import dbConnect from "@/lib/db";
// models
import CategoryModel, { ICategory } from "@/lib/models/category";
import SubcategoryModel, { ISubcategory } from "@/lib/models/subcategory";
// mongoose
import { Types } from "mongoose";
// next
import { notFound } from "next/navigation";
import Link from "next/link";
// type
interface PageProps {
  params: {
    category: string;
  };
}

export default async function Page({ params }: PageProps) {
  const categorySlug = params.category;
  let category: ICategory | null = null;
  let subcategories: ISubcategory[] = [];

  // --- HIGHLIGHTED CHANGE START ---
  // 1. Connect to the database (moved here to ensure connection before any DB ops)
  await dbConnect();

  try {
    // 2. Find the Category document using its slug
    // This part is now outside the main error handling for subcategories
    category = await CategoryModel.findOne({ slug: categorySlug })
      .select("_id name slug")
      .lean();

    // 3. Handle case where category is not found immediately
    if (!category) {
      // If category is not found, call notFound().
      // This will stop the execution of this component and render not-found.tsx.
      // Any subsequent code in this function will not run.
      notFound();
    }

    // 4. Fetch all Subcategories linked to this Category's _id
    // This part is now within a try-catch for other potential database errors
    subcategories = await SubcategoryModel.find({ categoryId: category._id })
      .sort({ order: 1 }) // Sort by 'order' field in ascending order
      .lean();

    console.log(subcategories);
  } catch (error: any) {
    // This catch block will now primarily handle errors *other than* notFound()
    // (e.g., actual database connection issues, Mongoose validation errors during find operations if any)
    console.error("Database error fetching subcategories:", error);
    // throw new Error(
    //   "Failed to load subcategory data due to an unexpected error.",
    // );
  }
  // --- HIGHLIGHTED CHANGE END ---

  // return
  return (
    <main className="container mx-auto p-4 md:p-8">
      {/* Category Header */}
      <h1 className="mb-6 text-center text-4xl font-bold text-gray-800">
        Category:{" "}
        <span className="text-indigo-600 capitalize">{category?.name}</span>
      </h1>

      {/* Subcategories List */}
      <section className="mt-10">
        <h2 className="mb-6 text-center text-3xl font-semibold text-gray-700">
          Subcategories
        </h2>
        {subcategories.length > 0 ? (
          <ul className="mx-auto grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {subcategories.map((subcat) => (
              <li
                key={(subcat._id as Types.ObjectId).toString()}
                className="rounded-lg bg-white shadow-md transition-shadow duration-300 hover:shadow-lg"
              >
                <Link
                  href={`/flashcards/${categorySlug}/${subcat.slug}`}
                  className="block p-6 text-center text-xl font-medium text-gray-900 hover:text-indigo-700"
                >
                  {subcat.name}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-lg text-gray-600">
            No subcategories found for this category yet.
          </p>
        )}
      </section>
    </main>
  );
}
