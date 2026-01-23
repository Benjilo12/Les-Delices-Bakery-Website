"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  Calendar,
  Clock,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";

export default function BlogPage() {
  const [blogs, setBlogs] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);

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
        // limit is now set to 9
        const query = new URLSearchParams({
          page: page.toString(),
          limit: "9",
          ...(search && { search }),
          ...(category && { category }),
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
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page, category, search]);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Header */}
      <header className="pt-40 pb-20 px-4">
        <div className="max-w-7xl mx-auto border-b border-gray-100 pb-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="max-w-2xl">
              <span className="text-amber-700 font-bold uppercase tracking-[0.4em] text-[10px] mb-4 block">
                The Flourish Journal
              </span>
              <h1 className="text-5xl md:text-7xl font-serif text-gray-900 leading-tight">
                Refined <span className="italic text-amber-700">Insights</span>{" "}
                <br />
                for the Modern Baker
              </h1>
            </div>
            <p className="text-gray-500 max-w-xs text-sm leading-relaxed pb-2 italic">
              &quot;Baking is both an art and a science; we share the secrets to
              both.&quot;
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 pb-32">
        {/* Filters */}
        <div className="flex flex-col lg:flex-row gap-8 items-start lg:items-center justify-between mb-16">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => {
                setCategory("");
                setPage(1);
              }}
              className={`px-5 py-2 rounded-full text-[10px] font-bold tracking-widest uppercase transition-all border ${!category ? "bg-gray-900 text-white border-gray-900" : "bg-transparent text-gray-400 border-gray-200 hover:border-gray-900"}`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setCategory(cat);
                  setPage(1);
                }}
                className={`px-5 py-2 rounded-full text-[10px] font-bold tracking-widest uppercase transition-all border ${category === cat ? "bg-amber-700 text-white border-amber-700" : "bg-transparent text-gray-400 border-gray-200 hover:border-amber-700"}`}
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
              className="w-full pl-8 pr-4 py-2 bg-transparent border-b border-gray-100 focus:border-amber-700 outline-none text-sm transition-all"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>
        </div>

        {/* Blog Grid (Showing 9 items) */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse space-y-6">
                <div className="bg-gray-50 aspect-3/4 rounded-2xl" />
                <div className="h-4 bg-gray-50 w-1/2 rounded" />
              </div>
            ))}
          </div>
        ) : blogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-20">
            {blogs.map((blog) => (
              <Link
                key={blog._id}
                href={`/blogs/${blog.slug}`}
                className="group"
              >
                <div className="relative aspect-3/4 rounded-2xl overflow-hidden mb-8 bg-[#FAF9F6]">
                  <Image
                    src={blog.featuredImage || "/placeholder-cake.jpg"}
                    alt={blog.title}
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-amber-900/0 group-hover:bg-amber-900/5 transition-colors duration-500" />
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
                  <div className="pt-2 flex items-center gap-2 text-gray-900 group-hover:text-amber-700 font-bold text-xs uppercase tracking-widest transition-colors">
                    Read Post{" "}
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-40">
            <p className="font-serif italic text-xl text-gray-400">
              No stories found in this batch.
            </p>
          </div>
        )}

        {/* Pagination Section - Logic for 9 items per page */}
        {pagination.totalPages > 1 && (
          <div className="mt-32 flex justify-center items-center gap-8 border-t border-gray-100 pt-12">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={!pagination.hasPrevPage}
              className="group p-2 disabled:opacity-20 hover:text-amber-700 transition-all"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <div className="flex items-center gap-6">
              {[...Array(pagination.totalPages)].map((_, i) => {
                const pageNum = i + 1;
                return (
                  <button
                    key={i}
                    onClick={() => setPage(pageNum)}
                    className={`text-xs font-bold transition-all ${page === pageNum ? "text-amber-700 scale-125" : "text-gray-300 hover:text-gray-900"}`}
                  >
                    {pageNum < 10 ? `0${pageNum}` : pageNum}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() =>
                setPage((p) => Math.min(pagination.totalPages, p + 1))
              }
              disabled={!pagination.hasNextPage}
              className="group p-2 disabled:opacity-20 hover:text-amber-700 transition-all"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
