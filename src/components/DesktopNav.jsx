// app/components/DesktopNav.jsx
import Link from "next/link";
import { Button } from "@/components/ui/button";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Menu", href: "/menu" },
  { name: "About", href: "/about" },
];

export default function DesktopNav() {
  return (
    <nav className="hidden lg:flex items-center space-x-4">
      {navLinks.map((link) => (
        <Button
          key={link.name}
          variant="ghost"
          asChild
          className="text-foreground hover:text-primary hover:bg-transparent"
        >
          <Link href={link.href}>{link.name}</Link>
        </Button>
      ))}
    </nav>
  );
}
