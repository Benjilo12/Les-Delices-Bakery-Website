"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import ManageBlogsHeader from "@/components/dashboard/dashboardManageBlog/ManageBlogsHeader";
import StatsCards from "@/components/dashboard/dashboardManageBlog/StatsCards";
import FiltersSection from "@/components/dashboard/dashboardManageBlog/FiltersSection";
import BlogsList from "@/components/dashboard/dashboardManageBlog/BlogsList";
import WarningSection from "@/components/dashboard/dashboardManageBlog/WarningSection";

export default function ManageBlogsPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalBlogs: 0,
    limit: 10,
    hasNextPage: false,
    hasPrevPage: false,
  });

  useEffect(() => {
    fetchBlogs();
  }, [pagination.currentPage, categoryFilter, statusFilter]);

  useEffect(() => {
    const uniqueCategories = [...new Set(blogs.map((blog) => blog.category))];
    setCategories(uniqueCategories);
  }, [blogs]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.currentPage.toString(),
        limit: pagination.limit.toString(),
      });

      if (categoryFilter !== "all") {
        params.append("category", categoryFilter);
      }

      if (searchTerm) {
        params.append("search", searchTerm);
      }

      const response = await fetch(`/api/blogs?${params.toString()}`);

      if (!response.ok) {
        throw new Error("Failed to fetch blogs");
      }

      const data = await response.json();

      if (data.success) {
        let filteredBlogs = data.blogs;
        if (statusFilter !== "all") {
          filteredBlogs = data.blogs.filter((blog) =>
            statusFilter === "published" ? blog.isPublished : !blog.isPublished
          );
        }

        setBlogs(filteredBlogs);
        setPagination(data.pagination);

        if (statusFilter !== "all") {
          setPagination((prev) => ({
            ...prev,
            totalBlogs: filteredBlogs.length,
            totalPages: Math.ceil(filteredBlogs.length / prev.limit),
          }));
        }
      } else {
        toast.error("Failed to load blogs");
      }
    } catch (error) {
      console.error("Error fetching blogs:", error);
      toast.error("Failed to load blogs");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
    fetchBlogs();
  };

  const handleDelete = async (slug) => {
    try {
      setDeletingId(slug);
      const response = await fetch(`/api/blogs/${slug}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success("Blog deleted successfully!", {
          description: "The blog post has been permanently removed.",
        });
        await fetchBlogs();
      } else {
        if (response.status === 404) {
          toast.info("Blog not found", {
            description:
              "The blog may have already been deleted. Refreshing list...",
          });
          await fetchBlogs();
        } else {
          throw new Error(data.error || "Failed to delete blog");
        }
      }
    } catch (error) {
      console.error("Error deleting blog:", error);
      toast.error("Failed to delete blog", {
        description: error.message || "An unexpected error occurred.",
      });
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not published";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handlePageChange = (page) => {
    if (page < 1 || page > pagination.totalPages) return;
    setPagination((prev) => ({ ...prev, currentPage: page }));
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setCategoryFilter("all");
    setStatusFilter("all");
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const getStatusColor = (isPublished) => {
    return isPublished
      ? "bg-green-100 text-green-800 border-green-300"
      : "bg-yellow-100 text-yellow-800 border-yellow-300";
  };

  const getCategoryColor = (category) => {
    const colors = {
      technology: "bg-blue-100 text-blue-800 border-blue-300",
      lifestyle: "bg-purple-100 text-purple-800 border-purple-300",
      travel: "bg-emerald-100 text-emerald-800 border-emerald-300",
      food: "bg-orange-100 text-orange-800 border-orange-300",
      health: "bg-red-100 text-red-800 border-red-300",
      education: "bg-indigo-100 text-indigo-800 border-indigo-300",
      business: "bg-gray-100 text-gray-800 border-gray-300",
      default: "bg-gray-100 text-gray-800 border-gray-300",
    };
    return colors[category?.toLowerCase()] || colors.default;
  };

  return (
    <div className="space-y-6">
      <ManageBlogsHeader totalBlogs={pagination.totalBlogs} />

      <StatsCards
        totalBlogs={pagination.totalBlogs}
        publishedCount={blogs.filter((blog) => blog.isPublished).length}
        draftCount={blogs.filter((blog) => !blog.isPublished).length}
        totalViews={blogs.reduce((sum, blog) => sum + (blog.views || 0), 0)}
      />

      <FiltersSection
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        categories={categories}
        handleSearch={handleSearch}
        handleClearFilters={handleClearFilters}
        blogs={blogs}
        totalBlogs={pagination.totalBlogs}
      />

      <BlogsList
        blogs={blogs}
        loading={loading}
        deletingId={deletingId}
        searchTerm={searchTerm}
        categoryFilter={categoryFilter}
        statusFilter={statusFilter}
        handleDelete={handleDelete}
        getStatusColor={getStatusColor}
        getCategoryColor={getCategoryColor}
        formatDate={formatDate}
        handleClearFilters={handleClearFilters}
        pagination={pagination}
        handlePageChange={handlePageChange}
      />

      <WarningSection />
    </div>
  );
}
