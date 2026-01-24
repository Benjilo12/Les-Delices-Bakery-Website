import Image from "next/image";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock, Calendar, User } from "lucide-react";
import Navbar from "@/components/Navbar";

async function getBlog(slug) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/blogs/${slug}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.success ? data.blog : null;
  } catch (error) {
    console.error("Fetch error:", error);
    return null;
  }
}

// ... (keep your imports and getBlog function the same)

export default async function BlogDetailsPage({ params }) {
  const { slug } = await params;
  const blog = await getBlog(slug);

  if (!blog) notFound();

  const formatDate = (dateString) => {
    if (!dateString) return "Recently Published";
    const date = new Date(dateString);
    return isNaN(date.getTime())
      ? "Recently Published"
      : date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        });
  };

  return (
    <>
      {" "}
      {/* ✅ Added Fragment Wrapper */}
      <Navbar />
      {/* Added pt-20 to prevent Navbar from covering the "Back to Journal" link */}
      <article className="min-h-screen bg-[#FDFCFB] pt-10 pb-20 overflow-x-hidden">
        {/* Top Progress Bar - ensure it sits just below or on top of Navbar */}
        <div className="" />

        {/* Navigation & Header */}
        <div className="mx-auto max-w-4xl px-6 pt-12">
          <Link
            href="/blog"
            className="mb-10 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition-colors hover:text-amber-700 group"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Journal
          </Link>

          <header className="text-center">
            <div className="mb-6 flex justify-center">
              <span className="rounded-full bg-amber-100/50 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-amber-900 border border-amber-200">
                {blog.category}
              </span>
            </div>

            <h1 className="mb-8 font-serif text-3xl leading-tight text-gray-900 md:text-5xl lg:text-6xl wrap-break-word">
              {blog.title}
            </h1>

            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 border-y border-gray-100 py-6 text-xs sm:text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-amber-600" />
                <span className="font-semibold text-gray-900">
                  {blog.author?.name || "Les Délices"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-amber-600" />
                <span>{blog.readTime || 1} min read</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-amber-600" />
                <span>{formatDate(blog.publishedAt)}</span>
              </div>
            </div>
          </header>
        </div>

        {/* Featured Image */}
        <div className="mx-auto my-12 max-w-5xl px-4 sm:px-6">
          <div className="relative aspect-video md:aspect-21/9 overflow-hidden rounded-2xl md:rounded-3xl shadow-2xl">
            <Image
              src={blog.featuredImage}
              alt={blog.title}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1200px) 100vw, 1200px"
            />
          </div>
        </div>

        {/* MAIN CONTENT AREA */}
        <div className="mx-auto max-w-2xl px-6 md:max-w-3xl lg:px-0">
          {blog.excerpt && (
            <p className="mb-12 border-l-4 border-amber-500 pl-6 font-serif text-xl italic leading-relaxed text-gray-600 md:text-2xl wrap-break-word">
              &quot;{blog.excerpt}&quot;
            </p>
          )}

          <div
            className="
              prose prose-amber max-w-none
              sm:prose-lg
              md:prose-xl
              prose-headings:font-serif prose-headings:text-gray-900
              prose-p:text-gray-700 prose-p:leading-relaxed prose-p:break-words
              prose-strong:text-amber-900 prose-strong:font-bold
              prose-img:rounded-2xl prose-img:shadow-lg prose-img:mx-auto
              prose-blockquote:border-l-4 prose-blockquote:border-amber-500
              overflow-hidden wrap-break-word
            "
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />

          {/* Tags Section */}
          {blog.tags?.length > 0 && (
            <div className="mt-20 border-t border-gray-100 pt-10">
              <h3 className="mb-6 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                Related Topics
              </h3>
              <div className="flex flex-wrap gap-3">
                {blog.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-xl bg-gray-50 px-4 py-2 text-xs font-bold text-gray-600 border border-gray-100 hover:bg-amber-50 transition-colors"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Payment Gateway Trust Badge */}
          <div className="mt-16 py-8 border-t border-gray-100 flex flex-col items-center">
            <p className="text-xs text-gray-400 uppercase tracking-widest mb-4">
              Secure Payments Accepted
            </p>
            <Image
              src="/images/gateway.png"
              alt="Payment Gateways"
              width={500}
              height={100}
              className="opacity-80 grayscale hover:grayscale-0 transition-all h-auto w-auto"
            />
          </div>
        </div>
      </article>
    </>
  );
}
