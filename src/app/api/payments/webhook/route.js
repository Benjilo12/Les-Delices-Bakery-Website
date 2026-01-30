// app/api/payments/webhook/route.js
import { NextResponse } from "next/server";
import { connect } from "@/mongodb/mongoose";
import Order from "@/models/order";
import crypto from "crypto";

// Helper function to handle successful payment
async function handleSuccessfulPayment(data) {
  try {
    console.log("=== Handling successful payment ===");
    await connect();

    const orderNumber = data.metadata?.orderNumber;
    const reference = data.reference;

    console.log("Order number:", orderNumber);
    console.log("Reference:", reference);

    if (!orderNumber) {
      console.error("No order number in webhook data");
      return;
    }

    const order = await Order.findOne({ orderNumber });

    if (!order) {
      console.error("Order not found:", orderNumber);
      return;
    }

    // Check if already processed
    if (order.paymentStatus === "paid") {
      console.log("Order already marked as paid");
      return;
    }

    // Verify amount
    const paidAmount = data.amount / 100; // Convert from pesewas
    if (Math.abs(paidAmount - order.totalAmount) > 0.01) {
      console.error("Amount mismatch:", {
        paid: paidAmount,
        expected: order.totalAmount,
      });
      return;
    }

    // Update order
    order.paymentStatus = "paid";
    order.paymentMethod = "card";
    order.paymentReference = reference;
    order.status = "confirmed";
    order.confirmedAt = new Date();
    await order.save();

    console.log("Order updated successfully via webhook");
  } catch (error) {
    console.error("Error handling successful payment:", error);
  }
}

// Helper function to handle failed payment
async function handleFailedPayment(data) {
  try {
    console.log("=== Handling failed payment ===");
    await connect();

    const orderNumber = data.metadata?.orderNumber;
    console.log("Order number:", orderNumber);

    if (!orderNumber) {
      console.error("No order number in webhook data");
      return;
    }

    const order = await Order.findOne({ orderNumber });

    if (!order) {
      console.error("Order not found:", orderNumber);
      return;
    }

    // Only update if not already paid
    if (order.paymentStatus !== "paid") {
      order.paymentStatus = "failed";
      await order.save();
      console.log("Order marked as payment failed");
    }
  } catch (error) {
    console.error("Error handling failed payment:", error);
  }
}

export async function POST(request) {
  try {
    console.log("=== Received Paystack webhook ===");

    // Read the raw body once
    const rawBody = await request.text();

    // Verify Paystack secret key exists
    const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY;
    if (!paystackSecretKey) {
      console.error("PAYSTACK_SECRET_KEY not configured in environment");
      return NextResponse.json(
        { error: "Webhook not configured" },
        { status: 500 },
      );
    }

    // Verify webhook signature
    const hash = crypto
      .createHmac("sha512", paystackSecretKey)
      .update(rawBody)
      .digest("hex");

    const signature = request.headers.get("x-paystack-signature");

    console.log("Signature verification:", {
      received: signature?.substring(0, 20) + "...",
      computed: hash.substring(0, 20) + "...",
      match: hash === signature,
    });

    if (hash !== signature) {
      console.error("Invalid webhook signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    // Parse the body after verification
    const body = JSON.parse(rawBody);
    const event = body.event;
    const data = body.data;

    console.log("Webhook event:", event);
    console.log("Event data:", JSON.stringify(data, null, 2));

    // Handle different webhook events
    switch (event) {
      case "charge.success":
        await handleSuccessfulPayment(data);
        break;

      case "charge.failed":
        await handleFailedPayment(data);
        break;

      case "subscription.create":
      case "invoice.create":
      case "invoice.update":
      case "subscription.disable":
        console.log("Subscription/Invoice event (not processed):", event);
        break;

      default:
        console.log("Unhandled webhook event:", event);
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error("=== Webhook error ===");
    console.error("Error:", error);
    console.error("Stack:", error.stack);
    return NextResponse.json(
      { error: "Webhook processing failed: " + error.message },
      { status: 500 },
    );
  }
}
