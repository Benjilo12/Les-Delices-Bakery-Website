import { Trash2, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogTrigger,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function DeleteBlogDialog({ blog, deletingId, handleDelete }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="destructive"
          size="sm"
          disabled={deletingId === blog.slug}
          className="bg-red-600 hover:bg-red-700 text-white"
        >
          {deletingId === blog.slug ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <Trash2 className="h-4 w-4 mr-2" />
          )}
          Delete
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="bg-white dark:bg-gray-900 border-2 border-red-300 dark:border-red-700">
        <AlertDialogHeader>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full">
              <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <AlertDialogTitle className="text-2xl font-bold text-red-600 dark:text-red-400">
              Delete Blog Post?
            </AlertDialogTitle>
          </div>

          <div className="space-y-4">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <p className="text-sm font-semibold text-red-900 dark:text-red-300 mb-2">
                ⚠️ This action cannot be undone!
              </p>
              <p className="text-sm text-red-700 dark:text-red-400">
                You are about to permanently delete:
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <p className="font-semibold text-gray-900 dark:text-white mb-3">
                {blog.title}
              </p>

              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">•</span>
                  <span>The blog post and all its content</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">•</span>
                  <span>All associated comments and reactions</span>
                </li>
                {blog.featuredImage && (
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 font-bold">•</span>
                    <span>The featured image from ImageKit</span>
                  </li>
                )}
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">•</span>
                  <span>View count: {blog.views || 0} views will be lost</span>
                </li>
              </ul>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-400 italic">
              Are you absolutely sure you want to proceed?
            </p>
          </div>
        </AlertDialogHeader>

        <AlertDialogFooter className="gap-2 sm:gap-0">
          <AlertDialogCancel className="border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => handleDelete(blog.slug)}
            className="bg-red-600 hover:bg-red-700 text-white border-2 border-red-700 dark:border-red-600"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Yes, Delete Permanently
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
