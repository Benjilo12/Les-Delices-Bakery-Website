import { NextResponse } from "next/server";
import { connect } from "@/mongodb/mongoose";
import Order from "@/models/order.model";
import { currentUser } from "@clerk/nextjs/server";

// GET - Fetch single order
export async function GET(request, { params }) {
  try {
    await connect();

    const user = await currentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { orderNumber } = params;
    const isAdmin = user.publicMetadata.isAdmin === true;

    const order = await Order.findOne({ orderNumber }).populate(
      "items.product"
    );

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Check if user owns this order or is admin
    if (!isAdmin && order.userId !== user.id) {
      return NextResponse.json(
        { error: "You don't have permission to view this order" },
        { status: 403 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        order,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json(
      { error: "Failed to fetch order" },
      { status: 500 }
    );
  }
}

// PATCH - Update order status (Admin only)
export async function PATCH(request, { params }) {
  try {
    console.log("Starting order update...");
    await connect();

    const user = await currentUser();

    if (!user || user.publicMetadata.isAdmin !== true) {
      console.log("Unauthorized access attempt");
      return NextResponse.json(
        { error: "Unauthorized - Admin only" },
        { status: 401 }
      );
    }

    const { orderNumber } = params;
    const body = await request.json();

    const {
      status,
      paymentStatus,
      paymentMethod,
      paymentReference,
      adminNotes,
      cancellationReason,
    } = body;

    console.log("Update data received:", {
      orderNumber,
      status,
      paymentStatus,
    });

    const order = await Order.findOne({ orderNumber });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Update fields
    const updateData = {};

    if (status) {
      updateData.status = status;

      // Update timestamp based on status
      if (status === "confirmed" && !order.confirmedAt) {
        updateData.confirmedAt = new Date();
      } else if (status === "completed" && !order.completedAt) {
        updateData.completedAt = new Date();
      } else if (status === "cancelled" && !order.cancelledAt) {
        updateData.cancelledAt = new Date();
        if (cancellationReason) {
          updateData.cancellationReason = cancellationReason;
        }
      }
    }

    if (paymentStatus) updateData.paymentStatus = paymentStatus;
    if (paymentMethod) updateData.paymentMethod = paymentMethod;
    if (paymentReference) updateData.paymentReference = paymentReference;
    if (adminNotes !== undefined) updateData.adminNotes = adminNotes;

    const updatedOrder = await Order.findOneAndUpdate(
      { orderNumber },
      { $set: updateData },
      { new: true, runValidators: true }
    ).populate("items.product");

    console.log("Order updated successfully:", orderNumber);

    return NextResponse.json(
      {
        success: true,
        order: updatedOrder,
        message: "Order updated successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json(
      { error: "Internal server error: " + error.message },
      { status: 500 }
    );
  }
}

// DELETE - Cancel order (User can cancel pending orders, Admin can delete any)
export async function DELETE(request, { params }) {
  try {
    console.log("Starting order cancellation...");
    await connect();

    const user = await currentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { orderNumber } = params;
    const isAdmin = user.publicMetadata.isAdmin === true;

    const order = await Order.findOne({ orderNumber });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Check permissions
    if (!isAdmin) {
      // Users can only cancel their own pending orders
      if (order.userId !== user.id) {
        return NextResponse.json(
          { error: "You don't have permission to cancel this order" },
          { status: 403 }
        );
      }

      if (order.status !== "pending") {
        return NextResponse.json(
          { error: "Only pending orders can be cancelled" },
          { status: 400 }
        );
      }
    }

    // If admin, delete order. If user, just cancel it
    if (isAdmin) {
      await Order.findOneAndDelete({ orderNumber });
      console.log("Order deleted by admin:", orderNumber);
    } else {
      order.status = "cancelled";
      order.cancelledAt = new Date();
      order.cancellationReason = "Cancelled by customer";
      await order.save();
      console.log("Order cancelled by user:", orderNumber);
    }

    return NextResponse.json(
      {
        success: true,
        message: isAdmin
          ? "Order deleted successfully"
          : "Order cancelled successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error cancelling/deleting order:", error);
    return NextResponse.json(
      { error: "Internal server error: " + error.message },
      { status: 500 }
    );
  }
}
