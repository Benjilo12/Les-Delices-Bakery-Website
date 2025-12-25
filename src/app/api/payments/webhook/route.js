// app/api/payments/initialize/route.js
import { NextResponse } from "next/server";
import { connect } from "@/mongodb/mongoose";
import Order from "@/models/order.model";

import crypto from "crypto";

// Paystack webhook for payment notifications
export async function POST(request) {
  try {
    console.log("Received Paystack webhook...");

    // Verify webhook signature
    const hash = crypto
      .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY)
      .update(JSON.stringify(await request.json()))
      .digest("hex");

    const signature = request.headers.get("x-paystack-signature");

    if (hash !== signature) {
      console.error("Invalid webhook signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const body = await request.json();
    const event = body.event;
    const data = body.data;

    console.log("Webhook event:", event);

    // Handle different webhook events
    switch (event) {
      case "charge.success":
        await handleSuccessfulPayment(data);
        break;

      case "charge.failed":
        await handleFailedPayment(data);
        break;

      default:
        console.log("Unhandled webhook event:", event);
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}

// Helper function to handle successful payment
async function handleSuccessfulPayment(data) {
  try {
    await connect();

    const orderNumber = data.metadata.orderNumber;
    const reference = data.reference;

    const order = await Order.findOne({ orderNumber });

    if (!order) {
      console.error("Order not found for successful payment:", orderNumber);
      return;
    }

    // Update order if not already updated
    if (order.paymentStatus !== "paid") {
      order.paymentStatus = "paid";
      order.paymentMethod = "card";
      order.paymentReference = reference;
      order.status = "confirmed";
      order.confirmedAt = new Date();
      await order.save();

      console.log("Order updated via webhook:", orderNumber);
    }
  } catch (error) {
    console.error("Error handling successful payment:", error);
  }
}

// Helper function to handle failed payment
async function handleFailedPayment(data) {
  try {
    await connect();

    const orderNumber = data.metadata.orderNumber;

    const order = await Order.findOne({ orderNumber });

    if (!order) {
      console.error("Order not found for failed payment:", orderNumber);
      return;
    }

    // You can add logic here to handle failed payments
    // For example, send notification to admin or customer
    console.log("Payment failed for order:", orderNumber);
  } catch (error) {
    console.error("Error handling failed payment:", error);
  }
}
