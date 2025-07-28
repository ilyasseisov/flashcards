import { Schema, model, models, Document } from "mongoose";

// Define the interface for TypeScript
// Extends Document for Mongoose document properties like _id, etc.
export interface ICategory extends Document {
  name: string;
  description?: string; // Optional as per your requirement
  slug: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

// Create the schema
const CategorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: true,
      unique: true, // Ensures category names are unique
      trim: true,
    },
    description: {
      type: String,
      required: false, // Description is optional
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true, // Ensures slugs are unique for URL integrity
      lowercase: true, // Always store slugs in lowercase
      trim: true,
    },
    order: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  },
);

// Return Mongoose's model if it exists, otherwise create a new model
const CategoryModel =
  models?.Category || model<ICategory>("Category", CategorySchema);

export default CategoryModel;
