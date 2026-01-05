// app/dashboard/manage-blogs/page.js
"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  Loader2,
  Trash2,
  Eye,
  Search,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Tag,
  Eye as ViewIcon,
  FileText,
  AlertCircle,
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogTrigger,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

export default function ManageBlogsPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categories, setCategories] = useState([]);

  // Pagination state
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalBlogs: 0,
    limit: 10,
    hasNextPage: false,
    hasPrevPage: false,
  });

  // Fetch blogs on component mount and when filters/pagination changes
  useEffect(() => {
    fetchBlogs();
  }, [pagination.currentPage, categoryFilter, statusFilter]);

  // Extract unique categories from blogs
  useEffect(() => {
    const uniqueCategories = [...new Set(blogs.map((blog) => blog.category))];
    setCategories(uniqueCategories);
  }, [blogs]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);

      // Build query params
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
        // Filter by status locally if needed
        let filteredBlogs = data.blogs;
        if (statusFilter !== "all") {
          filteredBlogs = data.blogs.filter((blog) =>
            statusFilter === "published" ? blog.isPublished : !blog.isPublished
          );
        }

        setBlogs(filteredBlogs);
        setPagination(data.pagination);

        // Adjust total blogs count if we filtered locally
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
    // Reset to page 1 when searching
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
    fetchBlogs();
  };

  //handleDelete function
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

        // Refresh the list after successful deletion
        await fetchBlogs();
      } else {
        // Handle specific error cases
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

  // Clear all filters
  const handleClearFilters = () => {
    setSearchTerm("");
    setCategoryFilter("all");
    setStatusFilter("all");
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  // Get status color
  const getStatusColor = (isPublished) => {
    return isPublished
      ? "bg-green-100 text-green-800 border-green-300"
      : "bg-yellow-100 text-yellow-800 border-yellow-300";
  };

  // Get category color
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
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          Manage Blogs
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          View, manage, and delete your blog posts. You have{" "}
          {pagination.totalBlogs} blogs in total.
        </p>
      </div>

      {/* Stats Cards with Colors */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Total Blogs Card */}
        <Card className="bg-linear-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700 dark:text-blue-400">
                  Total Blogs
                </p>
                <h3 className="text-3xl font-bold text-blue-900 dark:text-blue-300 mt-2">
                  {pagination.totalBlogs}
                </h3>
              </div>
              <div className="p-3 bg-blue-500/20 rounded-full">
                <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Published Blogs Card */}
        <Card className="bg-linear-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700 dark:text-green-400">
                  Published
                </p>
                <h3 className="text-3xl font-bold text-green-900 dark:text-green-300 mt-2">
                  {blogs.filter((blog) => blog.isPublished).length}
                </h3>
              </div>
              <div className="p-3 bg-green-500/20 rounded-full">
                <Eye className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Draft Blogs Card */}
        <Card className="bg-linear-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 border-yellow-200 dark:border-yellow-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-700 dark:text-yellow-400">
                  Drafts
                </p>
                <h3 className="text-3xl font-bold text-yellow-900 dark:text-yellow-300 mt-2">
                  {blogs.filter((blog) => !blog.isPublished).length}
                </h3>
              </div>
              <div className="p-3 bg-yellow-500/20 rounded-full">
                <FileText className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Views Card */}
        <Card className="bg-linear-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-700 dark:text-purple-400">
                  Total Views
                </p>
                <h3 className="text-3xl font-bold text-purple-900 dark:text-purple-300 mt-2">
                  {blogs.reduce((sum, blog) => sum + (blog.views || 0), 0)}
                </h3>
              </div>
              <div className="p-3 bg-purple-500/20 rounded-full">
                <ViewIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search Card */}
      <Card className="border-gray-200 dark:border-gray-800">
        <CardHeader className="pb-3">
          <CardTitle className="text-gray-900 dark:text-white">
            Filters & Search
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            Filter and search through your blog posts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <div className="flex gap-2">
                <Input
                  placeholder="Search by title, content, or excerpt..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                  className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700"
                />
                <Button
                  onClick={handleSearch}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Status Filter */}
            <div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem
                    value="published"
                    className="text-green-700 dark:text-green-400"
                  >
                    Published
                  </SelectItem>
                  <SelectItem
                    value="draft"
                    className="text-yellow-700 dark:text-yellow-400"
                  >
                    Draft
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {(searchTerm ||
            categoryFilter !== "all" ||
            statusFilter !== "all") && (
            <div className="mt-4 flex items-center justify-between">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Showing {blogs.length} of {pagination.totalBlogs} blogs
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearFilters}
                className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
              >
                Clear all filters
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Blogs List */}
      <Card className="border-gray-200 dark:border-gray-800">
        <CardHeader className="pb-3">
          <CardTitle className="text-gray-900 dark:text-white">
            Blog Posts
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            Manage your blog posts. Click delete to remove a blog permanently.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-12 w-12 animate-spin text-blue-600 dark:text-blue-400 mb-4" />
              <p className="text-gray-600 dark:text-gray-400">
                Loading blogs...
              </p>
            </div>
          ) : blogs.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                <FileText className="h-8 w-8 text-gray-400 dark:text-gray-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No blogs found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                {searchTerm
                  ? `No blogs found for "${searchTerm}". Try a different search term.`
                  : "You haven't created any blogs yet or no blogs match your filters."}
              </p>
              {(searchTerm ||
                categoryFilter !== "all" ||
                statusFilter !== "all") && (
                <Button
                  onClick={handleClearFilters}
                  className="mt-4 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Clear filters
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {blogs.map((blog) => (
                <div
                  key={blog._id}
                  className="group bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    {/* Blog Info */}
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <Badge
                          className={`border ${getStatusColor(
                            blog.isPublished
                          )}`}
                        >
                          {blog.isPublished ? "Published" : "Draft"}
                        </Badge>
                        <Badge
                          className={`border ${getCategoryColor(
                            blog.category
                          )}`}
                        >
                          {blog.category}
                        </Badge>
                        {blog.featuredImage && (
                          <Badge variant="outline" className="text-xs">
                            Has Image
                          </Badge>
                        )}
                      </div>

                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {blog.title}
                      </h3>

                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                        {blog.excerpt || "No excerpt available"}
                      </p>

                      {/* Blog Metadata */}
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>
                            {formatDate(blog.publishedAt || blog.createdAt)}
                          </span>
                        </div>

                        <div className="flex items-center gap-1">
                          <ViewIcon className="h-3 w-3" />
                          <span>{blog.views || 0} views</span>
                        </div>

                        {blog.tags && blog.tags.length > 0 && (
                          <div className="flex items-center gap-1">
                            <Tag className="h-3 w-3" />
                            <span className="max-w-50 truncate">
                              {blog.tags.slice(0, 2).join(", ")}
                              {blog.tags.length > 2 &&
                                ` +${blog.tags.length - 2} more`}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          window.open(`/blog/${blog.slug}`, "_blank")
                        }
                        className="border-gray-300 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="destructive"
                            size="sm"
                            disabled={deletingId === blog.slug}
                            className="bg-red-600 hover:bg-red-700 text-white"
                          >
                            {deletingId === blog.slug ? (
                              <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            ) : (
                              <Trash2 className="h-4 w-4 mr-2" />
                            )}
                            Delete
                          </Button>
                        </AlertDialogTrigger>

                        <AlertDialogContent className="bg-white dark:bg-gray-900 border-2 border-red-300 dark:border-red-700">
                          <AlertDialogHeader>
                            <div className="flex items-center gap-3 mb-4">
                              <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full">
                                <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
                              </div>
                              <AlertDialogTitle className="text-2xl font-bold text-red-600 dark:text-red-400">
                                Delete Blog Post?
                              </AlertDialogTitle>
                            </div>

                            <div className="space-y-4">
                              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                                <p className="text-sm font-semibold text-red-900 dark:text-red-300 mb-2">
                                  ⚠️ This action cannot be undone!
                                </p>
                                <p className="text-sm text-red-700 dark:text-red-400">
                                  You are about to permanently delete:
                                </p>
                              </div>

                              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                                <p className="font-semibold text-gray-900 dark:text-white mb-3">
                                  "{blog.title}"
                                </p>

                                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                                  <li className="flex items-start gap-2">
                                    <span className="text-red-500 font-bold">
                                      •
                                    </span>
                                    <span>
                                      The blog post and all its content
                                    </span>
                                  </li>
                                  <li className="flex items-start gap-2">
                                    <span className="text-red-500 font-bold">
                                      •
                                    </span>
                                    <span>
                                      All associated comments and reactions
                                    </span>
                                  </li>
                                  {blog.featuredImage && (
                                    <li className="flex items-start gap-2">
                                      <span className="text-red-500 font-bold">
                                        •
                                      </span>
                                      <span>
                                        The featured image from ImageKit
                                      </span>
                                    </li>
                                  )}
                                  <li className="flex items-start gap-2">
                                    <span className="text-red-500 font-bold">
                                      •
                                    </span>
                                    <span>
                                      View count: {blog.views || 0} views will
                                      be lost
                                    </span>
                                  </li>
                                </ul>
                              </div>

                              <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                                Are you absolutely sure you want to proceed?
                              </p>
                            </div>
                          </AlertDialogHeader>

                          <AlertDialogFooter className="gap-2 sm:gap-0">
                            <AlertDialogCancel className="border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800">
                              Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(blog.slug)}
                              className="bg-red-600 hover:bg-red-700 text-white border-2 border-red-700 dark:border-red-600"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Yes, Delete Permanently
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-800">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-4 sm:mb-0">
                Showing page {pagination.currentPage} of {pagination.totalPages}{" "}
                • {blogs.length} blogs on this page
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={!pagination.hasPrevPage || loading}
                  className="border-gray-300 dark:border-gray-700"
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
                              ? "bg-blue-600 hover:bg-blue-700 text-white"
                              : "border-gray-300 dark:border-gray-700"
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
                  className="border-gray-300 dark:border-gray-700"
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Warning Section */}
      <Card className="border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/20">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-yellow-800 dark:text-yellow-300 mb-1">
                Important Note About Deletion
              </h4>
              <p className="text-sm text-yellow-700 dark:text-yellow-400">
                When you delete a blog post, it will be permanently removed from
                the database along with its featured image from ImageKit. This
                action cannot be undone. Please make sure you want to delete a
                blog before proceeding.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
