import { Card, CardContent } from "@/components/ui/card";
import { FileText, Eye } from "lucide-react";

export default function StatsCards({
  totalBlogs,
  publishedCount,
  draftCount,
  totalViews,
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card className="bg-linear-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-700">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-700 dark:text-blue-400">
                Total Blogs
              </p>
              <h3 className="text-3xl font-bold text-blue-900 dark:text-blue-300 mt-2">
                {totalBlogs}
              </h3>
            </div>
            <div className="p-3 bg-blue-500/20 rounded-full">
              <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-linear-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-700">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-700 dark:text-green-400">
                Published
              </p>
              <h3 className="text-3xl font-bold text-green-900 dark:text-green-300 mt-2">
                {publishedCount}
              </h3>
            </div>
            <div className="p-3 bg-green-500/20 rounded-full">
              <Eye className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-linear-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 border-yellow-200 dark:border-yellow-700">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-700 dark:text-yellow-400">
                Drafts
              </p>
              <h3 className="text-3xl font-bold text-yellow-900 dark:text-yellow-300 mt-2">
                {draftCount}
              </h3>
            </div>
            <div className="p-3 bg-yellow-500/20 rounded-full">
              <FileText className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-linear-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-700">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-700 dark:text-purple-400">
                Total Views
              </p>
              <h3 className="text-3xl font-bold text-purple-900 dark:text-purple-300 mt-2">
                {totalViews}
              </h3>
            </div>
            <div className="p-3 bg-purple-500/20 rounded-full">
              <Eye className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
