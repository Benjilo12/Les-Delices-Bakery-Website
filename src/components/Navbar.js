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
import { Shield } from "lucide-react";

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
          <div className="flex items-center gap-2 md:gap-6">
            <MobileMenu />
            <Logo />
          </div>

          {/* Center: Nav Links (Desktop) */}
          <div className="ml-8 md:ml-12">
            <NavLinks />
          </div>

          {/* Center-Right: Search Bar (Desktop) */}
          <div className="flex-1 max-w-md mx-8 hidden lg:block">
            <SearchBar />
          </div>

          {/* Right: User Actions */}
          <div className="flex items-center gap-4">
            {/* Admin Dashboard Icon - medium+ screens, icon + tooltip only */}
            {isSignedIn && isAdmin && (
              <Link
                href="/dashboard"
                className="hidden md:flex items-center justify-center p-2 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-lg transition-all group relative"
              >
                <Shield className="w-5 h-5" />
                {/* Tooltip */}
                <div className="absolute -bottom-9 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                  Admin Dashboard
                  <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
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
