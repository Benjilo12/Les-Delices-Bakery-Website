// app/api/payments/initialize/route.js
import { NextResponse } from "next/server";
import { connect } from "@/mongodb/mongoose";
import Order from "@/models/order";
import { currentUser } from "@clerk/nextjs/server";

// Initialize Paystack payment
export async function POST(request) {
  try {
    console.log("=== Initializing Paystack payment ===");
    await connect();

    const user = await currentUser();

    if (!user) {
      console.error("No user found - unauthorized");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { orderNumber } = body;

    console.log("Order number:", orderNumber);

    if (!orderNumber) {
      return NextResponse.json(
        { error: "Order number is required" },
        { status: 400 },
      );
    }

    // Find the order
    const order = await Order.findOne({ orderNumber });

    if (!order) {
      console.error("Order not found:", orderNumber);
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    console.log("Order found:", {
      orderNumber: order.orderNumber,
      amount: order.totalAmount,
      email: order.customerEmail,
    });

    // Verify user owns this order
    if (order.userId !== user.id) {
      console.error("User does not own order");
      return NextResponse.json(
        { error: "Unauthorized - This is not your order" },
        { status: 403 },
      );
    }

    // Check if order is already paid
    if (order.paymentStatus === "paid") {
      console.log("Order already paid");
      return NextResponse.json(
        { error: "Order is already paid" },
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

    console.log(
      "Using Paystack secret key:",
      paystackSecretKey.substring(0, 10) + "...",
    );

    // Generate unique reference
    const paymentReference = `${orderNumber}-${Date.now()}`;
    console.log("Payment reference:", paymentReference);

    // Prepare Paystack payload
    const paystackPayload = {
      email: order.customerEmail,
      amount: Math.round(order.totalAmount * 100), // Convert to pesewas and ensure integer
      currency: "GHS",
      reference: paymentReference,
      callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/orders/${orderNumber}/payment-success`,
      metadata: {
        orderNumber: order.orderNumber,
        userId: order.userId,
        customerName: order.customerName,
        customerPhone: order.customerPhone,
        custom_fields: [
          {
            display_name: "Order Number",
            variable_name: "order_number",
            value: order.orderNumber,
          },
          {
            display_name: "Customer Name",
            variable_name: "customer_name",
            value: order.customerName,
          },
        ],
      },
    };

    console.log("Paystack payload:", JSON.stringify(paystackPayload, null, 2));

    // Initialize payment with Paystack
    console.log("Calling Paystack API...");
    const paystackResponse = await fetch(
      "https://api.paystack.co/transaction/initialize",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${paystackSecretKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(paystackPayload),
      },
    );

    const paystackData = await paystackResponse.json();
    console.log("Paystack response:", JSON.stringify(paystackData, null, 2));

    if (!paystackResponse.ok || !paystackData.status) {
      console.error("Paystack initialization failed:", {
        status: paystackResponse.status,
        statusText: paystackResponse.statusText,
        data: paystackData,
      });
      return NextResponse.json(
        {
          error: "Failed to initialize payment",
          details: paystackData.message || "Unknown error from Paystack",
        },
        { status: 500 },
      );
    }

    // Store payment reference in order
    order.paymentReference = paystackData.data.reference;
    await order.save();

    console.log("Payment initialized successfully");
    console.log("Authorization URL:", paystackData.data.authorization_url);

    return NextResponse.json(
      {
        success: true,
        authorization_url: paystackData.data.authorization_url,
        access_code: paystackData.data.access_code,
        reference: paystackData.data.reference,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("=== Error initializing payment ===");
    console.error("Error:", error);
    console.error("Stack:", error.stack);
    return NextResponse.json(
      { error: "Internal server error: " + error.message },
      { status: 500 },
    );
  }
}
