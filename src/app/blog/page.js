import BlogPageLoading from "@/components/BlogPageLoading";
import { Suspense } from "react";
import BlogPageContent from "./BlogPageContent";

// Main export with Suspense boundary
export default function BlogPage() {
  return (
    <Suspense fallback={<BlogPageLoading />}>
      <BlogPageContent />
    </Suspense>
  );
}
