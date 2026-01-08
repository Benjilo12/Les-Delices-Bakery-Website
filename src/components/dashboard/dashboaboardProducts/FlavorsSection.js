import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function FlavorsSection({
  commonFlavors,
  selectedFlavors,
  setSelectedFlavors,
  customFlavor,
  setCustomFlavor,
}) {
  const toggleFlavor = (flavor) => {
    if (selectedFlavors.includes(flavor)) {
      setSelectedFlavors(selectedFlavors.filter((f) => f !== flavor));
    } else {
      setSelectedFlavors([...selectedFlavors, flavor]);
    }
  };

  const addCustomFlavor = () => {
    if (customFlavor.trim() && !selectedFlavors.includes(customFlavor.trim())) {
      setSelectedFlavors([...selectedFlavors, customFlavor.trim()]);
      setCustomFlavor("");
    }
  };

  return (
    <div className="bg-white rounded-lg md:rounded-xl border border-gray-200 md:border-2 p-4 md:p-6 lg:p-8 shadow-sm">
      <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
        <div className="w-8 h-8 md:w-10 md:h-10 bg-purple-100 rounded-lg flex items-center justify-center">
          <span className="text-purple-600 text-lg md:text-xl">🍰</span>
        </div>
        <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900">
          Available Flavors
        </h2>
      </div>

      <div className="space-y-4 md:space-y-6">
        <div className="flex flex-wrap gap-2 md:gap-3">
          {commonFlavors.map((flavor) => (
            <button
              key={flavor}
              type="button"
              onClick={() => toggleFlavor(flavor)}
              className={`px-3 py-1.5 md:px-4 md:py-2.5 rounded-lg text-xs md:text-sm font-medium md:font-semibold transition-all ${
                selectedFlavors.includes(flavor)
                  ? "bg-amber-500 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {flavor}
            </button>
          ))}
        </div>

        <div className="flex flex-col md:flex-row gap-2 md:gap-3">
          <Input
            placeholder="Add custom flavor..."
            value={customFlavor}
            onChange={(e) => setCustomFlavor(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addCustomFlavor();
              }
            }}
            className="h-10 md:h-12 text-sm md:text-base"
          />
          <Button
            type="button"
            onClick={addCustomFlavor}
            className="h-10 md:h-12 px-4 md:px-6 text-sm md:text-base"
          >
            Add
          </Button>
        </div>

        {selectedFlavors.length > 0 && (
          <div className="p-3 md:p-4 bg-amber-50 rounded-lg border border-amber-200">
            <p className="text-xs md:text-sm font-semibold text-amber-900 mb-2 md:mb-3">
              Selected Flavors ({selectedFlavors.length}):
            </p>
            <div className="flex flex-wrap gap-1.5 md:gap-2">
              {selectedFlavors.map((flavor) => (
                <span
                  key={flavor}
                  className="px-3 py-1 md:px-4 md:py-2 bg-amber-200 text-amber-900 rounded-full text-xs md:text-sm font-medium"
                >
                  {flavor}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
