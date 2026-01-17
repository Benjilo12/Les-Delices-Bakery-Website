import Image from "next/image";
import { Highlighter } from "./ui/highlighter";

export default function AboutSection() {
  return (
    <section className="py-16 md:py-20 bg-amber-600">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-20">
          {/* Image */}
          <div className="lg:w-7/12">
            <div className="relative w-full h-96 lg:h-128 mx-auto rounded-full overflow-hidden shadow-2xl border-8 border-white">
              <Image
                src="/images/profile.png"
                alt="Mrs. Eleanor Dartey - CEO of Les Délices By Akorfa"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </div>
          </div>

          {/* Content - All text in white */}
          <div className="lg:w-5/12 text-white">
            <span className="text-amber-100 font-bold uppercase tracking-[0.3em] text-xs mb-4 block">
              <Highlighter action="underline" color="#E91E63">
                Our Story
              </Highlighter>
            </span>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif italic leading-tight mb-6">
              From{" "}
              <span className="text-pink-500">
                <Highlighter color="#FFEDC2">Passion</Highlighter>
              </span>{" "}
              to Celebration
            </h2>

            <div className="space-y-3 text-amber-50 text-base leading-relaxed">
              <p>
                What began as a hobby for our founder,{" "}
                <strong className="text-white">Mrs. Eleanor Dartey</strong>,
                evolved into a passion for crafting cakes that become the
                centerpiece of family joy.
              </p>

              <p>
                Today, <em className="text-white">Les Délices By Akorfa</em> is
                your partner in celebration, offering healthy, delicious treats
                where great taste meets well-being.
              </p>

              <blockquote className="text-amber-100 italic text-lg font-serif border-l-4 border-amber-300 pl-6 py-2 my-4">
                &quot;Whether it&apos;s a birthday, anniversary, or &lsquo;just
                because&rsquo; treat, we&apos;re honored to be part of your
                story.&quot;
              </blockquote>
            </div>

            <div className="mt-8 pt-6 border-t border-amber-300/50">
              <p className="font-serif text-xl text-white">
                Mrs. Eleanor Dartey
              </p>
              <p className="text-sm text-amber-100 uppercase tracking-widest">
                CEO & Founder
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
