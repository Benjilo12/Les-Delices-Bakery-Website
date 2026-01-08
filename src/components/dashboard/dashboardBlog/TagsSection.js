import { Plus, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function TagsSection({
  tags,
  tagInput,
  setTagInput,
  addTag,
  removeTag,
}) {
  return (
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
  );
}
