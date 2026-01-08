import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

export default function CustomizationSection({ formData, setFormData }) {
  return (
    <div className="bg-white rounded-lg md:rounded-xl border border-gray-200 md:border-2 p-4 md:p-6 lg:p-8 shadow-sm">
      <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
        <div className="w-8 h-8 md:w-10 md:h-10 bg-pink-100 rounded-lg flex items-center justify-center">
          <span className="text-pink-600 text-lg md:text-xl">✨</span>
        </div>
        <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900">
          Customization Options
        </h2>
      </div>

      <div className="space-y-4 md:space-y-6">
        <div className="flex items-center justify-between p-3 md:p-4 bg-gray-50 rounded-lg">
          <div>
            <Label
              htmlFor="customizationAvailable"
              className="text-sm md:text-base font-semibold"
            >
              Customization Available
            </Label>
            <p className="text-xs md:text-sm text-gray-600 mt-1">
              Allow customers to customize this product
            </p>
          </div>
          <Switch
            id="customizationAvailable"
            checked={formData.customizationAvailable}
            onCheckedChange={(checked) =>
              setFormData({ ...formData, customizationAvailable: checked })
            }
          />
        </div>

        {formData.customizationAvailable && (
          <div>
            <Label
              htmlFor="customizationNotes"
              className="text-sm md:text-base font-semibold"
            >
              Customization Notes
            </Label>
            <Textarea
              id="customizationNotes"
              value={formData.customizationNotes}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  customizationNotes: e.target.value,
                })
              }
              placeholder="e.g., Character cakes, edible prints, custom toppers..."
              rows={3}
              className="mt-2 text-sm md:text-base"
            />
          </div>
        )}
      </div>
    </div>
  );
}
