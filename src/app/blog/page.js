"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import Link from "next/link";
import { Search, ChevronRight, ChevronLeft } from "lucide-react";

/**
 * Blog Listing Page
 * Features: Category filtering, keyword search, and pagination.
 */
export default function BlogPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get values from URL params
  const currentCategory = searchParams.get("category") || "";
  const currentSearch = searchParams.get("search") || "";
  const currentPage = parseInt(searchParams.get("page")) || 1;

  const [blogs, setBlogs] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);

  const categories = [
    "Baking Tips",
    "Recipes",
    "Healthy Living",
    "Behind the Scenes",
  ];

  useEffect(() => {
    async function fetchBlogs() {
      setLoading(true);
      try {
        const query = new URLSearchParams({
          page: currentPage.toString(),
          limit: "9",
          ...(currentSearch && { search: currentSearch }),
          ...(currentCategory && { category: currentCategory }),
        });
        const res = await fetch(`/api/blogs?${query}`);
        const data = await res.json();
        if (data.success) {
          setBlogs(data.blogs);
          setPagination(data.pagination);
        }
      } catch (error) {
        console.error("Error loading blogs:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchBlogs();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage, currentCategory, currentSearch]);

  // Function to update URL parameters
  const updateParams = (updates) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    // Reset to page 1 when category or search changes
    if (updates.category !== undefined || updates.search !== undefined) {
      params.set("page", "1");
    }

    router.push(`?${params.toString()}`, { scroll: false });
  };

  const handleCategoryChange = (cat) => updateParams({ category: cat });
  const handleSearchChange = (searchTerm) =>
    updateParams({ search: searchTerm });
  const handlePageChange = (pageNum) =>
    updateParams({ page: pageNum.toString() });

  return (
    <div className="min-h-screen bg-[#FDFCFB] overflow-x-hidden">
      <Navbar />

      {/* Hero Header */}
      <header className="pt-40 pb-20 px-6">
        <div className="max-w-7xl mx-auto border-b border-gray-100 pb-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="max-w-2xl">
              <span className="text-amber-700 font-bold uppercase tracking-[0.4em] text-[10px] mb-4 block">
                The Flourish Journal
              </span>
              <h1 className="text-5xl md:text-7xl font-serif text-gray-900 leading-[1.1]">
                Refined <span className="italic text-amber-700">Insights</span>{" "}
                <br />
                for the Modern Baker
              </h1>
            </div>
            <p className="text-gray-500 max-w-xs text-sm leading-relaxed pb-2 italic font-light">
              &quot;Baking is both an art and a science; we share the secrets to
              both.&quot;
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 pb-32">
        {/* Filters & Search */}
        <div className="flex flex-col lg:flex-row gap-8 items-start lg:items-center justify-between mb-20">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => handleCategoryChange("")}
              className={`px-6 py-2.5 rounded-full text-[10px] font-bold tracking-widest uppercase transition-all border ${
                !currentCategory
                  ? "bg-gray-900 text-white border-gray-900"
                  : "bg-transparent text-gray-400 border-gray-200 hover:border-gray-900"
              }`}
            >
              All Stories
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`px-6 py-2.5 rounded-full text-[10px] font-bold tracking-widest uppercase transition-all border ${
                  currentCategory === cat
                    ? "bg-amber-700 text-white border-amber-700"
                    : "bg-transparent text-gray-400 border-gray-200 hover:border-amber-700"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full lg:w-80">
            <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
            <input
              type="text"
              placeholder="Search by keyword..."
              className="w-full pl-8 pr-4 py-2 bg-transparent border-b border-gray-100 focus:border-amber-700 outline-none text-sm transition-all placeholder:text-gray-300"
              value={currentSearch}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
          </div>
        </div>

        {/* Blog Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-20">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse space-y-6">
                <div className="bg-gray-100 aspect-[3/4] rounded-2xl" />
                <div className="space-y-3">
                  <div className="h-3 bg-gray-100 w-1/4 rounded" />
                  <div className="h-6 bg-gray-100 w-3/4 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : blogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-24">
            {blogs.map((blog) => (
              <Link
                key={blog._id}
                href={`/blog/${blog.slug}`} // Ensure your folder is named 'blog'
                className="group block"
              >
                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-8 bg-[#FAF9F6] shadow-sm">
                  <Image
                    src={blog.featuredImage || "/placeholder-cake.jpg"}
                    alt={blog.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />
                </div>

                <div className="space-y-4">
                  <span className="text-amber-700 text-[10px] font-bold uppercase tracking-[0.2em]">
                    {blog.category}
                  </span>
                  <h3 className="text-2xl font-serif text-gray-900 group-hover:text-amber-800 transition-colors leading-tight">
                    {blog.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 font-light">
                    {blog.excerpt}
                  </p>
                  <div className="pt-2 flex items-center gap-2 text-gray-900 group-hover:text-amber-700 font-bold text-[10px] uppercase tracking-[0.2em] transition-colors">
                    Read Story
                    <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-40">
            <p className="font-serif italic text-2xl text-gray-300">
              No stories found in this batch.
            </p>
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="mt-32 flex justify-center items-center gap-12 border-t border-gray-100 pt-16">
            <button
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              disabled={!pagination.hasPrevPage}
              className="group p-2 disabled:opacity-10 hover:text-amber-700 transition-all"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <div className="flex items-center gap-8">
              {[...Array(pagination.totalPages)].map((_, i) => {
                const pageNum = i + 1;
                return (
                  <button
                    key={i}
                    onClick={() => handlePageChange(pageNum)}
                    className={`text-[10px] font-bold tracking-widest transition-all ${
                      currentPage === pageNum
                        ? "text-amber-700 scale-150"
                        : "text-gray-300 hover:text-gray-900"
                    }`}
                  >
                    {pageNum < 10 ? `0${pageNum}` : pageNum}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() =>
                handlePageChange(
                  Math.min(pagination.totalPages, currentPage + 1),
                )
              }
              disabled={!pagination.hasNextPage}
              className="group p-2 disabled:opacity-10 hover:text-amber-700 transition-all"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
