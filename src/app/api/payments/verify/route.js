// app/api/payments/verify/route.js
import { NextResponse } from "next/server";
import { connect } from "@/mongodb/mongoose";
import Order from "@/models/order";
import { currentUser } from "@clerk/nextjs/server";

// Verify Paystack payment
export async function POST(request) {
  try {
    console.log("=== Verifying Paystack payment ===");
    await connect();

    const user = await currentUser();

    if (!user) {
      console.error("No user found - unauthorized");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { reference } = body;

    console.log("Payment reference:", reference);

    if (!reference) {
      return NextResponse.json(
        { error: "Payment reference is required" },
        { status: 400 },
      );
    }

    // Verify Paystack secret key exists
    const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY;
    if (!paystackSecretKey) {
      console.error("PAYSTACK_SECRET_KEY not configured in environment");
      return NextResponse.json(
        { error: "Payment system not configured. Please contact support." },
        { status: 500 },
      );
    }

    // Verify payment with Paystack
    console.log("Calling Paystack verification API...");
    const paystackResponse = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${paystackSecretKey}`,
        },
      },
    );

    const paystackData = await paystackResponse.json();
    console.log(
      "Paystack verification response:",
      JSON.stringify(paystackData, null, 2),
    );

    if (!paystackResponse.ok || !paystackData.status) {
      console.error("Payment verification failed:", {
        status: paystackResponse.status,
        data: paystackData,
      });
      return NextResponse.json(
        { error: "Payment verification failed", details: paystackData.message },
        { status: 400 },
      );
    }

    // Check payment status
    if (paystackData.data.status !== "success") {
      console.error("Payment not successful:", paystackData.data.status);
      return NextResponse.json(
        { error: `Payment status: ${paystackData.data.status}` },
        { status: 400 },
      );
    }

    // Extract order number from reference or metadata
    let orderNumber = paystackData.data.metadata?.orderNumber;

    if (!orderNumber) {
      // Try to extract from reference (format: ORDER123-timestamp)
      const refParts = reference.split("-");
      if (refParts.length >= 2) {
        orderNumber = refParts.slice(0, -1).join("-");
      }
    }

    console.log("Order number extracted:", orderNumber);

    if (!orderNumber) {
      console.error("Could not extract order number from payment data");
      return NextResponse.json(
        { error: "Invalid payment data - order number not found" },
        { status: 400 },
      );
    }

    // Find and update order
    const order = await Order.findOne({ orderNumber });

    if (!order) {
      console.error("Order not found:", orderNumber);
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Verify user owns this order
    if (order.userId !== user.id) {
      console.error("User does not own order");
      return NextResponse.json(
        { error: "Unauthorized - This is not your order" },
        { status: 403 },
      );
    }

    // Verify amount matches
    const paidAmount = paystackData.data.amount / 100; // Convert from pesewas
    if (Math.abs(paidAmount - order.totalAmount) > 0.01) {
      console.error("Amount mismatch:", {
        paid: paidAmount,
        expected: order.totalAmount,
      });
      return NextResponse.json(
        { error: "Payment amount does not match order total" },
        { status: 400 },
      );
    }

    // Update order payment status
    console.log("Updating order payment status...");
    order.paymentStatus = "paid";
    order.paymentMethod = "card";
    order.paymentReference = reference;
    order.status = "confirmed"; // Auto-confirm order when payment is successful
    order.confirmedAt = new Date();
    await order.save();

    console.log("Payment verified and order updated successfully");

    return NextResponse.json(
      {
        success: true,
        message: "Payment verified successfully",
        order: {
          orderNumber: order.orderNumber,
          status: order.status,
          paymentStatus: order.paymentStatus,
          totalAmount: order.totalAmount,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("=== Error verifying payment ===");
    console.error("Error:", error);
    console.error("Stack:", error.stack);
    return NextResponse.json(
      { error: "Internal server error: " + error.message },
      { status: 500 },
    );
  }
}
