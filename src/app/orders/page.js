// app/orders/page.js
import { connect } from "@/mongodb/mongoose";
import Order from "@/models/order";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import {
  Package,
  CheckCircle,
  Clock,
  AlertCircle,
  Truck,
  Calendar,
  CreditCard,
  MapPin,
  ArrowRight,
  Receipt,
  FileText,
  Eye,
  ChevronRight,
} from "lucide-react";

export const dynamic = "force-dynamic";

// For testing: Get all orders without user authentication
async function getAllOrders() {
  try {
    await connect();
    const orders = await Order.find({})
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();
    return JSON.parse(JSON.stringify(orders));
  } catch (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
}

function OrderStatusBadge({ status }) {
  const statusConfig = {
    pending: {
      label: "Pending",
      icon: Clock,
      className: "bg-yellow-100 text-yellow-800",
    },
    confirmed: {
      label: "Confirmed",
      icon: CheckCircle,
      className: "bg-blue-100 text-blue-800",
    },
    processing: {
      label: "Processing",
      icon: Package,
      className: "bg-indigo-100 text-indigo-800",
    },
    ready: {
      label: "Ready",
      icon: CheckCircle,
      className: "bg-green-100 text-green-800",
    },
    out_for_delivery: {
      label: "Out for Delivery",
      icon: Truck,
      className: "bg-purple-100 text-purple-800",
    },
    delivered: {
      label: "Delivered",
      icon: CheckCircle,
      className: "bg-emerald-100 text-emerald-800",
    },
    cancelled: {
      label: "Cancelled",
      icon: AlertCircle,
      className: "bg-red-100 text-red-800",
    },
  };

  const config = statusConfig[status] || statusConfig.pending;
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${config.className}`}
    >
      <Icon className="w-3 h-3" />
      {config.label}
    </span>
  );
}

function PaymentStatusBadge({ status }) {
  const statusConfig = {
    pending: { label: "Pending", className: "bg-yellow-100 text-yellow-800" },
    paid: { label: "Paid", className: "bg-green-100 text-green-800" },
    failed: { label: "Failed", className: "bg-red-100 text-red-800" },
    refunded: { label: "Refunded", className: "bg-gray-100 text-gray-800" },
  };

  const config = statusConfig[status] || statusConfig.pending;

  return (
    <span
      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${config.className}`}
    >
      <CreditCard className="w-3 h-3" />
      {config.label}
    </span>
  );
}

