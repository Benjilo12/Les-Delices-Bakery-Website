import Navbar from "@/components/Navbar";
import Topbar from "@/components/Topbar";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <>
    <Topbar />
    <Navbar />
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-white">
      <div className="text-center">
        {/* Decorative number */}
        <div className="relative inline-block mb-8">
          <div className="text-[180px] md:text-[220px] font-bold text-amber-100 select-none">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-4xl md:text-5xl font-bold text-amber-600">
              Page Not Found
            </div>
          </div>
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
          Something&apos;s missing...
        </h1>

        <p className="text-gray-600 max-w-md mx-auto mb-10">
          The page you&apos;re looking for isn&apos;t available. But our bakery
          is always open with fresh bread and pastries!
        </p>

        <div className="space-y-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-amber-600 hover:text-amber-700 font-medium group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Return to Les Délices homepage
          </Link>

          <div className="text-sm text-gray-500">
            <p>Or explore our:</p>
            <div className="flex justify-center gap-4 mt-2">
              <Link href="/menu" className="text-amber-600 hover:underline">
                Menu
              </Link>
              <Link href="/about" className="text-amber-600 hover:underline">
                Story
              </Link>
              <Link
                href="/locations"
                className="text-amber-600 hover:underline"
              >
                Locations
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
