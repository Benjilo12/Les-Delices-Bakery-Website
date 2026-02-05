"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  Filter,
  Download,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  Package,
  Truck,
  AlertCircle,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Plus,
  FileText,
  Printer,
  Mail,
  Phone,
  MapPin,
  User,
  CreditCard,
  ShoppingBag,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useUser, useAuth } from "@clerk/nextjs";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { toast } from "sonner";

// Helper functions
function OrderStatusBadge({ status }) {
  // Updated to match API status values (snake_case)
  const statusConfig = {
    pending: {
      label: "Pending",
      icon: Clock,
      className: "bg-yellow-100 text-yellow-800 border border-yellow-200",
    },
    confirmed: {
      label: "Confirmed",
      icon: CheckCircle,
      className: "bg-green-100 text-green-800 border border-green-200",
    },
    processing: {
      label: "Processing",
      icon: Package,
      className: "bg-blue-100 text-blue-800 border border-blue-200",
    },
    ready: {
      label: "Ready",
      icon: CheckCircle,
      className: "bg-indigo-100 text-indigo-800 border border-indigo-200",
    },
    out_for_delivery: {
      label: "Out for Delivery",
      icon: Truck,
      className: "bg-purple-100 text-purple-800 border border-purple-200",
    },
    completed: {
      label: "Delivered",
      icon: CheckCircle,
      className: "bg-emerald-100 text-emerald-800 border border-emerald-200",
    },
    cancelled: {
      label: "Cancelled",
      icon: AlertCircle,
      className: "bg-red-100 text-red-800 border border-red-200",
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
    pending: {
      label: "Pending",
      className: "bg-yellow-100 text-yellow-800 border border-yellow-200",
    },
    paid: {
      label: "Paid",
      className: "bg-green-100 text-green-800 border border-green-200",
    },
    failed: {
      label: "Failed",
      className: "bg-red-100 text-red-800 border border-red-200",
    },
    refunded: {
      label: "Refunded",
      className: "bg-gray-100 text-gray-800 border border-gray-200",
    },
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
  }).format(price || 0);
}