function formatPrice(price) {
  return new Intl.NumberFormat("en-GH", {
    style: "currency",
    currency: "GHS",
    minimumFractionDigits: 2,
  }).format(price);
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString("en-GH", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function OrdersPage() {
  // Get all orders without authentication for testing
  const orders = await getAllOrders();

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-50">
        {/* Breadcrumb */}
        <div className="border-b border-gray-100 bg-white">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <nav className="flex items-center gap-2 text-sm text-gray-500">
              <Link href="/" className="hover:text-amber-700 transition-colors">
                Home
              </Link>
              <ChevronRight className="w-4 h-4 text-gray-300" />
              <span className="text-gray-900 font-medium">Orders</span>
            </nav>
          </div>
        </div>

        <main className="max-w-7xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-serif text-gray-900">
                All Orders
              </h1>
              <p className="text-gray-500 mt-2">
                View and track all orders (Testing Mode - No Auth)
              </p>
            </div>

            <div className="flex items-center gap-4">
              <Link
                href="/menu"
                className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                <Package className="w-4 h-4" />
                Order More
              </Link>
            </div>
          </div>

          {/* Info Banner */}
          <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <Package className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-blue-900 mb-1">
                  Testing Mode - No Authentication Required
                </h3>
                <p className="text-sm text-blue-700">
                  This page is displaying all orders without user authentication
                  for testing purposes. In production, users will only see their
                  own orders.
                </p>
              </div>
            </div>
          </div>

          {orders.length === 0 ? (
            <EmptyOrdersState />
          ) : (
            <div className="space-y-6">
              {/* Order Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-xl border border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                      <Clock className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-900">
                        {orders.filter((o) => o.status === "pending").length}
                      </div>
                      <div className="text-sm text-gray-500">Pending</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-900">
                        {orders.filter((o) => o.status === "delivered").length}
                      </div>
                      <div className="text-sm text-gray-500">Delivered</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
                      <Truck className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-900">
                        {
                          orders.filter((o) => o.status === "out_for_delivery")
                            .length
                        }
                      </div>
                      <div className="text-sm text-gray-500">In Transit</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
                      <Receipt className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-900">
                        {orders.length}
                      </div>
                      <div className="text-sm text-gray-500">Total Orders</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Orders List */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  Recent Orders ({orders.length} total)
                </h2>

                {orders.map((order) => (
                  <OrderCard key={order._id} order={order} />
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
}

function OrderCard({ order }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:border-amber-300 transition-colors">
      {/* Order Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-lg font-semibold text-gray-900">
                Order #{order.orderNumber}
              </h3>
              <OrderStatusBadge status={order.status} />
              <PaymentStatusBadge status={order.paymentStatus} />
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {formatDate(order.createdAt)}
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {order.deliveryMethod === "delivery" ? "Delivery" : "Pickup"}
              </div>
              <div className="flex items-center gap-1">
                <CreditCard className="w-4 h-4" />
                {formatPrice(order.totalAmount)}
              </div>
              {order.customerName && (
                <div className="text-sm text-gray-500">
                  Customer: {order.customerName}
                </div>
              )}
            </div>
          </div>

          <Link
            href={`/orders/${order.orderNumber}`}
            className="inline-flex items-center gap-2 text-amber-700 hover:text-amber-800 font-medium"
          >
            View Details
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Order Items Preview */}
      <div className="p-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Order Items:</h4>
        <div className="grid gap-4">
          {order.items.slice(0, 2).map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
            >
              <div className="w-16 h-16 bg-amber-100 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-amber-600" />
              </div>
              <div className="flex-1">
                <h5 className="font-medium text-gray-900">
                  {item.productName}
                </h5>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm text-gray-600">
                    {item.selectedOption?.label || "Standard"}
                  </span>
                  <span className="text-sm text-gray-500">
                    × {item.quantity}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="font-medium text-gray-900">
                  {formatPrice(item.itemTotal)}
                </div>
              </div>
            </div>
          ))}

          {order.items.length > 2 && (
            <div className="text-center py-2">
              <span className="text-sm text-gray-500">
                + {order.items.length - 2} more item
                {order.items.length - 2 !== 1 ? "s" : ""}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Order Footer */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="text-sm text-gray-600">Event Date</div>
            <div className="font-medium text-gray-900">
              {new Date(order.eventDate).toLocaleDateString("en-GH", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href={`/orders/${order.orderNumber}`}
              className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              <Eye className="w-4 h-4" />
              View Full Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function EmptyOrdersState() {
  return (
    <div className="text-center py-16">
      <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-amber-100 flex items-center justify-center">
        <Package className="w-12 h-12 text-amber-500" />
      </div>
      <h2 className="text-2xl font-medium text-gray-900 mb-3">
        No orders found
      </h2>
      <p className="text-gray-500 mb-8 max-w-md mx-auto">
        There are no orders in the system yet.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          href="/menu"
          className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-8 py-4 rounded-xl font-medium text-lg transition-colors transform hover:-translate-y-0.5 hover:shadow-lg"
        >
          <Package className="w-5 h-5" />
          Browse Menu
        </Link>
        <Link
          href="/cart"
          className="inline-flex items-center gap-2 border-2 border-amber-600 text-amber-700 hover:bg-amber-50 px-8 py-4 rounded-xl font-medium text-lg transition-colors"
        >
          View Cart
        </Link>
      </div>
    </div>
  );
}
