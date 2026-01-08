import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function PriceOptionsSection({ priceOptions, setPriceOptions }) {
  const addPriceOption = () => {
    setPriceOptions([...priceOptions, { label: "", price: "" }]);
  };

  const removePriceOption = (index) => {
    setPriceOptions(priceOptions.filter((_, i) => i !== index));
  };

  const updatePriceOption = (index, field, value) => {
    const updated = [...priceOptions];
    updated[index][field] = value;
    setPriceOptions(updated);
  };

  return (
    <div className="bg-white rounded-lg md:rounded-xl border border-gray-200 md:border-2 p-4 md:p-6 lg:p-8 shadow-sm">
      <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
        <div className="w-8 h-8 md:w-10 md:h-10 bg-green-100 rounded-lg flex items-center justify-center">
          <span className="text-green-600 text-lg md:text-xl">💰</span>
        </div>
        <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900">
          Price Options
        </h2>
      </div>

      <div className="space-y-3 md:space-y-4">
        {priceOptions.map((option, index) => (
          <div
            key={index}
            className="flex flex-col md:flex-row gap-2 md:gap-4 p-3 md:p-4 bg-gray-50 rounded-lg"
          >
            <div className="flex-1">
              <Input
                placeholder="e.g., 8 Inch - 1 Flavor"
                value={option.label}
                onChange={(e) =>
                  updatePriceOption(index, "label", e.target.value)
                }
                className="h-9 md:h-11"
              />
            </div>
            <div className="flex gap-2">
              <div className="flex-1 md:w-40">
                <Input
                  type="number"
                  placeholder="Price (GH₵)"
                  value={option.price}
                  onChange={(e) =>
                    updatePriceOption(index, "price", e.target.value)
                  }
                  className="h-9 md:h-11"
                />
              </div>
              {priceOptions.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removePriceOption(index)}
                  className="h-9 w-9 md:h-11 md:w-11 text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <X className="w-4 h-4 md:w-5 md:h-5" />
                </Button>
              )}
            </div>
          </div>
        ))}

        <Button
          type="button"
          variant="outline"
          onClick={addPriceOption}
          className="w-full h-10 md:h-12 border border-dashed md:border-2 border-gray-300 hover:border-amber-400 hover:bg-amber-50 text-sm md:text-base"
        >
          <Plus className="w-4 h-4 md:w-5 md:h-5 mr-2" />
          Add Price Option
        </Button>
      </div>
    </div>
  );
}
