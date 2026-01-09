import {
  Loader2,
  Trash2,
  Eye,
  FileText,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Tag,
  Eye as ViewIcon,
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
import { Badge } from "@/components/ui/badge";
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
import DeleteBlogDialog from "./DeleteBlogDialog";

export default function BlogsList({
  blogs,
  loading,
  deletingId,
  searchTerm,
  categoryFilter,
  statusFilter,
  handleDelete,
  getStatusColor,
  getCategoryColor,
  formatDate,
  handleClearFilters,
  pagination,
  handlePageChange,
}) {
  return (
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
            <p className="text-gray-600 dark:text-gray-400">Loading blogs...</p>
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
          <>
            <div className="space-y-4">
              {blogs.map((blog) => (
                <div
                  key={blog._id}
                  className="group bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
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

                      <DeleteBlogDialog
                        blog={blog}
                        deletingId={deletingId}
                        handleDelete={handleDelete}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {pagination.totalPages > 1 && (
              <Pagination
                pagination={pagination}
                loading={loading}
                handlePageChange={handlePageChange}
                blogs={blogs}
              />
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

function Pagination({ pagination, loading, handlePageChange, blogs }) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-800">
      <div className="text-sm text-gray-600 dark:text-gray-400 mb-4 sm:mb-0">
        Showing page {pagination.currentPage} of {pagination.totalPages} •{" "}
        {blogs.length} blogs on this page
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
              } else if (pagination.currentPage >= pagination.totalPages - 2) {
                pageNum = pagination.totalPages - 4 + i;
              } else {
                pageNum = pagination.currentPage - 2 + i;
              }

              return (
                <Button
                  key={pageNum}
                  variant={
                    pagination.currentPage === pageNum ? "default" : "outline"
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
  );
}
