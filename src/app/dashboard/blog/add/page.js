"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Upload, Loader2, X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import dynamic from "next/dynamic";

// Dynamically import ReactQuillNew to avoid SSR issues
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

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    category: "",
    isPublished: false,
  });

  // Tags state
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");

  // Author state
  const [author, setAuthor] = useState({
    name: "Les Délices By Akorfa",
    role: "Bakery Team",
  });

  // Quill modules configuration
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

  // CORRECTED formats array - removed "bullet" and kept only "list"
  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list", // Changed from "bullet" to "list"
    "color",
    "background",
    "link",
    "image",
  ];

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFeaturedImage(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove image
  const removeImage = () => {
    setFeaturedImage(null);
    setImagePreview(null);
  };

  // Add tag
  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  // Remove tag
  const removeTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  // Handle form submission
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

      // Add basic fields
      formDataToSend.append("title", formData.title);
      formDataToSend.append("excerpt", formData.excerpt);
      formDataToSend.append("content", formData.content);
      formDataToSend.append("category", formData.category);
      formDataToSend.append("isPublished", formData.isPublished);

      // Add arrays as JSON strings
      formDataToSend.append("tags", JSON.stringify(tags));
      formDataToSend.append("author", JSON.stringify(author));

      // Add featured image if exists
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
          icon: (
            <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center">
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
          ),
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
        icon: (
          <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center">
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
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        ),
      });
    } finally {
      setLoading(false);
    }
  };

  const remainingChars = 200 - formData.excerpt.length;

  // Get selected category color
  const selectedCategory = categories.find(
    (cat) => cat.value === formData.category
  );

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-10">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-4 -ml-2 hover:bg-amber-50"
        >
          <ArrowLeft className="w-4 h-4 mr-2 text-amber-600" />
          <span className="text-amber-700">Back to Blog</span>
        </Button>
        <h1 className="text-4xl font-bold text-gray-900">
          Create New Blog Post
        </h1>
        <p className="text-gray-600 mt-2 text-lg">
          Share baking tips, recipes, and stories with your customers
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10">
        {/* Basic Information */}
        <div className="bg-white rounded-xl border-2 border-gray-200 p-8 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-blue-600 text-xl">✍️</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Post Details</h2>
          </div>

          <div className="space-y-6">
            {/* Title */}
            <div>
              <Label htmlFor="title" className="text-base font-semibold">
                Post Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                required
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="e.g., 5 Essential Baking Tips for Perfect Cakes"
                className="mt-2 h-12 text-base border-2 border-gray-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
              />
            </div>

            {/* Category with Enhanced Colors */}
            <div>
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
                <SelectTrigger className="mt-2 h-12 text-base bg-white border-2 border-gray-300 hover:border-amber-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-200">
                  <SelectValue placeholder="Select category">
                    {selectedCategory ? (
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{selectedCategory.icon}</span>
                        <span
                          className={`px-3 py-1.5 rounded-full text-sm font-semibold border ${selectedCategory.color} ${selectedCategory.border}`}
                        >
                          {selectedCategory.label}
                        </span>
                      </div>
                    ) : (
                      <span className="text-gray-500">Select category</span>
                    )}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="bg-white border-2 border-gray-300 shadow-xl">
                  {categories.map((cat) => (
                    <SelectItem
                      key={cat.value}
                      value={cat.value}
                      className="cursor-pointer hover:bg-amber-50 focus:bg-amber-50 transition-colors duration-200"
                    >
                      <div className="flex items-center gap-3 py-1.5">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full text-lg">
                          {cat.icon}
                        </div>
                        <div className="flex-1">
                          <span
                            className={`px-3 py-1.5 rounded-full text-sm font-semibold border ${cat.color} ${cat.border} transition-all duration-300`}
                          >
                            {cat.label}
                          </span>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500 mt-2">
                Choose a category that best describes your blog post
              </p>
            </div>

            {/* Excerpt */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label htmlFor="excerpt" className="text-base font-semibold">
                  Excerpt <span className="text-red-500">*</span>
                </Label>
                <span
                  className={`text-sm font-medium ${
                    remainingChars < 0
                      ? "text-red-500"
                      : remainingChars < 50
                      ? "text-amber-500"
                      : "text-gray-500"
                  }`}
                >
                  {remainingChars} characters remaining
                </span>
              </div>
              <Input
                id="excerpt"
                required
                value={formData.excerpt}
                onChange={(e) =>
                  setFormData({ ...formData, excerpt: e.target.value })
                }
                placeholder="A brief summary of your post (max 200 characters)..."
                maxLength={200}
                className="mt-2 h-12 text-base border-2 border-gray-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
              />
            </div>

            {/* Content with Quill */}
            <div>
              <Label htmlFor="content" className="text-base font-semibold">
                Content <span className="text-red-500">*</span>
              </Label>
              <div className="mt-2">
                <ReactQuill
                  theme="snow"
                  value={formData.content}
                  onChange={(value) =>
                    setFormData({ ...formData, content: value })
                  }
                  modules={modules}
                  formats={formats}
                  placeholder="Write your blog post content here..."
                  className="h-80 mb-16 [&_.ql-container]:border-2 [&_.ql-container]:border-gray-300 [&_.ql-container]:rounded-b-lg [&_.ql-toolbar]:border-2 [&_.ql-toolbar]:border-gray-300 [&_.ql-toolbar]:border-b-0 [&_.ql-toolbar]:rounded-t-lg"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Featured Image */}
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

        {/* Tags */}
        <div className="bg-white rounded-xl border-2 border-gray-200 p-8 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-green-600 text-xl">🏷️</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Tags</h2>
          </div>

          <div className="space-y-6">
            <div className="flex gap-3">
              <Input
                placeholder="Add a tag..."
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addTag();
                  }
                }}
                className="h-12 border-2 border-gray-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
              />
              <Button
                type="button"
                onClick={addTag}
                className="h-12 px-6 bg-green-600 hover:bg-green-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add
              </Button>
            </div>

            {tags.length > 0 && (
              <div className="p-4 bg-green-50 rounded-lg border-2 border-green-200">
                <p className="text-sm font-semibold text-green-900 mb-3">
                  Tags ({tags.length}):
                </p>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1.5 bg-green-200 text-green-900 rounded-full text-sm font-medium flex items-center gap-2 border border-green-300"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="hover:text-red-600 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Author & Publishing */}
        <div className="bg-white rounded-xl border-2 border-gray-200 p-8 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
              <span className="text-amber-600 text-xl">👤</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              Author & Publishing
            </h2>
          </div>

          <div className="space-y-6">
            {/* Author Name */}
            <div>
              <Label htmlFor="authorName" className="text-base font-semibold">
                Author Name
              </Label>
              <Input
                id="authorName"
                value={author.name}
                onChange={(e) => setAuthor({ ...author, name: e.target.value })}
                className="mt-2 h-12 border-2 border-gray-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
              />
            </div>

            {/* Author Role */}
            <div>
              <Label htmlFor="authorRole" className="text-base font-semibold">
                Author Role
              </Label>
              <Input
                id="authorRole"
                value={author.role}
                onChange={(e) => setAuthor({ ...author, role: e.target.value })}
                className="mt-2 h-12 border-2 border-gray-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
              />
            </div>

            {/* Publish Toggle */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border-2 border-gray-300">
              <div>
                <Label
                  htmlFor="isPublished"
                  className="text-base font-semibold"
                >
                  Publish Immediately
                </Label>
                <p className="text-sm text-gray-600 mt-1">
                  Make this post visible to everyone
                </p>
              </div>
              <Switch
                id="isPublished"
                checked={formData.isPublished}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, isPublished: checked })
                }
                className="data-[state=checked]:bg-amber-600"
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4 pb-8">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={loading}
            className="h-12 px-8 text-base border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={loading}
            className="h-12 px-8 text-base bg-linear-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 shadow-lg"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                {formData.isPublished ? "Publishing..." : "Saving..."}
              </>
            ) : (
              <span className="flex items-center">
                {formData.isPublished ? "🎯 Publish Post" : "💾 Save as Draft"}
              </span>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
