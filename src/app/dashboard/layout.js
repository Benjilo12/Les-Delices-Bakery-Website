import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Toaster } from "@/components/ui/sonner";

export const metadata = {
  title: "Dashboard - Les Délices By Akorfa",
  description: "Admin dashboard for managing bakery operations",
};

export default function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen  bg-gray-50">
      {/* Sidebar - Fixed */}
      <div className="fixed">
        <DashboardSidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col flex-1">
        {/* Header - Fixed */}
        <div className="fixed w-full lg:pl-64 z-10">
          <DashboardHeader />
        </div>
        {/* Main Content - Scrollable */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>

      {/* Toaster */}
      <Toaster position="top-right" richColors />
    </div>
  );
}
