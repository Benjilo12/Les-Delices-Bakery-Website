"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import BlogFormHeader from "@/components/dashboard/dashboardBlog/BlogFormHeader";
import PostDetailsSection from "@/components/dashboard/dashboardBlog/PostDetailsSection";
import FeaturedImageSection from "@/components/dashboard/dashboardBlog/FeaturedImageSection";
import TagsSection from "@/components/dashboard/dashboardBlog/TagsSection";
import AuthorSection from "@/components/dashboard/dashboardBlog/AuthorSection";
import FormActions from "@/components/dashboard/dashboardBlog/FormActions";
import { toast } from "sonner";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });
import "react-quill-new/dist/quill.snow.css";

const categories = [
  {
    value: "Baking Tips",
    label: "Baking Tips",
    color: "bg-blue-100 text-blue-700",
    border: "border-blue-200",
    icon: "🍰",
  },
  {
    value: "Recipes",
    label: "Recipes",
    color: "bg-green-100 text-green-700",
    border: "border-green-200",
    icon: "📝",
  },
  {
    value: "offers & promotions",
    label: "Offers & Promotions",
    color: "bg-purple-100 text-purple-700",
    border: "border-purple-200",
    icon: "🎉",
  },
];

export default function AddBlogPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [featuredImage, setFeaturedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    category: "",
    isPublished: false,
  });
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [author, setAuthor] = useState({
    name: "Les Délices By Akorfa",
    role: "Bakery Team",
  });

  const modules = useMemo(
    () => ({
      toolbar: [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ color: [] }, { background: [] }],
        ["link", "image"],
        ["clean"],
      ],
    }),
    []
  );

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "color",
    "background",
    "link",
    "image",
  ];

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFeaturedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFeaturedImage(null);
    setImagePreview(null);
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const loadingToast = toast.loading("Creating blog post...", {
      description: "Please wait while we publish your content.",
      style: {
        background: "#FEF3C7",
        border: "2px solid #F59E0B",
        color: "#92400E",
        fontWeight: 600,
      },
      icon: (
        <div className="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center">
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
        </div>
      ),
    });

    try {
      const formDataToSend = new FormData();

      formDataToSend.append("title", formData.title);
      formDataToSend.append("excerpt", formData.excerpt);
      formDataToSend.append("content", formData.content);
      formDataToSend.append("category", formData.category);
      formDataToSend.append("isPublished", formData.isPublished);
      formDataToSend.append("tags", JSON.stringify(tags));
      formDataToSend.append("author", JSON.stringify(author));

      if (featuredImage) {
        formDataToSend.append("featuredImage", featuredImage);
      }

      const response = await fetch("/api/blogs", {
        method: "POST",
        body: formDataToSend,
      });

      const data = await response.json();
      toast.dismiss(loadingToast);

      if (response.ok) {
        toast.success("Blog post created successfully!", {
          description: `${formData.title} has been ${
            formData.isPublished ? "published" : "saved as draft"
          }.`,
          duration: 4000,
          style: {
            background: "#D1FAE5",
            border: "2px solid #10B981",
            color: "#065F46",
            fontWeight: 600,
          },
        });

        setTimeout(() => {
          router.push("/dashboard/blog");
        }, 1000);
      } else {
        toast.error("Failed to create blog post", {
          description: data.error || "Something went wrong. Please try again.",
          duration: 5000,
          style: {
            background: "#FEE2E2",
            border: "2px solid #EF4444",
            color: "#7F1D1D",
            fontWeight: 600,
          },
        });
      }
    } catch (error) {
      console.error("Error:", error);
      toast.dismiss(loadingToast);
      toast.error("Network Error", {
        description: "Unable to create blog post. Check your connection.",
        duration: 5000,
        style: {
          background: "#FEE2E2",
          border: "2px solid #EF4444",
          color: "#7F1D1D",
          fontWeight: 600,
        },
      });
    } finally {
      setLoading(false);
    }
  };

  const remainingChars = 200 - formData.excerpt.length;
  const selectedCategory = categories.find(
    (cat) => cat.value === formData.category
  );

  return (
    <div className="max-w-5xl mx-auto">
      <BlogFormHeader router={router} />

      <form onSubmit={handleSubmit} className="space-y-10">
        <PostDetailsSection
          formData={formData}
          setFormData={setFormData}
          categories={categories}
          selectedCategory={selectedCategory}
          remainingChars={remainingChars}
          ReactQuill={ReactQuill}
          modules={modules}
          formats={formats}
        />

        <FeaturedImageSection
          imagePreview={imagePreview}
          handleImageChange={handleImageChange}
          removeImage={removeImage}
        />

        <TagsSection
          tags={tags}
          tagInput={tagInput}
          setTagInput={setTagInput}
          addTag={addTag}
          removeTag={removeTag}
        />

        <AuthorSection
          author={author}
          setAuthor={setAuthor}
          formData={formData}
          setFormData={setFormData}
        />

        <FormActions loading={loading} formData={formData} router={router} />
      </form>
    </div>
  );
}
