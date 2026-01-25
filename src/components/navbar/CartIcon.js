"use client";

import { useEffect, useState } from "react";
import { useCart } from "@/lib/store";
import { ShoppingBag } from "lucide-react";

export default function CartIcon() {
  const { toggleCart, count } = useCart();
  const [mounted, setMounted] = useState(false);

  // This only runs on the client after the page loads
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <button
      onClick={toggleCart}
      className="relative p-1 hover:bg-gray-100 rounded-lg transition-colors group cursor-pointer"
      aria-label="Open cart"
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
    </button>
  );
}
