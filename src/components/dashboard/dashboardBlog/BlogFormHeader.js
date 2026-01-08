import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BlogFormHeader({ router }) {
  return (
    <div className="mb-10">
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="mb-4 -ml-2 hover:bg-amber-50"
      >
        <ArrowLeft className="w-4 h-4 mr-2 text-amber-600" />
        <span className="text-amber-700">Back to Blog</span>
      </Button>
      <h1 className="text-4xl font-bold text-gray-900">Create New Blog Post</h1>
      <p className="text-gray-600 mt-2 text-lg">
        Share baking tips, recipes, and stories with your customers
      </p>
    </div>
  );
}
