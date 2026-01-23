"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, ArrowRight, Clock, Tag } from "lucide-react";

export default function BlogSection() {
  const [data, setData] = useState({ latestBlog: null, recentBlogs: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBlogs() {
      try {
        const res = await fetch("/api/blogs?limit=3");
        const json = await res.json();

        if (json.success) {
          setData({
            latestBlog: json.latestBlog,
            recentBlogs: json.blogs.slice(1, 3),
          });
        }
      } catch (err) {
        console.error("Failed to load blogs", err);
      } finally {
        setLoading(false);
      }
    }
    fetchBlogs();
  }, []);

  if (loading) {
    return (
      <div className="py-24 bg-linear-to-b from-[#FAF3E0] to-[#F5E6CA] text-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-10 bg-amber-100 w-64 rounded-full mb-4"></div>
          <div className="h-4 bg-amber-50 w-96 rounded-full"></div>
        </div>
      </div>
    );
  }

  if (!data.latestBlog) return null;

  return (
    <section className="py-24 bg-linear-to-b from-[#FAF3E0] to-[#F5E6CA] relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-100/40 rounded-full blur-3xl -mr-48 -mt-48" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-amber-100/30 rounded-full blur-3xl -ml-36 -mb-36" />

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Modern Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="h-px w-8 bg-amber-700"></span>
              <span className="text-amber-800 font-bold uppercase tracking-widest text-xs">
                The Flourish Blog
              </span>
            </div>
            <h2 className="text-4xl md:text-6xl font-serif text-gray-900 leading-tight">
              Wholesome <span className="italic text-amber-700">Stories</span> &{" "}
              <br />
              Baking Secrets
            </h2>
          </div>

          <Link
            href="/blogs"
            className="group flex items-center gap-3 bg-linear-to-r from-amber-700 to-amber-800 text-white px-6 py-3 rounded-full font-medium hover:from-amber-800 hover:to-amber-900 transition-all shadow-lg hover:shadow-xl"
          >
            <span className="font-medium">Explore all articles</span>
            <div className="bg-white/20 rounded-full p-1.5">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Featured Article */}
          <div className="lg:col-span-8 relative group">
            <Link href={`/blogs/${data.latestBlog.slug}`} className="block">
              <div className="relative h-100 md:h-150 rounded-4xl overflow-hidden shadow-2xl">
                <Image
                  src={data.latestBlog.featuredImage || "/placeholder-cake.jpg"}
                  alt={data.latestBlog.title}
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />

                {/* Floating Badge */}
                <div className="absolute top-6 left-6 bg-linear-to-r from-amber-600 to-amber-700 text-white px-4 py-2 rounded-full shadow-lg">
                  <span className="text-white text-xs font-bold uppercase tracking-tighter flex items-center gap-2">
                    <Tag className="w-3 h-3" />{" "}
                    {data.latestBlog.category || "Feature"}
                  </span>
                </div>
              </div>

              {/* Overlapping Content Box */}
              <div className="relative -mt-20 mx-6 md:mx-12 p-8 md:p-10 bg-white rounded-3xl shadow-xl border border-amber-50 group-hover:border-amber-200 transition-colors">
                <div className="flex items-center gap-4 text-gray-400 text-sm mb-4">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />{" "}
                    {data.latestBlog.readTime || "5 min read"}
                  </span>
                  <span>•</span>
                  <span>By Les Délices Team</span>
                </div>
                <h3 className="text-2xl md:text-4xl font-serif text-gray-900 mb-4 group-hover:text-sky-800 transition-colors">
                  {data.latestBlog.title}
                </h3>
                <p className="text-gray-600 line-clamp-2 md:text-lg italic">
                  &quot;{data.latestBlog.excerpt}&quot;
                </p>
                <div className="mt-6 inline-flex items-center gap-2 text-amber-700 font-bold hover:text-amber-800 transition-colors">
                  Read Full Article <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          </div>

          {/* Sidebar Articles */}
          <div className="lg:col-span-4 space-y-10">
            <h4 className="text-sm font-bold text-amber-900 uppercase tracking-widest border-b border-amber-100 pb-4">
              More Recent Crumbs
            </h4>

            {data.recentBlogs.map((blog) => (
              <Link
                key={blog._id}
                href={`/blogs/${blog.slug}`}
                className="group block bg-white/80 hover:bg-white p-5 rounded-2xl border border-amber-100 hover:border-amber-200 transition-all hover:shadow-lg"
              >
                <div className="flex gap-6 items-start">
                  <div className="relative w-20 h-20 shrink-0 rounded-xl overflow-hidden shadow-md">
                    <Image
                      src={blog.featuredImage || "/placeholder-cake.jpg"}
                      alt={blog.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <div className="space-y-2 flex-1">
                    <span className="inline-block px-2 py-1 bg-amber-50 text-amber-700 text-[10px] font-bold uppercase tracking-widest rounded-full">
                      {blog.category}
                    </span>
                    <h5 className="font-bold text-gray-900 group-hover:text-sky-800 transition-colors line-clamp-2 leading-snug">
                      {blog.title}
                    </h5>
                    <div className="flex items-center text-xs text-amber-600 font-medium gap-1 mt-2">
                      Read Article{" "}
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}

            {/* View All Button (replaces newsletter) */}
            <div className="mt-8">
              <Link
                href="/blogs"
                className="group block bg-linear-to-r from-amber-700 to-amber-800 text-white p-6 rounded-2xl hover:from-amber-800 hover:to-amber-900 transition-all shadow-lg hover:shadow-xl text-center"
              >
                <div className="flex flex-col items-center">
                  <span className="text-xl font-serif italic mb-2">
                    Discover More Baking Secrets
                  </span>
                  <span className="text-sm font-medium flex items-center gap-2">
                    View All Articles{" "}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
