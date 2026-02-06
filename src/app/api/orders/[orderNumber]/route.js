import { NextResponse } from "next/server";
import { connect } from "@/mongodb/mongoose";
import Order from "@/models/order";
import { currentUser } from "@clerk/nextjs/server";

// ────────────────────────────────────────────────
// GET /api/orders/[orderNumber]
// Fetch single order by orderNumber
// ────────────────────────────────────────────────
// Updated GET function for /app/api/orders/[orderNumber]/route.js
export async function GET(request, { params }) {
  try {
    // Await the params promise in Next.js 15
    const { orderNumber } = await params;

    if (!orderNumber) {
      return NextResponse.json(
        { success: false, error: "Order number is required" },
        { status: 400 },
      );
    }

    await connect();

    const user = await currentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized - please sign in" },
        { status: 401 },
      );
    }

    const order = await Order.findOne({ orderNumber }).lean();

    if (!order) {
      return NextResponse.json(
        { success: false, error: "Order not found" },
        { status: 404 },
      );
    }

    // Check if user owns this order (or is admin)
    const isAdmin = user.publicMetadata?.roles?.includes("admin");
    const isOwner = order.userId === user.id;

    if (!isAdmin && !isOwner) {
      return NextResponse.json(
        {
          success: false,
          error: "You don't have permission to view this order",
        },
        { status: 403 },
      );
    }

    return NextResponse.json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("[GET /api/orders/[orderNumber]]", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        message:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 },
    );
  }
}

// ────────────────────────────────────────────────
// PUT /api/orders/[orderNumber]
// Update order (mainly status, but also other fields)
// ────────────────────────────────────────────────
export async function PUT(request, { params }) {
  try {
    // Await the params promise in Next.js 15
    const { orderNumber } = await params;

    if (!orderNumber) {
      return NextResponse.json(
        { success: false, error: "Order number is required" },
        { status: 400 },
      );
    }

    await connect();

    const user = await currentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const body = await request.json();
    const { status, note, ...otherUpdates } = body;

    const order = await Order.findOne({ orderNumber });

    if (!order) {
      return NextResponse.json(
        { success: false, error: "Order not found" },
        { status: 404 },
      );
    }

    let statusChanged = false;

    // ── Status update logic ──────────────────────────────────────
    if (status) {
      // Standardized status values (use snake_case)
      const validStatuses = [
        "pending",
        "confirmed",
        "processing",
        "ready",
        "out_for_delivery",
        "completed", // delivered → completed
        "cancelled",
      ];

      if (!validStatuses.includes(status)) {
        return NextResponse.json(
          {
            success: false,
            error: `Invalid status. Allowed: ${validStatuses.join(", ")}`,
          },
          { status: 400 },
        );
      }

      if (order.status === status) {
        // Optional: you can allow it or reject it
        // Here we allow it (idempotent)
      } else {
        order.status = status;
        order.updatedAt = new Date();
        statusChanged = true;
      }

      // Set status-specific timestamps (only if not already set)
      if (status === "confirmed" && !order.confirmedAt) {
        order.confirmedAt = new Date();
      }
      if (status === "completed" && !order.completedAt) {
        order.completedAt = new Date();
      }
      if (status === "cancelled" && !order.cancelledAt) {
        order.cancelledAt = new Date();
        order.cancellationReason = note?.trim() || "Cancelled by admin";
      }

      // Status history entry
      if (!order.statusHistory) {
        order.statusHistory = [];
      }

      order.statusHistory.push({
        status,
        changedBy: user.id,
        changedByName: user.firstName || user.username || "Admin",
        note: note?.trim() || "",
        changedAt: new Date(),
      });
    }

    // ── Apply any other fields sent in the body ──────────────────
    if (Object.keys(otherUpdates).length > 0) {
      // You can add more strict control here in production
      // e.g. only allow certain fields: customerNote, internalNotes, etc.
      Object.assign(order, otherUpdates);
      order.updatedAt = new Date();
    }

    await order.save();

    return NextResponse.json({
      success: true,
      message: statusChanged
        ? `Order status updated to ${status}`
        : "Order updated successfully",
      order: {
        _id: order._id,
        orderNumber: order.orderNumber,
        status: order.status,
        updatedAt: order.updatedAt,
        // you can return more fields if frontend needs them
      },
    });
  } catch (error) {
    console.error("[PUT /api/orders/[orderNumber]]", error);

    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors || {}).map(
        (err) => err.message,
      );
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          details: errors,
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Failed to update order",
        message:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 },
    );
  }
}

// ────────────────────────────────────────────────
// DELETE /api/orders/[orderNumber]
// Soft or hard delete — currently hard delete
// ────────────────────────────────────────────────
export async function DELETE(request, { params }) {
  try {
    // Await the params promise in Next.js 15
    const { orderNumber } = await params;

    if (!orderNumber) {
      return NextResponse.json(
        { success: false, error: "Order number is required" },
        { status: 400 },
      );
    }

    await connect();

    const user = await currentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    // ── Optional: restrict to admins only ────────────────────────
    // Uncomment in production
    /*
    const isAdmin = user.publicMetadata?.roles?.includes("admin");
    if (!isAdmin) {
      return NextResponse.json(
        { success: false, error: "Admin access required to delete orders" },
        { status: 403 }
      );
    }
    */

    const deletedOrder = await Order.findOneAndDelete({ orderNumber });

    if (!deletedOrder) {
      return NextResponse.json(
        { success: false, error: "Order not found" },
        { status: 404 },
      );
    }

    // Optional: you could create a deletedOrders collection / audit log here

    return NextResponse.json({
      success: true,
      message: `Order ${orderNumber} deleted successfully`,
      deletedOrderNumber: orderNumber,
    });
  } catch (error) {
    console.error("[DELETE /api/orders/[orderNumber]]", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete order",
        message:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 },
    );
  }
}
