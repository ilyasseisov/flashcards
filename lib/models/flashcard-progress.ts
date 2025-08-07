import { Schema, model, models, Document, Types } from "mongoose";

// Define the interface for TypeScript
export interface IFlashcardProgress extends Document {
  clerkId: string; // The Clerk ID of the user
  flashcardId: Types.ObjectId; // Reference to the specific Flashcard
  status: "correct" | "incorrect"; // The last recorded status for this attempt
  selectedOptionIndex?: number; // The index of the user's selected answer (optional)
  createdAt: Date; // When this progress record was first created
  updatedAt: Date; // When this progress record was last updated (e.g., status changed from incorrect to correct)
}

// Create the schema
const FlashcardProgressSchema = new Schema<IFlashcardProgress>(
  {
    clerkId: {
      type: String,
      required: true,
    },
    flashcardId: {
      type: Schema.Types.ObjectId,
      ref: "Flashcard", // References the Flashcard model
      required: true,
    },
    status: {
      type: String,
      enum: ["correct", "incorrect"], // The last outcome of the flashcard attempt
      required: true,
    },
    selectedOptionIndex: {
      type: Number,
      required: false,
    },
  },
  {
    timestamps: true, // This will handle createdAt and updatedAt automatically
  },
);

// --- Important: Compound Unique Index ---
// This ensures that a single user can only have ONE progress record for any given flashcard.
FlashcardProgressSchema.index({ clerkId: 1, flashcardId: 1 }, { unique: true });

// Return Mongoose's model if it exists, otherwise create a new model
const FlashcardProgressModel =
  models?.FlashcardProgress ||
  model<IFlashcardProgress>("FlashcardProgress", FlashcardProgressSchema);

export default FlashcardProgressModel;
