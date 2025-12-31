"use client";

import Logo from "./navbar/Logo";
import NavLinks from "./navbar/NavLinks";
import SearchBar from "./navbar/SearchBar";
import CartIcon from "./navbar/CartIcon";
import WishlistIcon from "./navbar/WishlistIcon";
import UserMenu from "./navbar/UserMenu";
import MobileMenu from "./navbar/MobileMenu";

export default function Navbar() {
  // TODO: Replace with actual cart/wishlist counts from your state management
  const cartCount = 3;
  const wishlistCount = 5;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-backdrop-filter:bg-white/60">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Left: Mobile Menu + Logo */}
          <div className="flex items-center gap-4">
            <MobileMenu />
            <Logo />
          </div>

          {/* Center: Nav Links (Desktop) */}
          <NavLinks />

          {/* Center-Right: Search Bar (Desktop) */}
          <div className="flex-1 max-w-md mx-8 hidden lg:block">
            <SearchBar />
          </div>

          {/* Right: User Actions */}
          <div className="flex items-center gap-4">
            <UserMenu />
            <WishlistIcon count={wishlistCount} />
            <CartIcon count={cartCount} />
          </div>
        </div>
      </div>
    </header>
  );
}
