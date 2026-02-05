// app/orders/page.js
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import Navbar from "@/components/Navbar";
import {
  Package,
  CheckCircle,
  Clock,
  AlertCircle,
  Truck,
  Calendar,
  CreditCard,
  MapPin,
  Receipt,
  ChevronRight,
  User,
  Phone,
  Mail,
  Home,
  ShoppingBag,
} from "lucide-react";

// Order status badge component
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

// Payment status badge component
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

// Helper function to format delivery address
function formatDeliveryAddress(deliveryAddress) {
  if (!deliveryAddress) return "Not specified";

  if (typeof deliveryAddress === "string") {
    return deliveryAddress;
  }

  if (typeof deliveryAddress === "object") {
    const { street, area, city, additionalInfo } = deliveryAddress;
    const parts = [];

    if (street) parts.push(street);
    if (area) parts.push(area);
    if (city) parts.push(city);
    if (additionalInfo) parts.push(additionalInfo);

    return parts.join(", ");
  }

  return "Invalid address format";
}

// Order details component (expanded view)
function OrderDetails({ order, isOpen, onToggle }) {
  if (!isOpen) return null;

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-GH", {
      style: "currency",
      currency: "GHS",
      minimumFractionDigits: 2,
    }).format(price || 0);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-GH", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="mt-4 p-6 bg-gray-50 rounded-xl border border-gray-200">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Information */}
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-900 flex items-center gap-2">
            <Receipt className="w-4 h-4" />
            Order Information
          </h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Order Number:</span>
              <span className="font-medium">#{order.orderNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Date Placed:</span>
              <span>{formatDate(order.createdAt)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Event Date:</span>
              <span>
                {new Date(
                  order.eventDate || order.createdAt,
                ).toLocaleDateString("en-GH", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Delivery Method:</span>
              <span className="font-medium">
                {order.deliveryMethod === "delivery" ? "Delivery" : "Pickup"}
              </span>
            </div>
          </div>
        </div>

        {/* Customer Information */}
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-900 flex items-center gap-2">
            <User className="w-4 h-4" />
            Customer Details
          </h4>
          <div className="space-y-2">
            {order.customerName && (
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-gray-400" />
                <span>{order.customerName}</span>
              </div>
            )}
            {order.customerEmail && (
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-400" />
                <span>{order.customerEmail}</span>
              </div>
            )}
            {order.customerPhone && (
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-400" />
                <span>{order.customerPhone}</span>
              </div>
            )}
            {order.deliveryAddress && (
              <div className="flex items-start gap-2">
                <Home className="w-4 h-4 text-gray-400 mt-1 flex-shrink-0" />
                <span className="text-sm">
                  {formatDeliveryAddress(order.deliveryAddress)}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Payment Summary */}
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-900 flex items-center gap-2">
            <CreditCard className="w-4 h-4" />
            Payment Summary
          </h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal:</span>
              <span>{formatPrice(order.subtotal || order.totalAmount)}</span>
            </div>
            {order.deliveryFee && order.deliveryFee > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-600">Delivery Fee:</span>
                <span>{formatPrice(order.deliveryFee)}</span>
              </div>
            )}
            {order.serviceFee && order.serviceFee > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-600">Service Fee:</span>
                <span>{formatPrice(order.serviceFee)}</span>
              </div>
            )}
            {order.discountAmount && order.discountAmount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount:</span>
                <span>-{formatPrice(order.discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between border-t pt-2 font-semibold text-lg">
              <span className="text-gray-900">Total:</span>
              <span className="text-amber-700">
                {formatPrice(order.totalAmount)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <ShoppingBag className="w-4 h-4" />
          Order Items ({(order.items || []).length})
        </h4>
        <div className="space-y-3">
          {(order.items || []).map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-100"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-amber-50 rounded-lg flex items-center justify-center">
                  <Package className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h5 className="font-medium text-gray-900">
                    {item.productName || `Item ${index + 1}`}
                  </h5>
                  <div className="flex items-center gap-3 mt-1 text-sm text-gray-600">
                    <span>{item.selectedOption?.label || "Standard"}</span>
                    <span>× {item.quantity || 1}</span>
                    {item.specialInstructions && (
                      <span className="text-xs text-gray-500">
                        Note: {item.specialInstructions}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-medium text-gray-900">
                  {formatPrice(item.itemTotal)}
                </div>
                <div className="text-sm text-gray-500">
                  {formatPrice(item.unitPrice)} each
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Order Notes */}
      {order.orderNotes && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h4 className="font-semibold text-gray-900 mb-2">Order Notes</h4>
          <p className="text-gray-600 bg-white p-3 rounded-lg border border-gray-100">
            {order.orderNotes}
          </p>
        </div>
      )}

      <button
        onClick={onToggle}
        className="mt-6 w-full py-2 text-center text-amber-600 hover:text-amber-700 font-medium"
      >
        Show Less
      </button>
    </div>
  );
}

// Order card component
function OrderCard({ order }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-GH", {
      style: "currency",
      currency: "GHS",
      minimumFractionDigits: 2,
    }).format(price || 0);
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:border-amber-300 transition-colors">
      {/* Order Header */}
      <div className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <h3 className="text-lg font-semibold text-gray-900">
                Order #{order.orderNumber}
              </h3>
              <OrderStatusBadge status={order.status} />
              <PaymentStatusBadge status={order.paymentStatus} />
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {new Date(order.createdAt).toLocaleDateString("en-GH", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {order.deliveryMethod === "delivery" ? "Delivery" : "Pickup"}
              </div>
              <div className="flex items-center gap-1">
                <CreditCard className="w-4 h-4" />
                {formatPrice(order.totalAmount)}
              </div>
            </div>
          </div>

          <button
            onClick={toggleExpand}
            className="inline-flex items-center gap-2 text-amber-700 hover:text-amber-800 font-medium px-4 py-2 rounded-lg hover:bg-amber-50 transition-colors"
          >
            {isExpanded ? "Hide Details" : "Show Details"}
            {isExpanded ? (
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 15l7-7 7 7"
                />
              </svg>
            ) : (
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Order Items Preview */}
        <div className="mt-4">
          <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600 mb-2">
            <Package className="w-4 h-4" />
            <span>{(order.items || []).length} items</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {(order.items || []).slice(0, 3).map((item, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
              >
                {item.productName || `Item ${index + 1}`} × {item.quantity || 1}
              </span>
            ))}
            {(order.items || []).length > 3 && (
              <span className="px-3 py-1 bg-gray-100 text-gray-500 rounded-full text-sm">
                +{(order.items || []).length - 3} more
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Expanded Order Details */}
      <OrderDetails order={order} isOpen={isExpanded} onToggle={toggleExpand} />

      {/* Order Footer */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="text-sm text-gray-600">Event Date</div>
            <div className="font-medium text-gray-900 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {new Date(order.eventDate || order.createdAt).toLocaleDateString(
                "en-GH",
                {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                },
              )}
            </div>
          </div>

          <div className="text-right">
            <div className="text-sm text-gray-600">Order Status</div>
            <div className="font-medium text-gray-900">
              {order.status === "pending" && "Awaiting Confirmation"}
              {order.status === "confirmed" && "Order Confirmed"}
              {order.status === "processing" && "Being Prepared"}
              {order.status === "ready" && "Ready for Pickup"}
              {order.status === "out_for_delivery" && "On the Way"}
              {order.status === "delivered" && "Delivered"}
              {order.status === "cancelled" && "Cancelled"}
              {!order.status && "Unknown Status"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Empty state component
function EmptyOrdersState() {
  return (
    <div className="text-center py-16">
      <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-amber-100 flex items-center justify-center">
        <Package className="w-12 h-12 text-amber-500" />
      </div>
      <h2 className="text-2xl font-medium text-gray-900 mb-3">No Orders Yet</h2>
      <p className="text-gray-500 mb-8 max-w-md mx-auto">
        You haven't placed any orders yet. Start shopping to see your orders
        here.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          href="/menu"
          className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-8 py-4 rounded-xl font-medium text-lg transition-colors transform hover:-translate-y-0.5 hover:shadow-lg"
        >
          <ShoppingBag className="w-5 h-5" />
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

export default function OrdersPage() {
  const { isLoaded, isSignedIn, userId } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isLoaded && isSignedIn && userId) {
      fetchUserOrders();
    }
  }, [isLoaded, isSignedIn, userId]);

  const fetchUserOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/orders?userId=${userId}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch orders: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setOrders(data.orders || []);
      } else {
        setError(data.error || "Failed to load orders");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Loading state
  if (!isLoaded) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
        </div>
      </>
    );
  }

  // Not signed in state
  if (!isSignedIn) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Sign In Required
            </h1>
            <p className="text-gray-600 mb-6">
              Please sign in to view your orders
            </p>
            <Link
              href="/sign-in"
              className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </>
    );
  }

  // Loading orders state
  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50">
          <div className="border-b border-gray-100 bg-white">
            <div className="max-w-7xl mx-auto px-4 py-3">
              <nav className="flex items-center gap-2 text-sm text-gray-500">
                <Link
                  href="/"
                  className="hover:text-amber-700 transition-colors"
                >
                  Home
                </Link>
                <ChevronRight className="w-4 h-4 text-gray-300" />
                <span className="text-gray-900 font-medium">Orders</span>
              </nav>
            </div>
          </div>

          <main className="max-w-7xl mx-auto px-4 py-8">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-24 bg-gray-200 rounded-xl"></div>
                ))}
              </div>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-48 bg-gray-200 rounded-2xl"></div>
                ))}
              </div>
            </div>
          </main>
        </div>
      </>
    );
  }

  // Error state
  if (error) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50">
          <div className="border-b border-gray-100 bg-white">
            <div className="max-w-7xl mx-auto px-4 py-3">
              <nav className="flex items-center gap-2 text-sm text-gray-500">
                <Link
                  href="/"
                  className="hover:text-amber-700 transition-colors"
                >
                  Home
                </Link>
                <ChevronRight className="w-4 h-4 text-gray-300" />
                <span className="text-gray-900 font-medium">Orders</span>
              </nav>
            </div>
          </div>

          <main className="max-w-7xl mx-auto px-4 py-8 text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Error Loading Orders
            </h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={fetchUserOrders}
              className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Try Again
            </button>
          </main>
        </div>
      </>
    );
  }

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
                My Orders
              </h1>
              <p className="text-gray-500 mt-2">
                View and track all your orders
              </p>
            </div>

            <div className="flex items-center gap-4">
              <Link
                href="/menu"
                className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                <ShoppingBag className="w-4 h-4" />
                Shop More
              </Link>
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
                  Your Orders ({orders.length} total)
                </h2>

                {orders.map((order) => (
                  <OrderCard
                    key={order._id || order.orderNumber}
                    order={order}
                  />
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
}
