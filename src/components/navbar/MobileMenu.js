"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

const links = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Menu" },
  { href: "/blog", label: "Blog" },
];

export default function MobileMenu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="md:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <button className="text-gray-700 hover:text-amber-700">
            <Menu className="w-6 h-6" />
          </button>
        </SheetTrigger>

        <SheetContent side="left" className="w-75 bg-amber-700">
          <SheetHeader>
            <SheetTitle className="text-left font-serif text-amber-900">
              Les Délices By Akorfa
            </SheetTitle>
          </SheetHeader>

          <nav className="flex flex-col gap-3 mt-8 ">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`text-base font-medium py-3 px-4 rounded-lg transition-colors ${
                  pathname === link.href
                    ? "bg-amber-200 text-gray-900 shadow-sm"
                    : "text-gray-100 hover:bg-amber-100"
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* Divider */}
            <div className="border-t border-amber-200 my-2"></div>

            {/* Login/Signup Section */}
            <SignedOut>
              <SignInButton mode="modal">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-base font-medium py-3 px-4 rounded-lg text-gray-100 hover:bg-amber-100"
                >
                  Login / Sign Up
                </Button>
              </SignInButton>
            </SignedOut>

            <SignedIn>
              <Link
                href="/profile"
                onClick={() => setOpen(false)}
                className="text-base font-medium py-3 px-4 rounded-lg text-amber-800 hover:bg-amber-100 transition-colors"
              >
                My Profile
              </Link>
              <Link
                href="/orders"
                onClick={() => setOpen(false)}
                className="text-base font-medium py-3 px-4 rounded-lg text-amber-800 hover:bg-amber-100 transition-colors"
              >
                My Orders
              </Link>
            </SignedIn>
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
}
