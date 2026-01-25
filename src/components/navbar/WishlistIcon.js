"use client";

import Link from "next/link";
import { useWishlist } from "@/lib/store";
import { Heart } from "lucide-react";

export default function WishlistIcon() {
  const { wishlist } = useWishlist();
  const count = wishlist.length;

  return (
    <Link
      href="/wishlist"
      className="relative p-1 hover:bg-gray-100 rounded-lg transition-colors group"
      aria-label="View wishlist"
    >
      <Heart className="w-6 h-6 text-gray-700 group-hover:text-amber-700 transition-colors" />
      {count > 0 && (
        <span className="absolute -top-2 -right-2 bg-amber-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
          {count > 9 ? "9+" : count}
        </span>
      )}
    </Link>
  );
}
