"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Heart,
  ArrowRight,
  Plus,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useWishlist, useCart, useUI } from "@/lib/store";
import { toast } from "sonner";
import { useState, useEffect } from "react";

export default function ProductCard({ product }) {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { formatPrice } = useUI();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const isFavorite = isInWishlist(product._id);
  // Optimistic state so the heart colors instantly on click
  const [optimisticFavorite, setOptimisticFavorite] = useState(isFavorite);

  // Keep optimistic state in sync if external store changes
  useEffect(() => {
    setOptimisticFavorite(isFavorite);
  }, [isFavorite]);

  const price = product.priceOptions?.[0]?.price || product.price || 0;
  const productCode =
    product.slug?.toUpperCase() ||
    product._id?.slice(-6).toUpperCase() ||
    "BK-1001";
  const isAvailable = product.isAvailable && product.priceOptions?.length > 0;

  // Get all product images or create an array with single image
  const productImages =
    product.images?.length > 0
      ? product.images
      : product.image
        ? [product.image]
        : [];

  const handleToggleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Flip optimistic state immediately so heart colors/uncolors instantly
    setOptimisticFavorite((prev) => !prev);
    toggleWishlist(product);

    if (isFavorite) {
      toast.success("Removed from wishlist", {
        description: `${product.name} has been removed from your wishlist.`,
        icon: "❤️",
      });
    } else {
      toast.success("Added to wishlist", {
        description: `${product.name} has been added to your wishlist.`,
        icon: "❤️",
      });
    }
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isAvailable) {
      addToCart(
        product,
        product.priceOptions[0],
        1,
        product.customizationNotes || "",
        product.availableFlavors?.[0] || "",
      );

      toast.success("Added to cart", {
        description: `${product.name} has been added to your cart.`,
        icon: "🛒",
        action: {
          label: "View Cart",
          onClick: () => (window.location.href = "/cart"),
        },
      });
    } else {
      toast.error("Out of stock", {
        description: `${product.name} is currently unavailable.`,
        icon: "😔",
      });
    }
  };

  const handlePrevImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) =>
      prev === 0 ? productImages.length - 1 : prev - 1,
    );
  };

  const handleNextImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) =>
      prev === productImages.length - 1 ? 0 : prev + 1,
    );
  };

  return (
    <div className="group bg-white w-full relative">
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden mb-4 bg-gray-50 rounded-sm">
        {/* New Arrival Badge */}
        <div className="absolute top-3 left-0 z-10 bg-amber-500 text-white px-3 py-1 text-[10px] font-bold uppercase tracking-widest italic">
          New Arrival
        </div>

        {/* Favorite Button */}
        <button
          onClick={handleToggleFavorite}
          className="absolute top-3 right-3 z-20 bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-sm transition-all cursor-pointer hover:scale-110"
          aria-label={
            optimisticFavorite ? "Remove from wishlist" : "Add to wishlist"
          }
        >
          <Heart
            className={`w-4 h-4 transition-all duration-200 ${
              optimisticFavorite
                ? "fill-red-500 text-red-500 scale-110"
                : "text-gray-400 hover:text-red-400"
            }`}
          />
        </button>

        {/* Add to Cart Button (Mobile only) */}
        {isAvailable && (
          <button
            onClick={handleAddToCart}
            className="md:hidden absolute bottom-3 right-3 z-20 bg-amber-600 text-white p-2 rounded-full shadow-sm hover:bg-amber-700 transition-colors"
            aria-label={`Add ${product.name} to cart`}
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        )}

        {/* Image Carousel Navigation */}
        {productImages.length > 1 && (
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 z-20 flex justify-between px-2 pointer-events-none">
            <button
              onClick={handlePrevImage}
              className="pointer-events-auto w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full shadow-sm flex items-center justify-center hover:bg-white transition-colors opacity-0 group-hover:opacity-100 transform -translate-x-1 group-hover:translate-x-0 transition-all duration-200"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-4 h-4 text-gray-700" />
            </button>
            <button
              onClick={handleNextImage}
              className="pointer-events-auto w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full shadow-sm flex items-center justify-center hover:bg-white transition-colors opacity-0 group-hover:opacity-100 transform translate-x-1 group-hover:translate-x-0 transition-all duration-200"
              aria-label="Next image"
            >
              <ChevronRight className="w-4 h-4 text-gray-700" />
            </button>
          </div>
        )}

        {/* Image Display */}
        <Link
          href={`/products/${product.slug || product._id}`}
          className="block w-full h-full"
        >
          {productImages.length > 0 ? (
            <>
              <Image
                src={productImages[currentImageIndex]}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 25vw"
                priority={currentImageIndex === 0}
              />

              {/* Image Indicators */}
              {productImages.length > 1 && (
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex gap-1.5">
                  {productImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setCurrentImageIndex(index);
                      }}
                      className={`w-1.5 h-1.5 rounded-full transition-all ${
                        index === currentImageIndex
                          ? "bg-amber-600 w-3"
                          : "bg-white/80 hover:bg-white"
                      }`}
                      aria-label={`Go to image ${index + 1}`}
                    />
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-2xl bg-gradient-to-br from-amber-50 to-amber-100">
              🎂
            </div>
          )}
        </Link>

        {/* Out of Stock Overlay */}
        {!product.isAvailable && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
            <span className="bg-white/90 text-gray-900 px-3 py-1 rounded text-xs font-medium">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Details */}
      <div className="px-1">
        <div className="flex items-center justify-between mb-1">
          <div className="text-[10px] text-gray-500 font-medium tracking-wider uppercase">
            {productCode}
          </div>
          <Link
            href={`/products/${product.slug || product._id}`}
            className="flex items-center justify-center w-7 h-7 rounded-full border border-gray-200 hover:bg-amber-900 hover:border-amber-900 hover:text-white transition-all group/link"
            aria-label={`View ${product.name} details`}
          >
            <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Product Name */}
        <Link href={`/products/${product.slug || product._id}`}>
          <h3
            className="text-sm font-medium text-gray-900 mb-1 truncate hover:text-amber-700 transition-colors"
            title={product.name}
          >
            {product.name}
          </h3>
        </Link>

        {/* Category Badge */}
        <div className="mb-2">
          <span className="inline-block px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] font-medium rounded">
            {product.category}
          </span>
        </div>

        {/* Price and Add to Cart Button */}
        <div className="flex items-center justify-between">
          <div className="text-base font-bold text-amber-800">
            {formatPrice
              ? formatPrice(price)
              : `₵${price.toLocaleString("en-GH", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}`}
          </div>

          {/* Add to Cart Button (Desktop only) */}
          {isAvailable && (
            <button
              onClick={handleAddToCart}
              className="hidden md:flex relative items-center justify-center h-9 px-4 bg-amber-600 text-white text-xs font-medium rounded-full hover:bg-amber-700 transition-all duration-200 group/cart overflow-hidden cursor-pointer"
              aria-label={`Add ${product.name} to cart`}
            >
              <Plus className="w-4 h-4 transition-all duration-200 group-hover/cart:opacity-0 group-hover/cart:-translate-x-2" />
              <span className="absolute inset-0 flex items-center justify-center transition-all duration-200 opacity-0 translate-x-2 group-hover/cart:opacity-100 group-hover/cart:translate-x-0">
                Add
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
