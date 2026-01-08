import { AlertCircle, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function EmptyState({ router }) {
  return (
    <div className="bg-linear-to-br from-white to-amber-50 rounded-xl border-2 border-amber-200 p-12 text-center">
      <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <AlertCircle className="w-10 h-10 text-amber-600" />
      </div>
      <h3 className="text-2xl font-bold text-amber-900 mb-2">
        No Products Found
      </h3>
      <p className="text-amber-700 mb-6 text-lg">
        Try adjusting your filters or add a new product.
      </p>
      <Button
        onClick={() => router.push("/dashboard/products")}
        className="bg-linear-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 h-12 px-8 text-lg shadow-lg"
      >
        <Plus className="w-5 h-5 mr-2" />
        Add Your First Product
      </Button>
    </div>
  );
}
