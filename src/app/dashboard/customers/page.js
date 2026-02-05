"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useUser, useAuth } from "@clerk/nextjs";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";

// Helper functions
function OrderStatusBadge({ status }) {
  const statusConfig = {
    pending: {
      label: "Pending",
      className: "bg-yellow-100 text-yellow-800 border border-yellow-200",
    },
    confirmed: {
      label: "Confirmed",
      className: "bg-green-100 text-green-800 border border-green-200",
    },
    processing: {
      label: "Processing",
      className: "bg-blue-100 text-blue-800 border border-blue-200",
    },
    ready: {
      label: "Ready",
      className: "bg-indigo-100 text-indigo-800 border border-indigo-200",
    },
    out_for_delivery: {
      label: "Out for Delivery",
      className: "bg-purple-100 text-purple-800 border border-purple-200",
    },
    completed: {
      label: "Delivered",
      className: "bg-emerald-100 text-emerald-800 border border-emerald-200",
    },
    cancelled: {
      label: "Cancelled",
      className: "bg-red-100 text-red-800 border border-red-200",
    },
  };

  const config = statusConfig[status] || statusConfig.pending;

  return (
    <span
      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${config.className}`}
    >
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
    });
  } catch (error) {
    return "Invalid date";
  }
}

// Stats Cards Component
function StatsCards({ stats }) {
  const statItems = [
    {
      title: "Total Orders",
      value: stats.total || 0,
      color: "bg-blue-50 text-blue-600",
      trend: "+12%",
    },
    {
      title: "Total Revenue",
      value: formatPrice(stats.totalRevenue || 0),
      color: "bg-green-50 text-green-600",
      trend: "+18%",
    },
    {
      title: "Pending Orders",
      value: stats.pending || 0,
      color: "bg-yellow-50 text-yellow-600",
      trend: "-5%",
    },
    {
      title: "Delivered",
      value: stats.completed || 0,
      color: "bg-emerald-50 text-emerald-600",
      trend: "+8%",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statItems.map((stat, index) => (
        <div
          key={index}
          className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {stat.value}
              </div>
              <div className="text-sm text-gray-500">{stat.title}</div>
              <div className="text-xs text-green-600 mt-1">{stat.trend}</div>
            </div>
            <div
              className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center`}
            >
              <div className="w-6 h-6">
                {index === 0 && "📦"}
                {index === 1 && "💰"}
                {index === 2 && "⏰"}
                {index === 3 && "✅"}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Header Component
function OrdersHeader({ onRefresh, onExport, loading }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
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
          onClick={onRefresh}
          disabled={loading}
          className="inline-flex items-center gap-2 border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
        >
          <span className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}>🔄</span>
          Refresh
        </button>
        <button
          onClick={onExport}
          className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          📥 Export
        </button>
      </div>
    </div>
  );
}

