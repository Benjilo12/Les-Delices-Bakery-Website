import { Highlighter } from "@/components/ui/highlighter";
import { SignIn } from "@clerk/nextjs";
import Image from "next/image";


export default function SignInPage() {
  return (
    <div className="flex min-h-screen">
      {/* LEFT SIDE: Sign In */}
      <div className="w-full lg:w-[30%] flex flex-col justify-center items-center lg:items-start p-6 sm:p-10 lg:pl-16 bg-white">
        <div className="w-full max-w-lg">
          {/* Logo */}
          <div className="mb-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-linear-to-r from-amber-600 to-amber-800 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">LD</span>
              </div>
              <h1 className="text-2xl font-serif italic text-amber-900">
                Les Délices
              </h1>
            </div>
            <p className="text-gray-600 text-sm">Join our sweet community</p>
          </div>

          {/* Clerk Sign In */}
          <SignIn
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "shadow-none border-0 p-0 bg-transparent w-full",
                headerTitle: "text-2xl font-bold text-gray-900 mb-1",
                headerSubtitle: "text-gray-500 mb-6",
                socialButtonsBlockButton:
                  "border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors",
                socialButtonsBlockButtonText: "text-gray-700 font-medium",
                dividerLine: "bg-gray-200",
                dividerText: "text-gray-500",
                formFieldLabel: "text-gray-700 font-medium text-sm",
                formFieldInput:
                  "border border-gray-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 rounded-lg",
                formButtonPrimary:
                  "bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-medium py-3 rounded-lg transition-all",
                footerActionLink:
                  "text-amber-600 hover:text-amber-700 font-medium",
              },
              variables: {
                colorPrimary: "#d97706",
                colorText: "#374151",
                colorTextSecondary: "#6b7280",
              },
            }}
            routing="path"
            path="/sign-in"
            signInUrl="/sign-in"
            redirectUrl="/"
          />

          {/* Terms */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              By signing in, you agree to our{" "}
              <a href="/terms" className="text-amber-600 hover:underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="/privacy" className="text-amber-600 hover:underline">
                Privacy Policy
              </a>
              .
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: Image */}
      <div className="hidden lg:flex lg:w-[70%] relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/bakery-background.jpg"
            alt="Les Délices Bakery"
            fill
            className="object-cover"
            priority
            sizes="60vw"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/50 to-black/40" />
        </div>

        {/* Overlay Content */}
        <div className="relative z-10 w-full flex flex-col justify-center p-12 xl:p-24">
          <div className="max-w-2xl">
            <blockquote className="text-3xl xl:text-4xl font-serif italic text-white leading-tight mb-10">
              “At{" "}
              <span className="text-amber-600">
                {" "}
                <Highlighter action="hightlight" color="#E91E63">Les Délices By Akorfa</Highlighter>
              </span>
              , we believe life’s best moments deserve a sweet touch that is
              both delicious and thoughtfully crafted.”
            </blockquote>

            <div className="flex items-center gap-4">
              <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-amber-300">
                <Image
                  src="/images/profile.png"
                  alt="Mrs. Eleanor Dartey"
                  fill
                  className="object-cover"
                  sizes="56px"
                />
              </div>
              <div>
                <p className="font-bold text-white text-lg">
                  Mrs. Eleanor Dartey
                </p>
                <p className="text-amber-200 text-sm uppercase tracking-widest">
                  CEO & Founder
                </p>
              </div>
            </div>

            {/* Features */}
            <div className="mt-12 grid grid-cols-2 gap-6">
              <div className="flex items-center gap-3 text-amber-50">
                🎂 <span>Artisanal Quality</span>
              </div>
              <div className="flex items-center gap-3 text-amber-50">
                🌿 <span>Wholesome Ingredients</span>
              </div>
              <div className="flex items-center gap-3 text-amber-50">
                🎨 <span>Custom Designs</span>
              </div>
              <div className="flex items-center gap-3 text-amber-50">
                🚚 <span>Handcrafted in Accra</span>
              </div>
            </div>

            <div className="mt-16 pt-8 border-t border-white/20">
              <p className="text-amber-100/80 text-xs uppercase tracking-widest">
                Handcrafted with love in Accra, Ghana
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
