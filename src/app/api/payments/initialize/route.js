// app/api/payments/initialize/route.js
import { NextResponse } from "next/server";
import { connect } from "@/mongodb/mongoose";
import Order from "@/models/order";
import { currentUser } from "@clerk/nextjs/server";

// Initialize Paystack payment
export async function POST(request) {
  try {
    console.log("Initializing Paystack payment...");
    await connect();

    const user = await currentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { orderNumber } = body;

    if (!orderNumber) {
      return NextResponse.json(
        { error: "Order number is required" },
        { status: 400 }
      );
    }

    // Find the order
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

    // Check if order is already paid
    if (order.paymentStatus === "paid") {
      return NextResponse.json(
        { error: "Order is already paid" },
        { status: 400 }
      );
    }

    // Initialize payment with Paystack
    const paystackResponse = await fetch(
      "https://api.paystack.co/transaction/initialize",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: order.customerEmail,
          amount: order.totalAmount * 100, // Paystack uses kobo (pesewas), so multiply by 100
          currency: "GHS",
          reference: `${orderNumber}-${Date.now()}`,
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
        }),
      }
    );

    const paystackData = await paystackResponse.json();

    if (!paystackData.status) {
      console.error("Paystack initialization failed:", paystackData);
      return NextResponse.json(
        { error: "Failed to initialize payment" },
        { status: 500 }
      );
    }

    // Store payment reference in order
    order.paymentReference = paystackData.data.reference;
    await order.save();

    console.log(
      "Payment initialized successfully:",
      paystackData.data.reference
    );

    return NextResponse.json(
      {
        success: true,
        authorization_url: paystackData.data.authorization_url,
        access_code: paystackData.data.access_code,
        reference: paystackData.data.reference,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error initializing payment:", error);
    return NextResponse.json(
      { error: "Internal server error: " + error.message },
      { status: 500 }
    );
  }
}
