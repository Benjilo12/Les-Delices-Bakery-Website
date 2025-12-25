import { NextResponse } from "next/server";
import { connect } from "@/mongodb/mongoose";
import Order from "@/models/order";
import Product from "@/models/product";
import { currentUser } from "@clerk/nextjs/server";

// GET - Fetch orders (User: their orders, Admin: all orders)
export async function GET(request) {
  try {
    await connect();

    const user = await currentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const isAdmin = user.publicMetadata.isAdmin === true;

    let query = {};

    // If not admin, only show user's own orders
    if (!isAdmin) {
      query.userId = user.id;
    }

    // Filter by status if provided
    if (status) {
      query.status = status;
    }

    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .populate("items.product");

    console.log(`Fetched ${orders.length} orders for user:`, user.id);

    return NextResponse.json(
      {
        success: true,
        orders,
        count: orders.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch orders",
      },
      { status: 500 }
    );
  }
}

// POST - Create new order (Authenticated users)
export async function POST(request) {
  try {
    console.log("Starting order creation...");
    await connect();

    const user = await currentUser();

    if (!user) {
      console.log("Unauthorized access attempt");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    const {
      items,
      deliveryMethod,
      deliveryAddress,
      eventDate,
      eventType,
      specialInstructions,
      customerPhone,
    } = body;

    console.log("Order data received:", {
      userId: user.id,
      itemsCount: items?.length,
      deliveryMethod,
      eventDate,
    });

    // Validation
    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: "Order must contain at least one item" },
        { status: 400 }
      );
    }

    if (!deliveryMethod || !eventDate || !customerPhone) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate delivery address for delivery orders
    if (deliveryMethod === "delivery") {
      if (
        !deliveryAddress ||
        !deliveryAddress.street ||
        !deliveryAddress.area
      ) {
        return NextResponse.json(
          { error: "Delivery address is required for delivery orders" },
          { status: 400 }
        );
      }
    }

    // Validate event date (must be at least 48 hours in advance)
    const eventDateTime = new Date(eventDate);
    const now = new Date();
    const hoursDiff = (eventDateTime - now) / (1000 * 60 * 60);

    if (hoursDiff < 48) {
      return NextResponse.json(
        { error: "Orders must be placed at least 48 hours in advance" },
        { status: 400 }
      );
    }

    // Process order items and calculate totals
    let subtotal = 0;
    const processedItems = [];

    for (const item of items) {
      // Verify product exists
      const product = await Product.findById(item.product);

      if (!product) {
        return NextResponse.json(
          { error: `Product not found: ${item.product}` },
          { status: 404 }
        );
      }

      if (!product.isAvailable) {
        return NextResponse.json(
          { error: `Product not available: ${product.name}` },
          { status: 400 }
        );
      }

      // Calculate item total
      const basePrice = item.selectedOption.price * item.quantity;
      const customizationCost = item.customization?.additionalCost || 0;
      const itemTotal = basePrice + customizationCost;

      processedItems.push({
        product: item.product,
        productName: product.name,
        selectedOption: item.selectedOption,
        quantity: item.quantity,
        selectedFlavors: item.selectedFlavors || [],
        customization: {
          requested: item.customization?.requested || false,
          details: item.customization?.details || "",
          additionalCost: customizationCost,
        },
        itemTotal,
      });

      subtotal += itemTotal;
    }

    // Calculate delivery fee (you can customize this logic)
    const deliveryFee = deliveryMethod === "delivery" ? 50 : 0; // GH₵50 for delivery
    const totalAmount = subtotal + deliveryFee;

    // Get customer info from Clerk
    const customerName =
      `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Customer";
    const customerEmail = user.emailAddresses[0]?.emailAddress || "";

    // Create order
    const orderData = {
      userId: user.id,
      customerName,
      customerEmail,
      customerPhone,
      items: processedItems,
      subtotal,
      deliveryFee,
      totalAmount,
      deliveryMethod,
      deliveryAddress:
        deliveryMethod === "delivery" ? deliveryAddress : undefined,
      eventDate: eventDateTime,
      eventType,
      specialInstructions,
      status: "pending",
      paymentStatus: "pending",
    };

    console.log("Creating order in database...");
    const order = await Order.create(orderData);
    console.log("Order created successfully:", order.orderNumber);

    return NextResponse.json(
      {
        success: true,
        order,
        message: "Order placed successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Internal server error: " + error.message },
      { status: 500 }
    );
  }
}
