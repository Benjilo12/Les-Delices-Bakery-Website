import { Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function DeleteDialog({
  open,
  onOpenChange,
  productToDelete,
  deleting,
  onCancel,
  onConfirm,
}) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="border-0 bg-linear-to-br from-white to-red-50 shadow-2xl">
        <div className="relative">
          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
            <div className="w-12 h-12 bg-linear-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-lg">
              <Trash2 className="w-6 h-6 text-white" />
            </div>
          </div>

          <AlertDialogHeader className="pt-8">
            <AlertDialogTitle className="text-2xl font-bold text-center text-red-700">
              Delete Product?
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="text-center text-red-600">
                <div className="space-y-3">
                  <div className="text-lg font-semibold">
                    Are you sure you want to delete{" "}
                    <span className="text-red-700 font-bold">
                      {productToDelete?.name}
                    </span>
                    ?
                  </div>
                  <div className="bg-red-100 border-l-4 border-red-500 p-3 rounded-r">
                    <div className="text-red-800 text-sm">
                      ⚠️ This action cannot be undone!
                    </div>
                    {productToDelete?.images &&
                      productToDelete.images.length > 0 && (
                        <div className="text-red-700 text-sm mt-1">
                          • {productToDelete.images.length} image(s) will be
                          deleted from ImageKit
                        </div>
                      )}
                    <div className="text-red-700 text-sm mt-1">
                      • Product will be permanently removed from your inventory
                    </div>
                  </div>
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter className="flex flex-col sm:flex-row gap-3 sm:gap-0 mt-6">
            <AlertDialogCancel
              disabled={deleting}
              onClick={onCancel}
              className="flex-1 bg-linear-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-800 border-gray-300 hover:text-gray-900 font-semibold py-3"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={onConfirm}
              disabled={deleting}
              className="flex-1 bg-linear-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg py-3 font-semibold"
            >
              {deleting ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Deleting...
                </div>
              ) : (
                "Delete Product"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
