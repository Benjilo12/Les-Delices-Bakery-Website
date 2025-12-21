// app/components/MobileMenu.jsx
import { Home, Info, Utensils, ShoppingCart, X } from "lucide-react";
import Link from "next/link";
import { UserButton, SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";

import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const navLinks = [
  { name: "Home", href: "/", icon: Home },
  { name: "Menu", href: "/menu", icon: Utensils },
  { name: "About", href: "/about", icon: Info },
];

export default function MobileMenu({ isMenuOpen, setIsMenuOpen }) {
  return (
    <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
      <SheetContent
        side="left" // Changed from "right" to "left"
        className="w-[85vw] sm:max-w-sm p-0 bg-white rounded-r-2xl"
      >
        {/* Hidden title for accessibility */}
        <SheetTitle className="sr-only">Mobile Menu</SheetTitle>

        <div className="flex flex-col h-full">
          {/* Header with close button */}
          <div className="px-6 py-5 border-b flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold tracking-tight">
                Les Délices
              </h2>
              <p className="text-sm text-muted-foreground">
                Elegance in every bite
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 px-6 py-5 space-y-6 overflow-y-auto">
            {/* Navigation Links */}
            <nav className="space-y-2">
              {navLinks.map(({ name, href, icon: Icon }) => (
                <SheetClose asChild key={name}>
                  <Link
                    href={href}
                    className="flex items-center gap-4 rounded-xl px-4 py-3 text-base font-medium text-gray-700 hover:bg-primary/10 hover:text-primary transition-colors"
                  >
                    <Icon className="h-5 w-5" />
                    {name}
                  </Link>
                </SheetClose>
              ))}
            </nav>

            {/* Cart integrated with navigation */}
            <SheetClose asChild>
              <Link
                href="/cart"
                className="flex items-center justify-between rounded-xl px-4 py-3 text-base font-medium text-gray-700 hover:bg-primary/10 hover:text-primary transition-colors"
              >
                <div className="flex items-center gap-4">
                  <ShoppingCart className="h-5 w-5" />
                  <span>Cart</span>
                </div>
                <span className="bg-primary text-white text-sm px-2 py-0.5 rounded-full">
                  0
                </span>
              </Link>
            </SheetClose>

            <Separator />

            {/* Auth Section */}
            <div className="space-y-4">
              <SignedOut>
                <SignInButton mode="modal">
                  <SheetClose asChild>
                    <Button className="w-full h-12 rounded-xl text-base font-medium">
                      Sign In
                    </Button>
                  </SheetClose>
                </SignInButton>
              </SignedOut>

              <SignedIn>
                <div className="flex items-center justify-center p-4">
                  <UserButton afterSignOutUrl="/" />
                </div>
              </SignedIn>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
