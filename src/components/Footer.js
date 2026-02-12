import Link from "next/link";
import Image from "next/image";
import {
  Twitter,
  Linkedin,
  Github,
  Facebook,
  Instagram,
  Heart,
} from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-linear-to-b from-amber-50 to-orange-100 border-t border-amber-200 relative overflow-hidden">
      {/* Subtle decorative pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-64 h-64 bg-amber-300 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-orange-300 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col items-center space-y-8">
          {/* Logo with subtle glow */}
          <Link href="/" className="group">
            <div className="relative">
              <div className="absolute inset-0 bg-amber-400/20 rounded-full blur-xl group-hover:bg-amber-400/30 transition-all duration-300"></div>
              <Image
                src="/images/logo 2.png"
                alt="Les Délices"
                width={160}
                height={160}
                className="relative z-10 group-hover:scale-105 transition-transform duration-300 drop-shadow-md"
              />
            </div>
          </Link>

          {/* Elegant tagline */}
          <p className="text-lg md:text-xl font-serif italic text-amber-900/80">
            Elegance in Every Bite. Healthy in Every Slice.
          </p>

          {/* Decorative divider */}
          <div className="w-24 h-0.5 bg-linear-to-r from-amber-300 via-amber-500 to-orange-400 rounded-full"></div>

          {/* Navigation Links - Enhanced styling */}
          <nav className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            {[
              { href: "/menu", label: "Menu" },
              { href: "/blog", label: "Blog" },
              { href: "/faq", label: "FAQ" },
              { href: "/privacy", label: "Privacy" },
              { href: "/terms", label: "Terms" },
            ].map((link, index) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative text-amber-800 hover:text-amber-600 font-medium transition-colors px-2 py-1 group"
              >
                {link.label}
                <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-linear-to-r from-amber-500 to-orange-500 group-hover:w-full transition-all duration-300"></span>
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Bottom Bar - Glass morphism style */}
      <div className="border-t border-amber-200/50 bg-white/40 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Copyright with heart */}
            <p className="text-sm text-amber-800/70 flex items-center gap-1.5">
              © {currentYear} Les Délices LLABC.
              <span className="hidden sm:inline">All rights reserved.</span>
              <span className="inline-flex items-center gap-1 ml-1">
                Made with{" "}
                <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 animate-pulse" />{" "}
                in Accra
              </span>
            </p>

            {/* Social Links - Enhanced hover effects */}
            <div className="flex items-center gap-2">
              {[
                {
                  icon: Facebook,
                  href: "https://facebook.com",
                  label: "Facebook",
                  color: "hover:bg-blue-500",
                },
                {
                  icon: Instagram,
                  href: "https://instagram.com",
                  label: "Instagram",
                  color: "hover:bg-pink-600",
                },
                {
                  icon: Twitter,
                  href: "https://twitter.com",
                  label: "Twitter",
                  color: "hover:bg-sky-500",
                },
                {
                  icon: Linkedin,
                  href: "https://linkedin.com",
                  label: "LinkedIn",
                  color: "hover:bg-blue-700",
                },
                {
                  icon: Github,
                  href: "https://github.com",
                  label: "GitHub",
                  color: "hover:bg-gray-800",
                },
              ].map((social) => (
                <Link
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative"
                  aria-label={social.label}
                >
                  <div className="absolute inset-0 bg-linear-to-r from-amber-500 to-orange-500 rounded-full opacity-0 group-hover:opacity-100 blur-sm transition-opacity"></div>
                  <div className="relative w-10 h-10 flex items-center justify-center rounded-full bg-white text-amber-700 group-hover:text-white group-hover:bg-linear-to-r group-hover:from-amber-600 group-hover:to-orange-600 transition-all duration-300 shadow-sm hover:shadow-md border border-amber-200/50">
                    <social.icon className="w-4 h-4" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
