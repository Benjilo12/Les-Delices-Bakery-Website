// Skeleton Card UI
export default function ProductSkeleton() {
  return (
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
}
