import Link from "next/link";
import Image from "next/image";
import { Twitter, Linkedin, Github, Facebook, Instagram } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-linear-to-b from-amber-50 to-orange-100 border-t border-amber-200">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Top Section - Logo and Navigation */}
        <div className="flex flex-col items-center space-y-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 bg-linear-to-br from-amber-600 to-orange-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:shadow-xl transition-shadow">
              LD
            </div>
            <span className="font-serif text-2xl font-bold bg-linear-to-r from-amber-900 to-orange-800 bg-clip-text text-transparent">
              Les Délices
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="flex flex-wrap items-center justify-center gap-x-8 md:gap-x-15 gap-y-3">
            <Link
              href="/menu"
              className="text-amber-900 hover:text-amber-700 font-medium transition-colors"
            >
              Menu
            </Link>

            <Link
              href="/blog"
              className="text-amber-900 hover:text-amber-700 font-medium transition-colors"
            >
              Blog
            </Link>
            <Link
              href="/faq"
              className="text-amber-900 hover:text-amber-700 font-medium transition-colors"
            >
              FAQ
            </Link>
            <Link
              href="/privacy"
              className="text-amber-900 hover:text-amber-700 font-medium transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="text-amber-900 hover:text-amber-700 font-medium transition-colors"
            >
              Terms
            </Link>
          </nav>

          {/* Image Placeholder */}
          {/* <div className="relative w-full max-w-md h-25 bg-linear-to-r from-amber-200 to-orange-200 rounded-2xl overflow-hidden border-4 border-white shadow-lg">
            <Image
              src="/images/gateway.png"
              alt="Les Délices Banner"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 448px"
            />
        
            <div className="absolute inset-0 bg-linear-to-r from-amber-300/50 to-orange-300/50 mix-blend-overlay" />
          </div> */}
        </div>
      </div>

      {/* Bottom Section - Copyright and Social Links */}
      <div className="border-t border-amber-300 mt-10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Copyright */}
            <p className="text-sm text-amber-800/80">
              © {currentYear} Les Délices LLABC. All rights reserved.
            </p>

            {/* Social Media Links */}
            <div className="flex items-center gap-4">
              <Link
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white/50 hover:bg-white text-amber-700 hover:text-amber-900 transition-all hover:shadow-md"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </Link>
              <Link
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white/50 hover:bg-white text-amber-700 hover:text-amber-900 transition-all hover:shadow-md"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </Link>
              <Link
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white/50 hover:bg-white text-amber-700 hover:text-amber-900 transition-all hover:shadow-md"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </Link>
              <Link
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white/50 hover:bg-white text-amber-700 hover:text-amber-900 transition-all hover:shadow-md"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </Link>
              <Link
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white/50 hover:bg-white text-amber-700 hover:text-amber-900 transition-all hover:shadow-md"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
