export default function LoadingState() {
  return (
    <div className="bg-linear-to-br from-white to-amber-50 rounded-xl border-2 border-amber-200 p-12 text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
      <p className="text-amber-800 mt-4 text-lg font-medium">
        Loading products...
      </p>
    </div>
  );
}
