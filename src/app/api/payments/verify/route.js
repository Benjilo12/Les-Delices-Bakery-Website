// app/api/payments/initialize/route.js
import { NextResponse } from "next/server";
import { connect } from "@/mongodb/mongoose";
import Order from "@/models/order";
import { currentUser } from "@clerk/nextjs/server";

// Verify Paystack payment
export async function POST(request) {
  try {
    console.log("Verifying Paystack payment...");
    await connect();

    const user = await currentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { reference } = body;

    if (!reference) {
      return NextResponse.json(
        { error: "Payment reference is required" },
        { status: 400 }
      );
    }

    // Verify payment with Paystack
    const paystackResponse = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    const paystackData = await paystackResponse.json();

    if (!paystackData.status || paystackData.data.status !== "success") {
      console.error("Payment verification failed:", paystackData);
      return NextResponse.json(
        { error: "Payment verification failed" },
        { status: 400 }
      );
    }

    // Extract order number from reference
    const orderNumber = paystackData.data.metadata.orderNumber;

    // Find and update order
    const order = await Order.findOne({ orderNumber });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Verify user owns this order
    if (order.userId !== user.id) {
      return NextResponse.json(
        { error: "Unauthorized - This is not your order" },
        { status: 403 }
      );
    }

    // Update order payment status
    order.paymentStatus = "paid";
    order.paymentMethod = "card";
    order.paymentReference = reference;
    order.status = "confirmed"; // Auto-confirm order when payment is successful
    order.confirmedAt = new Date();
    await order.save();

    console.log("Payment verified and order updated:", orderNumber);

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
      { status: 200 }
    );
  } catch (error) {
    console.error("Error verifying payment:", error);
    return NextResponse.json(
      { error: "Internal server error: " + error.message },
      { status: 500 }
    );
  }
}
