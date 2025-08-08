"use server"; // This directive marks the file (or function) as a Server Action

import dbConnect from "@/lib/db"; // Adjust path to your dbConnect function
import CategoryModel from "@/lib/models/category"; // Adjust path to your Category model
import SubcategoryModel from "@/lib/models/subcategory"; // Adjust path to your Subcategory model
import { ICategory } from "@/lib/models/category";
import { ISubcategory } from "@/lib/models/subcategory";
import { Types } from "mongoose";

// Define the structure of the data we want to return for the navigation
interface NavSubItem {
  title: string;
  slug: string; // Use slug for the URL
  url: string;
  // Include subcategoryId so clients can map progress keyed by subcategory id
  subcategoryId: string;
}

interface NavMainItem {
  title: string;
  slug: string; // Use slug for the URL
  url: string;
  items: NavSubItem[];
}

/**
 * Fetches all categories and their associated subcategories from the database
 * and structures them for use in the navigation sidebar.
 * This is a Server Action.
 *
 * @returns An array of structured navigation items.
 */
export async function getNavCategoriesAndSubcategories(): Promise<
  NavMainItem[]
> {
  try {
    await dbConnect();

    // Fetch all categories, sorted by order
    const categories: ICategory[] = await CategoryModel.find({})
      .sort({ order: 1 })
      .lean();

    // Fetch all subcategories, sorted by order then name
    const subcategories: ISubcategory[] = await SubcategoryModel.find({})
      .sort({ order: 1, name: 1 }) // Sort by 'order' then 'name'
      .lean();

    // Structure the data for the navigation
    const navData: NavMainItem[] = categories.map((category) => {
      const categorySlug = category.slug;
      const categoryUrl = `/flashcards/${categorySlug}`;

      const subItems: NavSubItem[] = subcategories
        .filter(
          (subcat) =>
            subcat.categoryId.toString() ===
            (category._id as Types.ObjectId).toString(),
        )
        .map((subcat) => ({
          title: subcat.name,
          slug: subcat.slug, // Use slug for the subcategory URL
          url: `${categoryUrl}/${subcat.slug}`, // Construct the full URL
          subcategoryId: (subcat._id as Types.ObjectId).toString(),
        }));

      return {
        title: category.name,
        slug: categorySlug,
        url: categoryUrl,
        items: subItems,
      };
    });

    return navData;
  } catch (error) {
    console.error("Error fetching navigation data:", error);
    // In a production app, you might want to return a more specific error or empty array
    throw new Error("Failed to load navigation data.");
  }
}
