"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import InventoryHeader from "@/components/dashboard/dashboardInventory/InventoryHeader";
import InventoryFilters from "@/components/dashboard/dashboardInventory/InventoryFilters";
import ProductsTable from "@/components/dashboard/dashboardInventory/ProductsTable";
import LoadingState from "@/components/dashboard/dashboardInventory/LoadingState";
import EmptyState from "@/components/dashboard/dashboardInventory/EmptyState";
import DeleteDialog from "@/components/dashboard/dashboardInventory/DeleteDialog";
import { toast } from "sonner";
import { AlertCircle } from "lucide-react";

const categories = [
  "All Categories",
  "Birthday Cakes",
  "Wedding Cakes",
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
      });
    } finally {
      setDeleting(false);
    }
  };

  const openDeleteDialog = (product) => {
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  };

  return (
    <div className="space-y-8">
      <InventoryHeader router={router} />

      <InventoryFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        categories={categories}
        totalProducts={pagination.totalProducts}
        showingCount={products.length}
      />

      {loading ? (
        <LoadingState />
      ) : products.length === 0 ? (
        <EmptyState router={router} />
      ) : (
        <ProductsTable
          products={products}
          openDeleteDialog={openDeleteDialog}
          pagination={pagination}
          fetchProducts={fetchProducts}
        />
      )}

      <DeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        productToDelete={productToDelete}
        deleting={deleting}
        onCancel={() => setDeleteDialogOpen(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
