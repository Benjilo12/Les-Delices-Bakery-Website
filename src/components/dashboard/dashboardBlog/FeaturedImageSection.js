import { Upload, X } from "lucide-react";
import { Label } from "@/components/ui/label";
import Image from "next/image";

export default function FeaturedImageSection({
  imagePreview,
  handleImageChange,
  removeImage,
}) {
  return (
    <div className="bg-white rounded-xl border-2 border-gray-200 p-8 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
          <span className="text-purple-600 text-xl">🖼️</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Featured Image</h2>
      </div>

      <div className="space-y-6">
        {!imagePreview ? (
          <div>
            <Label className="text-base font-semibold">Upload Image</Label>
            <div className="mt-3">
              <label
                htmlFor="featuredImage"
                className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-purple-300 rounded-xl cursor-pointer hover:bg-purple-50 bg-purple-25 transition-colors"
              >
                <Upload className="w-10 h-10 text-purple-600 mb-3" />
                <span className="text-base font-medium text-gray-700">
                  Click to upload featured image
                </span>
                <span className="text-sm text-gray-500 mt-1">
                  PNG, JPG up to 5MB
                </span>
                <input
                  id="featuredImage"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        ) : (
          <div className="relative group">
            <div className="w-full h-64 rounded-lg border-2 border-gray-200 overflow-hidden">
              <Image
                src={imagePreview}
                alt="Featured image preview"
                width={800}
                height={400}
                className="w-full h-full object-cover"
              />
            </div>
            <button
              type="button"
              onClick={removeImage}
              className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
