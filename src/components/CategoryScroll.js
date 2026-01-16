// src/components/CategoryScroll.jsx
import Image from "next/image";
import Link from "next/link";

const categories = [
  { name: "Birthday Cakes", image: "/images/cakeloaf.jpg" },
  { name: "Wedding Cakes", image: "/images/cakeloaf.jpg" },
  { name: "Cupcakes", image: "/images/cakeloaf.jpg" },
  { name: "Cake Loaves", image: "/images/cakeloaf.jpg" },
  { name: "Pastries & Snacks", image: "/images/cakeloaf.jpg" },
];

export default function CategoryScroll() {
  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header Section - Now in a Row */}
        <div className="flex flex-col items-center mb-12">
          <div className="flex items-center gap-4 mb-2">
            {/* Icon */}
            <div className="w-10 h-10 md:w-12 md:h-12 bg-zinc-800 rounded-full flex items-center justify-center shrink-0">
              <span className="text-white text-lg md:text-xl">🎂</span>
            </div>

            {/* Title */}
            <h2 className="text-3xl md:text-5xl font-serif italic text-gray-900">
              Shop{" "}
              <span className="font-sans font-light not-italic text-2xl md:text-3xl mx-1">
                by
              </span>{" "}
              Category
            </h2>
          </div>

          {/* Subtitle */}
          <p className="text-gray-400 tracking-[0.2em] uppercase text-[10px] md:text-xs font-medium">
            Bangkok Same Day Delivery
          </p>
        </div>

        {/* Categories Grid */}
        <div className="flex flex-wrap justify-center gap-6 md:gap-10">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              href={`/menu?category=${encodeURIComponent(cat.name)}`}
              className="group flex flex-col items-center space-y-4"
            >
              {/* Circular Image Container */}
              <div className="relative w-28 h-28 md:w-36 md:h-36 rounded-full overflow-hidden border border-gray-100 group-hover:border-amber-600 transition-all duration-500 p-1 bg-white shadow-sm">
                <div className="relative w-full h-full rounded-full overflow-hidden">
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 768px) 112px, 144px"
                  />
                </div>
              </div>

              {/* Category Name */}
              <span className="text-xs md:text-sm font-medium text-gray-800 group-hover:text-amber-700 transition-colors uppercase tracking-wider">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
