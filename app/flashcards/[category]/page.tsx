// db connect
import dbConnect from "@/lib/db";
// models
import CategoryModel from "@/lib/models/category";
import SubcategoryModel from "@/lib/models/subcategory";
// mongoose
import { Types } from "mongoose";
// next
import { notFound } from "next/navigation";
import Link from "next/link";
// icons
import { BadgeCheck, BadgeAlert, BadgeX } from "lucide-react";
// auth
import { auth } from "@clerk/nextjs/server";
// quiz progress
import { getQuizProgressBySubcategory } from "@/lib/actions/quiz-progress";

// type
interface PageProps {
  params: {
    category: string;
  };
}

export default async function Page({ params }: PageProps) {
  const categorySlug = params.category;
  // Use lean-safe shapes for better type compatibility with `.lean()`
  type CategoryLean = { _id: Types.ObjectId; name: string; slug: string };
  type SubcategoryLean = {
    _id: Types.ObjectId;
    name: string;
    slug: string;
    categoryId: Types.ObjectId;
    order: number;
  };

  let category: CategoryLean | null = null;
  let subcategories: SubcategoryLean[] = [];

  // 1. Connect to the database
  await dbConnect();

  // 2. Find the Category document using its slug
  // IMPORTANT: Keep this OUTSIDE of try-catch so notFound() can work properly
  category = await CategoryModel.findOne({ slug: categorySlug })
    .select("_id name slug")
    .lean<CategoryLean>();

  // 3. Handle case where category is not found
  if (!category) {
    console.log("Category not found, calling notFound()");
    notFound(); // This will throw NEXT_HTTP_ERROR_FALLBACK;404 - don't catch it!
  }

  // 4. Only wrap subcategory fetching in try-catch
  try {
    subcategories = await SubcategoryModel.find({ categoryId: category._id })
      .sort({ order: 1 }) // Sort by 'order' field in ascending order
      .lean<SubcategoryLean[]>();

    console.log(subcategories);
  } catch (error: unknown) {
    // This catch block will only handle actual database errors for subcategories
    console.error("Database error fetching subcategories:", error);
    // You can handle subcategory fetch errors here if needed
    // For example, you might want to show an empty list or a different error message
  }

  // 5. Fetch user progress for these subcategories
  let progress: Record<string, { completed: boolean; score: number }> = {};
  try {
    const { userId } = await auth();
    if (userId) {
      progress = await getQuizProgressBySubcategory(userId);
    }
  } catch {
    // If auth or progress fails, just show no icons
    progress = {};
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
            {subcategories.map((subcat) => {
              // Use subcat._id as key for progress lookup
              const subcatId = (subcat._id as Types.ObjectId).toString();
              const subcatProgress = progress[subcatId];
              let icon = null;
              if (subcatProgress) {
                if (subcatProgress.completed && subcatProgress.score === 100) {
                  icon = (
                    <BadgeCheck
                      className="ml-2 inline text-green-500"
                      strokeWidth={2.5}
                    />
                  );
                } else if (
                  subcatProgress.completed &&
                  subcatProgress.score === 0
                ) {
                  icon = (
                    <BadgeX
                      className="ml-2 inline text-red-500"
                      strokeWidth={2.5}
                    />
                  );
                } else if (
                  subcatProgress.completed &&
                  subcatProgress.score < 100
                ) {
                  icon = (
                    <BadgeAlert
                      className="ml-2 inline text-orange-400"
                      strokeWidth={2.5}
                    />
                  );
                }
              }
              return (
                <li
                  key={subcatId}
                  className="rounded-lg bg-white shadow-md transition-shadow duration-300 hover:shadow-lg"
                >
                  <Link
                    href={`/flashcards/${categorySlug}/${subcat.slug}`}
                    className="flex items-center justify-center gap-2 p-6 text-center text-xl font-medium text-gray-900 hover:text-indigo-700"
                  >
                    {subcat.name}
                    {icon}
                  </Link>
                </li>
              );
            })}
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
