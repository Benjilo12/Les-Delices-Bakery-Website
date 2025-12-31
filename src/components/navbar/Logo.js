import Link from "next/link";
import Image from "next/image";

export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <div className="w-10 h-10 md:w-12 md:h-12 relative">
        {/* <Image
          src="/logo.png" // Add your logo in public folder
          alt="Les Délices"
          fill
          className="object-contain"
        /> */}
      </div>
      <span className="text-xl md:text-2xl font-serif text-pink-900">
        Les Délices
      </span>
    </Link>
  );
}
