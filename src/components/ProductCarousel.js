"use client";

import { useState, useEffect, useRef } from "react";
import ProductCard from "./ProductCard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Highlighter } from "./ui/highlighter";

export default function ProductCarousel() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slidesPerView, setSlidesPerView] = useState(4);
  const carouselRef = useRef(null);

  // Fetch products
  useEffect(() => {
    fetchProducts();
    updateSlidesPerView();
    window.addEventListener("resize", updateSlidesPerView);

    return () => window.removeEventListener("resize", updateSlidesPerView);
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      // Fetch first 8 products
      const response = await fetch("/api/products?limit=8");
      const data = await response.json();

      if (data.success) {
        setProducts(data.products);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateSlidesPerView = () => {
    if (typeof window === "undefined") return;

    const width = window.innerWidth;
    if (width < 640) {
      setSlidesPerView(1); // mobile
    } else if (width < 1024) {
      setSlidesPerView(2); // tablet
    } else if (width < 1280) {
      setSlidesPerView(3); // laptop
    } else {
      setSlidesPerView(4); // desktop
    }
  };

  const nextSlide = () => {
    const maxSlides = Math.max(
      0,
      Math.ceil(products.length / slidesPerView) - 1
    );
    setCurrentSlide((prev) => (prev >= maxSlides ? 0 : prev + 1));
  };

  const prevSlide = () => {
    const maxSlides = Math.max(
      0,
      Math.ceil(products.length / slidesPerView) - 1
    );
    setCurrentSlide((prev) => (prev <= 0 ? maxSlides : prev - 1));
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className="py-16 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="h-12 bg-gray-200 rounded w-1/3 mx-auto mb-4 animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-square bg-gray-200 mb-6"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                <div className="h-6 bg-gray-200 rounded w-1/3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="py-16 px-6 max-w-7xl mx-auto text-center">
        <div className="flex items-center justify-center gap-4 mb-16">
          <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center">
            <span className="text-white text-2xl">👑</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-serif italic text-gray-900">
            Our signature French collection
          </h2>
        </div>
        <div className="bg-gray-50 rounded-2xl p-12 max-w-md mx-auto">
          <div className="text-6xl mb-4">🍰</div>
          <p className="text-gray-600 mb-2">No cakes available at the moment</p>
          <p className="text-sm text-gray-500">
            Check back soon for delicious treats!
          </p>
        </div>
      </div>
    );
  }

  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-400 mx-auto px-6">
        {/* Section Title with Crown Icon */}
        <div className="flex items-center justify-center gap-4 mb-16">
          <div className="w-14 h-14 bg-gray-800 rounded-full flex items-center justify-center shrink-0">
            <svg
              className="w-7 h-7 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
            </svg>
          </div>
          <h2 className="text-3xl md:text-5xl font-serif italic text-gray-900">
            Our signature{" "}
            <span className="mr-2 text-pink-900">
              <Highlighter action="highlight" color="#FFD54F">
                French
              </Highlighter>
            </span>
            collection
          </h2>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Navigation Buttons - Visible on desktop */}
          <button
            onClick={prevSlide}
            className="hidden lg:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-16 z-10 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all border border-gray-200 hover:bg-gray-50 items-center justify-center"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6 text-gray-900" />
          </button>

          <button
            onClick={nextSlide}
            className="hidden lg:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-16 z-10 bg-amber-700 rounded-full p-3 shadow-lg hover:shadow-xl transition-all border border-amber-900 hover:bg-amber-800 items-center justify-center cursor-pointer"
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>

          {/* Carousel Track */}
          <div ref={carouselRef} className="overflow-hidden">
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
                  className="shrink-0 px-3"
                  style={{ width: `${100 / slidesPerView}%` }}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>

          {/* Mobile Navigation Buttons */}
          <div className="flex justify-center lg:hidden mt-8 gap-3">
            <button
              onClick={prevSlide}
              className="p-3 rounded-full bg-white border border-gray-300 shadow-sm hover:bg-gray-50"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-5 h-5 text-gray-900" />
            </button>
            <button
              onClick={nextSlide}
              className="p-3 rounded-full bg-gray-900 border border-gray-900 shadow-sm hover:bg-gray-800"
              aria-label="Next slide"
            >
              <ChevronRight className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* View Collection Button */}
        <div className="text-center mt-16">
          <button className="bg-amber-700 hover:bg-amber-800 text-white px-8 py-4 text-sm font-medium tracking-widest uppercase transition-colors rounded cursor-pointer shadow-lg hover:shadow-xl">
            VIEW SIGNATURE COLLECTION
          </button>
        </div>
      </div>
    </section>
  );
}
