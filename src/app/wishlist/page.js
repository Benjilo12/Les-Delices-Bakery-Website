"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import PaymentBanner from "@/components/PaymentBanner";
import { useWishlist, useCart, useUI } from "@/lib/store";
import {
  Heart,
  ShoppingBag,
  ArrowLeft,
  Trash2,
  ChevronRight,
  Cake,
  PlusCircle,
  AlertCircle,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
  Grid3x3,
  List,
} from "lucide-react";

export default function WishlistPage() {
  const { wishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { formatPrice } = useUI();

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(9);
  const [viewMode, setViewMode] = useState("grid");

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = wishlist.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(wishlist.length / itemsPerPage);

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAddAllToCart = () => {
    wishlist.forEach((product) => {
      if (product.isAvailable && product.priceOptions?.length > 0) {
        addToCart(
          product,
          product.priceOptions[0],
          1,
          product.customizationNotes || "",
          product.availableFlavors?.[0] || "",
        );
      }
    });
  };

  const handleRemoveAll = () => {
    wishlist.forEach((product) => {
      toggleWishlist(product);
    });
  };

  const calculateTotal = () => {
    return wishlist.reduce((total, product) => {
      const price = product.priceOptions?.[0]?.price || 0;
      return total + price;
    }, 0);
  };

  const availableProducts = wishlist.filter(
    (product) => product.isAvailable && product.priceOptions?.length > 0,
  );
  const unavailableProducts = wishlist.filter(
    (product) => !product.isAvailable || product.priceOptions?.length === 0,
  );

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        {/* Breadcrumb */}
        <div className="border-b border-gray-100 bg-white">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <nav className="flex items-center gap-2 text-sm text-gray-500">
              <Link href="/" className="hover:text-amber-700 transition-colors">
                Home
              </Link>
              <ChevronRight className="w-4 h-4 text-gray-300" />
              <Link
                href="/menu"
                className="hover:text-amber-700 transition-colors"
              >
                Menu
              </Link>
              <ChevronRight className="w-4 h-4 text-gray-300" />
              <span className="text-gray-900 font-medium">My Wishlist</span>
            </nav>
          </div>
        </div>

        <main className="max-w-7xl mx-auto px-4 py-8">
          <div className="mb-8">
            <Link
              href="/menu"
              className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-amber-700 group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Continue Shopping
            </Link>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main Content */}
            <div className="lg:w-3/4">
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                {/* Header with Controls */}
                <div className="p-6 border-b border-gray-100">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h1 className="text-2xl md:text-3xl font-serif text-gray-900">
                        My Wishlist
                      </h1>
                      <p className="text-gray-500 mt-1">
                        Save your favorite treats for later
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      {/* View Mode Toggle */}
                      <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                        <button
                          onClick={() => setViewMode("grid")}
                          className={`p-2 rounded-md transition-all ${
                            viewMode === "grid"
                              ? "bg-white text-amber-600 shadow-sm"
                              : "text-gray-500 hover:text-gray-700"
                          }`}
                        >
                          <Grid3x3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setViewMode("list")}
                          className={`p-2 rounded-md transition-all ${
                            viewMode === "list"
                              ? "bg-white text-amber-600 shadow-sm"
                              : "text-gray-500 hover:text-gray-700"
                          }`}
                        >
                          <List className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Items Per Page */}
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">Show:</span>
                        <select
                          value={itemsPerPage}
                          onChange={(e) => {
                            setItemsPerPage(Number(e.target.value));
                            setCurrentPage(1);
                          }}
                          className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-amber-500"
                        >
                          <option value={9}>9</option>
                          <option value={18}>18</option>
                          <option value={27}>27</option>
                          <option value={36}>36</option>
                        </select>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-600">
                          {wishlist.length} item
                          {wishlist.length !== 1 ? "s" : ""}
                        </span>
                        {wishlist.length > 0 && (
                          <button
                            onClick={handleRemoveAll}
                            className="text-sm text-red-600 hover:text-red-700 flex items-center gap-1"
                          >
                            <Trash2 className="w-4 h-4" />
                            Clear All
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Empty State */}
                {wishlist.length === 0 ? (
                  <div className="p-12 text-center">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-amber-100 flex items-center justify-center">
                      <Heart className="w-10 h-10 text-amber-500" />
                    </div>
                    <h2 className="text-xl font-medium text-gray-900 mb-2">
                      Your wishlist is empty
                    </h2>
                    <p className="text-gray-500 mb-6 max-w-md mx-auto">
                      Save your favorite products here to easily find them
                      later.
                    </p>
                    <Link
                      href="/menu"
                      className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                    >
                      <Cake className="w-5 h-5" />
                      Start Shopping
                    </Link>
                  </div>
                ) : (
                  <>
                    {/* Quick Actions */}
                    {availableProducts.length > 0 && (
                      <div className="p-4 bg-amber-50 border-b border-amber-100">
                        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
                          <div className="flex items-center gap-2">
                            <ShoppingBag className="w-5 h-5 text-amber-600" />
                            <div>
                              <p className="text-sm font-medium text-amber-800">
                                Ready to order?
                              </p>
                              <p className="text-xs text-amber-700">
                                Add all available items to cart at once
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={handleAddAllToCart}
                            className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
                          >
                            <PlusCircle className="w-4 h-4" />
                            Add All to Cart ({availableProducts.length})
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Unavailable Notice */}
                    {unavailableProducts.length > 0 && (
                      <div className="p-4 bg-red-50 border-b border-red-100">
                        <div className="flex items-start gap-3">
                          <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
                          <div>
                            <p className="text-sm font-medium text-red-800">
                              {unavailableProducts.length} item
                              {unavailableProducts.length !== 1 ? "s" : ""}{" "}
                              currently unavailable
                            </p>
                            <p className="text-xs text-red-700 mt-1">
                              Some items are out of stock or temporarily
                              unavailable.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Products Grid/List */}
                    <div className="p-6">
                      {viewMode === "grid" ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                          {currentItems.map((product) => (
                            <WishlistItem
                              key={product._id}
                              product={product}
                              formatPrice={formatPrice}
                              toggleWishlist={toggleWishlist}
                              addToCart={addToCart}
                            />
                          ))}
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {currentItems.map((product) => (
                            <WishlistItemList
                              key={product._id}
                              product={product}
                              formatPrice={formatPrice}
                              toggleWishlist={toggleWishlist}
                              addToCart={addToCart}
                            />
                          ))}
                        </div>
                      )}

                      {/* Pagination */}
                      {wishlist.length > 0 && totalPages > 1 && (
                        <div className="mt-8 pt-6 border-t border-gray-200">
                          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="text-sm text-gray-600">
                              Showing {indexOfFirstItem + 1}-
                              {Math.min(indexOfLastItem, wishlist.length)} of{" "}
                              {wishlist.length}
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                onClick={prevPage}
                                disabled={currentPage === 1}
                                className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                              >
                                <ChevronLeft className="w-4 h-4" />
                              </button>

                              {Array.from(
                                { length: totalPages },
                                (_, i) => i + 1,
                              ).map((page) => {
                                if (
                                  page === 1 ||
                                  page === totalPages ||
                                  (page >= currentPage - 1 &&
                                    page <= currentPage + 1)
                                ) {
                                  return (
                                    <button
                                      key={page}
                                      onClick={() => goToPage(page)}
                                      className={`w-8 h-8 rounded-lg text-sm font-medium ${
                                        currentPage === page
                                          ? "bg-amber-600 text-white"
                                          : "border border-gray-300 hover:bg-gray-50"
                                      }`}
                                    >
                                      {page}
                                    </button>
                                  );
                                } else if (
                                  page === currentPage - 2 ||
                                  page === currentPage + 2
                                ) {
                                  return (
                                    <span
                                      key={page}
                                      className="px-2 text-gray-500"
                                    >
                                      ...
                                    </span>
                                  );
                                }
                                return null;
                              })}

                              <button
                                onClick={nextPage}
                                disabled={currentPage === totalPages}
                                className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                              >
                                <ChevronRightIcon className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>

              {/* Payment Banner - NOW PLACED HERE */}
              <div className="mt-8">
                <PaymentBanner />
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:w-1/4">
              <div className="sticky top-8 space-y-6">
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h3 className="font-medium text-gray-900 mb-4">
                    Wishlist Summary
                  </h3>

                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Total Items</span>
                      <span className="font-medium">{wishlist.length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Available</span>
                      <span className="font-medium text-green-600">
                        {availableProducts.length}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Unavailable</span>
                      <span className="font-medium text-red-600">
                        {unavailableProducts.length}
                      </span>
                    </div>
                    <div className="pt-3 border-t border-gray-100">
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-900">
                          Total Value
                        </span>
                        <span className="text-lg font-bold text-amber-800">
                          {formatPrice(calculateTotal())}
                        </span>
                      </div>
                    </div>
                  </div>

                  {availableProducts.length > 0 && (
                    <button
                      onClick={handleAddAllToCart}
                      className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2 mb-3"
                    >
                      <ShoppingBag className="w-5 h-5" />
                      Add All to Cart
                    </button>
                  )}

                  <Link
                    href="/menu"
                    className="w-full py-2.5 border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <PlusCircle className="w-4 h-4" />
                    Add More Items
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

// Grid View Item
function WishlistItem({ product, formatPrice, toggleWishlist, addToCart }) {
  return (
    <div className="group relative border border-gray-200 rounded-xl overflow-hidden hover:border-amber-300 transition-all">
      <button
        onClick={() => toggleWishlist(product)}
        className="absolute top-3 right-3 z-10 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg hover:shadow-xl transition-all hover:scale-110"
      >
        <Heart className="w-4 h-4 fill-red-500 text-red-500" />
      </button>

      <div className="relative aspect-square bg-gray-50">
        {product.images?.[0] ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 bg-amber-50 flex items-center justify-center">
            <Cake className="w-12 h-12 text-amber-300" />
          </div>
        )}

        {!product.isAvailable && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-white/90 text-gray-900 px-3 py-1 rounded text-xs font-medium">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      <div className="p-4">
        <Link href={`/products/${product.slug || product._id}`}>
          <h3 className="font-medium text-gray-900 mb-1 hover:text-amber-700 transition-colors truncate">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center justify-between mb-3">
          <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
            {product.category}
          </span>
          <span className="text-lg font-bold text-amber-800">
            {formatPrice(product.priceOptions?.[0]?.price || 0)}
          </span>
        </div>

        {product.isAvailable && product.priceOptions?.length > 0 ? (
          <button
            onClick={() =>
              addToCart(
                product,
                product.priceOptions[0],
                1,
                "",
                product.availableFlavors?.[0] || "",
              )
            }
            className="w-full py-2 bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-4 h-4" />
            Add to Cart
          </button>
        ) : (
          <button
            disabled
            className="w-full py-2 bg-gray-200 text-gray-500 text-sm font-medium rounded-lg cursor-not-allowed"
          >
            Unavailable
          </button>
        )}
      </div>
    </div>
  );
}

// List View Item
function WishlistItemList({ product, formatPrice, toggleWishlist, addToCart }) {
  return (
    <div className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl hover:border-amber-300 transition-all">
      <button
        onClick={() => toggleWishlist(product)}
        className="self-start p-2 bg-white rounded-full shadow-sm hover:shadow-md transition-all"
      >
        <Heart className="w-4 h-4 fill-red-500 text-red-500" />
      </button>

      <div className="relative w-20 h-20 shrink-0 bg-gray-50 rounded-lg overflow-hidden">
        {product.images?.[0] ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover"
            sizes="80px"
          />
        ) : (
          <div className="absolute inset-0 bg-amber-50 flex items-center justify-center">
            <Cake className="w-8 h-8 text-amber-300" />
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <Link href={`/products/${product.slug || product._id}`}>
          <h3 className="font-medium text-gray-900 hover:text-amber-700 transition-colors truncate">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center gap-3 mt-1">
          <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded">
            {product.category}
          </span>
          <span className="text-base font-bold text-amber-800">
            {formatPrice(product.priceOptions?.[0]?.price || 0)}
          </span>
        </div>
        {!product.isAvailable && (
          <span className="text-xs text-red-600 mt-1 inline-block">
            Out of Stock
          </span>
        )}
      </div>

      <div className="shrink-0">
        {product.isAvailable && product.priceOptions?.length > 0 ? (
          <button
            onClick={() =>
              addToCart(
                product,
                product.priceOptions[0],
                1,
                "",
                product.availableFlavors?.[0] || "",
              )
            }
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap"
          >
            <ShoppingBag className="w-4 h-4" />
            Add to Cart
          </button>
        ) : (
          <button
            disabled
            className="px-4 py-2 bg-gray-200 text-gray-500 text-sm font-medium rounded-lg cursor-not-allowed"
          >
            Unavailable
          </button>
        )}
      </div>
    </div>
  );
}
