// app/api/webhooks/route.js
import { Webhook } from "svix";
import { headers } from "next/headers";
import { clerkClient } from "@clerk/nextjs/server"; // ✅ FIXED: Correct import
import { createOrUpdateUser, deleteUser } from "@/lib/actions/user";

export async function POST(req) {
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    console.error("❌ WEBHOOK_SECRET is missing");
    return new Response("Webhook secret not configured", { status: 500 });
  }

  try {
    // Get headers properly
    const headerList = await headers();
    const svix_id = headerList.get("svix-id");
    const svix_timestamp = headerList.get("svix-timestamp");
    const svix_signature = headerList.get("svix-signature");

    console.log("📨 Webhook headers received");

    if (!svix_id || !svix_timestamp || !svix_signature) {
      console.error("❌ Missing Svix headers");
      return new Response("Missing Svix headers", { status: 400 });
    }

    // Get the raw body text
    const body = await req.text();

    // Verify webhook
    const wh = new Webhook(WEBHOOK_SECRET);
    let evt;

    try {
      evt = wh.verify(body, {
        "svix-id": svix_id,
        "svix-timestamp": svix_timestamp,
        "svix-signature": svix_signature,
      });
    } catch (err) {
      console.error("❌ Error verifying webhook:", err.message);
      return new Response(`Error verifying webhook: ${err.message}`, {
        status: 400,
      });
    }

    const eventType = evt.type;
    const data = evt.data;

    console.log(`✅ Webhook verified: ${eventType}`);
    console.log("📊 Event data:", JSON.stringify(data, null, 2));

    // Handle events
    if (eventType === "user.created" || eventType === "user.updated") {
      const {
        id,
        first_name,
        last_name,
        image_url,
        email_addresses,
        username,
      } = data;

      // Safely extract email with proper fallback
      const email = email_addresses?.[0]?.email_address || "";

      console.log(`🔄 Processing user ${eventType}:`, {
        id,
        email,
        first_name,
        last_name,
        username,
      });

      // Create or update user in database
      const user = await createOrUpdateUser(
        id,
        first_name || "",
        last_name || "",
        image_url || "",
        email_addresses,
        username || ""
      );

      console.log("✅ User saved to database:", user?._id);

      // Update Clerk metadata if user was created
      if (user && eventType === "user.created") {
        try {
          const client = await clerkClient(); // ✅ FIXED: Call clerkClient as a function

          await client.users.updateUserMetadata(id, {
            publicMetadata: {
              userMongoId: user._id?.toString(),
              isAdmin: user.isAdmin || false,
            },
          });
          console.log("✅ Clerk metadata updated for user:", id);
        } catch (metadataError) {
          console.error(
            "❌ Failed to update Clerk metadata:",
            metadataError.message
          );
          // Don't throw the error - just log it and continue
        }
      }
    }

    // Handle user deletion
    if (eventType === "user.deleted") {
      await deleteUser(data.id);
      console.log("✅ User deleted:", data.id);
    }

    return new Response("Webhook processed successfully", { status: 200 });
  } catch (error) {
    console.error("❌ Unexpected error in webhook:", error);
    return new Response(`Internal server error: ${error.message}`, {
      status: 500,
    });
  }
}
