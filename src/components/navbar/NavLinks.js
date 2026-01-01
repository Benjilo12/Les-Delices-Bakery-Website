"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Menu" },
  { href: "/blog", label: "Blog" },
];

export default function NavLinks() {
  const pathname = usePathname();

  return (
    <nav className="hidden md:flex items-center gap-8">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={`text-base font-medium transition-colors hover:text-amber-600 ${
            pathname === link.href
              ? "text-amber-600 border-b-2 border-amber-600 font-bold"
              : "text-gray-700 "
          }`}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
