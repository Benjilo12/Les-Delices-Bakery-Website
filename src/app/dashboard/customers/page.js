"use client";

import { useState, useEffect, useCallback } from "react";

import {
  Users,
  Search,
  Filter,
  Download,
  Mail,
  Phone,
  Calendar,
  UserPlus,
  Shield,
  AlertCircle,
  ShoppingBag,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  // Fetch customers
  const fetchCustomers = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
        ...(searchQuery && { search: searchQuery }),
      });

      const response = await fetch(`/api/customers?${params}`);

      if (!response.ok) {
        throw new Error("Failed to fetch customers");
      }

      const data = await response.json();

      if (data.success) {
        setCustomers(data.customers);
        setTotalPages(data.pagination.totalPages);
        setTotalCustomers(data.pagination.totalCustomers);
      } else {
        throw new Error(data.error || "Failed to fetch customers");
      }
    } catch (err) {
      console.error("Error fetching customers:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [page, searchQuery]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1); // Reset to first page when searching
    fetchCustomers();
  };

  // Handle customer selection
  const handleSelectCustomer = (customerId) => {
    setSelectedCustomers((prev) =>
      prev.includes(customerId)
        ? prev.filter((id) => id !== customerId)
        : [...prev, customerId],
    );
  };

  // Handle select all
  const handleSelectAll = () => {
    if (selectedCustomers.length === customers.length) {
      setSelectedCustomers([]);
    } else {
      setSelectedCustomers(customers.map((c) => c._id));
    }
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-GH", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Calculate active customers (those who have placed orders)
  const activeCustomers = customers.filter((c) => c.totalOrders > 0).length;

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-full mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <AlertCircle className="w-6 h-6 text-red-600" />
              <h2 className="text-lg font-semibold text-red-900">Error</h2>
            </div>
            <p className="text-red-700">{error}</p>
            <button
              onClick={fetchCustomers}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:pl-4 lg:pr-6 lg:py-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 flex items-center gap-3">
              <Users className="w-8 h-8 text-amber-600" />
              Customers
            </h1>
            <p className="text-gray-600 mt-2">
              Manage and view all registered customers
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Download className="w-4 h-4" />
              Export
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors shadow-sm">
              <UserPlus className="w-4 h-4" />
              Add Customer
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6">
          <div className="bg-white p-5 lg:p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">
                  Total Customers
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {totalCustomers}
                </p>
              </div>
              <div className="w-14 h-14 rounded-xl bg-blue-50 flex items-center justify-center">
                <Users className="w-7 h-7 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-5 lg:p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">
                  Active Customers
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {activeCustomers}
                </p>
              </div>
              <div className="w-14 h-14 rounded-xl bg-green-50 flex items-center justify-center">
                <Shield className="w-7 h-7 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-5 lg:p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">This Month</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {
                    customers.filter((c) => {
                      const monthAgo = new Date();
                      monthAgo.setMonth(monthAgo.getMonth() - 1);
                      return new Date(c.createdAt) > monthAgo;
                    }).length
                  }
                </p>
              </div>
              <div className="w-14 h-14 rounded-xl bg-purple-50 flex items-center justify-center">
                <Calendar className="w-7 h-7 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-5 lg:p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Avg. Orders</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {customers.length > 0
                    ? Math.round(
                        customers.reduce(
                          (sum, c) => sum + (c.totalOrders || 0),
                          0,
                        ) / customers.length,
                      )
                    : 0}
                </p>
              </div>
              <div className="w-14 h-14 rounded-xl bg-amber-50 flex items-center justify-center">
                <ShoppingBag className="w-7 h-7 text-amber-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 lg:p-5 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <form onSubmit={handleSearch} className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search customers by name, email, or username..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
              />
            </div>
          </form>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="mt-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Account Status
                </label>
                <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-transparent">
                  <option value="">All</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date Joined
                </label>
                <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-transparent">
                  <option value="">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sort By
                </label>
                <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-transparent">
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="name">Name A-Z</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setShowFilters(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors shadow-sm">
                Apply Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Table Header */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={
                  selectedCustomers.length === customers.length &&
                  customers.length > 0
                }
                onChange={handleSelectAll}
                className="rounded border-gray-300 text-amber-600 focus:ring-amber-500 w-4 h-4"
              />
              <span className="text-sm font-medium text-gray-700">
                {selectedCustomers.length > 0
                  ? `${selectedCustomers.length} selected`
                  : "Select all"}
              </span>
            </div>

            {selectedCustomers.length > 0 && (
              <div className="flex items-center gap-3">
                <button className="text-sm text-gray-700 hover:text-gray-900 font-medium">
                  Send Email
                </button>
                <button className="text-sm text-red-600 hover:text-red-900 font-medium">
                  Delete Selected
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-amber-600 border-t-transparent"></div>
            <p className="mt-4 text-gray-600">Loading customers...</p>
          </div>
        ) : customers.length === 0 ? (
          <div className="p-12 text-center">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No customers found
            </h3>
            <p className="text-gray-600 mb-4">
              {searchQuery
                ? "Try adjusting your search criteria"
                : "No customers have registered yet"}
            </p>
          </div>
        ) : (
          <>
            {/* Table Content */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="py-4 px-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="py-4 px-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Contact Information
                    </th>
                    <th className="py-4 px-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Total Orders
                    </th>
                    <th className="py-4 px-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Date Joined
                    </th>
                    <th className="py-4 px-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Account Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {customers.map((customer) => (
                    <tr
                      key={customer._id}
                      className="hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      <td className="py-5 px-6">
                        <div className="flex items-center gap-4">
                          <input
                            type="checkbox"
                            checked={selectedCustomers.includes(customer._id)}
                            onChange={() => handleSelectCustomer(customer._id)}
                            onClick={(e) => e.stopPropagation()}
                            className="rounded border-gray-300 text-amber-600 focus:ring-amber-500 w-4 h-4"
                          />
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white font-semibold text-lg shadow-sm">
                              {customer.firstName?.charAt(0).toUpperCase() ||
                                customer.lastName?.charAt(0).toUpperCase() ||
                                "U"}
                            </div>
                            <div>
                              <div className="font-semibold text-gray-900 text-base">
                                {customer.firstName} {customer.lastName}
                              </div>
                              <div className="text-sm text-gray-500">
                                @{customer.username || "user"}
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-5 px-6">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            <span className="text-gray-900">
                              {customer.email}
                            </span>
                          </div>
                          {customer.phoneNumber && (
                            <div className="flex items-center gap-2 text-sm">
                              <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                              <span className="text-gray-600">
                                {customer.phoneNumber}
                              </span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-5 px-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold bg-amber-100 text-amber-800">
                          <ShoppingBag className="w-4 h-4" />
                          {customer.totalOrders || 0}
                        </div>
                      </td>
                      <td className="py-5 px-6">
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          {formatDate(customer.createdAt)}
                        </div>
                      </td>
                      <td className="py-5 px-6">
                        <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold bg-green-100 text-green-800">
                          Active
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-sm text-gray-600">
                  Showing{" "}
                  <span className="font-semibold text-gray-900">
                    {(page - 1) * 10 + 1}
                  </span>{" "}
                  to{" "}
                  <span className="font-semibold text-gray-900">
                    {Math.min(page * 10, totalCustomers)}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-gray-900">
                    {totalCustomers}
                  </span>{" "}
                  customers
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className={`p-2 rounded-lg transition-colors ${
                      page === 1
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-gray-700 hover:bg-white hover:shadow-sm"
                    }`}
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (page <= 3) {
                        pageNum = i + 1;
                      } else if (page >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = page - 2 + i;
                      }

                      return (
                        <button
                          key={pageNum}
                          onClick={() => setPage(pageNum)}
                          className={`min-w-[2rem] h-8 rounded-lg text-sm font-medium transition-colors ${
                            page === pageNum
                              ? "bg-amber-600 text-white shadow-sm"
                              : "text-gray-700 hover:bg-white hover:shadow-sm"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className={`p-2 rounded-lg transition-colors ${
                      page === totalPages
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-gray-700 hover:bg-white hover:shadow-sm"
                    }`}
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Bulk Actions Bar */}
      {selectedCustomers.length > 0 && (
        <div className="fixed bottom-6 left-6 right-6 bg-white border border-gray-200 rounded-xl shadow-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 z-40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
              <span className="font-bold text-amber-700">
                {selectedCustomers.length}
              </span>
            </div>
            <span className="font-semibold text-gray-900">
              {selectedCustomers.length === 1
                ? "1 customer selected"
                : `${selectedCustomers.length} customers selected`}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
              Export Selected
            </button>
            <button className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors shadow-sm text-sm font-medium">
              Send Bulk Email
            </button>
            <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-sm text-sm font-medium">
              Delete Selected
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
