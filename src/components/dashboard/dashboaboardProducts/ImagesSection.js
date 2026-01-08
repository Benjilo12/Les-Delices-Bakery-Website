import { Upload, X } from "lucide-react";
import { Label } from "@/components/ui/label";
import Image from "next/image";

export default function ImagesSection({
  images,
  imagePreviews,
  setImages,
  setImagePreviews,
}) {
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages([...images, ...files]);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prev) => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
    setImagePreviews(imagePreviews.filter((_, i) => i !== index));
  };

  return (
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
  );
}
