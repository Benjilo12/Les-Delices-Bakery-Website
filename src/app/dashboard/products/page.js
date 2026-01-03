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
  "Wedding Cakes",
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

// Function to reset all form states
const resetForm = () => {
  return {
    name: "",
    category: "",
    description: "",
    customizationAvailable: false,
    customizationNotes: "",
    isAvailable: true,
  };
};

export default function AddProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  // Form state
  const [formData, setFormData] = useState(resetForm());

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

  // Reset all form fields
  const resetAllFields = () => {
    setFormData(resetForm());
    setPriceOptions([{ label: "", price: "" }]);
    setSelectedFlavors([]);
    setImages([]);
    setImagePreviews([]);
    setCustomFlavor("");
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const loadingToast = toast.loading("Creating product...", {
      description: "Please wait while we upload your product.",
      style: {
        background: "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)",
        border: "1px solid #fbbf24",
        color: "#92400e",
        fontWeight: 600,
      },
      icon: (
        <div className="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center">
          <Loader2 className="w-4 h-4 text-white animate-spin" />
        </div>
      ),
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
        // Show success toast with custom styling
        toast.success("Product added successfully!", {
          description: `${formData.name} has been added to your menu.`,
          duration: 4000,
          style: {
            background: "linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)",
            border: "1px solid #10b981",
            color: "#065f46",
            fontWeight: 600,
          },
          icon: (
            <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          ),
        });

        // Reset all form fields
        resetAllFields();

        // Option 1: Redirect after delay
        setTimeout(() => {
          router.push("/dashboard/products");
        }, 1500);

        // Option 2: Stay on page with reset form (uncomment if you want to stay)
        // setTimeout(() => {
        //   // Form is already reset, user can add another product
        // }, 1000);
      } else {
        toast.error("Failed to create product", {
          description: data.error || "Something went wrong. Please try again.",
          duration: 5000,
          style: {
            background: "linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)",
            border: "1px solid #ef4444",
            color: "#7f1d1d",
            fontWeight: 600,
          },
          icon: (
            <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center">
              <X className="w-4 h-4 text-white" />
            </div>
          ),
        });
      }
    } catch (error) {
      console.error("Error:", error);
      toast.dismiss(loadingToast);
      toast.error("An error occurred", {
        description:
          "Unable to create product. Please check your connection and try again.",
        duration: 5000,
        style: {
          background: "linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)",
          border: "1px solid #ef4444",
          color: "#7f1d1d",
          fontWeight: 600,
        },
        icon: (
          <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center">
            <X className="w-4 h-4 text-white" />
          </div>
        ),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* Header with Back Button */}
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

      <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
        {/* Basic Information */}
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
            {/* Product Name */}
            <div>
              <Label
                htmlFor="name"
                className="text-sm md:text-base font-semibold"
              >
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
                className="mt-2 h-10 md:h-12 text-sm md:text-base"
              />
            </div>

            {/* Category */}
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

            {/* Description */}
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

            {/* Availability */}
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

        {/* Images */}
        <div className="bg-white rounded-lg md:rounded-xl border border-gray-200 md:border-2 p-4 md:p-6 lg:p-8 shadow-sm">
          <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-blue-600 text-lg md:text-xl">📸</span>
            </div>
            <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900">
              Product Images
            </h2>
          </div>

          <div className="space-y-4 md:space-y-6">
            <div>
              <Label className="text-sm md:text-base font-semibold">
                Upload Images
              </Label>
              <div className="mt-2">
                <label
                  htmlFor="images"
                  className="flex flex-col items-center justify-center w-full h-32 md:h-40 border border-dashed md:border-2 border-amber-300 rounded-lg md:rounded-xl cursor-pointer hover:bg-amber-50 bg-amber-25 transition-colors"
                >
                  <Upload className="w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 text-amber-600 mb-2" />
                  <span className="text-sm md:text-base font-medium text-gray-700">
                    Click to upload images
                  </span>
                  <span className="text-xs md:text-sm text-gray-500 mt-1">
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
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-video w-full overflow-hidden rounded-lg border border-gray-200">
                      <Image
                        width={300}
                        height={200}
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 md:top-2 md:right-2 p-1 md:p-2 bg-red-500 text-white rounded-full hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3 md:w-4 md:h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Price Options */}
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

        {/* Available Flavors */}
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

        {/* Customization */}
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

        {/* Actions */}
        <div className="flex flex-col-reverse md:flex-row justify-end gap-3 md:gap-4 pt-4 md:pt-0">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={loading}
            className="h-11 md:h-12 px-6 text-sm md:text-base"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={loading}
            className="h-11 md:h-12 px-6 text-sm md:text-base bg-amber-600 hover:bg-amber-700"
          >
            {loading && (
              <Loader2 className="w-4 h-4 md:w-5 md:h-5 mr-2 animate-spin" />
            )}
            Create Product
          </Button>
        </div>
      </form>
    </div>
  );
}
