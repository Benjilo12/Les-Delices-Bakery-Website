import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function PostDetailsSection({
  formData,
  setFormData,
  categories,
  selectedCategory,
  remainingChars,
  ReactQuill,
  modules,
  formats,
}) {
  return (
    <div className="bg-white rounded-xl border-2 border-gray-200 p-8 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
          <span className="text-blue-600 text-xl">✍️</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Post Details</h2>
      </div>

      <div className="space-y-6">
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

        <div>
          <Label htmlFor="content" className="text-base font-semibold">
            Content <span className="text-red-500">*</span>
          </Label>
          <div className="mt-2">
            <ReactQuill
              theme="snow"
              value={formData.content}
              onChange={(value) => setFormData({ ...formData, content: value })}
              modules={modules}
              formats={formats}
              placeholder="Write your blog post content here..."
              className="h-80 mb-16 [&_.ql-container]:border-2 [&_.ql-container]:border-gray-300 [&_.ql-container]:rounded-b-lg [&_.ql-toolbar]:border-2 [&_.ql-toolbar]:border-gray-300 [&_.ql-toolbar]:border-b-0 [&_.ql-toolbar]:rounded-t-lg"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
