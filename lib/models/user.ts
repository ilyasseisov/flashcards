import { Schema, model, models, Document } from "mongoose";

// It should extend Mongoose's Document to include _id, save(), etc.
export interface IUser extends Document {
  // Changed from 'User' to 'IUser' by convention, and added 'extends Document'
  clerkId: string; // Clerk user ID
  customerId?: string | null; // Added | null to correctly represent the sparse unique field
  planId: "free" | "paid";
  createdAt: Date;
  updatedAt: Date;
}

// Create the schema (this part remains the same as your example, it's already well-defined)
const UserSchema = new Schema<IUser>(
  {
    clerkId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
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
const UserModel = models?.User || model<IUser>("User", UserSchema); // Ensure model uses IUser

export default UserModel;