// Search and Filters Component
function SearchFilters({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  dateFilter,
  setDateFilter,
  sortBy,
  setSortBy,
  onSearch,
  onClear,
  hasFilters,
}) {
  return (
    <div className="bg-white p-4 md:p-6 rounded-xl border border-gray-200 shadow-sm">
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1 min-w-0">
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              🔍
            </div>
            <input
              type="text"
              placeholder="Search by order #, customer name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent min-w-[140px]"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="processing">Processing</option>
            <option value="ready">Ready</option>
            <option value="out_for_delivery">Out for Delivery</option>
            <option value="completed">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent min-w-[140px]"
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
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent min-w-[140px]"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="price-high">Price: High to Low</option>
            <option value="price-low">Price: Low to High</option>
          </select>

          <div className="flex gap-2">
            <button
              onClick={onSearch}
              className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
            >
              Apply
            </button>
            {hasFilters && (
              <button
                onClick={onClear}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Orders List Component
function OrdersList({
  orders,
  loading,
  searchTerm,
  onViewDetails,
  pagination,
  onPageChange,
}) {
  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Loading orders...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
          📦
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {searchTerm ? "No matching orders found" : "No orders yet"}
        </h3>
        <p className="text-gray-600 mb-4">
          {searchTerm
            ? "Try adjusting your search or filters"
            : "Start by creating your first order"}
        </p>
        <button className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
          ➕ Create Order
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr className="text-left text-sm text-gray-700">
              <th className="px-6 py-3 font-medium">Order #</th>
              <th className="px-6 py-3 font-medium">Customer</th>
              <th className="px-6 py-3 font-medium">Date</th>
              <th className="px-6 py-3 font-medium">Amount</th>
              <th className="px-6 py-3 font-medium">Status</th>
              <th className="px-6 py-3 font-medium">Payment</th>
              <th className="px-6 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order._id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900">
                    {order.orderNumber}
                  </div>
                  <div className="text-sm text-gray-600">
                    {order.deliveryMethod === "delivery"
                      ? "🚚 Delivery"
                      : "🏪 Pickup"}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900">
                    {order.customerName}
                  </div>
                  <div className="text-sm text-gray-600">
                    {order.customerEmail}
                  </div>
                  <div className="text-xs text-gray-500">
                    {order.customerPhone}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">
                    {formatDate(order.createdAt)}
                  </div>
                  {order.eventDate && (
                    <div className="text-xs text-gray-500">
                      Event: {formatDate(order.eventDate)}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="font-bold text-gray-900">
                    {formatPrice(order.totalAmount)}
                  </div>
                  <div className="text-xs text-gray-500">
                    {order.items?.length || 0} items
                  </div>
                </td>
                <td className="px-6 py-4">
                  <OrderStatusBadge status={order.status} />
                </td>
                <td className="px-6 py-4">
                  <PaymentStatusBadge status={order.paymentStatus} />
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => onViewDetails(order)}
                      className="p-2 hover:bg-amber-50 text-amber-600 rounded-lg transition-colors"
                      title="View details"
                    >
                      👁️
                    </button>
                    <button
                      className="p-2 hover:bg-gray-100 text-gray-600 rounded-lg transition-colors"
                      title="More options"
                    >
                      ⋮
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
          <div className="text-sm text-gray-600">
            Showing {pagination.offset + 1}-
            {Math.min(pagination.offset + pagination.limit, pagination.total)}{" "}
            of {pagination.total} orders
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage === 1}
              className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ← Previous
            </button>
            <span className="px-3 py-1 bg-amber-600 text-white rounded">
              {pagination.currentPage}
            </span>
            <button
              onClick={() => onPageChange(pagination.currentPage + 1)}
              disabled={pagination.currentPage === pagination.totalPages}
              className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Main Page Component
export default function DashboardOrdersPage() {
  const { isLoaded } = useUser();
  const { getToken } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  // Pagination state
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0,
    limit: 10,
    offset: 0,
  });

  // Stats state
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    processing: 0,
    ready: 0,
    out_for_delivery: 0,
    completed: 0,
    cancelled: 0,
    totalRevenue: 0,
  });

  // Fetch orders
  const fetchOrders = async (page = 1) => {
    try {
      setLoading(true);
      const token = await getToken();

      const params = new URLSearchParams({
        page: page.toString(),
        limit: pagination.limit.toString(),
      });

      if (searchTerm) params.append("search", searchTerm);
      if (statusFilter !== "all") params.append("status", statusFilter);
      if (dateFilter !== "all") params.append("date", dateFilter);
      if (sortBy !== "newest") params.append("sort", sortBy);

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
        if (data.pagination) {
          setPagination(data.pagination);
        }
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
  };

  // Initial load
  useEffect(() => {
    if (isLoaded) {
      fetchOrders();
    }
  }, [isLoaded]);

  // Handle search
  const handleSearch = () => {
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
    fetchOrders(1);
  };

  // Handle clear filters
  const handleClearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setDateFilter("all");
    setSortBy("newest");
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
    fetchOrders(1);
  };

  // Handle page change
  const handlePageChange = (page) => {
    if (page < 1 || page > pagination.totalPages) return;
    setPagination((prev) => ({ ...prev, currentPage: page }));
    fetchOrders(page);
  };

  // Handle refresh
  const handleRefresh = () => {
    fetchOrders(pagination.currentPage);
  };

  // Handle export
  const handleExport = () => {
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
        order.eventDate ? formatDate(order.eventDate) : "N/A",
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

  // Handle view details
  const handleViewDetails = (order) => {
    toast.info(`Viewing details for order ${order.orderNumber}`);
    // You can implement modal or redirect logic here
  };

  // Check if filters are active
  const hasFilters =
    searchTerm ||
    statusFilter !== "all" ||
    dateFilter !== "all" ||
    sortBy !== "newest";

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <DashboardSidebar />
        <div className="flex-1 lg:pl-64 w-full p-4 md:p-6 lg:p-8">
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
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar />

      <main className="flex-1 lg:pl-64 w-full p-4 md:p-6 lg:p-8">
        <div className="space-y-6">
          <OrdersHeader
            onRefresh={handleRefresh}
            onExport={handleExport}
            loading={loading}
          />

          <StatsCards stats={stats} />

          <SearchFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            dateFilter={dateFilter}
            setDateFilter={setDateFilter}
            sortBy={sortBy}
            setSortBy={setSortBy}
            onSearch={handleSearch}
            onClear={handleClearFilters}
            hasFilters={hasFilters}
          />

          {error ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
                ⚠️
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Error Loading Orders
              </h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <button
                onClick={handleRefresh}
                className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                🔄 Try Again
              </button>
            </div>
          ) : (
            <OrdersList
              orders={orders}
              loading={loading}
              searchTerm={searchTerm}
              onViewDetails={handleViewDetails}
              pagination={pagination}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </main>
    </div>
  );
}
