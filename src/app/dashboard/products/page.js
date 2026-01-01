"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, X, Upload, Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { toast } from "sonner";
import Image from "next/image";

const categories = [
  "Birthday Cakes",
  "Cupcakes",
  "Cake Loaves",
  "Pastries & Snacks",
];

const commonFlavors = [
  "Chocolate",
  "Vanilla",
  "Strawberry",
  "Red Velvet",
  "Lemon",
  "Banana",
  "Carrot",
  "Coconut",
  "Coffee",
  "Cookies and Cream",
  "Orange",
];

export default function AddProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    customizationAvailable: false,
    customizationNotes: "",
    isAvailable: true,
  });

  // Price options state
  const [priceOptions, setPriceOptions] = useState([{ label: "", price: "" }]);

  // Flavors state
  const [selectedFlavors, setSelectedFlavors] = useState([]);
  const [customFlavor, setCustomFlavor] = useState("");

  // Handle image selection
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages([...images, ...files]);

    // Create previews
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prev) => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  // Remove image
  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
    setImagePreviews(imagePreviews.filter((_, i) => i !== index));
  };

  // Add price option
  const addPriceOption = () => {
    setPriceOptions([...priceOptions, { label: "", price: "" }]);
  };

  // Remove price option
  const removePriceOption = (index) => {
    setPriceOptions(priceOptions.filter((_, i) => i !== index));
  };

  // Update price option
  const updatePriceOption = (index, field, value) => {
    const updated = [...priceOptions];
    updated[index][field] = value;
    setPriceOptions(updated);
  };

  // Toggle flavor
  const toggleFlavor = (flavor) => {
    if (selectedFlavors.includes(flavor)) {
      setSelectedFlavors(selectedFlavors.filter((f) => f !== flavor));
    } else {
      setSelectedFlavors([...selectedFlavors, flavor]);
    }
  };

  // Add custom flavor
  const addCustomFlavor = () => {
    if (customFlavor.trim() && !selectedFlavors.includes(customFlavor.trim())) {
      setSelectedFlavors([...selectedFlavors, customFlavor.trim()]);
      setCustomFlavor("");
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const loadingToast = toast.loading("Creating product...", {
      description: "Please wait while we upload your product.",
    });

    try {
      const formDataToSend = new FormData();

      formDataToSend.append("name", formData.name);
      formDataToSend.append("category", formData.category);
      formDataToSend.append("description", formData.description);
      formDataToSend.append(
        "customizationAvailable",
        formData.customizationAvailable
      );
      formDataToSend.append("customizationNotes", formData.customizationNotes);
      formDataToSend.append("isAvailable", formData.isAvailable);
      formDataToSend.append("priceOptions", JSON.stringify(priceOptions));
      formDataToSend.append(
        "availableFlavors",
        JSON.stringify(selectedFlavors)
      );

      images.forEach((image) => {
        formDataToSend.append("images", image);
      });

      const response = await fetch("/api/products", {
        method: "POST",
        body: formDataToSend,
      });

      const data = await response.json();
      toast.dismiss(loadingToast);

      if (response.ok) {
        toast.success("Product added successfully!", {
          description: `${formData.name} has been added to your menu.`,
          duration: 4000,
        });
        setTimeout(() => {
          router.push("/dashboard/products");
        }, 1000);
      } else {
        toast.error("Failed to create product", {
          description: data.error || "Something went wrong. Please try again.",
          duration: 5000,
        });
      }
    } catch (error) {
      console.error("Error:", error);
      toast.dismiss(loadingToast);
      toast.error("An error occurred", {
        description:
          "Unable to create product. Please check your connection and try again.",
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header with Back Button */}
      <div className="mb-10">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-4 -ml-2"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Products
        </Button>
        <h1 className="text-4xl font-bold text-gray-900">Add New Product</h1>
        <p className="text-gray-600 mt-2 text-lg">
          Create a new product for your bakery menu
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10">
        {/* Basic Information */}
        <div className="bg-white rounded-xl border-2 border-gray-200 p-8 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
              <span className="text-amber-600 text-xl">📝</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              Basic Information
            </h2>
          </div>

          <div className="space-y-8">
            {/* Product Name */}
            <div>
              <Label htmlFor="name" className="text-base font-semibold">
                Product Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="e.g., Chocolate Birthday Cake"
                className="mt-3 h-12 text-base"
              />
            </div>

            {/* Category - Added more spacing */}
            <div className="pb-2">
              <Label htmlFor="category" className="text-base font-semibold">
                Category <span className="text-red-500">*</span>
              </Label>
              <Select
                required
                value={formData.category}
                onValueChange={(value) =>
                  setFormData({ ...formData, category: value })
                }
              >
                <SelectTrigger className="mt-3 h-12 text-base bg-gray-950 text-gray-100">
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
              <p className="text-sm text-gray-500 mt-2">
                Choose the category this product belongs to
              </p>
            </div>

            {/* Description - Added more spacing above */}
            <div className="pt-4">
              <Label htmlFor="description" className="text-base font-semibold">
                Description
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Describe your product (ingredients, size, serving suggestions)..."
                rows={5}
                className="mt-3 text-base"
              />
              <p className="text-sm text-gray-500 mt-2">
                Optional: Provide detailed information about your product
              </p>
            </div>

            {/* Availability - moved to bottom with more spacing */}
            <div className="pt-6">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <Label
                    htmlFor="isAvailable"
                    className="text-base font-semibold"
                  >
                    Available for Order
                  </Label>
                  <p className="text-sm text-gray-600 mt-1">
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

        {/* Images */}
        <div className="bg-white rounded-xl border-2 border-gray-200 p-8 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-blue-600 text-xl">📸</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Product Images</h2>
          </div>

          <div className="space-y-6">
            <div>
              <Label className="text-base font-semibold">Upload Images</Label>
              <div className="mt-3">
                <label
                  htmlFor="images"
                  className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-amber-300 rounded-xl cursor-pointer hover:bg-amber-50 bg-amber-25 transition-colors"
                >
                  <Upload className="w-10 h-10 text-amber-600 mb-3" />
                  <span className="text-base font-medium text-gray-700">
                    Click to upload images
                  </span>
                  <span className="text-sm text-gray-500 mt-1">
                    PNG, JPG up to 10MB
                  </span>
                  <input
                    id="images"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative group">
                    <Image
                      width={300}
                      height={160}
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-40 object-cover rounded-lg border-2 border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Price Options */}
        <div className="bg-white rounded-xl border-2 border-gray-200 p-8 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-green-600 text-xl">💰</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Price Options</h2>
          </div>

          <div className="space-y-4">
            {priceOptions.map((option, index) => (
              <div key={index} className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <Input
                    placeholder="e.g., 8 Inch - 1 Flavor"
                    value={option.label}
                    onChange={(e) =>
                      updatePriceOption(index, "label", e.target.value)
                    }
                    className="h-11"
                  />
                </div>
                <div className="w-40">
                  <Input
                    type="number"
                    placeholder="Price (GH₵)"
                    value={option.price}
                    onChange={(e) =>
                      updatePriceOption(index, "price", e.target.value)
                    }
                    className="h-11"
                  />
                </div>
                {priceOptions.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removePriceOption(index)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                )}
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              onClick={addPriceOption}
              className="w-full h-12 border-2 border-dashed border-gray-300 hover:border-amber-400 hover:bg-amber-50"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Price Option
            </Button>
          </div>
        </div>

        {/* Available Flavors */}
        <div className="bg-white rounded-xl border-2 border-gray-200 p-8 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <span className="text-purple-600 text-xl">🍰</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              Available Flavors
            </h2>
          </div>

          <div className="space-y-6">
            <div className="flex flex-wrap gap-3">
              {commonFlavors.map((flavor) => (
                <button
                  key={flavor}
                  type="button"
                  onClick={() => toggleFlavor(flavor)}
                  className={`px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                    selectedFlavors.includes(flavor)
                      ? "bg-amber-500 text-white shadow-md scale-105"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {flavor}
                </button>
              ))}
            </div>

            <div className="flex gap-3">
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
                className="h-12"
              />
              <Button
                type="button"
                onClick={addCustomFlavor}
                className="h-12 px-6"
              >
                Add
              </Button>
            </div>

            {selectedFlavors.length > 0 && (
              <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                <p className="text-sm font-semibold text-amber-900 mb-3">
                  Selected Flavors ({selectedFlavors.length}):
                </p>
                <div className="flex flex-wrap gap-2">
                  {selectedFlavors.map((flavor) => (
                    <span
                      key={flavor}
                      className="px-4 py-2 bg-amber-200 text-amber-900 rounded-full text-sm font-medium"
                    >
                      {flavor}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Customization */}
        <div className="bg-white rounded-xl border-2 border-gray-200 p-8 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
              <span className="text-pink-600 text-xl">✨</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              Customization Options
            </h2>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <Label
                  htmlFor="customizationAvailable"
                  className="text-base font-semibold"
                >
                  Customization Available
                </Label>
                <p className="text-sm text-gray-600 mt-1">
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
                  className="text-base font-semibold"
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
                  rows={4}
                  className="mt-2 text-base"
                />
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4 pb-8">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={loading}
            className="h-12 px-8 text-base"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={loading}
            className="h-12 px-8 text-base bg-amber-600 hover:bg-amber-700"
          >
            {loading && <Loader2 className="w-5 h-5 mr-2 animate-spin" />}
            Create Product
          </Button>
        </div>
      </form>
    </div>
  );
}
