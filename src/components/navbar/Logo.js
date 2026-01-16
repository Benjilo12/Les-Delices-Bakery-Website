import Link from "next/link";
import Image from "next/image";

export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2">
      {/* <div className="w-50 h-50 md:w-12 md:h-50relative">
        <Image
          src="/images/logo.png" // Add your logo in public folder
          alt="Les Délices"
          fill
          className="object-contain"
        />
      </div> */}
      <span className="text-xl md:text-2xl font-serif text-pink-900">
        Les Délices
      </span>
    </Link>
  );
}
