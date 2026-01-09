import { AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function WarningSection() {
  return (
    <Card className="border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/20">
      <CardContent className="pt-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-yellow-800 dark:text-yellow-300 mb-1">
              Important Note About Deletion
            </h4>
            <p className="text-sm text-yellow-700 dark:text-yellow-400">
              When you delete a blog post, it will be permanently removed from
              the database along with its featured image from ImageKit. This
              action cannot be undone. Please make sure you want to delete a
              blog before proceeding.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
