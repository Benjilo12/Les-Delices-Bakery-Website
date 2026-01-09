"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import CustomersHeader from "@/components/dashboard/dashboardCustomer/CustomersHeader";
import StatsCards from "@/components/dashboard/dashboardCustomer/StatsCards";
import SearchSection from "@/components/dashboard/dashboardCustomer/SearchSection";
import CustomersList from "@/components/dashboard/dashboardCustomer/CustomersList";

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCustomers: 0,
    limit: 10,
    hasNextPage: false,
    hasPrevPage: false,
  });

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

  const totalAdmins = customers.filter((c) => c.isAdmin).length;
  const totalRegularUsers = customers.filter((c) => !c.isAdmin).length;

  return (
    <div className="space-y-6">
      <CustomersHeader />

      <StatsCards
        totalCustomers={pagination.totalCustomers}
        totalAdmins={totalAdmins}
        totalRegularUsers={totalRegularUsers}
      />

      <SearchSection
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        handleSearch={handleSearch}
        customers={customers}
        totalCustomers={pagination.totalCustomers}
        clearSearch={() => {
          setSearchTerm("");
          setPagination((prev) => ({ ...prev, currentPage: 1 }));
          fetchCustomers();
        }}
      />

      <CustomersList
        customers={customers}
        loading={loading}
        searchTerm={searchTerm}
        formatDate={formatDate}
        getInitials={getInitials}
        pagination={pagination}
        handlePageChange={handlePageChange}
      />
    </div>
  );
}
