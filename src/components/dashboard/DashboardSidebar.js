"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  CakeSlice,
  Package,
  FileText,
  Users,
  FolderKanban,
  Menu,
  X,
} from "lucide-react";
import { useUser } from "@clerk/nextjs";

const menuItems = [
  { label: "Overview", icon: LayoutDashboard, href: "/dashboard" },
  {
    label: "Orders",
    icon: ShoppingBag,
    href: "/dashboard/orders",
    badge: "12",
  },
  { label: "Products", icon: CakeSlice, href: "/dashboard/products" },
  { label: "Inventory", icon: Package, href: "/dashboard/inventory" },
  { label: "Blog", icon: FileText, href: "/dashboard/blog/add" },
  {
    label: "Manage blogs",
    icon: FolderKanban,
    href: "/dashboard/blog/manage-blogs",
  },
  { label: "Customers", icon: Users, href: "/dashboard/customers" },
];

export default function DashboardSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Get the current user from Clerk
  const { user, isLoaded } = useUser();

  return (
    <>
      {/* MOBILE MENU BUTTON */}
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md"
      >
        <Menu className="w-6 h-6 text-gray-700" />
      </button>

      {/* MOBILE OVERLAY */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* SIDEBAR - Fixed width (64 = w-64 = 256px) */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50
          flex flex-col
          bg-white border-r border-gray-200
          transition-transform duration-300
          h-screen
          shadow-lg
          w-64
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* HEADER */}
        <div className="h-16 px-4 flex items-center justify-between border-b">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-amber-600 rounded-lg flex items-center justify-center text-white font-bold">
              LD
            </div>
            <span className="font-serif text-lg text-amber-900">
              Les Délices
            </span>
          </Link>

          {/* MOBILE CLOSE */}
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden p-2 rounded hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* NAVIGATION */}
        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active =
                pathname === item.href || pathname.startsWith(`${item.href}/`);

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition
                      ${
                        active
                          ? "bg-amber-50 text-amber-900 border-r-2 border-amber-500"
                          : "text-gray-700 hover:bg-gray-100"
                      }
                    `}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="flex-1">{item.label}</span>
                    {item.badge && (
                      <span className="text-xs bg-amber-100 px-2 py-0.5 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* FOOTER */}
        <div className="p-4 border-t">
          <div className="bg-amber-50 p-3 rounded-lg">
            {isLoaded && user ? (
              <>
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {user.fullName ||
                    user.firstName ||
                    user.emailAddresses[0]?.emailAddress ||
                    "Admin User"}
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  {/* Display role from public metadata or default to "Admin" */}
                  {user.publicMetadata?.role === "super_admin"
                    ? "Super Admin"
                    : user.publicMetadata?.role === "manager"
                    ? "Manager"
                    : "Admin"}
                </p>
              </>
            ) : (
              <>
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
