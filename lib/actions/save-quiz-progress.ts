// lib/actions/save-quiz-progress.ts
"use server";

import dbConnect from "@/lib/db";
import FlashcardProgressModel from "@/lib/models/flashcard-progress";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

interface ProgressData {
  flashcardId: string;
  status: "correct" | "incorrect";
  selectedOptionIndex?: number;
}

export async function saveQuizProgress(progressData: ProgressData[]) {
  try {
    // Get authenticated user
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      throw new Error("User not authenticated");
    }

    // Connect to database
    await dbConnect();

    console.log(
      `Saving progress for ${progressData.length} flashcards for user: ${clerkId}`,
    );

    // Save or update progress for each flashcard
    const savePromises = progressData.map(async (progress) => {
      return await FlashcardProgressModel.findOneAndUpdate(
        {
          clerkId: clerkId,
          flashcardId: progress.flashcardId,
        },
        {
          clerkId: clerkId,
          flashcardId: progress.flashcardId,
          status: progress.status,
          updatedAt: new Date(),
          ...(progress.selectedOptionIndex !== undefined && {
            selectedOptionIndex: progress.selectedOptionIndex,
          }),
        },
        {
          upsert: true, // Create if doesn't exist, update if exists
          new: true,
        },
      );
    });

    const results = await Promise.all(savePromises);
    console.log(`Successfully saved ${results.length} progress records`);

    // Revalidate the path to refresh any cached data
    revalidatePath("/flashcards");

    return { success: true, message: "Progress saved successfully" };
  } catch (error) {
    console.error("Error saving quiz progress:", error);
    throw new Error("Failed to save quiz progress");
  }
}
