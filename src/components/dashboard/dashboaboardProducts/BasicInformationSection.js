import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

export default function BasicInformationSection({
  formData,
  setFormData,
  categories,
}) {
  return (
    <div className="bg-white rounded-lg md:rounded-xl border border-gray-200 md:border-2 p-4 md:p-6 lg:p-8 shadow-sm">
      <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
        <div className="w-8 h-8 md:w-10 md:h-10 bg-amber-100 rounded-lg flex items-center justify-center">
          <span className="text-amber-600 text-lg md:text-xl">📝</span>
        </div>
        <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900">
          Basic Information
        </h2>
      </div>

      <div className="space-y-4 md:space-y-6">
        <div>
          <Label htmlFor="name" className="text-sm md:text-base font-semibold">
            Product Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="name"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g., Chocolate Birthday Cake"
            className="mt-2 h-10 md:h-12 text-sm md:text-base"
          />
        </div>

        <div>
          <Label
            htmlFor="category"
            className="text-sm md:text-base font-semibold"
          >
            Category <span className="text-red-500">*</span>
          </Label>
          <Select
            required
            value={formData.category}
            onValueChange={(value) =>
              setFormData({ ...formData, category: value })
            }
          >
            <SelectTrigger className="mt-2 h-10 md:h-12 text-sm md:text-base bg-gray-950 text-gray-100">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 text-gray-100">
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs md:text-sm text-gray-500 mt-1">
            Choose the category this product belongs to
          </p>
        </div>

        <div>
          <Label
            htmlFor="description"
            className="text-sm md:text-base font-semibold"
          >
            Description
          </Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            placeholder="Describe your product (ingredients, size, serving suggestions)..."
            rows={3}
            className="mt-2 text-sm md:text-base"
          />
          <p className="text-xs md:text-sm text-gray-500 mt-1">
            Optional: Provide detailed information about your product
          </p>
        </div>

        <div>
          <div className="flex items-center justify-between p-3 md:p-4 bg-gray-50 rounded-lg">
            <div>
              <Label
                htmlFor="isAvailable"
                className="text-sm md:text-base font-semibold"
              >
                Available for Order
              </Label>
              <p className="text-xs md:text-sm text-gray-600 mt-1">
                Customers can order this product
              </p>
            </div>
            <Switch
              id="isAvailable"
              checked={formData.isAvailable}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, isAvailable: checked })
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}
