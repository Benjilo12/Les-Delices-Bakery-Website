// app/components/Logo.jsx
import Link from "next/link";
import { Cake } from "lucide-react";

export default function Logo() {
  return (
    <Link
      href="/"
      className="flex items-center space-x-2 hover:opacity-90 transition-opacity"
    >
      <Cake className="h-7 w-7 text-primary" />
      <span className="text-xl font-bold text-foreground hidden sm:inline">
        LesDélices
      </span>
    </Link>
  );
}
