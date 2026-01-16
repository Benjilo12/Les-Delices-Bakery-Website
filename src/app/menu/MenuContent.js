// src/app/menu/MenuContent.jsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  Search,
  PackageOpen,
} from "lucide-react";
import MenuBanner from "@/components/menu/MenuBanner";

const categories = [
  { name: "All Categories", icon: "🍰" },
  { name: "Birthday Cakes", icon: "🎂" },
  { name: "Wedding Cakes", icon: "💒" },
  { name: "Cupcakes", icon: "🧁" },
  { name: "Cake Loaves", icon: "🍞" },
  { name: "Pastries & Snacks", icon: "🥐" },
];

export default function MenuContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentCategory = searchParams.get("category") || "All Categories";
  const currentPage = parseInt(searchParams.get("page")) || 1;

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    totalPages: 1,
    totalProducts: 0,
  });

  const PRODUCTS_PER_PAGE = 8;

  useEffect(() => {
    fetchProducts();
  }, [currentCategory, currentPage]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let url = `/api/products?page=${currentPage}&limit=${PRODUCTS_PER_PAGE}`;
      if (currentCategory !== "All Categories") {
        url += `&category=${encodeURIComponent(currentCategory)}`;
      }

      const response = await fetch(url);
      const data = await response.json();

      if (data.success) {
        setProducts(data.products);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateParams = (newCategory, newPage) => {
    const params = new URLSearchParams(searchParams.toString());

    if (newCategory) {
      params.set("category", newCategory);
      params.set("page", "1");
    }
    if (newPage) {
      params.set("page", newPage.toString());
    }

    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <main className="min-h-screen bg-linear-to-b from-gray-50 to-white">
      <MenuBanner />

      <div className="max-w-400 mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* SIDEBAR FILTER */}
          <aside className="w-full lg:w-72 shrink-0">
            <div className="sticky top-24 lg:bg-amber-50 lg:p-6 lg:rounded-xl">
              <h2 className="text-2xl font-serif italic text-gray-900 mb-6 hidden lg:block">
                Browse Categories
              </h2>

              {/* Mobile horizontal scroll */}
              <div className="flex lg:flex-col overflow-x-auto pb-4 lg:pb-0 gap-3 no-scrollbar">
                {categories.map((cat) => (
                  <button
                    key={cat.name}
                    onClick={() => updateParams(cat.name, null)}
                    className={`group relative whitespace-nowrap px-5 py-3.5 text-left text-sm font-medium transition-all duration-200 rounded-lg
                      ${
                        currentCategory === cat.name
                          ? "bg-amber-700 text-white shadow-md shadow-amber-700/30"
                          : "bg-white text-gray-700 border border-amber-100 hover:border-amber-700 hover:text-amber-700 hover:shadow-sm hover:bg-amber-50"
                      }`}
                  >
                    <span className="flex items-center gap-3">
                      <span className="text-lg">{cat.icon}</span>
                      <span>{cat.name}</span>
                    </span>
                    {currentCategory === cat.name && (
                      <div className="absolute inset-0 bg-amber-600 rounded-lg -z-10 blur-sm opacity-30"></div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* GRID & PAGINATION */}
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="mb-8 pb-6 border-b border-gray-200">
              <h1 className="text-3xl md:text-4xl font-serif italic text-gray-900 mb-2">
                {currentCategory}
              </h1>
              <p className="text-sm text-gray-500">
                {loading ? (
                  <span className="inline-block w-20 h-4 bg-gray-200 rounded animate-pulse"></span>
                ) : (
                  <span>
                    {pagination.totalProducts}{" "}
                    {pagination.totalProducts === 1 ? "item" : "items"} found
                  </span>
                )}
              </p>
            </div>

            {loading ? (
              // Loading State
              <div className="flex flex-col items-center justify-center py-32">
                <Loader2 className="w-12 h-12 animate-spin text-amber-700 mb-4" />
                <p className="text-gray-500 text-sm">
                  Loading delicious treats...
                </p>
              </div>
            ) : products.length === 0 ? (
              // Empty State
              <div className="flex flex-col items-center justify-center py-24">
                <div className="relative mb-6">
                  <div className="w-24 h-24 bg-linear-to-br from-amber-100 to-amber-200 rounded-full flex items-center justify-center">
                    <PackageOpen className="w-12 h-12 text-amber-700" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full border-2 border-amber-700 flex items-center justify-center">
                    <Search className="w-4 h-4 text-amber-700" />
                  </div>
                </div>
                <h3 className="text-2xl font-serif italic text-gray-900 mb-2">
                  No items found
                </h3>
                <p className="text-gray-500 text-center max-w-md mb-6">
                  We couldn&apos;t find any products in this category. Try
                  browsing other categories or check back later.
                </p>
                <button
                  onClick={() => updateParams("All Categories", null)}
                  className="px-6 py-3 bg-amber-700 hover:bg-amber-800 text-white rounded-lg font-medium transition-colors"
                >
                  View All Products
                </button>
              </div>
            ) : (
              <>
                {/* Products Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {products.map((p) => (
                    <ProductCard key={p._id} product={p} />
                  ))}
                </div>

                {/* PAGINATION */}
                {pagination.totalPages > 1 && (
                  <div className="mt-16 flex flex-col sm:flex-row justify-center items-center gap-4">
                    <button
                      disabled={currentPage <= 1}
                      onClick={() => updateParams(null, currentPage - 1)}
                      className="p-3 border-2 border-gray-200 rounded-full disabled:opacity-30 disabled:cursor-not-allowed hover:border-amber-700 hover:bg-amber-50 transition-all group"
                      aria-label="Previous page"
                    >
                      <ChevronLeft className="w-5 h-5 text-gray-700 group-hover:text-amber-700" />
                    </button>

                    <div className="flex gap-2 flex-wrap justify-center">
                      {[...Array(pagination.totalPages)].map((_, i) => {
                        const pageNum = i + 1;
                        // Show first page, last page, current page, and pages around current
                        const showPage =
                          pageNum === 1 ||
                          pageNum === pagination.totalPages ||
                          (pageNum >= currentPage - 1 &&
                            pageNum <= currentPage + 1);

                        if (!showPage) {
                          // Show ellipsis
                          if (
                            pageNum === currentPage - 2 ||
                            pageNum === currentPage + 2
                          ) {
                            return (
                              <span
                                key={pageNum}
                                className="w-10 h-10 flex items-center justify-center text-gray-400"
                              >
                                ...
                              </span>
                            );
                          }
                          return null;
                        }

                        return (
                          <button
                            key={pageNum}
                            onClick={() => updateParams(null, pageNum)}
                            className={`w-10 h-10 rounded-full text-sm font-semibold transition-all ${
                              currentPage === pageNum
                                ? "bg-amber-700 text-white shadow-lg shadow-amber-700/30 scale-110"
                                : "bg-white border-2 border-gray-200 text-gray-700 hover:border-amber-700 hover:text-amber-700"
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>

                    <button
                      disabled={currentPage >= pagination.totalPages}
                      onClick={() => updateParams(null, currentPage + 1)}
                      className="p-3 border-2 border-gray-200 rounded-full disabled:opacity-30 disabled:cursor-not-allowed hover:border-amber-700 hover:bg-amber-50 transition-all group"
                      aria-label="Next page"
                    >
                      <ChevronRight className="w-5 h-5 text-gray-700 group-hover:text-amber-700" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
