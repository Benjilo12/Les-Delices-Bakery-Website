import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Toaster } from "@/components/ui/sonner";

export const metadata = {
  title: "Dashboard - Les Délices By Akorfa",
  description: "Admin dashboard for managing bakery operations",
};

export default async function DashboardLayout({ children }) {
  const user = await currentUser();

  if (!user) redirect("/sign-in");
  if (user.publicMetadata.isAdmin !== true) redirect("/unauthorized");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* FIXED SIDEBAR */}
      <DashboardSidebar />

      {/* MAIN CONTENT AREA - ml-0 on mobile, ml-64 on desktop for sidebar */}
      <div className="lg:ml-64 flex flex-col min-h-screen">
        {/* STICKY HEADER */}
        <DashboardHeader />

        {/* MAIN CONTENT */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">{children}</div>
        </main>
      </div>

      <Toaster position="top-right" richColors />
    </div>
  );
}
