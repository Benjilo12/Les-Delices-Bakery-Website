// app/components/Header.jsx
"use client";

import { useState } from "react";
import DesktopNav from "./DesktopNav";
import Logo from "./Logo";
import RightIcons from "./RightIcons";
import MobileMenu from "./MobileMenu";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 py-4 transition-all duration-300">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            {/* Left Navigation */}
            <DesktopNav />

            {/* Centered Logo */}
            <div className="absolute left-1/2 transform -translate-x-1/2">
              <Logo />
            </div>

            {/* Right Icons */}
            <RightIcons
              isMenuOpen={isMenuOpen}
              setIsMenuOpen={setIsMenuOpen}
              isSearchOpen={isSearchOpen}
              setIsSearchOpen={setIsSearchOpen}
            />
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <MobileMenu isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
    </>
  );
}
