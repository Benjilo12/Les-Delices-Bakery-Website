import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Pagination({
  pagination,
  loading,
  handlePageChange,
  customers,
}) {
  return (
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
  );
}
