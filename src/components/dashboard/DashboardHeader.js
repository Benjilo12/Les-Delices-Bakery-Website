"use client";

import { Bell, Search } from "lucide-react";
import { UserButton } from "@clerk/nextjs";

export default function DashboardHeader() {
  return (
    <header className="h-16 sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b flex items-center justify-between px-4 lg:px-8">
      {/* SEARCH - Hidden on mobile, visible on desktop */}
      <div className="hidden md:flex flex-1 max-w-2xl">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search orders, products, customers..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition"
          />
        </div>
      </div>

      {/* MOBILE TITLE */}
      <div className="md:hidden">
        <h1 className="text-lg font-semibold text-gray-900">Dashboard</h1>
      </div>

      {/* RIGHT SECTION */}
      <div className="flex items-center gap-4">
        {/* MOBILE SEARCH BUTTON */}
        <button className="md:hidden p-2 rounded hover:bg-gray-100">
          <Search className="w-5 h-5 text-gray-600" />
        </button>

        {/* NOTIFICATIONS */}
        <button className="relative p-2 rounded hover:bg-gray-100">
          <Bell className="w-5 h-5 text-gray-600" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        {/* USER BUTTON */}
        <UserButton
          appearance={{
            elements: { avatarBox: "w-8 h-8 md:w-9 md:h-9" },
          }}
        />
      </div>
    </header>
  );
}
