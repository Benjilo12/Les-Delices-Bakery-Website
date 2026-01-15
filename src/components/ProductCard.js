// src/components/ProductCard.jsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ArrowRight } from "lucide-react";
import { useState } from "react";

export default function ProductCard({ product }) {
  const [isFavorite, setIsFavorite] = useState(false);

  const price = product.priceOptions?.[0]?.price || product.price || 0;
  const formattedPrice = `₵${price.toLocaleString("en-GH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

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
    <div className="group bg-white w-full">
      {/* Image Container - Aspect Square to keep size manageable for 4-per-row */}
      <div className="relative aspect-square overflow-hidden mb-4 bg-gray-50 rounded-sm">
        {/* New Arrival Badge */}
        <div className="absolute top-3 left-0 z-10 bg-amber-500 text-white px-3 py-1 text-[10px] font-bold uppercase tracking-widest italic">
          New Arrival
        </div>

        <button
          onClick={toggleFavorite}
          className="absolute top-3 right-3 z-10 bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-sm transition-all cursor-pointer"
        >
          <Heart
            className={`w-4 h-4 ${
              isFavorite ? "fill-red-500 text-red-500" : "text-gray-400"
            }`}
          />
        </button>

        {product.images?.[0] ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 25vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-2xl">
            🎂
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
            className="flex items-center justify-center w-7 h-7 rounded-full border border-gray-200 hover:bg-amber-900 hover:text-white transition-all"
          >
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Shortened Name: font-medium and single line truncation */}
        <Link href={`/products/${product.slug || product._id}`}>
          <h3
            className="text-sm font-medium text-gray-900 mb-1 truncate hover:text-amber-700 transition-colors"
            title={product.name}
          >
            {product.name}
          </h3>
        </Link>

        {/* Price */}
        <div className="text-base font-bold text-amber-800">
          {formattedPrice}
        </div>
      </div>
    </div>
  );
}
