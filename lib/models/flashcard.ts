import { Schema, model, models, Document, Types } from "mongoose";

// Define the interface for TypeScript
export interface IFlashcard extends Document {
  question: string;
  options: string[]; // Array of strings for choices
  correctAnswerIndex: number; // Index of the correct answer in the options array
  explanation: string;
  subcategoryId: Types.ObjectId; // Reference to the parent Subcategory's _id
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

// Create the schema
const FlashcardSchema = new Schema<IFlashcard>(
  {
    question: {
      type: String,
      required: true,
      trim: true,
    },
    options: {
      type: [String], // Array of strings
      required: true,
      validate: {
        validator: function (v: string[]) {
          return v && v.length === 4; // Ensures exactly 4 options
        },
        message: "Flashcards must have exactly 4 options.",
      },
    },
    correctAnswerIndex: {
      type: Number,
      required: true,
      min: 0,
      validate: {
        validator: function (v: number) {
          // Ensure correctAnswerIndex is a valid index within the options array.
          return this.options && v >= 0 && v < this.options.length;
        },
        message:
          "Correct answer index must be a valid index within the options array.",
      },
    },
    explanation: {
      type: String,
      required: true,
      trim: true,
    },
    subcategoryId: {
      type: Schema.Types.ObjectId,
      ref: "Subcategory", // References the Subcategory model
      required: true,
    },
    order: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    timestamps: true,
  },
);

// Optional: Add an index for faster lookups by subcategory
FlashcardSchema.index({ subcategoryId: 1 });

// Return Mongoose's model if it exists, otherwise create a new model
const FlashcardModel =
  models?.Flashcard || model<IFlashcard>("Flashcard", FlashcardSchema);

export default FlashcardModel;
