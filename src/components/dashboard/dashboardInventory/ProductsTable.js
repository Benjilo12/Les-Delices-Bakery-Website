import { Package, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

export default function ProductsTable({
  products,
  openDeleteDialog,
  pagination,
  fetchProducts,
}) {
  return (
    <div className="bg-linear-to-br from-white to-amber-50 rounded-xl border-2 border-amber-200 overflow-hidden shadow-lg">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-linear-to-r from-amber-500 to-amber-600">
            <tr>
              <th className="px-6 py-4 text-left text-lg font-bold text-white">
                Product
              </th>
              <th className="px-6 py-4 text-left text-lg font-bold text-white">
                Category
              </th>
              <th className="px-6 py-4 text-left text-lg font-bold text-white">
                Prices
              </th>
              <th className="px-6 py-4 text-left text-lg font-bold text-white">
                Status
              </th>
              <th className="px-6 py-4 text-left text-lg font-bold text-white">
                Flavors
              </th>
              <th className="px-6 py-4 text-right text-lg font-bold text-white">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-amber-100">
            {products.map((product) => (
              <tr
                key={product._id}
                className="hover:bg-amber-50/70 transition-all duration-200"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-linear-to-br from-amber-100 to-amber-200 shrink-0 border-2 border-amber-300 relative">
                      {product.images && product.images[0] ? (
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          fill
                          sizes="(max-width: 64px) 64px"
                          className="object-cover"
                          unoptimized={product.images[0].includes(
                            "imagekit.io"
                          )}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="w-8 h-8 text-amber-500" />
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-amber-900 text-lg">
                        {product.name}
                      </p>
                      {product.description && (
                        <p className="text-sm text-amber-700 truncate max-w-xs">
                          {product.description}
                        </p>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <Badge className="bg-linear-to-r from-amber-100 to-amber-200 text-amber-900 border border-amber-300 text-sm font-semibold">
                    {product.category}
                  </Badge>
                </td>
                <td className="px-6 py-4">
                  {product.priceOptions && product.priceOptions.length > 0 ? (
                    <div className="space-y-1">
                      {product.priceOptions.slice(0, 2).map((option, idx) => (
                        <p key={idx} className="text-sm text-amber-900">
                          <span className="font-bold">GH₵ {option.price}</span>
                          <span className="text-amber-600 text-xs ml-1">
                            ({option.label})
                          </span>
                        </p>
                      ))}
                      {product.priceOptions.length > 2 && (
                        <p className="text-xs text-amber-500">
                          +{product.priceOptions.length - 2} more
                        </p>
                      )}
                    </div>
                  ) : (
                    <span className="text-sm text-amber-500 italic">
                      No prices set
                    </span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <Badge
                    className={
                      product.isAvailable
                        ? "bg-linear-to-r from-green-100 to-green-200 text-green-900 border border-green-300 font-semibold"
                        : "bg-linear-to-r from-red-100 to-red-200 text-red-900 border border-red-300 font-semibold"
                    }
                  >
                    {product.isAvailable ? "Available" : "Unavailable"}
                  </Badge>
                </td>
                <td className="px-6 py-4">
                  {product.availableFlavors &&
                  product.availableFlavors.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {product.availableFlavors
                        .slice(0, 2)
                        .map((flavor, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-linear-to-r from-purple-100 to-purple-200 text-purple-900 text-xs rounded-full border border-purple-300"
                          >
                            {flavor}
                          </span>
                        ))}
                      {product.availableFlavors.length > 2 && (
                        <span className="text-xs text-amber-500 ml-1 font-medium">
                          +{product.availableFlavors.length - 2}
                        </span>
                      )}
                    </div>
                  ) : (
                    <span className="text-sm text-amber-500 italic">None</span>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openDeleteDialog(product)}
                    className="bg-linear-to-r from-red-50 to-red-100 hover:from-red-100 hover:to-red-200 text-red-600 hover:text-red-700 border border-red-300 hover:border-red-400"
                    title="Delete Product"
                  >
                    <Trash2 className="w-5 h-5" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pagination.totalPages > 1 && (
        <div className="border-t-2 border-amber-200 p-4 flex items-center justify-between bg-linear-to-r from-amber-50 to-white">
          <p className="text-sm text-amber-700 font-medium">
            Page {pagination.currentPage} of {pagination.totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => fetchProducts(pagination.currentPage - 1)}
              disabled={!pagination.hasPrevPage}
              className="border-amber-300 text-amber-700 hover:bg-amber-50 hover:text-amber-800 font-medium"
            >
              Previous
            </Button>
            <Button
              variant="outline"
              onClick={() => fetchProducts(pagination.currentPage + 1)}
              disabled={!pagination.hasNextPage}
              className="border-amber-300 text-amber-700 hover:bg-amber-50 hover:text-amber-800 font-medium"
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
