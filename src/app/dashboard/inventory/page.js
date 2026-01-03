"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, Plus, Trash2, Package, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import Image from "next/image";

const categories = [
  "All Categories",
  "Birthday Cakes",
  "Cupcakes",
  "Cake Loaves",
  "Pastries & Snacks",
];

export default function InventoryPage() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalProducts: 0,
    hasPrevPage: false,
    hasNextPage: false,
  });

  // Fetch products
  const fetchProducts = async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
      });

      if (searchQuery) params.append("search", searchQuery);
      if (selectedCategory !== "All Categories")
        params.append("category", selectedCategory);

      const response = await fetch(`/api/products?${params}`);
      const data = await response.json();

      if (data.success) {
        setProducts(data.products);
        setPagination({
          currentPage: data.pagination?.currentPage || 1,
          totalPages: data.pagination?.totalPages || 1,
          totalProducts: data.pagination?.totalProducts || 0,
          hasPrevPage: data.pagination?.hasPrevPage || false,
          hasNextPage: data.pagination?.hasNextPage || false,
        });
      } else {
        toast.error("Failed to load products", {
          description: data.error || "Please try again.",
          style: {
            background: "#FEE2E2",
            border: "2px solid #EF4444",
            color: "#7F1D1D",
            fontWeight: 600,
          },
          icon: (
            <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center">
              <AlertCircle className="w-4 h-4 text-white" />
            </div>
          ),
        });
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Network Error", {
        description: "Failed to load products. Check your connection.",
        style: {
          background: "#FEE2E2",
          border: "2px solid #EF4444",
          color: "#7F1D1D",
          fontWeight: 600,
        },
        icon: (
          <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center">
            <AlertCircle className="w-4 h-4 text-white" />
          </div>
        ),
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [searchQuery, selectedCategory]);

  // Handle delete
  const handleDelete = async () => {
    if (!productToDelete) return;

    setDeleting(true);
    const loadingToast = toast.loading("Deleting product...", {
      description: "Please wait while we remove the product.",
      style: {
        background: "#FEF3C7",
        border: "2px solid #F59E0B",
        color: "#92400E",
        fontWeight: 600,
      },
      icon: (
        <div className="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center">
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
        </div>
      ),
    });

    try {
      const response = await fetch(`/api/products/${productToDelete.slug}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      toast.dismiss(loadingToast);

      if (response.ok) {
        toast.success("Product deleted successfully!", {
          description: `${productToDelete.name} has been removed from inventory.`,
          duration: 4000,
          style: {
            background: "#D1FAE5",
            border: "2px solid #10B981",
            color: "#065F46",
            fontWeight: 600,
          },
          icon: (
            <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          ),
        });

        // Refresh products list
        fetchProducts(pagination.currentPage);

        setDeleteDialogOpen(false);
        setProductToDelete(null);
      } else {
        toast.error("Failed to delete product", {
          description: data.error || "Something went wrong. Please try again.",
          duration: 5000,
          style: {
            background: "#FEE2E2",
            border: "2px solid #EF4444",
            color: "#7F1D1D",
            fontWeight: 600,
          },
          icon: (
            <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center">
              <AlertCircle className="w-4 h-4 text-white" />
            </div>
          ),
        });
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.dismiss(loadingToast);
      toast.error("Network Error", {
        description: "Unable to delete product. Check your connection.",
        duration: 5000,
        style: {
          background: "#FEE2E2",
          border: "2px solid #EF4444",
          color: "#7F1D1D",
          fontWeight: 600,
        },
        icon: (
          <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center">
            <AlertCircle className="w-4 h-4 text-white" />
          </div>
        ),
      });
    } finally {
      setDeleting(false);
    }
  };

  // Open delete dialog
  const openDeleteDialog = (product) => {
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
            <Package className="w-10 h-10 text-amber-600" />
            Inventory
          </h1>
          <p className="text-gray-600 mt-2 text-lg">
            Manage your bakery products and stock
          </p>
        </div>
        <Button
          onClick={() => router.push("/dashboard/products")}
          className="h-12 px-6 bg-linear-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 shadow-lg cursor-pointer"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Product
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-linear-to-br from-white to-amber-50 rounded-xl border-2 border-amber-200 p-6 shadow-lg">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-amber-500" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 text-lg border-2 border-amber-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="w-full md:w-64">
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="h-12 bg-white border-2 border-amber-300 hover:border-amber-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all duration-200">
                <SelectValue className="text-lg text-amber-900" />
              </SelectTrigger>
              <SelectContent className="bg-white border-2 border-amber-300 shadow-lg">
                {categories.map((cat) => (
                  <SelectItem
                    key={cat}
                    value={cat}
                    className="text-lg hover:bg-amber-50 focus:bg-amber-50 cursor-pointer transition-colors duration-150 text-amber-900"
                  >
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-6 flex gap-6">
          <div className="flex items-center gap-2 bg-linear-to-r from-amber-100 to-amber-200 px-4 py-2 rounded-lg border border-amber-300">
            <span className="text-sm font-semibold text-amber-900">
              Total Products:
            </span>
            <span className="text-lg font-bold text-amber-900">
              {pagination.totalProducts}
            </span>
          </div>
          <div className="flex items-center gap-2 bg-linear-to-r from-blue-100 to-blue-200 px-4 py-2 rounded-lg border border-blue-300">
            <span className="text-sm font-semibold text-blue-900">
              Showing:
            </span>
            <span className="text-lg font-bold text-blue-900">
              {products.length}
            </span>
          </div>
        </div>
      </div>

      {/* Products Table */}
      {loading ? (
        <div className="bg-linear-to-br from-white to-amber-50 rounded-xl border-2 border-amber-200 p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
          <p className="text-amber-800 mt-4 text-lg font-medium">
            Loading products...
          </p>
        </div>
      ) : products.length === 0 ? (
        <div className="bg-linear-to-br from-white to-amber-50 rounded-xl border-2 border-amber-200 p-12 text-center">
          <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-10 h-10 text-amber-600" />
          </div>
          <h3 className="text-2xl font-bold text-amber-900 mb-2">
            No Products Found
          </h3>
          <p className="text-amber-700 mb-6 text-lg">
            Try adjusting your filters or add a new product.
          </p>
          <Button
            onClick={() => router.push("/dashboard/products")}
            className="bg-linear-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 h-12 px-8 text-lg shadow-lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Your First Product
          </Button>
        </div>
      ) : (
        <div className="bg-linear-to-br from-white to-amber-50 rounded-xl border-2 border-amber-200 overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-linear-to-r from-amber-500 to-amber-600">
                <tr>
                  <th className="px-6 py-4 text-left text-lg font-bold text-white">
                    Product
                  </th>
                  <th className="px-6 py-4 text-left text-lg font-bold text-white">
                    Category
                  </th>
                  <th className="px-6 py-4 text-left text-lg font-bold text-white">
                    Prices
                  </th>
                  <th className="px-6 py-4 text-left text-lg font-bold text-white">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-lg font-bold text-white">
                    Flavors
                  </th>
                  <th className="px-6 py-4 text-right text-lg font-bold text-white">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-amber-100">
                {products.map((product) => (
                  <tr
                    key={product._id}
                    className="hover:bg-amber-50/70 transition-all duration-200"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-linear-to-br from-amber-100 to-amber-200 shrink-0 border-2 border-amber-300 relative">
                          {product.images && product.images[0] ? (
                            <Image
                              src={product.images[0]}
                              alt={product.name}
                              fill
                              sizes="(max-width: 64px) 64px"
                              className="object-cover"
                              unoptimized={product.images[0].includes(
                                "imagekit.io"
                              )}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package className="w-8 h-8 text-amber-500" />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-amber-900 text-lg">
                            {product.name}
                          </p>
                          {product.description && (
                            <p className="text-sm text-amber-700 truncate max-w-xs">
                              {product.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge className="bg-linear-to-r from-amber-100 to-amber-200 text-amber-900 border border-amber-300 text-sm font-semibold">
                        {product.category}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      {product.priceOptions &&
                      product.priceOptions.length > 0 ? (
                        <div className="space-y-1">
                          {product.priceOptions
                            .slice(0, 2)
                            .map((option, idx) => (
                              <p key={idx} className="text-sm text-amber-900">
                                <span className="font-bold">
                                  GH₵ {option.price}
                                </span>
                                <span className="text-amber-600 text-xs ml-1">
                                  ({option.label})
                                </span>
                              </p>
                            ))}
                          {product.priceOptions.length > 2 && (
                            <p className="text-xs text-amber-500">
                              +{product.priceOptions.length - 2} more
                            </p>
                          )}
                        </div>
                      ) : (
                        <span className="text-sm text-amber-500 italic">
                          No prices set
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <Badge
                        className={
                          product.isAvailable
                            ? "bg-linear-to-r from-green-100 to-green-200 text-green-900 border border-green-300 font-semibold"
                            : "bg-linear-to-r from-red-100 to-red-200 text-red-900 border border-red-300 font-semibold"
                        }
                      >
                        {product.isAvailable ? "Available" : "Unavailable"}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      {product.availableFlavors &&
                      product.availableFlavors.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {product.availableFlavors
                            .slice(0, 2)
                            .map((flavor, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-1 bg-linear-to-r from-purple-100 to-purple-200 text-purple-900 text-xs rounded-full border border-purple-300"
                              >
                                {flavor}
                              </span>
                            ))}
                          {product.availableFlavors.length > 2 && (
                            <span className="text-xs text-amber-500 ml-1 font-medium">
                              +{product.availableFlavors.length - 2}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-sm text-amber-500 italic">
                          None
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openDeleteDialog(product)}
                        className="bg-linear-to-r from-red-50 to-red-100 hover:from-red-100 hover:to-red-200 text-red-600 hover:text-red-700 border border-red-300 hover:border-red-400"
                        title="Delete Product"
                      >
                        <Trash2 className="w-5 h-5" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="border-t-2 border-amber-200 p-4 flex items-center justify-between bg-linear-to-r from-amber-50 to-white">
              <p className="text-sm text-amber-700 font-medium">
                Page {pagination.currentPage} of {pagination.totalPages}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => fetchProducts(pagination.currentPage - 1)}
                  disabled={!pagination.hasPrevPage}
                  className="border-amber-300 text-amber-700 hover:bg-amber-50 hover:text-amber-800 font-medium"
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  onClick={() => fetchProducts(pagination.currentPage + 1)}
                  disabled={!pagination.hasNextPage}
                  className="border-amber-300 text-amber-700 hover:bg-amber-50 hover:text-amber-800 font-medium"
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Delete Confirmation Dialog - Colorful Version */}
      {/* Delete Confirmation Dialog - Colorful Version */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="border-0 bg-linear-to-br from-white to-red-50 shadow-2xl">
          <div className="relative">
            {/* Warning Icon */}
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
              <div className="w-12 h-12 bg-linear-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-lg">
                <Trash2 className="w-6 h-6 text-white" />
              </div>
            </div>

            <AlertDialogHeader className="pt-8">
              <AlertDialogTitle className="text-2xl font-bold text-center text-red-700">
                Delete Product?
              </AlertDialogTitle>
              <AlertDialogDescription asChild>
                <div className="text-center text-red-600">
                  <div className="space-y-3">
                    <div className="text-lg font-semibold">
                      Are you sure you want to delete{" "}
                      <span className="text-red-700 font-bold">
                        {productToDelete?.name}
                      </span>
                      ?
                    </div>
                    <div className="bg-red-100 border-l-4 border-red-500 p-3 rounded-r">
                      <div className="text-red-800 text-sm">
                        ⚠️ This action cannot be undone!
                      </div>
                      {productToDelete?.images &&
                        productToDelete.images.length > 0 && (
                          <div className="text-red-700 text-sm mt-1">
                            • {productToDelete.images.length} image(s) will be
                            deleted from ImageKit
                          </div>
                        )}
                      <div className="text-red-700 text-sm mt-1">
                        • Product will be permanently removed from your
                        inventory
                      </div>
                    </div>
                  </div>
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter className="flex flex-col sm:flex-row gap-3 sm:gap-0 mt-6">
              <AlertDialogCancel
                disabled={deleting}
                className="flex-1 bg-linear-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-800 border-gray-300 hover:text-gray-900 font-semibold py-3"
              >
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 bg-linear-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg py-3 font-semibold"
              >
                {deleting ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Deleting...
                  </div>
                ) : (
                  "Delete Product"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
