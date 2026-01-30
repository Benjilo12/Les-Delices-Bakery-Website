"use client";

import { useEffect, useState } from "react";
import { useCart } from "@/lib/store";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";

export default function CartIcon() {
  const { count } = useCart();
  const { isSignedIn } = useUser();
  const [mounted, setMounted] = useState(false);

  // This only runs on the client after the page loads
  useEffect(() => {
    setMounted(true);
  }, []);

  // If user is not signed in, show a disabled cart icon or sign in prompt
  if (!isSignedIn) {
    return (
      <div className="relative group">
        <div className="p-1 opacity-50">
          <ShoppingBag className="w-6 h-6 text-gray-500" />
        </div>
        <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 text-white text-xs py-1 px-2 rounded -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
          Sign in to view cart
        </div>
      </div>
    );
  }

  return (
    <Link
      href="/cart"
      className="relative p-1 hover:bg-gray-100 rounded-lg transition-colors group cursor-pointer"
      aria-label="Go to cart"
    >
      <ShoppingBag className="w-6 h-6 text-gray-700 group-hover:text-amber-700 transition-colors" />

      {/* Only show the badge if the component is mounted AND count > 0.
        This prevents the server/client mismatch.
      */}
      {mounted && count > 0 && (
        <span className="absolute -top-2 -right-2 bg-amber-600 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center animate-in zoom-in duration-300">
          {count > 9 ? "9+" : count}
        </span>
      )}
    </Link>
  );
}
