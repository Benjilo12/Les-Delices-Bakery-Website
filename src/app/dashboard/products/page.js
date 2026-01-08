"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ArrowLeft, X } from "lucide-react";

import ProductFormHeader from "@/components/dashboard/dashboaboardProducts/ProductFormHeader";
import BasicInformationSection from "@/components/dashboard/dashboaboardProducts/BasicInformationSection";
import ImagesSection from "@/components/dashboard/dashboaboardProducts/ImagesSection";
import PriceOptionsSection from "@/components/dashboard/dashboaboardProducts/PriceOptionsSection";
import FlavorsSection from "@/components/dashboard/dashboaboardProducts/FlavorsSection";
import CustomizationSection from "@/components/dashboard/dashboaboardProducts/CustomizationSection";
import FormActions from "@/components/dashboard/dashboaboardProducts/FormActions";
import { toast } from "sonner";

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
  const [formData, setFormData] = useState(resetForm());
  const [priceOptions, setPriceOptions] = useState([{ label: "", price: "" }]);
  const [selectedFlavors, setSelectedFlavors] = useState([]);
  const [customFlavor, setCustomFlavor] = useState("");

  const resetAllFields = () => {
    setFormData(resetForm());
    setPriceOptions([{ label: "", price: "" }]);
    setSelectedFlavors([]);
    setImages([]);
    setImagePreviews([]);
    setCustomFlavor("");
  };

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

        resetAllFields();

        setTimeout(() => {
          router.push("/dashboard/products");
        }, 1500);
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
      <ProductFormHeader router={router} />

      <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
        <BasicInformationSection
          formData={formData}
          setFormData={setFormData}
          categories={categories}
        />

        <ImagesSection
          images={images}
          imagePreviews={imagePreviews}
          setImages={setImages}
          setImagePreviews={setImagePreviews}
        />

        <PriceOptionsSection
          priceOptions={priceOptions}
          setPriceOptions={setPriceOptions}
        />

        <FlavorsSection
          commonFlavors={commonFlavors}
          selectedFlavors={selectedFlavors}
          setSelectedFlavors={setSelectedFlavors}
          customFlavor={customFlavor}
          setCustomFlavor={setCustomFlavor}
        />

        <CustomizationSection formData={formData} setFormData={setFormData} />

        <FormActions loading={loading} router={router} />
      </form>
    </div>
  );
}