function formatDate(dateString) {
  if (!dateString) return "No date";

  try {
    return new Date(dateString).toLocaleDateString("en-GH", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (error) {
    console.error("Date parsing error:", error);
    return "Invalid date";
  }
}

function formatDateShort(dateString) {
  if (!dateString) return "N/A";

  try {
    return new Date(dateString).toLocaleDateString("en-GH", {
      month: "short",
      day: "numeric",
    });
  } catch (error) {
    return "Invalid";
  }
}

// Order Actions Dropdown
function OrderActions({ order, onAction }) {
  const [isOpen, setIsOpen] = useState(false);

  const actions = [
    { label: "View Details", icon: Eye, action: "view" },
    { label: "Edit Order", icon: Edit, action: "edit" },
    { label: "Update Status", icon: RefreshCw, action: "update_status" },
    { label: "Send Invoice", icon: Mail, action: "invoice" },
    { label: "Print Receipt", icon: Printer, action: "print" },
    { label: "Cancel Order", icon: X, action: "cancel", danger: true },
    { label: "Delete", icon: Trash2, action: "delete", danger: true },
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        aria-label="Order actions"
      >
        <MoreVertical className="w-4 h-4 text-gray-500" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
            {actions.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.action}
                  onClick={() => {
                    onAction(item.action, order);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2 ${
                    item.danger
                      ? "text-red-600 hover:text-red-700"
                      : "text-gray-700"
                  } ${item.action === "delete" ? "border-t border-gray-200" : ""}`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

// Order Detail Modal
function OrderDetailModal({ order, isOpen, onClose, onUpdateStatus }) {
  const [activeTab, setActiveTab] = useState("details");
  const [newStatus, setNewStatus] = useState(order?.status || "");
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateNote, setUpdateNote] = useState("");

  // Updated status options to match API
  const statusOptions = [
    { value: "pending", label: "Pending", color: "yellow" },
    { value: "confirmed", label: "Confirmed", color: "green" },
    { value: "processing", label: "Processing", color: "blue" },
    { value: "ready", label: "Ready", color: "indigo" },
    { value: "out_for_delivery", label: "Out for Delivery", color: "purple" },
    { value: "completed", label: "Delivered", color: "emerald" },
    { value: "cancelled", label: "Cancelled", color: "red" },
  ];

  const handleStatusUpdate = async () => {
    if (!newStatus || newStatus === order.status) return;

    setIsUpdating(true);
    toast.loading("Updating order status...");

    try {
      const response = await fetch(`/api/orders/${order.orderNumber}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: newStatus,
          note: updateNote,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update status");
      }

      toast.dismiss();
      toast.success("Order status updated successfully");

      if (onUpdateStatus) {
        onUpdateStatus(order._id, newStatus);
      }
      onClose();
    } catch (error) {
      console.error("Error updating status:", error);
      toast.dismiss();
      toast.error(error.message || "Failed to update order status");
    } finally {
      setIsUpdating(false);
    }
  };

  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-7xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">
              Order #{order.orderNumber}
            </h2>
            <p className="text-gray-500 mt-1">
              Created {formatDate(order.createdAt)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <div className="flex px-6 overflow-x-auto">
            {["details", "customer", "items", "actions"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-3 font-medium text-sm border-b-2 whitespace-nowrap transition-colors ${
                  activeTab === tab
                    ? "border-amber-500 text-amber-700"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>
        {/* Content */}
        <div className="overflow-y-auto max-h-[60vh] p-6">
          {activeTab === "details" && (
            <div className="space-y-6">
              {/* Order Summary */}
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                <div className="bg-gray-50 p-4 rounded-xl">
                  <div className="text-sm text-gray-500 mb-1">Status</div>
                  <OrderStatusBadge status={order.status} />
                </div>
                <div className="bg-gray-50 p-4 rounded-xl">
                  <div className="text-sm text-gray-500 mb-1">Payment</div>
                  <PaymentStatusBadge status={order.paymentStatus} />
                </div>
                <div className="bg-gray-50 p-4 rounded-xl">
                  <div className="text-sm text-gray-500 mb-1">Delivery</div>
                  <div className="font-medium text-gray-900">
                    {order.deliveryMethod === "delivery"
                      ? "Delivery"
                      : "Pickup"}
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl">
                  <div className="text-sm text-gray-500 mb-1">Event Date</div>
                  <div className="font-medium text-gray-900">
                    {formatDateShort(order.eventDate)}
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl">
                  <div className="text-sm text-gray-500 mb-1">Total Amount</div>
                  <div className="text-2xl font-bold text-gray-900">
                    {formatPrice(order.totalAmount)}
                  </div>
                </div>
              </div>

              {/* Delivery Information */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Delivery Information
                  </h3>
                  <div className="space-y-4">
                    {order.deliveryAddress && (
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                          <MapPin className="w-4 h-4" />
                          Delivery Address
                        </div>
                        <div className="text-gray-700 space-y-1">
                          {order.deliveryAddress.street && (
                            <div className="font-medium">
                              {order.deliveryAddress.street}
                            </div>
                          )}
                          {order.deliveryAddress.city && (
                            <div>{order.deliveryAddress.city}</div>
                          )}
                          {order.deliveryAddress.state && (
                            <div>{order.deliveryAddress.state}</div>
                          )}
                          {order.deliveryAddress.country && (
                            <div>{order.deliveryAddress.country}</div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Special Instructions */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Order Details
                  </h3>
                  <div className="space-y-4">
                    {order.eventType && (
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="text-sm text-gray-500 mb-1">
                          Event Type
                        </div>
                        <div className="font-medium text-gray-900">
                          {order.eventType}
                        </div>
                      </div>
                    )}

                    {order.specialInstructions && (
                      <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                        <div className="text-sm text-gray-500 mb-2">
                          Special Instructions
                        </div>
                        <p className="text-gray-700">
                          {order.specialInstructions}
                        </p>
                      </div>
                    )}

                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="text-sm text-gray-500 mb-2">
                        Order Timeline
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Created:</span>
                          <span className="font-medium">
                            {formatDateShort(order.createdAt)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Last Updated:</span>
                          <span className="font-medium">
                            {formatDateShort(order.updatedAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "customer" && (
            <div className="space-y-6">
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center">
                  <User className="w-8 h-8 text-amber-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {order.customerName}
                  </h3>
                  <p className="text-gray-600">Customer ID: {order.userId}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="p-4 bg-white border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                    <Mail className="w-4 h-4" />
                    Email Address
                  </div>
                  <div className="font-medium text-gray-900 break-all">
                    {order.customerEmail}
                  </div>
                </div>

                <div className="p-4 bg-white border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                    <Phone className="w-4 h-4" />
                    Phone Number
                  </div>
                  <div className="font-medium text-gray-900">
                    {order.customerPhone}
                  </div>
                </div>

                <div className="p-4 bg-white border border-gray-200 rounded-lg">
                  <div className="text-sm text-gray-500 mb-2">
                    Order Reference
                  </div>
                  <div className="font-medium text-gray-900 font-mono">
                    {order.orderNumber}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="p-4 bg-white border border-gray-200 rounded-lg">
                  <div className="text-sm text-gray-500 mb-2">
                    Delivery Method
                  </div>
                  <div className="font-medium text-gray-900 capitalize">
                    {order.deliveryMethod}
                  </div>
                </div>

                <div className="p-4 bg-white border border-gray-200 rounded-lg">
                  <div className="text-sm text-gray-500 mb-2">Event Date</div>
                  <div className="font-medium text-gray-900">
                    {formatDate(order.eventDate)}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "items" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Order Items ({order.items?.length || 0})
                  </h3>
                  <p className="text-gray-500 text-sm mt-1">
                    Total: {formatPrice(order.totalAmount)}
                  </p>
                </div>
                <button
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Printer className="w-4 h-4" />
                  Print Items
                </button>
              </div>

              <div className="space-y-4">
                {order.items?.map((item, index) => (
                  <div
                    key={index}
                    className="flex flex-col lg:flex-row lg:items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors gap-4"
                  >
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      <div className="w-16 h-16 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Package className="w-8 h-8 text-amber-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900 text-lg">
                          {item.productName}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          {item.selectedOption?.label || "Standard"}
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {item.customization?.requested && (
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                              Customized
                            </span>
                          )}
                          {item.selectedFlavors &&
                            item.selectedFlavors.length > 0 && (
                              <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded">
                                {item.selectedFlavors.length} flavor(s)
                              </span>
                            )}
                        </div>
                        {item.customization?.details && (
                          <div className="text-sm text-blue-600 mt-2">
                            Customization: {item.customization.details}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col lg:items-end gap-2">
                      <div className="text-right">
                        <div className="font-medium text-gray-900 text-xl">
                          {formatPrice(item.itemTotal)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {item.quantity} ×{" "}
                          {formatPrice(item.selectedOption?.price || 0)}
                        </div>
                      </div>
                      {item.customization?.additionalCost > 0 && (
                        <div className="text-sm text-blue-600">
                          +{formatPrice(item.customization.additionalCost)}{" "}
                          customization fee
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="mt-6 p-6 bg-white border border-gray-200 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-4 text-lg">
                  Price Breakdown
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium text-lg">
                      {formatPrice(order.subtotal)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600">Delivery Fee</span>
                    <span className="font-medium text-lg">
                      {formatPrice(order.deliveryFee || 0)}
                    </span>
                  </div>
                  <div className="border-t border-gray-200 pt-3 mt-2">
                    <div className="flex justify-between items-center py-2">
                      <span className="font-bold text-xl">Total Amount</span>
                      <span className="font-bold text-2xl text-amber-700">
                        {formatPrice(order.totalAmount)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "actions" && (
            <div className="space-y-6">
              {/* Status Update */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Update Order Status
                </h3>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  {statusOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setNewStatus(option.value)}
                      className={`p-4 rounded-lg border-2 transition-colors text-left ${
                        newStatus === option.value
                          ? `border-${option.color}-500 bg-${option.color}-50`
                          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      <div className="text-sm font-medium text-gray-900 mb-1">
                        {option.label}
                      </div>
                      <div className="text-xs text-gray-500">
                        {option.value === "pending" &&
                          "Order received, awaiting confirmation"}
                        {option.value === "confirmed" &&
                          "Order confirmed, preparing items"}
                        {option.value === "processing" &&
                          "Items being prepared"}
                        {option.value === "ready" &&
                          "Order ready for pickup/delivery"}
                        {option.value === "out_for_delivery" &&
                          "On the way to customer"}
                        {option.value === "completed" &&
                          "Successfully delivered"}
                        {option.value === "cancelled" && "Order cancelled"}
                      </div>
                    </button>
                  ))}
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Update Note (Optional)
                  </label>
                  <textarea
                    value={updateNote}
                    onChange={(e) => setUpdateNote(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    rows="3"
                    placeholder="Add a note about this status update..."
                  />
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={onClose}
                    className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleStatusUpdate}
                    disabled={isUpdating || newStatus === order.status}
                    className="flex-1 bg-amber-600 hover:bg-amber-700 text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isUpdating ? "Updating..." : "Update Status"}
                  </button>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Quick Actions
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
                  <button
                    onClick={() => {
                      toast.success("Invoice sent to customer email");
                    }}
                    className="flex items-center justify-center gap-2 p-4 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg border border-blue-200 transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                    Send Invoice
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="flex items-center justify-center gap-2 p-4 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg border border-green-200 transition-colors"
                  >
                    <Printer className="w-4 h-4" />
                    Print Receipt
                  </button>
                  <button
                    onClick={() => {
                      if (
                        window.confirm(
                          `Mark order ${order.orderNumber} as delivered?`,
                        )
                      ) {
                        setNewStatus("completed");
                        handleStatusUpdate();
                      }
                    }}
                    className="flex items-center justify-center gap-2 p-4 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg border border-emerald-200 transition-colors"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Mark Delivered
                  </button>
                  <button
                    onClick={() => {
                      if (
                        window.confirm(
                          `Cancel order ${order.orderNumber}? This action cannot be undone.`,
                        )
                      ) {
                        setNewStatus("cancelled");
                        handleStatusUpdate();
                      }
                    }}
                    className="flex items-center justify-center gap-2 p-4 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg border border-red-200 transition-colors"
                  >
                    <X className="w-4 h-4" />
                    Cancel Order
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Stats Card Component
function StatsCard({ title, value, icon: Icon, color, trend }) {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-2xl font-bold text-gray-900">{value}</div>
          <div className="text-sm text-gray-500">{title}</div>
          {trend && (
            <div
              className={`text-xs mt-1 ${trend > 0 ? "text-green-600" : "text-red-600"}`}
            >
              {trend > 0 ? "↑" : "↓"} {Math.abs(trend)}% from last month
            </div>
          )}
        </div>
        <div
          className={`w-12 h-12 rounded-lg ${color} flex items-center justify-center`}
        >
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}

// Main Component
export default function DashboardOrdersPage() {
  const { isLoaded, user } = useUser();
  const { getToken } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [sortBy, setSortBy] = useState("newest");
  const [expandedOrders, setExpandedOrders] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    processing: 0,
    ready: 0,
    out_for_delivery: 0,
    completed: 0, // Changed from delivered
    cancelled: 0,
    totalRevenue: 0,
  });

  // Fetch orders from actual API
  useEffect(() => {
    async function fetchOrders() {
      try {
        setLoading(true);
        const token = await getToken();

        // Build query parameters
        const params = new URLSearchParams();
        if (statusFilter !== "all") {
          params.append("status", statusFilter);
        }
        if (searchTerm) {
          params.append("search", searchTerm);
        }
        params.append("page", currentPage.toString());
        params.append("limit", itemsPerPage.toString());

        const queryString = params.toString();
        const url = `/api/orders${queryString ? `?${queryString}` : ""}`;

        const response = await fetch(url, {
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch orders: ${response.status}`);
        }

        const data = await response.json();

        if (data.success) {
          setOrders(data.orders || []);
          if (data.stats) {
            setStats(data.stats);
          }
          setError(null);
        } else {
          throw new Error(data.error || "Failed to fetch orders");
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
        setError(error.message);
        toast.error("Failed to load orders");
      } finally {
        setLoading(false);
      }
    }

    if (isLoaded) {
      fetchOrders();
    }
  }, [isLoaded, getToken, statusFilter, searchTerm, currentPage]);

  // Handle order actions
  const handleOrderAction = async (action, order) => {
    switch (action) {
      case "view":
        setSelectedOrder(order);
        setDetailModalOpen(true);
        break;

      case "edit":
        window.location.href = `/dashboard/orders/edit/${order.orderNumber}`;
        break;

      case "update_status":
        setSelectedOrder(order);
        setDetailModalOpen(true);
        break;

      case "invoice":
        toast.success("Invoice sent successfully");
        break;

      case "print":
        const printWindow = window.open("", "_blank");
        printWindow.document.write(`
          <html>
            <head>
              <title>Order ${order.orderNumber} - Receipt</title>
              <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                .header { text-align: center; margin-bottom: 30px; }
                .order-info { margin-bottom: 20px; }
                .items { margin: 20px 0; }
                table { width: 100%; border-collapse: collapse; }
                th, td { padding: 8px; text-align: left; border-bottom: 1px solid #ddd; }
                .total { font-weight: bold; font-size: 1.2em; }
              </style>
            </head>
            <body>
              <div class="header">
                <h1>Order Receipt</h1>
                <h2>Order #${order.orderNumber}</h2>
              </div>
              <div class="order-info">
                <p><strong>Customer:</strong> ${order.customerName}</p>
                <p><strong>Date:</strong> ${formatDate(order.createdAt)}</p>
                <p><strong>Status:</strong> ${order.status}</p>
              </div>
              <div class="items">
                <h3>Order Items</h3>
                <table>
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th>Quantity</th>
                      <th>Price</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${order.items
                      ?.map(
                        (item) => `
                      <tr>
                        <td>${item.productName}</td>
                        <td>${item.quantity}</td>
                        <td>${formatPrice(item.selectedOption?.price || 0)}</td>
                        <td>${formatPrice(item.itemTotal)}</td>
                      </tr>
                    `,
                      )
                      .join("")}
                  </tbody>
                </table>
              </div>
              <div class="total">
                <p>Subtotal: ${formatPrice(order.subtotal)}</p>
                <p>Delivery Fee: ${formatPrice(order.deliveryFee || 0)}</p>
                <p>Total Amount: ${formatPrice(order.totalAmount)}</p>
              </div>
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.print();
        toast.success("Print dialog opened");
        break;

      case "cancel":
        if (
          window.confirm(
            `Cancel order ${order.orderNumber}? This action cannot be undone.`,
          )
        ) {
          try {
            toast.loading("Cancelling order...");
            const response = await fetch(`/api/orders/${order.orderNumber}`, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                status: "cancelled",
                note: "Order cancelled by admin",
              }),
            });

            const data = await response.json();

            if (!response.ok) {
              throw new Error(data.error || "Failed to cancel order");
            }

            toast.success("Order cancelled successfully");
            setOrders((prev) =>
              prev.map((o) =>
                o._id === order._id ? { ...o, status: "cancelled" } : o,
              ),
            );
          } catch (error) {
            console.error("Error cancelling order:", error);
            toast.error(error.message || "Failed to cancel order");
          }
        }
        break;

      case "delete":
        if (
          window.confirm(
            `Delete order ${order.orderNumber}? This action cannot be undone.`,
          )
        ) {
          try {
            toast.loading("Deleting order...");
            const response = await fetch(`/api/orders/${order.orderNumber}`, {
              method: "DELETE",
            });

            const data = await response.json();

            if (!response.ok) {
              throw new Error(data.error || "Failed to delete order");
            }

            toast.success("Order deleted successfully");
            setOrders((prev) => prev.filter((o) => o._id !== order._id));
          } catch (error) {
            console.error("Error deleting order:", error);
            toast.error(error.message || "Failed to delete order");
          }
        }
        break;
    }
  };

  // Toggle order expansion
  const toggleOrderExpansion = (orderId) => {
    setExpandedOrders((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };

  // Handle status update
  const handleStatusUpdate = (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((order) =>
        order._id === orderId ? { ...order, status: newStatus } : order,
      ),
    );
  };

  // Refresh orders
  const refreshOrders = async () => {
    setLoading(true);
    try {
      toast.loading("Refreshing orders...");
      const token = await getToken();
      const response = await fetch("/api/orders", {
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to refresh orders");
      }

      if (data.success) {
        setOrders(data.orders || []);
        if (data.stats) {
          setStats(data.stats);
        }
        toast.success("Orders refreshed successfully");
      }
    } catch (error) {
      console.error("Error refreshing orders:", error);
      toast.error(error.message || "Failed to refresh orders");
    } finally {
      setLoading(false);
    }
  };

  // Export orders to CSV
  const exportToCSV = () => {
    toast.loading("Exporting orders to CSV...");

    setTimeout(() => {
      const headers = [
        "Order Number",
        "Customer Name",
        "Customer Email",
        "Customer Phone",
        "Total Amount",
        "Status",
        "Payment Status",
        "Delivery Method",
        "Event Date",
        "Created At",
      ];

      const csvData = orders.map((order) => [
        order.orderNumber,
        order.customerName,
        order.customerEmail,
        order.customerPhone,
        order.totalAmount,
        order.status,
        order.paymentStatus,
        order.deliveryMethod,
        formatDateShort(order.eventDate),
        formatDate(order.createdAt),
      ]);

      const csvContent = [
        headers.join(","),
        ...csvData.map((row) => row.join(",")),
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `orders-${new Date().toISOString().split("T")[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);

      toast.success("Orders exported successfully");
    }, 500);
  };

  // Handle pagination
  const totalPages = Math.ceil(orders.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = orders.slice(indexOfFirstItem, indexOfLastItem);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <DashboardSidebar />
        <div className="flex-1 ml-0 lg:ml-64">
          <div className="p-8">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-32 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar />

      {/* Main Content - EXTRA WIDE */}
      <main className="flex-1 ml-0 lg:ml-64">
        <div className="p-4 md:p-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-3xl font-serif font-bold text-gray-900">
                  Orders Management
                </h1>
                <p className="text-gray-600 mt-2">
                  Manage and track all customer orders
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={refreshOrders}
                  disabled={loading}
                  className="inline-flex items-center gap-2 border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
                >
                  <RefreshCw
                    className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
                  />
                  Refresh
                </button>
                <Link
                  href="/dashboard/orders/create"
                  className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Create Order
                </Link>
                <button
                  onClick={exportToCSV}
                  className="inline-flex items-center gap-2 border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Export
                </button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <StatsCard
                title="Total Orders"
                value={stats.total}
                icon={ShoppingBag}
                color="bg-blue-50 text-blue-600"
                trend={12}
              />
              <StatsCard
                title="Total Revenue"
                value={formatPrice(stats.totalRevenue)}
                icon={CreditCard}
                color="bg-green-50 text-green-600"
                trend={18}
              />
              <StatsCard
                title="Pending Orders"
                value={stats.pending}
                icon={Clock}
                color="bg-yellow-50 text-yellow-600"
                trend={-5}
              />
              <StatsCard
                title="Delivered"
                value={stats.completed} // Changed from stats.delivered
                icon={CheckCircle}
                color="bg-emerald-50 text-emerald-600"
                trend={8}
              />
            </div>

            {/* Filters and Search */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mb-6">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Search */}
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search by order #, customer name, email, or phone..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Filters */}
                <div className="flex gap-3">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="processing">Processing</option>
                    <option value="ready">Ready</option>
                    <option value="out_for_delivery">Out for Delivery</option>
                    <option value="completed">Delivered</option> {/* Changed */}
                    <option value="cancelled">Cancelled</option>
                  </select>

                  <select
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  >
                    <option value="all">All Time</option>
                    <option value="today">Today</option>
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                    <option value="year">This Year</option>
                  </select>

                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="price-low">Price: Low to High</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Orders Table - EXTREMELY WIDE LAYOUT */}
          {loading ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading orders...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Error Loading Orders
              </h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <button
                onClick={refreshOrders}
                className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Try Again
              </button>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                <Package className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No Orders Found
              </h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || statusFilter !== "all"
                  ? "Try adjusting your filters or search term"
                  : "No orders have been placed yet"}
              </p>
              <Link
                href="/dashboard/orders/create"
                className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                <Plus className="w-4 h-4" />
                Create Your First Order
              </Link>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              {/* Table Header - ULTRA WIDE COLUMN SIZES */}
              <div className="grid grid-cols-14 gap-2 p-4 border-b border-gray-200 bg-gray-50 font-medium text-sm text-gray-700">
                <div className="col-span-3">Order Details</div>
                <div className="col-span-3">Customer Information</div>
                <div className="col-span-2">Dates</div>
                <div className="col-span-1">Amount</div>
                <div className="col-span-1">Items</div>
                <div className="col-span-1">Status</div>
                <div className="col-span-1">Payment</div>
                <div className="col-span-2 text-right">Actions</div>
              </div>

              {/* Table Body - EXTRA WIDE */}
              <div className="divide-y divide-gray-200">
                {currentOrders.map((order) => {
                  const isExpanded = expandedOrders[order._id];

                  return (
                    <div key={order._id}>
                      {/* Row - WIDE LAYOUT */}
                      <div className="grid grid-cols-14 gap-2 p-4 hover:bg-gray-50 transition-colors items-center">
                        {/* Order Details - 3 columns */}
                        <div className="col-span-3">
                          <div className="font-medium text-gray-900 text-lg">
                            {order.orderNumber}
                          </div>
                          <div className="text-sm text-gray-600 mt-1">
                            {order.deliveryMethod === "delivery"
                              ? "🚚 Delivery"
                              : "🏪 Pickup"}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {order.eventType || "No event type"}
                          </div>
                        </div>

                        {/* Customer Information - 3 columns */}
                        <div className="col-span-3">
                          <div className="font-medium text-gray-900">
                            {order.customerName}
                          </div>
                          <div className="text-sm text-gray-600 truncate">
                            {order.customerEmail}
                          </div>
                          <div className="text-xs text-gray-500">
                            📱 {order.customerPhone}
                          </div>
                        </div>

                        {/* Dates - 2 columns */}
                        <div className="col-span-2">
                          <div className="text-sm text-gray-900">
                            📅 {formatDateShort(order.createdAt)}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            🎯 Event: {formatDateShort(order.eventDate)}
                          </div>
                        </div>

                        {/* Amount - 1 column */}
                        <div className="col-span-1">
                          <div className="font-bold text-gray-900 text-lg">
                            {formatPrice(order.totalAmount)}
                          </div>
                        </div>

                        {/* Items Count - 1 column */}
                        <div className="col-span-1">
                          <div className="flex items-center gap-1">
                            <Package className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-900">
                              {order.items?.length || 0}
                            </span>
                          </div>
                        </div>

                        {/* Status - 1 column */}
                        <div className="col-span-1">
                          <OrderStatusBadge status={order.status} />
                        </div>

                        {/* Payment - 1 column */}
                        <div className="col-span-1">
                          <PaymentStatusBadge status={order.paymentStatus} />
                        </div>

                        {/* Actions - 2 columns */}
                        <div className="col-span-2 flex justify-end items-center gap-2">
                          <button
                            onClick={() => toggleOrderExpansion(order._id)}
                            className="p-2 hover:bg-gray-100 rounded transition-colors"
                            aria-label={
                              isExpanded ? "Collapse details" : "Expand details"
                            }
                          >
                            {isExpanded ? (
                              <ChevronUp className="w-4 h-4 text-gray-500" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-gray-500" />
                            )}
                          </button>
                          <button
                            onClick={() => {
                              setSelectedOrder(order);
                              setDetailModalOpen(true);
                            }}
                            className="p-2 hover:bg-amber-50 text-amber-600 rounded transition-colors"
                            aria-label="View details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <OrderActions
                            order={order}
                            onAction={handleOrderAction}
                          />
                        </div>
                      </div>

                      {/* Expanded Details - FULL WIDTH */}
                      {isExpanded && (
                        <div className="px-4 pb-4 bg-gray-50 border-t border-gray-200">
                          <div className="p-6 bg-white rounded-lg border border-gray-200">
                            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                              {/* Contact Info */}
                              <div>
                                <h4 className="font-medium text-gray-900 mb-3">
                                  Contact Information
                                </h4>
                                <div className="space-y-3">
                                  <div>
                                    <div className="text-xs text-gray-500 mb-1">
                                      Customer
                                    </div>
                                    <div className="font-medium">
                                      {order.customerName}
                                    </div>
                                  </div>
                                  <div>
                                    <div className="text-xs text-gray-500 mb-1">
                                      Email
                                    </div>
                                    <div className="text-sm break-all">
                                      {order.customerEmail}
                                    </div>
                                  </div>
                                  <div>
                                    <div className="text-xs text-gray-500 mb-1">
                                      Phone
                                    </div>
                                    <div className="text-sm">
                                      {order.customerPhone}
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Delivery Info */}
                              <div>
                                <h4 className="font-medium text-gray-900 mb-3">
                                  Delivery Information
                                </h4>
                                <div className="space-y-3">
                                  <div>
                                    <div className="text-xs text-gray-500 mb-1">
                                      Method
                                    </div>
                                    <div className="font-medium capitalize">
                                      {order.deliveryMethod}
                                    </div>
                                  </div>
                                  <div>
                                    <div className="text-xs text-gray-500 mb-1">
                                      Event Date
                                    </div>
                                    <div className="text-sm">
                                      {formatDate(order.eventDate)}
                                    </div>
                                  </div>
                                  <div>
                                    <div className="text-xs text-gray-500 mb-1">
                                      Event Type
                                    </div>
                                    <div className="text-sm">
                                      {order.eventType || "Not specified"}
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Order Summary */}
                              <div>
                                <h4 className="font-medium text-gray-900 mb-3">
                                  Order Summary
                                </h4>
                                <div className="space-y-2">
                                  <div className="flex justify-between text-sm">
                                    <span>Items:</span>
                                    <span className="font-medium">
                                      {order.items?.length || 0}
                                    </span>
                                  </div>
                                  <div className="flex justify-between text-sm">
                                    <span>Subtotal:</span>
                                    <span className="font-medium">
                                      {formatPrice(order.subtotal)}
                                    </span>
                                  </div>
                                  <div className="flex justify-between text-sm">
                                    <span>Delivery:</span>
                                    <span className="font-medium">
                                      {formatPrice(order.deliveryFee || 0)}
                                    </span>
                                  </div>
                                  <div className="border-t border-gray-200 pt-2 mt-2">
                                    <div className="flex justify-between font-bold">
                                      <span>Total:</span>
                                      <span className="text-amber-700">
                                        {formatPrice(order.totalAmount)}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Quick Actions */}
                              <div className="col-span-2">
                                <h4 className="font-medium text-gray-900 mb-3">
                                  Quick Actions
                                </h4>
                                <div className="grid grid-cols-2 gap-2">
                                  <button
                                    onClick={() =>
                                      handleOrderAction("view", order)
                                    }
                                    className="flex items-center justify-center gap-2 p-3 bg-amber-50 text-amber-700 hover:bg-amber-100 rounded-lg transition-colors text-sm"
                                  >
                                    <Eye className="w-4 h-4" />
                                    View Details
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleOrderAction("invoice", order)
                                    }
                                    className="flex items-center justify-center gap-2 p-3 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg transition-colors text-sm"
                                  >
                                    <Mail className="w-4 h-4" />
                                    Send Invoice
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleOrderAction("print", order)
                                    }
                                    className="flex items-center justify-center gap-2 p-3 bg-green-50 text-green-700 hover:bg-green-100 rounded-lg transition-colors text-sm"
                                  >
                                    <Printer className="w-4 h-4" />
                                    Print Receipt
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleOrderAction("update_status", order)
                                    }
                                    className="flex items-center justify-center gap-2 p-3 bg-purple-50 text-purple-700 hover:bg-purple-100 rounded-lg transition-colors text-sm"
                                  >
                                    <RefreshCw className="w-4 h-4" />
                                    Update Status
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between p-4 border-t border-gray-200">
                <div className="text-sm text-gray-600">
                  Showing {indexOfFirstItem + 1}-
                  {Math.min(indexOfLastItem, orders.length)} of {orders.length}{" "}
                  orders
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    className="inline-flex items-center gap-1 px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </button>
                  <span className="px-3 py-1 bg-amber-600 text-white rounded">
                    {currentPage}
                  </span>
                  <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className="inline-flex items-center gap-1 px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Order Detail Modal */}
      <OrderDetailModal
        order={selectedOrder}
        isOpen={detailModalOpen}
        onClose={() => {
          setDetailModalOpen(false);
          setSelectedOrder(null);
        }}
        onUpdateStatus={handleStatusUpdate}
      />
    </div>
  );
}
