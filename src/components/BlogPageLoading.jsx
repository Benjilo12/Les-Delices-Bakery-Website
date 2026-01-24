import Navbar from "./Navbar";

// Loading component for Suspense
export default function BlogPageLoading() {
  return (
    <div className="min-h-screen bg-[#FDFCFB] overflow-x-hidden">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 pt-40 pb-32">
        <div className="animate-pulse">
          {/* Header skeleton */}
          <div className="mb-20">
            <div className="h-4 w-48 bg-gray-200 rounded mb-6"></div>
            <div className="h-16 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>

          {/* Filters skeleton */}
          <div className="flex gap-3 mb-20">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-10 w-24 bg-gray-200 rounded-full"></div>
            ))}
          </div>

          {/* Blog grid skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-24">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-6">
                <div className="bg-gray-200 aspect-3/4 rounded-2xl"></div>
                <div className="space-y-3">
                  <div className="h-3 bg-gray-200 w-1/4 rounded"></div>
                  <div className="h-6 bg-gray-200 w-3/4 rounded"></div>
                  <div className="h-4 bg-gray-200 w-full rounded"></div>
                  <div className="h-4 bg-gray-200 w-2/3 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
