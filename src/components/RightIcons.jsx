// app/components/RightIcons.jsx
import { Search, ShoppingCart, Menu } from "lucide-react";
import { UserButton, SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";
import SearchBar from "./SearchBar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function RightIcons({
  isMenuOpen,
  setIsMenuOpen,
  isSearchOpen,
  setIsSearchOpen,
}) {
  return (
    <div className="flex items-center gap-4">
      {/* Search */}
      <div className="hidden lg:block">
        {isSearchOpen ? (
          <SearchBar onClose={() => setIsSearchOpen(false)} />
        ) : (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSearchOpen(true)}
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
          </Button>
        )}
      </div>

      {/* Cart with Badge */}
      <Button
        variant="ghost"
        size="icon"
        asChild
        className=" bg-emerald-300 rounded-4xl relative"
      >
        <Link href="/cart">
          <ShoppingCart className="h-5 w-5" />
          <Badge
            variant="destructive"
            className="absolute text-black -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center"
          >
            3
          </Badge>
        </Link>
      </Button>

      {/* Auth - Desktop */}
      <div className="hidden lg:flex items-center gap-2">
        <SignedOut>
          <SignInButton mode="modal">
            <Button size="sm">Sign In</Button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <UserButton afterSignOutUrl="/" />
        </SignedIn>
      </div>

      {/* Mobile Menu Toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label="Toggle menu"
      >
        <Menu className="h-5 w-5" />
      </Button>
    </div>
  );
}
