"use client";

import Link from "next/link";
import { CakeSlice } from "lucide-react";

export default function CartIcon({ count = 0 }) {
  return (
    <Link href="/cart" className="relative">
      <CakeSlice className="w-6 h-6 text-gray-700 hover:text-amber-700 transition-colors" />
      {count > 0 && (
        <span className="absolute -top-2 -right-2 bg-amber-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
          {count > 9 ? "9+" : count}
        </span>
      )}
    </Link>
  );
}
