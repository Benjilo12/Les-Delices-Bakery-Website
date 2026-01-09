"use client";

import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="relative bg-linear-to-br from-amber-50 to-amber-100 overflow-hidden min-h-screen">
      {/* Decorative elements - Hidden on mobile to save space */}
      <div className="hidden md:block absolute top-0 left-0 w-64 h-64 bg-amber-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="hidden md:block absolute top-0 right-0 w-64 h-64 bg-amber-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="hidden md:block absolute -bottom-8 left-20 w-64 h-64 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

      <div className="container mx-auto px-4 py-12 md:py-16 lg:py-24">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12 xl:gap-16 min-h-[80vh]">
          {/* Left side - Text content - Full width on mobile */}
          <div className="w-full lg:w-1/2 text-center lg:text-left space-y-6 md:space-y-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-amber-900 leading-tight">
              Taste the Magic of{" "}
              <span className="text-amber-600">Freshly Baked</span> Delights
            </h1>

            <p className="text-lg md:text-xl lg:text-2xl text-amber-800/80 max-w-3xl mx-auto lg:mx-0">
              At Les Délices, we craft every cake with love and precision. From
              traditional recipes to modern creations, experience the perfect
              blend of flavor, texture, and artistry in every bite.
            </p>

            {/* Mobile image - Show below text on mobile */}
            <div className="block lg:hidden relative w-full h-62.5 sm:h-75 my-8">
              <Image
                src="/images/hamper.png"
                alt="Humber filled with delicious cake loaves and chips"
                fill
                className="object-contain drop-shadow-xl"
                sizes="100vw"
                priority
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 lg:gap-6 justify-center lg:justify-start">
              <button className="px-8 py-3.5 md:px-10 md:py-4 lg:px-12 lg:py-4 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 text-base md:text-lg">
                Order Now
              </button>
              <button className="px-8 py-3.5 md:px-10 md:py-4 lg:px-12 lg:py-4 bg-white hover:bg-amber-50 text-amber-700 font-semibold rounded-full border-2 border-amber-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 text-base md:text-lg">
                View Menu
              </button>
            </div>

            {/* Features/Stats - Hidden on mobile, shown on md+ */}
            <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 pt-6">
              <div className="text-center p-4 bg-amber-100/50 rounded-xl">
                <div className="text-2xl lg:text-3xl xl:text-4xl font-bold text-amber-700">
                  50+
                </div>
                <div className="text-sm lg:text-base text-amber-800 font-medium">
                  Cake Varieties
                </div>
              </div>
              <div className="text-center p-4 bg-amber-100/50 rounded-xl">
                <div className="text-2xl lg:text-3xl xl:text-4xl font-bold text-amber-700">
                  10+
                </div>
                <div className="text-sm lg:text-base text-amber-800 font-medium">
                  Years Experience
                </div>
              </div>
              <div className="text-center p-4 bg-amber-100/50 rounded-xl">
                <div className="text-2xl lg:text-3xl xl:text-4xl font-bold text-amber-700">
                  1K+
                </div>
                <div className="text-sm lg:text-base text-amber-800 font-medium">
                  Happy Customers
                </div>
              </div>
              <div className="text-center p-4 bg-amber-100/50 rounded-xl">
                <div className="text-2xl lg:text-3xl xl:text-4xl font-bold text-amber-700">
                  Fresh
                </div>
                <div className="text-sm lg:text-base text-amber-800 font-medium">
                  Daily Baking
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Image (Hidden on mobile, shown on desktop) */}
          <div className="hidden lg:block lg:w-1/2 relative w-full">
            <div className="relative max-w-lg mx-auto w-full">
              <div className="relative z-10 w-full">
                <div className="relative w-full h-100 lg:h-112.5 xl:h-125">
                  <Image
                    src="/images/hamper.png"
                    alt="Humber filled with delicious cake loaves and chips"
                    fill
                    className="object-contain drop-shadow-2xl"
                    sizes="(max-width: 1024px) 50vw, 600px"
                    priority
                  />

                  {/* Floating cake loaf */}
                  <div className="absolute top-1/4 right-1/3 transform -translate-y-1/2 translate-x-1/2 w-40 h-40 lg:w-48 lg:h-48 xl:w-56 xl:h-56 animate-float-high">
                    <div className="relative w-full h-full">
                      <Image
                        src="/images/loave.png"
                        alt="Delicious cake loaf"
                        fill
                        className="object-contain drop-shadow-2xl"
                        sizes="(max-width: 1024px) 160px, 192px"
                      />
                    </div>

                    <div className="absolute inset-0 bg-amber-200/30 rounded-full blur-xl -z-10"></div>
                    <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-1 h-6 bg-linear-to-t from-yellow-500/60 to-transparent"></div>
                  </div>

                  {/* Gold sprinkles - Top left */}
                  <div className="absolute top-4 left-8 w-20 h-20 opacity-50">
                    <div className="absolute top-0 left-0 w-4 h-4 bg-yellow-500 rounded-full animate-pulse"></div>
                    <div className="absolute bottom-2 right-4 w-3 h-3 bg-yellow-400 rounded-full animate-pulse animation-delay-1000"></div>
                  </div>

                  {/* Gold sprinkles - Bottom right */}
                  <div className="absolute bottom-8 right-10 w-20 h-20 opacity-50">
                    <div className="absolute top-4 right-0 w-4.5 h-4.5 bg-yellow-600 rounded-full animate-pulse animation-delay-500"></div>
                    <div className="absolute bottom-0 left-6 w-3.5 h-3.5 bg-yellow-500 rounded-full animate-pulse animation-delay-1500"></div>
                  </div>

                  {/* Gold sprinkles - Top right (near loaf) */}
                  <div className="absolute top-12 right-16 w-16 h-16 opacity-60">
                    <div className="absolute top-2 right-2 w-3 h-3 bg-yellow-400 rounded-full animate-float-slow animation-delay-300"></div>
                  </div>

                  {/* Gold sprinkles - Bottom left */}
                  <div className="absolute bottom-16 left-12 w-16 h-16 opacity-50">
                    <div className="absolute bottom-4 left-4 w-4 h-4 bg-yellow-600 rounded-full animate-float-slow animation-delay-800"></div>
                  </div>
                </div>

                {/* Floating gold sprinkles around the loaf - fewer and simpler */}
                <div className="absolute top-1/4 right-1/3 transform -translate-y-1/2 translate-x-1/2 w-64 h-64 -z-5">
                  <div className="absolute top-8 left-12 w-2.5 h-2.5 bg-yellow-500 rounded-full animate-float-slow animation-delay-400"></div>
                  <div className="absolute bottom-12 right-14 w-3 h-3 bg-yellow-400 rounded-full animate-float-slow animation-delay-1200"></div>
                </div>
              </div>

              {/* Gold decorative circles */}
              <div className="absolute -top-10 -right-10 w-64 h-64 rounded-full bg-linear-to-br from-yellow-100/20 to-yellow-200/30 blur-2xl -z-10"></div>
              <div className="absolute -bottom-10 -left-10 w-56 h-56 rounded-full bg-linear-to-tr from-yellow-50/15 to-yellow-100/25 blur-2xl -z-10"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
