import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function ProductFormHeader({ router }) {
  return (
    <div className="mb-6 md:mb-8">
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="mb-3 -ml-2"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Products
      </Button>
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
        Add New Product
      </h1>
      <p className="text-gray-600 mt-1 md:mt-2 text-sm md:text-base">
        Create a new product for your bakery menu
      </p>
    </div>
  );
}
