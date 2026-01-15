// src/components/ProductCard.jsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ArrowRight } from "lucide-react";
import { useState } from "react";

export default function ProductCard({ product }) {
  const [isFavorite, setIsFavorite] = useState(false);

  // Get the first price from priceOptions array
  const firstPriceOption = product.priceOptions?.[0];
  const price = firstPriceOption?.price || product.price || 0;

  // Format price with currency symbol
  const formattedPrice = `₵${price.toLocaleString("en-GH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

  // Get product code from slug or ID
  const productCode =
    product.slug?.toUpperCase() ||
    product._id?.slice(-6).toUpperCase() ||
    "BK-1001";

  const toggleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  return (
    <div className="group bg-white">
      {/* Product Image Container */}
      <div className="relative aspect-square overflow-hidden mb-6 bg-gray-50">
        {/* New Arrival Badge - Top Left */}
        <div className="absolute top-4 left-0 z-10 bg-amber-500 text-white px-4 py-1.5 text-xs font-medium italic">
          New Arrival
        </div>

        {/* Love Icon - Top Right */}
        <button
          onClick={toggleFavorite}
          className="absolute top-4 right-4 z-10 bg-white rounded-full p-2.5 shadow-sm hover:shadow-md transition-all"
        >
          <Heart
            className={`w-5 h-5 transition-all ${
              isFavorite
                ? "fill-red-500 text-red-500"
                : "text-gray-400 hover:text-red-500"
            }`}
          />
        </button>

        {product.images?.[0] ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <span className="text-4xl mb-2">🎂</span>
              <p className="text-sm text-gray-400">No Image</p>
            </div>
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="px-1">
        {/* Product Code and Arrow */}
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm text-gray-600 font-normal">{productCode}</div>
          <Link
            href={`/products/${product.slug || product._id}`}
            className="flex items-center justify-center w-8 h-8 rounded-full border border-gray-300 hover:border-amber-900 hover:bg-amber-900 transition-all group-hover:border-amber-900"
          >
            <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-white transition-colors" />
          </Link>
        </div>

        {/* Product Name */}
        <Link href={`/products/${product.slug || product._id}`}>
          <h3 className="text-base font-normal text-amber-900 mb-1 line-clamp-2 min-h-12 hover:text-amber-600 transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Price */}
        <div className="text-lg font-normal text-amber-700">
          {formattedPrice}
        </div>
      </div>
    </div>
  );
}
