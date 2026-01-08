import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function FormActions({ loading, formData, router }) {
  return (
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
  );
}
