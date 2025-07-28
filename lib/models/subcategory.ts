import { Schema, model, models, Document, Types } from "mongoose";

// Define the interface for TypeScript
export interface ISubcategory extends Document {
  name: string;
  slug: string;
  categoryId: Types.ObjectId; // Reference to the parent Category's _id
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

// Create the schema
const SubcategorySchema = new Schema<ISubcategory>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
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

// Compound Index: Ensures 'slug' is unique within a given 'categoryId'
SubcategorySchema.index({ slug: 1, categoryId: 1 }, { unique: true });

// Return Mongoose's model if it exists, otherwise create a new model
const SubcategoryModel =
  models?.Subcategory || model<ISubcategory>("Subcategory", SubcategorySchema);

export default SubcategoryModel;
