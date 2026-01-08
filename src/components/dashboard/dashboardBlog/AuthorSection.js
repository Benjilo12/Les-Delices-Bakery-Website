import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export default function AuthorSection({
  author,
  setAuthor,
  formData,
  setFormData,
}) {
  return (
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

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border-2 border-gray-300">
          <div>
            <Label htmlFor="isPublished" className="text-base font-semibold">
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
  );
}
