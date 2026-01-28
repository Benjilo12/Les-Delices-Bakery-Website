"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Highlighter } from "./ui/highlighter";

const reviews = [
  {
    id: 1,
    name: "Edward Alexander",
    rating: 4.9,
    date: "29 Aug, 2017",
    text: "Overall pleasurable experience. Pay a little first and Pay a little during the development of the app as milestones are achieved, which made me feel very confident and comfortable. Seamless and Easy process.",
    image: "/images/prof1.jpg",
  },
  {
    id: 2,
    name: "Diana Johnston",
    rating: 4.9,
    date: "29 Aug, 2017",
    text: "I love that I don't have to choose between taste and well-being. Their artisanal cupcakes are the best healthy treats I've found in Accra.",
    image: "/images/prof2.jpg",
  },
  {
    id: 3,
    name: "Lauren Contreras",
    rating: 4.9,
    date: "29 Aug, 2017",
    text: "Mrs. Eleanor's passion really shows in every slice. The flour chips are my favorite crunchy delight for tea time!",
    image: "/images/prof3.jpg",
  },
  {
    id: 4,
    name: "Edward Alexander",
    rating: 4.9,
    date: "29 Aug, 2017",
    text: "The attention to detail and commitment to quality is exceptional. Every order feels special and customized.",
    image: "/images/prof4.jpg",
  },
];

export default function CustomerReviews() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) =>
        prevIndex === reviews.length - 1 ? 0 : prevIndex + 1,
      );
    }, 9000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-20 md:py-24 bg-white overflow-hidden relative">
      {/* Large Golden Brown Left Panel */}
      <div className="absolute left-0 top-0 bottom-0 w-[45%] bg-linear-to-br from-amber-900 via-amber-800 to-amber-700 -z-10 hidden lg:block">
        {/* Optional subtle pattern overlay */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* Smaller mobile accent */}
      <div className="absolute left-0 top-0 w-32 h-full bg-linear-to-b from-amber-800 to-amber-900 -z-10 lg:hidden" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Centered Title */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-serif italic text-gray-900">
            Customer{" "}
            <span className="text-pink-500">
              <Highlighter action="highlight" color="#FFEDC2">
                Reviews
              </Highlighter>{" "}
            </span>
          </h2>
          <div className="w-20 h-0.5 bg-amber-600 mx-auto mt-4"></div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-6 xl:gap-12">
          {/* Left Side: Reviewers List */}
          <div className="lg:w-2/5 xl:w-2/5">
            <div className="relative pl-4 lg:pl-0">
              {/* Vertical decorative line */}
              <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-linear-to-b from-amber-600 via-amber-500 to-amber-400 hidden lg:block" />

              <div className="space-y-8 lg:space-y-10">
                {reviews.map((review, index) => (
                  <button
                    key={review.id}
                    onClick={() => setActiveIndex(index)}
                    className={`flex items-center gap-4 transition-all duration-300 w-full text-left group ${
                      activeIndex === index
                        ? "opacity-100 scale-[1.02]"
                        : "opacity-70 hover:opacity-90"
                    }`}
                  >
                    {/* Profile Image */}
                    <div className="relative w-14 h-14 md:w-16 md:h-16 rounded-full overflow-hidden border-4 border-white shadow-lg">
                      <Image
                        src={review.image}
                        alt={review.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 56px, 64px"
                      />
                      {/* Active indicator */}
                      {activeIndex === index && (
                        <div className="absolute inset-0 border-2 border-amber-500 rounded-full animate-pulse"></div>
                      )}
                    </div>

                    {/* Reviewer Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-gray-900 text-base md:text-lg truncate">
                          {review.name}
                        </h3>
                        {activeIndex === index && (
                          <div className="w-2 h-2 bg-amber-600 rounded-full animate-ping"></div>
                        )}
                      </div>

                      <div className="flex items-center gap-3 mt-1">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <span
                              key={i}
                              className={`text-sm ${
                                i < Math.floor(review.rating)
                                  ? "text-amber-500"
                                  : "text-gray-300"
                              }`}
                            >
                              ★
                            </span>
                          ))}
                          <span className="ml-1 font-semibold text-gray-700 text-sm">
                            {review.rating}
                          </span>
                        </div>
                        <span className="text-gray-500 text-xs">
                          on {review.date}
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side: Active Review */}
          <div className="lg:w-3/5 xl:w-3/5">
            <div className="relative bg-linear-to-br from-amber-50 to-white rounded-2xl p-6 md:p-8 lg:p-10 shadow-xl border border-amber-500 h-full">
              {/* Decorative corner */}
              <div className="absolute top-0 right-0 w-20 h-20 overflow-hidden">
                <div className="absolute top-0 right-0 w-28 h-28 bg-linear-to-bl from-amber-600/20 to-transparent transform rotate-45 translate-x-14 -translate-y-14"></div>
              </div>

              {/* Quote mark - Reduced margin */}
              <div className="text-amber-600 text-6xl md:text-7xl font-serif leading-none select-none -mb-2">
                &ldquo;
              </div>

              {/* Review text */}
              <div
                key={activeIndex}
                className="animate-in fade-in slide-in-from-bottom-8 duration-700"
              >
                <p className="text-lg md:text-xl lg:text-2xl font-serif italic text-gray-800 leading-relaxed">
                  {reviews[activeIndex].text}
                </p>

                {/* Current reviewer info */}
                <div className="mt-8 pt-6 border-t border-amber-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-0.5 bg-amber-600"></div>
                    <div>
                      <p className="text-amber-700 font-bold uppercase tracking-widest text-xs">
                        Verified Customer
                      </p>
                      <p className="text-gray-600 text-xs mt-0.5">
                        {reviews[activeIndex].name} • Accra, Ghana
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
