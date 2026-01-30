// app/api/orders/route.js
import { NextResponse } from "next/server";
import { connect } from "@/mongodb/mongoose";
import Order from "@/models/order";
import Product from "@/models/product";
import { currentUser } from "@clerk/nextjs/server";

// Helper function to generate order number
function generateOrderNumber() {
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, "");
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `LD-${dateStr}-${timestamp}${random}`;
}

export async function POST(request) {
  try {
    console.log("=== Starting order creation ===");
    await connect();

    const user = await currentUser();

    if (!user) {
      console.log("Unauthorized access attempt");
      return NextResponse.json({ 
        success: false,
        error: "Unauthorized" 
      }, { status: 401 });
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
      deliveryAddress: deliveryAddress || "No address provided",
    });

    // Validation
    if (!items || items.length === 0) {
      return NextResponse.json(
        { 
          success: false,
          error: "Order must contain at least one item" 
        },
        { status: 400 }
      );
    }

    if (!deliveryMethod || !eventDate || !customerPhone) {
      return NextResponse.json(
        { 
          success: false,
          error: "Missing required fields: deliveryMethod, eventDate, or customerPhone" 
        },
        { status: 400 }
      );
    }

    if (deliveryMethod === "delivery") {
      if (!deliveryAddress || !deliveryAddress.street) {
        console.log("Invalid delivery address:", deliveryAddress);
        return NextResponse.json(
          { 
            success: false,
            error: "Delivery address is required for delivery orders" 
          },
          { status: 400 }
        );
      }
    }

    const eventDateTime = new Date(eventDate);

    // Process order items
    let subtotal = 0;
    const processedItems = [];

    for (const item of items) {
      let product;
      try {
        product = await Product.findById(item.product);
      } catch (error) {
        console.error("Error finding product:", error);
        return NextResponse.json(
          { 
            success: false,
            error: `Invalid product ID: ${item.product}` 
          },
          { status: 400 }
        );
      }
      
      if (!product) {
        return NextResponse.json(
          { 
            success: false,
            error: `Product not found: ${item.product}` 
          },
          { status: 404 }
        );
      }

      if (!product.isAvailable) {
        return NextResponse.json(
          { 
            success: false,
            error: `Product not available: ${product.name}` 
          },
          { status: 400 }
        );
      }

      const basePrice = (item.selectedOption?.price || product.price) * (item.quantity || 1);
      const customizationCost = item.customization?.additionalCost || 0;
      const itemTotal = basePrice + customizationCost;

      processedItems.push({
        product: item.product,
        productName: product.name,
        selectedOption: item.selectedOption || {
          label: `${product.name} - Standard`,
          price: product.price,
        },
        quantity: item.quantity || 1,
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

    const deliveryFee = deliveryMethod === "delivery" ? 50 : 0;
    const totalAmount = subtotal + deliveryFee;

    // Get customer info
    const customerName = `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Customer";
    const customerEmail = user.emailAddresses[0]?.emailAddress || "";

    if (!customerEmail) {
      return NextResponse.json(
        { 
          success: false,
          error: "User email is required" 
        },
        { status: 400 }
      );
    }

    // Generate order number manually BEFORE creating the order
    const orderNumber = generateOrderNumber();
    console.log("Manually generated order number:", orderNumber);

    // Create order data WITH orderNumber
    const orderData = {
      orderNumber, // This is the key - include it here
      userId: user.id,
      customerName,
      customerEmail,
      customerPhone,
      items: processedItems,
      subtotal,
      deliveryFee,
      totalAmount,
      deliveryMethod,
      deliveryAddress: deliveryMethod === "delivery" ? deliveryAddress : undefined,
      eventDate: eventDateTime,
      eventType: eventType || "Birthday",
      specialInstructions: specialInstructions || "",
      status: "pending",
      paymentStatus: "pending",
    };

    console.log("Creating order in database...");
    console.log("Order data with orderNumber:", JSON.stringify(orderData, null, 2));
    
    const order = await Order.create(orderData);
    
    console.log("Order created successfully:", {
      id: order._id,
      orderNumber: order.orderNumber,
      status: order.status,
    });

    return NextResponse.json(
      {
        success: true,
        order: {
          _id: order._id,
          orderNumber: order.orderNumber,
          customerName: order.customerName,
          customerEmail: order.customerEmail,
          customerPhone: order.customerPhone,
          items: processedItems,
          subtotal: order.subtotal,
          deliveryFee: order.deliveryFee,
          totalAmount: order.totalAmount,
          deliveryMethod: order.deliveryMethod,
          deliveryAddress: order.deliveryAddress,
          eventDate: order.eventDate,
          eventType: order.eventType,
          status: order.status,
          paymentStatus: order.paymentStatus,
          createdAt: order.createdAt,
        },
        message: "Order placed successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("=== Error creating order ===");
    console.error("Error name:", error.name);
    console.error("Error message:", error.message);
    console.error("Error code:", error.code);
    console.error("Error stack:", error.stack);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => ({
        field: err.path,
        message: err.message
      }));
      console.error("Validation errors:", errors);
      return NextResponse.json(
        { 
          success: false,
          error: "Validation failed",
          details: errors
        },
        { status: 400 }
      );
    }
    
    if (error.code === 11000) { // Duplicate key error
      console.error("Duplicate key error:", error.keyValue);
      return NextResponse.json(
        { 
          success: false,
          error: "Duplicate order number detected. Please try again."
        },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { 
        success: false,
        error: "Failed to create order: " + error.message 
      },
      { status: 500 }
    );
  }
}