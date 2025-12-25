import { NextResponse } from "next/server";
import { connect } from "@/mongodb/mongoose";
import Order from "@/models/order.model";
import { currentUser } from "@clerk/nextjs/server";

// GET - Get order statistics (Admin only)
export async function GET(request) {
  try {
    await connect();

    const user = await currentUser();

    if (!user || user.publicMetadata.isAdmin !== true) {
      return NextResponse.json(
        { error: "Unauthorized - Admin only" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") || "month"; // day, week, month, year

    // Calculate date range
    const now = new Date();
    let startDate = new Date();

    switch (period) {
      case "day":
        startDate.setHours(0, 0, 0, 0);
        break;
      case "week":
        startDate.setDate(now.getDate() - 7);
        break;
      case "month":
        startDate.setMonth(now.getMonth() - 1);
        break;
      case "year":
        startDate.setFullYear(now.getFullYear() - 1);
        break;
    }

    // Get statistics
    const orders = await Order.find({
      createdAt: { $gte: startDate },
    });

    const stats = {
      totalOrders: orders.length,
      totalRevenue: orders.reduce((sum, order) => sum + order.totalAmount, 0),
      statusBreakdown: {},
      paymentBreakdown: {},
      deliveryMethodBreakdown: {},
      averageOrderValue: 0,
    };

    // Calculate breakdowns
    orders.forEach((order) => {
      stats.statusBreakdown[order.status] =
        (stats.statusBreakdown[order.status] || 0) + 1;
      stats.paymentBreakdown[order.paymentStatus] =
        (stats.paymentBreakdown[order.paymentStatus] || 0) + 1;
      stats.deliveryMethodBreakdown[order.deliveryMethod] =
        (stats.deliveryMethodBreakdown[order.deliveryMethod] || 0) + 1;
    });

    stats.averageOrderValue =
      orders.length > 0 ? stats.totalRevenue / orders.length : 0;

    return NextResponse.json(
      {
        success: true,
        period,
        stats,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching order stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch statistics" },
      { status: 500 }
    );
  }
}
