"use server";

import dbConnect from "@/lib/db";
import FlashcardModel from "@/lib/models/flashcard";
import FlashcardProgressModel from "@/lib/models/flashcard-progress";
import SubcategoryModel from "@/lib/models/subcategory";
import { Types } from "mongoose";

export interface SubcategoryQuizProgress {
  completed: boolean;
  score: number; // 0-100
}

export interface QuizProgressBySubcategory {
  [subcategoryId: string]: SubcategoryQuizProgress;
}

/**
 * Returns quiz progress for each subcategory for the given user.
 * @param clerkId Clerk user ID
 */
export async function getQuizProgressBySubcategory(
  clerkId: string,
): Promise<QuizProgressBySubcategory> {
  await dbConnect();

  // Get all subcategories
  const subcategories = await SubcategoryModel.find({}).lean();
  const subcategoryIds = subcategories.map((sub) => sub._id);

  // Get all flashcards for these subcategories
  const flashcards = await FlashcardModel.find({
    subcategoryId: { $in: subcategoryIds },
  })
    .select("_id subcategoryId")
    .lean();

  // Group flashcards by subcategory
  const flashcardsBySubcat: { [subcatId: string]: Types.ObjectId[] } = {};
  for (const fc of flashcards) {
    const subcatId = fc.subcategoryId.toString();
    if (!flashcardsBySubcat[subcatId]) flashcardsBySubcat[subcatId] = [];
    flashcardsBySubcat[subcatId].push(fc._id);
  }

  // Get all progress records for this user for these flashcards
  const flashcardIds = flashcards.map((fc) => fc._id);
  const progresses = await FlashcardProgressModel.find({
    clerkId,
    flashcardId: { $in: flashcardIds },
  })
    .select("flashcardId status")
    .lean();

  // Group progress by flashcardId
  const progressByFlashcard: {
    [flashcardId: string]: "correct" | "incorrect";
  } = {};
  for (const prog of progresses) {
    progressByFlashcard[prog.flashcardId.toString()] = prog.status;
  }

  // For each subcategory, compute completed and score
  const result: QuizProgressBySubcategory = {};
  for (const subcat of subcategories) {
    const subcatId = subcat._id.toString();
    const fcIds = flashcardsBySubcat[subcatId] || [];
    if (fcIds.length === 0) {
      result[subcatId] = { completed: false, score: 0 };
      continue;
    }
    let correct = 0;
    let attempted = 0;
    for (const fcId of fcIds) {
      const status = progressByFlashcard[fcId.toString()];
      if (status) {
        attempted++;
        if (status === "correct") correct++;
      }
    }
    const completed = attempted === fcIds.length;
    const score =
      attempted === 0 ? 0 : Math.round((correct / fcIds.length) * 100);
    result[subcatId] = { completed, score };
  }
  return result;
}
