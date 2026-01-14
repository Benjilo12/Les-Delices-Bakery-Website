import React from "react";
import { Truck, Croissant, ChefHat, Cake } from "lucide-react";

export default function LesDelicesBanner() {
  return (
    <>
      {/* Top Banner */}
      <div className="bg-linear-to-r from-amber-800 via-amber-600 to-amber-800 text-white py-5 px-6 md:px-10 mb-8 rounded-lg shadow-lg">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-around items-center gap-6 md:gap-8">
          {/* Accra Same Day Delivery */}
          <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-50 group">
            <Truck className="w-10 h-10 md:w-12 md:h-12 shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12 group-hover:animate-shake" />
            <div>
              <h3 className="text-base md:text-lg font-semibold tracking-wide">
                Accra Same Day Delivery
              </h3>
              <p className="text-xs md:text-sm italic opacity-95">
                Delivered fresh via eco-friendly vehicles
              </p>
            </div>
          </div>

          {/* French Patisserie Excellence */}
          <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-50 group">
            <Croissant className="w-10 h-10 md:w-12 md:h-12 shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12 group-hover:animate-shake" />
            <div>
              <h3 className="text-base md:text-lg font-semibold tracking-wide">
                French Patisserie Excellence
              </h3>
              <p className="text-xs md:text-sm italic opacity-95">
                Authentic, Delicate & Traditional
              </p>
            </div>
          </div>

          {/* Artisan Recipes */}
          <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-50 group">
            <ChefHat className="w-10 h-10 md:w-12 md:h-12 shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12 group-hover:animate-shake" />
            <div>
              <h3 className="text-base md:text-lg font-semibold tracking-wide">
                Artisan Recipes
              </h3>
              <p className="text-xs md:text-sm italic opacity-95">
                Simple, Quality & Timeless Techniques
              </p>
            </div>
          </div>

          {/* Custom Orders Available */}
          <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-50 group">
            <Cake className="w-10 h-10 md:w-12 md:h-12 shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12 group-hover:animate-shake" />
            <div>
              <h3 className="text-base md:text-lg font-semibold tracking-wide">
                Custom Orders Available
              </h3>
              <p className="text-xs md:text-sm italic opacity-95">
                Weddings to Birthdays, We Do It All
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Section */}
      <div className="max-w-6xl mx-auto px-6 md:px-10 py-12 md:py-16">
        {/* Title */}
        <div className="text-center mb-5">
          <h1 className="text-2xl md:text-4xl font-semibold text-gray-800 tracking-wider md:tracking-widest">
            AUTHENTIC FRENCH PASTRIES BY LES DÉLICES
          </h1>
        </div>

        {/* Subtitle */}
        <div className="text-center text-gray-600 mb-10 md:mb-12 max-w-4xl mx-auto">
          <p className="text-sm md:text-base leading-relaxed">
            Accra&apos; home for artisan baking. Led by
            <span className="font-semibold">Master Pastry Chef</span>, we refuse
            industrial shortcuts. Every pastry is crafted using traditional
            French recipes, 100% pure butter, and premium imported ingredients.
          </p>
        </div>

        {/* Three Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 mb-8">
          {/* Signature Celebrations */}
          <div className="text-center">
            <h2 className="text-lg md:text-xl font-semibold text-slate-700 mb-3 md:mb-4 uppercase tracking-wide">
              Signature Celebrations
            </h2>
            <p className="text-sm md:text-base text-gray-600 leading-relaxed">
              Elevate your celebration. Whether it&apos;s rich Chocolate Ganache
              or classic Vanilla Cream, every cake includes complimentary
              candles and a hand-written plaque.
            </p>
          </div>

          {/* Bespoke & Custom */}
          <div className="text-center">
            <h2 className="text-lg md:text-xl font-semibold text-slate-700 mb-3 md:mb-4 uppercase tracking-wide">
              Bespoke & Custom
            </h2>
            <p className="text-sm md:text-base text-gray-600 leading-relaxed">
              Have a vision? Our chefs specialize in{" "}
              <span className="font-semibold">custom cake design</span>. From
              elegant multi-tier creations to personalized theme cakes, we turn
              imagination into reality.
            </p>
          </div>

          {/* Zero Preservatives */}
          <div className="text-center">
            <h2 className="text-lg md:text-xl font-semibold text-slate-700 mb-3 md:mb-4 uppercase tracking-wide">
              Zero Preservatives
            </h2>
            <p className="text-sm md:text-base text-gray-600 leading-relaxed">
              We bake fresh daily. Our commitment to &quot;clean baking&quot;
              means no margarine, no trans-fats, and absolutely no artificial
              preservatives.
            </p>
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-center text-gray-500 italic text-xs md:text-sm mt-6 md:mt-8">
          Same-Day Delivery available for Classic Cakes. Custom orders require
          24-48 hours notice.
        </div>
      </div>
    </>
  );
}
