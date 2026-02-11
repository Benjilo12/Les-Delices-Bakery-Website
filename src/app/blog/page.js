import BlogPageLoading from "@/components/BlogPageLoading";
import { Suspense } from "react";
import BlogPageContent from "./BlogPageContent";
import Footer from "@/components/Footer";

// Main export with Suspense boundary
export default function BlogPage() {
  return (
    <div> <Suspense fallback={<BlogPageLoading />}>
      <BlogPageContent />
    </Suspense>
    <Footer /></div>
   
  );
}
