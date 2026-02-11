"use client";

import Logo from "./navbar/Logo";
import NavLinks from "./navbar/NavLinks";
import SearchBar from "./navbar/SearchBar";
import CartIcon from "./navbar/CartIcon";
import WishlistIcon from "./navbar/WishlistIcon";
import UserMenu from "./navbar/UserMenu";
import MobileMenu from "./navbar/MobileMenu";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { LayoutDashboard, Shield } from "lucide-react";

export default function Navbar() {
  const { user, isSignedIn } = useUser();

  // Check if user is admin
  const isAdmin =
    user?.publicMetadata?.role === "admin" ||
    user?.publicMetadata?.isAdmin === true ||
    user?.emailAddresses?.some(
      (email) =>
        email.emailAddress.endsWith("@admin.com") ||
        email.emailAddress === process.env.NEXT_PUBLIC_ADMIN_EMAIL,
    ) ||
    false;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-backdrop-filter:bg-white/60">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Left: Mobile Menu + Logo */}
          <div className="flex items-center gap-4">
            <MobileMenu />
            <Logo />

            {/* Admin Dashboard Icon - Only for admins, shows on all screens */}
            {isSignedIn && isAdmin && (
              <Link
                href="/dashboard"
                className="md:hidden p-2 text-gray-600 hover:text-amber-600 transition-colors"
                title="Dashboard"
              >
                <LayoutDashboard className="w-5 h-5" />
              </Link>
            )}
          </div>

          {/* Center: Nav Links (Desktop) */}
          <NavLinks />

          {/* Center-Right: Search Bar (Desktop) */}
          <div className="flex-1 max-w-md mx-8 hidden lg:block">
            <SearchBar />
          </div>

          {/* Right: User Actions */}
          <div className="flex items-center gap-4">
            {/* Admin Dashboard Icon - Only for admins, shows on medium+ screens */}
            {isSignedIn && isAdmin && (
              <Link
                href="/dashboard"
                className="hidden md:flex items-center gap-2 px-3 py-2 bg-linear-to-r from-amber-50 to-orange-50 hover:from-amber-100 hover:to-orange-100 text-amber-700 rounded-lg transition-all group relative"
                title="Admin Dashboard"
              >
                <Shield className="w-4 h-4" />
                <span className="font-medium text-sm hidden lg:inline">
                  Dashboard
                </span>
                {/* Tooltip for smaller screens */}
                <div className="lg:hidden absolute -bottom-10 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                  Admin Dashboard
                  <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
                </div>
              </Link>
            )}

            <UserMenu />
            <WishlistIcon />
            <CartIcon />
          </div>
        </div>
      </div>
    </header>
  );
}
