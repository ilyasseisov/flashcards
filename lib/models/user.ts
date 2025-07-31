import { Schema, model, models, Document } from "mongoose";

// Define the interface for TypeScript
export interface IUser extends Document {
  clerkId: string; // Clerk user ID
  email: string; // --- HIGHLIGHTED CHANGE: Added email field to interface ---
  customerId?: string | null; // Added | null to correctly represent the sparse unique field
  planId: "free" | "paid";
  createdAt: Date;
  updatedAt: Date;
}

// Create the schema
const UserSchema = new Schema<IUser>(
  {
    clerkId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      // --- HIGHLIGHTED CHANGE: Added email field to schema ---
      type: String,
      required: true,
      unique: true, // Each email should be unique
      trim: true,
      lowercase: true, // Store emails in lowercase for consistent lookups
      // You might add a regex 'match' validator here for basic email format,
      // but robust validation is often handled by Clerk and/or frontend/backend logic.
    },
    customerId: {
      type: String,
      required: false,
      unique: true,
      sparse: true,
      trim: true,
    },
    planId: {
      type: String,
      required: true,
      enum: ["free", "paid"],
      default: "free",
    },
  },
  {
    timestamps: true,
  },
);

// Return mongoose's model if it exists
// otherwise create a new model
const UserModel = models?.User || model<IUser>("User", UserSchema);

export default UserModel;
