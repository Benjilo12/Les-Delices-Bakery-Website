// src/components/MenuBanner.jsx
import Image from "next/image";

export default function MenuBanner() {
  return (
    <div className="relative w-full h-62.5 md:h-87.5 overflow-hidden">
      {/* 1. The Background Image */}
      <Image
        src="/images/banners.jpg" // Replace with your image path
        alt="Bakery Menu Banner"
        fill
        priority
        className="object-cover"
      />

      {/* 2. The Dark Overlay */}
      {/* Adjust opacity (bg-black/40) to make the image darker or lighter */}
      <div className="absolute inset-0 bg-black/40" />

      {/* 3. The Menu Box */}
      <div className="absolute inset-0 flex items-center justify-center px-4">
        <div className="bg-white py-6 px-16 md:px-24 shadow-2xl transition-transform duration-500 hover:scale-105">
          <h1 className="text-4xl md:text-6xl font-serif text-gray-900 tracking-tight">
            Menu
          </h1>
        </div>
      </div>
    </div>
  );
}
