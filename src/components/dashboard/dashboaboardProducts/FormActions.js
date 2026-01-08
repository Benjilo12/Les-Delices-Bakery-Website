import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function FormActions({ loading, router }) {
  return (
    <div className="flex flex-col-reverse md:flex-row justify-end gap-3 md:gap-4 pt-4 md:pt-0">
      <Button
        type="button"
        variant="outline"
        onClick={() => router.back()}
        disabled={loading}
        className="h-11 md:h-12 px-6 text-sm md:text-base"
      >
        Cancel
      </Button>
      <Button
        type="submit"
        disabled={loading}
        className="h-11 md:h-12 px-6 text-sm md:text-base bg-amber-600 hover:bg-amber-700"
      >
        {loading && (
          <Loader2 className="w-4 h-4 md:w-5 md:h-5 mr-2 animate-spin" />
        )}
        Create Product
      </Button>
    </div>
  );
}
