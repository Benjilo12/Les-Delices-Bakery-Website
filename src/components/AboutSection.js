import Image from "next/image";
import { Highlighter } from "./ui/highlighter";

export default function AboutSection() {
  return (
    <section className="py-16 md:py-24 bg-amber-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          {/* Image Container */}
          <div className="w-full lg:w-6/12 flex justify-center">
            <div
              className="relative 
              /* Mobile size */
              w-72 h-72 
              /* Laptop (14 inch) and Desktop size */
              md:w-112.5 md:h-112.5 
              lg:w-125 lg:h-125 
              rounded-full overflow-hidden shadow-2xl border-8 border-white bg-white"
            >
              <Image
                src="/images/profile.png"
                alt="Mrs. Eleanor Dartey - CEO of Les Délices By Akorfa"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 288px, (max-width: 1280px) 450px, 500px"
                priority
              />
            </div>
          </div>

          {/* Content - All text in white */}
          <div className="w-full lg:w-6/12 text-white">
            <span className="text-amber-100 font-bold uppercase tracking-[0.3em] text-xs mb-4 block">
              <Highlighter action="underline" color="#E91E63">
                Our Story
              </Highlighter>
            </span>

            <h2 className="text-3xl md:text-5xl lg:text-6xl font-serif italic leading-tight mb-8">
              From{" "}
              <span className="text-pink-500">
                <Highlighter color="#FFEDC2">Passion</Highlighter>
              </span>{" "}
              to Celebration
            </h2>

            <div className="space-y-6 text-amber-50 text-base md:text-lg leading-relaxed">
              <p>
                What began as a hobby for our founder,{" "}
                <strong className="text-white">Mrs. Eleanor Dartey</strong>,
                evolved into a passion for crafting cakes that become the
                centerpiece of family joy.
              </p>

              <p>
                Today,{" "}
                <em className="text-white font-serif">Les Délices By Akorfa</em>{" "}
                is your partner in celebration, offering healthy, delicious
                treats where great taste meets well-being.
              </p>

              <blockquote className="text-amber-100 italic text-xl font-serif border-l-4 border-white/40 pl-6 py-2 my-8">
                &quot;Whether it&apos;s a birthday, anniversary, or &lsquo;just
                because&rsquo; treat, we&apos;re honored to be part of your
                story.&quot;
              </blockquote>
            </div>

            <div className="mt-10 pt-8 border-t border-white/20">
              <p className="font-serif text-2xl text-white">
                Mrs. Eleanor Dartey
              </p>
              <p className="text-xs text-amber-100 uppercase tracking-widest mt-1">
                CEO & Founder
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
