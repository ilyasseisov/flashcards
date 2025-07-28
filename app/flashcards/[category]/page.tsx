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
  // get category slug
  const categorySlug = await params.category;
  let category: ICategory | null = null;
  let subcategories: ISubcategory[] = [];

  try {
    // 1. Connect to the database
    await dbConnect();

    // 2. Find the Category document using its slug
    // We select only the _id to keep the payload small, as we only need the ID for subcategory lookup
    category = await CategoryModel.findOne({ slug: categorySlug })
      .select("_id name slug")
      .lean();

    // 3. Handle case where category is not found
    if (!category) {
      // Next.js notFound() will render the nearest not-found.tsx or a default 404 page
      notFound();
    }

    // 4. Fetch all Subcategories linked to this Category's _id
    // We use .lean() for performance when not modifying the documents
    subcategories = await SubcategoryModel.find({ categoryId: category._id })
      .sort({ order: 1 }) // Optional: Sort subcategories alphabetically by name
      .lean();

    console.log(subcategories);
  } catch (error) {
    console.error("Database error fetching category or subcategories:", error);
    // In a real application, you might want a more user-friendly error page or message
    // For now, we'll re-throw or show a generic error.
    // As it's a server component, re-throwing will trigger Next.js error boundary.
    throw new Error("Failed to load category data.");
  }

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
