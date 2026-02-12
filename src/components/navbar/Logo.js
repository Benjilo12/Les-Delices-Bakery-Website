import Link from "next/link";
import Image from "next/image";

export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 mt-7">
      <div className="relative  md:w-70 md:h-35">
        <Image
          src="/images/logo 2.png"
          alt="Les Délices"
          fill
          className="object-contain"
        />
      </div>
      {/* <span className="text-xl md:text-2xl font-serif text-pink-900">
        Les Délices
      </span> */}
    </Link>
  );
}
