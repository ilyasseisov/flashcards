import { WebhookEvent } from "@clerk/nextjs/server"; // Type for Clerk webhook events
import { headers } from "next/headers"; // For accessing request headers
import { Webhook } from "svix"; // For verifying webhook signatures

// Database connection and User model
import dbConnect from "@/lib/db"; // Adjust path
import UserModel from "@/lib/models/user"; // Adjust path

// Define your Clerk Webhook Secret Key
// IMPORTANT: Store this securely in your .env.local file
const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

export async function POST(req: Request) {
  // --- DEBUG LOGS START ---
  console.log("--- Webhook POST Request Started ---");
  console.log("WEBHOOK_SECRET loaded:", WEBHOOK_SECRET ? "YES" : "NO"); // Check if secret is loaded
  // --- DEBUG LOGS END ---

  // 1. Get the headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // --- DEBUG LOGS START ---
  console.log("Svix Headers:", {
    svix_id,
    svix_timestamp,
    svix_signature: svix_signature ? "PRESENT" : "MISSING",
  });
  // --- DEBUG LOGS END ---

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    console.error("Missing Svix headers.");
    return new Response("Error occured -- no svix headers", {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // --- DEBUG LOGS START ---
  console.log("Payload parsed. Attempting Svix verification...");
  // --- DEBUG LOGS END ---

  // Create a new Svix instance with your secret.
  // The 'as string' assertion is needed because process.env can be undefined
  const wh = new Webhook(WEBHOOK_SECRET as string);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
    // --- DEBUG LOGS START ---
    console.log("Svix verification successful.");
    // --- DEBUG LOGS END ---
  } catch (err) {
    console.error("Error verifying webhook signature:", err);
    return new Response("Error occured -- invalid signature", {
      status: 400,
    });
  }

  // Get the ID and type
  const { id } = evt.data;
  const eventType = evt.type;

  // Log the event for debugging
  console.log(`Clerk Webhook Event Type: ${eventType}`);
  // console.log('Webhook body:', body); // Uncomment for full debugging of payload if needed

  try {
    // --- DEBUG LOGS START ---
    console.log("Attempting DB connect...");
    // --- DEBUG LOGS END ---
    // Connect to the database
    await dbConnect();
    // --- DEBUG LOGS START ---
    console.log("DB connected successfully.");
    // --- DEBUG LOGS END ---

    // Handle different event types
    if (eventType === "user.created") {
      const { id: clerkId, email_addresses } = evt.data;
      const email = email_addresses[0]?.email_address; // Get the primary email address

      // --- DEBUG LOGS START ---
      console.log(
        `Handling user.created for Clerk ID: ${clerkId}, Email: ${email}`,
      );
      // --- DEBUG LOGS END ---

      if (!clerkId || !email) {
        console.error("Missing clerkId or email in user.created payload.");
        return new Response("Missing user data in webhook payload", {
          status: 400,
        });
      }

      // Create a new user in MongoDB
      const newUser = await UserModel.create({
        clerkId: clerkId,
        email: email,
        planId: "free", // All new users are free by default
      });

      console.log("New user created in MongoDB:", newUser.toObject());
      return new Response("User created in MongoDB", { status: 200 });
    } else if (eventType === "user.updated") {
      const { id: clerkId, email_addresses } = evt.data;
      const email = email_addresses[0]?.email_address; // Get the primary email address

      // --- DEBUG LOGS START ---
      console.log(
        `Handling user.updated for Clerk ID: ${clerkId}, Email: ${email}`,
      );
      // --- DEBUG LOGS END ---

      if (!clerkId || !email) {
        console.error("Missing clerkId or email in user.updated payload.");
        return new Response("Missing user data in webhook payload", {
          status: 400,
        });
      }

      // Find and update the user in MongoDB
      const updatedUser = await UserModel.findOneAndUpdate(
        { clerkId: clerkId },
        { email: email }, // Update email if it changes
        { new: true, upsert: true, runValidators: true }, // upsert: true ensures it creates if not found (fallback)
      ).lean();

      console.log("User updated in MongoDB:", updatedUser);
      return new Response("User updated in MongoDB", { status: 200 });
    } else if (eventType === "user.deleted") {
      const { id: clerkId } = evt.data;

      // --- DEBUG LOGS START ---
      console.log(`Handling user.deleted for Clerk ID: ${clerkId}`);
      // --- DEBUG LOGS END ---

      if (!clerkId) {
        console.error("Missing clerkId in user.deleted payload.");
        return new Response("Missing user ID in webhook payload", {
          status: 400,
        });
      }

      // Delete the user from MongoDB
      const deletedUser = await UserModel.findOneAndDelete({
        clerkId: clerkId,
      }).lean();

      if (deletedUser) {
        console.log("User deleted from MongoDB:", deletedUser);
        return new Response("User deleted from MongoDB", { status: 200 });
      } else {
        console.log("User not found in MongoDB for deletion:", clerkId);
        return new Response("User not found in MongoDB", { status: 200 }); // Still 200 if already gone
      }
    }

    // If event type is not handled
    console.log("Event type not handled:", eventType);
    return new Response("Event type not handled", { status: 200 });
  } catch (dbError) {
    // This catch block handles errors during DB connection or Mongoose operations
    console.error("Database operation failed for webhook:", dbError);
    // It's crucial to return a 500 here if a database error occurs
    return new Response("Database operation failed", { status: 500 });
  } finally {
    console.log("--- Webhook POST Request Finished ---");
  }
}
