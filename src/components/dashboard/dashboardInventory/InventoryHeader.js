import { Package, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function InventoryHeader({ router }) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
          <Package className="w-10 h-10 text-amber-600" />
          Inventory
        </h1>
        <p className="text-gray-600 mt-2 text-lg">
          Manage your bakery products and stock
        </p>
      </div>
      <Button
        onClick={() => router.push("/dashboard/products")}
        className="h-12 px-6 bg-linear-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 shadow-lg cursor-pointer"
      >
        <Plus className="w-5 h-5 mr-2" />
        Add Product
      </Button>
    </div>
  );
}
