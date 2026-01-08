"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  Loader2,
  Search,
  ChevronLeft,
  ChevronRight,
  Users,
  ShieldCheck,
  Calendar,
  Mail,
  User as UserIcon,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Pagination state
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCustomers: 0,
    limit: 10,
    hasNextPage: false,
    hasPrevPage: false,
  });

  // Fetch customers on component mount and when filters/pagination changes
  useEffect(() => {
    fetchCustomers();
  }, [pagination.currentPage]);

  const fetchCustomers = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams({
        page: pagination.currentPage.toString(),
        limit: pagination.limit.toString(),
      });

      if (searchTerm) {
        params.append("search", searchTerm);
      }

      const response = await fetch(`/api/customers?${params.toString()}`);

      if (!response.ok) {
        throw new Error("Failed to fetch customers");
      }

      const data = await response.json();

      if (data.success) {
        setCustomers(data.customers);
        setPagination(data.pagination);
      } else {
        toast.error("Failed to load customers");
      }
    } catch (error) {
      console.error("Error fetching customers:", error);
      toast.error("Failed to load customers");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
    fetchCustomers();
  };

  const handlePageChange = (page) => {
    if (page < 1 || page > pagination.totalPages) return;
    setPagination((prev) => ({ ...prev, currentPage: page }));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ""}${
      lastName?.charAt(0) || ""
    }`.toUpperCase();
  };

  // Calculate stats
  const totalAdmins = customers.filter((c) => c.isAdmin).length;
  const totalRegularUsers = customers.filter((c) => !c.isAdmin).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900">Customers</h1>
        <p className="text-gray-600 mt-2 text-lg">
          Manage and view all registered customers
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Customers */}
        <Card className="bg-linear-to-br from-blue-50 to-blue-100 border-blue-200 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-blue-700">
                  Total Customers
                </p>
                <h3 className="text-4xl font-bold text-blue-900 mt-2">
                  {pagination.totalCustomers}
                </h3>
              </div>
              <div className="p-4 bg-blue-500/20 rounded-full">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Admins */}
        <Card className="bg-linear-to-br from-purple-50 to-purple-100 border-purple-200 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-purple-700">Admins</p>
                <h3 className="text-4xl font-bold text-purple-900 mt-2">
                  {totalAdmins}
                </h3>
              </div>
              <div className="p-4 bg-purple-500/20 rounded-full">
                <ShieldCheck className="h-8 w-8 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Regular Users */}
        <Card className="bg-linear-to-br from-green-50 to-green-100 border-green-200 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-green-700">
                  Regular Users
                </p>
                <h3 className="text-4xl font-bold text-green-900 mt-2">
                  {totalRegularUsers}
                </h3>
              </div>
              <div className="p-4 bg-green-500/20 rounded-full">
                <UserIcon className="h-8 w-8 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card className="border-2 border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl">Search Customers</CardTitle>
          <CardDescription>Search by name, email, or username</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <Input
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              className="h-12 text-base"
            />
            <Button onClick={handleSearch} className="h-12 px-6">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>

          {searchTerm && (
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Showing {customers.length} of {pagination.totalCustomers}{" "}
                customers
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchTerm("");
                  setPagination((prev) => ({ ...prev, currentPage: 1 }));
                  fetchCustomers();
                }}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                Clear search
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Customers List */}
      <Card className="border-2 border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl">Customer List</CardTitle>
          <CardDescription>
            All registered customers and their details
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 className="h-12 w-12 animate-spin text-blue-600 mb-4" />
              <p className="text-gray-600">Loading customers...</p>
            </div>
          ) : customers.length === 0 ? (
            <div className="text-center py-16">
              <div className="mx-auto w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Users className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No customers found
              </h3>
              <p className="text-gray-600">
                {searchTerm
                  ? `No customers found for "${searchTerm}"`
                  : "No customers registered yet"}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {customers.map((customer) => (
                <div
                  key={customer._id}
                  className="group bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-blue-300 hover:shadow-lg transition-all duration-200"
                >
                  <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <Avatar className="h-16 w-16 border-2 border-gray-200">
                      <AvatarImage
                        src={customer.profilePicture}
                        alt={customer.firstName}
                      />
                      <AvatarFallback className="bg-linear-to-br from-blue-400 to-purple-500 text-white text-lg font-bold">
                        {getInitials(customer.firstName, customer.lastName)}
                      </AvatarFallback>
                    </Avatar>

                    {/* Customer Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-gray-900">
                          {customer.firstName} {customer.lastName || ""}
                        </h3>
                        {customer.isAdmin && (
                          <Badge className="bg-purple-100 text-purple-800 border border-purple-300">
                            <ShieldCheck className="h-3 w-3 mr-1" />
                            Admin
                          </Badge>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-gray-400" />
                          <span>{customer.email}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <UserIcon className="h-4 w-4 text-gray-400" />
                          <span>@{customer.username}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span>Joined {formatDate(customer.createdAt)}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-gray-400">Clerk ID:</span>
                          <span className="font-mono text-xs">
                            {customer.clerkId.substring(0, 12)}...
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between mt-8 pt-6 border-t-2 border-gray-200">
              <div className="text-sm text-gray-600 mb-4 sm:mb-0">
                Page {pagination.currentPage} of {pagination.totalPages} •{" "}
                {customers.length} customers on this page
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={!pagination.hasPrevPage || loading}
                  className="border-2"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>

                <div className="flex items-center gap-1">
                  {Array.from(
                    { length: Math.min(5, pagination.totalPages) },
                    (_, i) => {
                      let pageNum;
                      if (pagination.totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (pagination.currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (
                        pagination.currentPage >=
                        pagination.totalPages - 2
                      ) {
                        pageNum = pagination.totalPages - 4 + i;
                      } else {
                        pageNum = pagination.currentPage - 2 + i;
                      }

                      return (
                        <Button
                          key={pageNum}
                          variant={
                            pagination.currentPage === pageNum
                              ? "default"
                              : "outline"
                          }
                          size="sm"
                          onClick={() => handlePageChange(pageNum)}
                          disabled={loading}
                          className={
                            pagination.currentPage === pageNum
                              ? "bg-blue-600 hover:bg-blue-700"
                              : "border-2"
                          }
                        >
                          {pageNum}
                        </Button>
                      );
                    }
                  )}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={!pagination.hasNextPage || loading}
                  className="border-2"
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
