import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function InventoryFilters({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  categories,
  totalProducts,
  showingCount,
}) {
  return (
    <div className="bg-linear-to-br from-white to-amber-50 rounded-xl border-2 border-amber-200 p-6 shadow-lg">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-amber-500" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 text-lg border-2 border-amber-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
            />
          </div>
        </div>

        <div className="w-full md:w-64">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="h-12 bg-white border-2 border-amber-300 hover:border-amber-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all duration-200">
              <SelectValue className="text-lg text-amber-900" />
            </SelectTrigger>
            <SelectContent className="bg-white border-2 border-amber-300 shadow-lg">
              {categories.map((cat) => (
                <SelectItem
                  key={cat}
                  value={cat}
                  className="text-lg hover:bg-amber-50 focus:bg-amber-50 cursor-pointer transition-colors duration-150 text-amber-900"
                >
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mt-6 flex gap-6">
        <div className="flex items-center gap-2 bg-linear-to-r from-amber-100 to-amber-200 px-4 py-2 rounded-lg border border-amber-300">
          <span className="text-sm font-semibold text-amber-900">
            Total Products:
          </span>
          <span className="text-lg font-bold text-amber-900">
            {totalProducts}
          </span>
        </div>
        <div className="flex items-center gap-2 bg-linear-to-r from-blue-100 to-blue-200 px-4 py-2 rounded-lg border border-blue-300">
          <span className="text-sm font-semibold text-blue-900">Showing:</span>
          <span className="text-lg font-bold text-blue-900">
            {showingCount}
          </span>
        </div>
      </div>
    </div>
  );
}
