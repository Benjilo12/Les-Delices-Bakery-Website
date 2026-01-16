// src/components/ProductCarousel.jsx
"use client";

import { useState, useEffect, useRef } from "react";
import ProductCard from "./ProductCard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Highlighter } from "./ui/highlighter";
import Link from "next/link";

export default function ProductCarousel() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slidesPerView, setSlidesPerView] = useState(4);
  const carouselRef = useRef(null);

  useEffect(() => {
    fetchProducts();
    updateSlidesPerView();
    window.addEventListener("resize", updateSlidesPerView);
    return () => window.removeEventListener("resize", updateSlidesPerView);
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/products?limit=8");
      const data = await response.json();
      if (data.success) setProducts(data.products);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      // Small delay to make transition smoother
      setTimeout(() => setLoading(false), 500);
    }
  };

  const updateSlidesPerView = () => {
    if (typeof window === "undefined") return;
    const width = window.innerWidth;
    if (width < 640) setSlidesPerView(1);
    else if (width < 1024) setSlidesPerView(2);
    else if (width < 1280) setSlidesPerView(3);
    else setSlidesPerView(4);
  };

  const nextSlide = () => {
    const maxOffset = Math.max(0, products.length - slidesPerView);
    setCurrentSlide((prev) => (prev >= maxOffset ? 0 : prev + 1));
  };

  const prevSlide = () => {
    const maxOffset = Math.max(0, products.length - slidesPerView);
    setCurrentSlide((prev) => (prev <= 0 ? maxOffset : prev - 1));
  };

  // Skeleton Card UI
  const ProductSkeleton = () => (
    <div className="w-full animate-pulse px-2">
      <div className="aspect-square bg-gray-200 rounded-sm mb-4"></div>
      <div className="flex justify-between mb-2">
        <div className="h-3 bg-gray-200 rounded w-1/4"></div>
        <div className="h-6 w-6 bg-gray-200 rounded-full"></div>
      </div>
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
      <div className="h-5 bg-gray-200 rounded w-1/2"></div>
    </div>
  );

  return (
    <section className="py-10 bg-gray-50 overflow-hidden w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex items-center justify-center gap-4 mb-12">
          <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center shrink-0">
            <span className="text-white text-xl">👑</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-serif italic text-gray-900">
            Our signature{" "}
            <span className="text-pink-900">
              <Highlighter action="highlight" color="#FFD54F">
                French
              </Highlighter>
            </span>{" "}
            collection
          </h2>
        </div>

        {/* Carousel Viewport */}
        <div className="relative">
          {/* Navigation Arrows */}
          {!loading && products.length > 0 && (
            <>
              <button
                onClick={prevSlide}
                className="hidden xl:flex absolute -left-6 top-1/2 -translate-y-1/2 z-20 bg-amber-600 hover:bg-amber-700 text-white rounded-full p-3 shadow-lg border border-gray-100 transition-transform active:scale-90 cursor-pointer"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={nextSlide}
                className="hidden xl:flex absolute -right-6 top-1/2 -translate-y-1/2 z-20 bg-amber-600 hover:bg-amber-700 text-white rounded-full p-3 shadow-lg transition-transform active:scale-90 cursor-pointer"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          <div className="overflow-hidden">
            {loading ? (
              // Skeleton Grid
              <div className="flex">
                {[...Array(slidesPerView === 1 ? 1 : slidesPerView)].map(
                  (_, i) => (
                    <div
                      key={i}
                      style={{ width: `${100 / slidesPerView}%` }}
                      className="shrink-0"
                    >
                      <ProductSkeleton />
                    </div>
                  )
                )}
              </div>
            ) : (
              // Product Track
              <div
                className="flex transition-transform duration-500 ease-out"
                style={{
                  transform: `translateX(-${
                    currentSlide * (100 / slidesPerView)
                  }%)`,
                }}
              >
                {products.map((product) => (
                  <div
                    key={product._id}
                    className="shrink-0 px-2"
                    style={{ width: `${100 / slidesPerView}%` }}
                  >
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Mobile/Small Screen Controls */}
          {!loading && (
            <div className="flex justify-center xl:hidden mt-8 gap-3">
              <button
                onClick={prevSlide}
                className="p-3 rounded-full bg-white border shadow-sm"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextSlide}
                className="p-3 rounded-full bg-gray-900 text-white shadow-sm"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        {/* View Collection Button */}
        <div className="text-center mt-16">
          <Link
            href="/menu"
            className="bg-amber-700 hover:bg-amber-800 text-white px-8 py-4 text-sm font-medium tracking-widest uppercase transition-all rounded cursor-pointer shadow-lg hover:shadow-xl active:translate-y-0.5"
          >
            VIEW SIGNATURE COLLECTION
          </Link>
        </div>
      </div>
    </section>
  );
}
