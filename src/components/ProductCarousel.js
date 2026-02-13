// src/components/ProductCarousel.jsx
"use client";

import { useState, useEffect, useRef } from "react";
import ProductCard from "./ProductCard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Highlighter } from "./ui/highlighter";
import Link from "next/link";
import ProductSkeleton from "./ProductSkeleton";

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
      const response = await fetch("/api/products?limit=10"); // Increased limit for wider screens
      const data = await response.json();
      if (data.success) setProducts(data.products);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setTimeout(() => setLoading(false), 500);
    }
  };

  const updateSlidesPerView = () => {
    if (typeof window === "undefined") return;
    const width = window.innerWidth;

    if (width < 640) {
      setSlidesPerView(1); // Mobile
    } else if (width < 1024) {
      setSlidesPerView(2); // Tablet
    } else if (width < 1280) {
      setSlidesPerView(3); // Small Laptop
    } else if (width < 1536) {
      setSlidesPerView(4); // 14-inch Laptop (Standard Desktop)
    } else {
      setSlidesPerView(5); // Large Monitor / Ultra-wide
    }
  };

  const nextSlide = () => {
    const maxOffset = Math.max(0, products.length - slidesPerView);
    setCurrentSlide((prev) => (prev >= maxOffset ? 0 : prev + 1));
  };

  const prevSlide = () => {
    const maxOffset = Math.max(0, products.length - slidesPerView);
    setCurrentSlide((prev) => (prev <= 0 ? maxOffset : prev - 1));
  };

  return (
    <section className="py-20 bg-gray-50 overflow-hidden w-full">
      {/* Container Width Strategy:
        max-w-7xl (1280px) is perfect for 14-inch screens.
        2xl:max-w-[1600px] expands the content for large 4k or iMac monitors.
      */}
      <div className="max-w-7xl 2xl:max-w-400 mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-center gap-4 mb-16">
          <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center shrink-0">
            <span className="text-white text-xl">👑</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-serif italic text-gray-900 text-center">
            Our signature{" "}
           <span className="text-pink-900"> <Highlighter action="highlight" color="#FFD54F"> collection</Highlighter></span>
          </h2>
        </div>

        {/* Carousel Viewport */}
        <div className="relative group">
          {/* Desktop Navigation Arrows */}
          {!loading && products.length > slidesPerView && (
            <>
              <button
                onClick={prevSlide}
                className="hidden xl:flex absolute -left-6 2xl:-left-16 top-1/2 -translate-y-1/2 z-20 bg-amber-600 hover:bg-amber-700 text-white rounded-full p-4 shadow-xl border border-white/20 transition-all hover:scale-110 active:scale-95 cursor-pointer"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={nextSlide}
                className="hidden xl:flex absolute -right-6 2xl:-right-16 top-1/2 -translate-y-1/2 z-20 bg-amber-600 hover:bg-amber-700 text-white rounded-full p-4 shadow-xl border border-white/20 transition-all hover:scale-110 active:scale-95 cursor-pointer"
                aria-label="Next slide"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          <div className="overflow-hidden">
            {loading ? (
              // Skeleton Loading State
              <div className="flex gap-4">
                {[...Array(slidesPerView)].map((_, i) => (
                  <div
                    key={i}
                    style={{ width: `${100 / slidesPerView}%` }}
                    className="shrink-0"
                  >
                    <ProductSkeleton />
                  </div>
                ))}
              </div>
            ) : (
              // Product Track
              <div
                className="flex transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"
                style={{
                  transform: `translateX(-${currentSlide * (100 / slidesPerView)}%)`,
                }}
              >
                {products.map((product) => (
                  <div
                    key={product._id}
                    className="shrink-0 px-3"
                    style={{ width: `${100 / slidesPerView}%` }}
                  >
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Mobile & Tablet Controls */}
          {!loading && (
            <div className="flex justify-center xl:hidden mt-10 gap-4">
              <button
                onClick={prevSlide}
                className="p-4 rounded-full bg-white border border-gray-200 shadow-sm hover:bg-gray-50 active:bg-gray-100 transition-colors"
              >
                <ChevronLeft className="w-6 h-6 text-gray-700" />
              </button>
              <button
                onClick={nextSlide}
                className="p-4 rounded-full bg-gray-900 text-white shadow-md hover:bg-black active:scale-95 transition-all"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          )}
        </div>

        {/* View Collection Call to Action */}
        <div className="text-center mt-20">
          <Link
            href="/menu"
            className="inline-block bg-amber-700 hover:bg-amber-800 text-white px-10 py-5 text-sm font-bold tracking-[0.2em] uppercase transition-all rounded-sm shadow-lg hover:shadow-2xl hover:-translate-y-1 active:translate-y-0"
          >
            Explore Full Menu
          </Link>
        </div>
      </div>
    </section>
  );
}
