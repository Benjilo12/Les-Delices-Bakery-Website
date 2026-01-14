"use client";

import Image from "next/image";
import { Highlighter } from "./ui/highlighter";

export default function HeroSection() {
  return (
    <section className="relative bg-linear-to-br from-amber-50 to-amber-100 overflow-hidden min-h-[70vh] md:min-h-0">
      {/* Decorative elements - Hidden on mobile to save space */}
      <div className="hidden md:block absolute top-0 left-0 w-64 h-64 bg-amber-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="hidden md:block absolute top-0 right-0 w-64 h-64 bg-amber-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="hidden md:block absolute -bottom-8 left-20 w-64 h-64 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

      <div className="container mx-auto px-4 md:px-6 py-8 md:py-8 lg:py-16 h-full">
        <div className="flex flex-col lg:flex-row items-center justify-center gap-6 md:gap-6 lg:gap-10 xl:gap-12 min-h-[60vh] md:min-h-[60vh]">
          {/* Left side - Text content - Full width on mobile */}
          <div className="w-full lg:w-1/2 text-center lg:text-left space-y-4 md:space-y-6 flex flex-col justify-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-amber-900 leading-tight">
              Taste the Magic of{" "}
              <Highlighter action="underline" color="#E91E63">
                {" "}
                <span className="text-amber-600">Freshly Baked</span>
              </Highlighter>
              Delights
            </h1>

            <p className="text-base md:text-lg lg:text-xl text-amber-800/80 max-w-2xl mx-auto lg:mx-0">
              At Les Délices, we craft every cake with love and precision. From
              traditional recipes to modern creations, experience the perfect
              blend of flavor, texture, and artistry in every bite.
            </p>

            {/* Mobile image - Show below text on mobile */}
            <div className="block lg:hidden relative w-full h-50 sm:h-62.5 my-4">
              <Image
                src="/images/hamper.png"
                alt="Humber filled with delicious cake loaves and chips"
                fill
                className="object-contain drop-shadow-xl"
                sizes="100vw"
                priority
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 lg:gap-4 justify-center lg:justify-start">
              <button className="px-6 py-2.5 md:px-8 md:py-3 lg:px-10 lg:py-3 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 text-sm md:text-base">
                Order Now
              </button>
              <button className="px-6 py-2.5 md:px-8 md:py-3 lg:px-10 lg:py-3 bg-white hover:bg-amber-50 text-amber-700 font-semibold rounded-full border-2 border-amber-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 text-sm md:text-base">
                View Menu
              </button>
            </div>

            {/* Features/Stats - Hidden on mobile, shown on md+ */}
            <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 pt-4">
              <div className="text-center p-3 bg-amber-100/50 rounded-lg">
                <div className="text-xl lg:text-2xl xl:text-3xl font-bold text-amber-700">
                  50+
                </div>
                <div className="text-xs lg:text-sm text-amber-800 font-medium">
                  Cake Varieties
                </div>
              </div>
              <div className="text-center p-3 bg-amber-100/50 rounded-lg">
                <div className="text-xl lg:text-2xl xl:text-3xl font-bold text-amber-700">
                  10+
                </div>
                <div className="text-xs lg:text-sm text-amber-800 font-medium">
                  Years Experience
                </div>
              </div>
              <div className="text-center p-3 bg-amber-100/50 rounded-lg">
                <div className="text-xl lg:text-2xl xl:text-3xl font-bold text-amber-700">
                  1K+
                </div>
                <div className="text-xs lg:text-sm text-amber-800 font-medium">
                  Happy Customers
                </div>
              </div>
              <div className="text-center p-3 bg-amber-100/50 rounded-lg">
                <div className="text-xl lg:text-2xl xl:text-3xl font-bold text-amber-700">
                  Fresh
                </div>
                <div className="text-xs lg:text-sm text-amber-800 font-medium">
                  Daily Baking
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Image (Hidden on mobile, shown on desktop) */}
          <div className="hidden lg:block lg:w-1/2 relative w-full h-full">
            <div className="relative max-w-lg xl:max-w-xl mx-auto w-full h-full flex items-center justify-center">
              <div className="relative z-10 w-full">
                {/* Larger image on large screens */}
                <div className="relative w-full h-95 lg:h-112.5 xl:h-125 2xl:h-137.5">
                  <Image
                    src="/images/hamper.png"
                    alt="Humber filled with delicious cake loaves and chips"
                    fill
                    className="object-contain drop-shadow-2xl"
                    sizes="(max-width: 1024px) 50vw, (max-width: 1280px) 45vw, 600px"
                    priority
                  />

                  {/* Floating cake loaf - larger on large screens */}
                  <div className="absolute top-1/4 right-1/3 transform -translate-y-1/2 translate-x-1/2 w-40 h-40 lg:w-48 lg:h-48 xl:w-56 xl:h-56 2xl:w-60 2xl:h-60 animate-float-high">
                    <div className="relative w-full h-full">
                      <Image
                        src="/images/loave.png"
                        alt="Delicious cake loaf"
                        fill
                        className="object-contain drop-shadow-2xl"
                        sizes="(max-width: 1024px) 160px, (max-width: 1280px) 192px, 224px"
                      />
                    </div>

                    <div className="absolute inset-0 bg-amber-200/30 rounded-full blur-xl -z-10"></div>
                    <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-1 h-6 bg-linear-to-t from-yellow-500/60 to-transparent"></div>
                  </div>

                  {/* Gold sprinkles - Top left */}
                  <div className="absolute top-6 left-10 w-20 h-20 opacity-50">
                    <div className="absolute top-0 left-0 w-3.5 h-3.5 bg-yellow-500 rounded-full animate-pulse"></div>
                    <div className="absolute bottom-2 right-4 w-3 h-3 bg-yellow-400 rounded-full animate-pulse animation-delay-1000"></div>
                  </div>

                  {/* Gold sprinkles - Bottom right */}
                  <div className="absolute bottom-10 right-12 w-20 h-20 opacity-50">
                    <div className="absolute top-4 right-0 w-4 h-4 bg-yellow-600 rounded-full animate-pulse animation-delay-500"></div>
                  </div>

                  {/* Gold sprinkles - Top right (near loaf) */}
                  <div className="absolute top-14 right-20 w-16 h-16 opacity-60">
                    <div className="absolute top-2 right-2 w-3 h-3 bg-yellow-400 rounded-full animate-float-slow animation-delay-300"></div>
                  </div>

                  {/* Additional sprinkles for larger screens */}
                  <div className="hidden xl:block absolute top-20 left-16 w-12 h-12 opacity-50">
                    <div className="absolute bottom-1 left-3 w-2.5 h-2.5 bg-yellow-500 rounded-full animate-pulse animation-delay-700"></div>
                  </div>

                  <div className="hidden xl:block absolute bottom-16 left-20 w-12 h-12 opacity-50">
                    <div className="absolute top-2 right-1 w-3 h-3 bg-yellow-400 rounded-full animate-float-slow animation-delay-900"></div>
                  </div>
                </div>

                {/* Floating gold sprinkles around the loaf - larger on large screens */}
                <div className="absolute top-1/4 right-1/3 transform -translate-y-1/2 translate-x-1/2 w-64 h-64 lg:w-72 lg:h-72 xl:w-80 xl:h-80 -z-5">
                  <div className="absolute top-10 left-12 w-2.5 h-2.5 bg-yellow-500 rounded-full animate-float-slow animation-delay-400"></div>
                  <div className="absolute bottom-12 right-16 w-3 h-3 bg-yellow-400 rounded-full animate-float-slow animation-delay-1200"></div>
                  <div className="hidden xl:block absolute top-16 right-20 w-2 h-2 bg-yellow-600 rounded-full animate-float-slow animation-delay-600"></div>
                  <div className="hidden xl:block absolute bottom-8 left-16 w-2.5 h-2.5 bg-yellow-500 rounded-full animate-float-slow animation-delay-1500"></div>
                </div>
              </div>

              {/* Larger decorative circles for large screens */}
              <div className="absolute -top-10 -right-10 w-56 h-56 lg:w-64 lg:h-64 xl:w-72 xl:h-72 rounded-full bg-linear-to-br from-yellow-100/20 to-yellow-200/30 blur-2xl -z-10"></div>
              <div className="absolute -bottom-10 -left-10 w-48 h-48 lg:w-56 lg:h-56 xl:w-64 xl:h-64 rounded-full bg-linear-to-tr from-yellow-50/15 to-yellow-100/25 blur-2xl -z-10"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
