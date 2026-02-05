// app/sign-up/page.js
import { SignUp } from "@clerk/nextjs";
import Image from "next/image";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen overflow-hidden bg-white">
      {/* LEFT SIDE: Sign Up */}
      <div className="w-full lg:w-[40%] xl:w-[35%] h-screen overflow-y-auto flex flex-col justify-center items-center lg:items-start p-6 sm:p-10 lg:pl-12 xl:pl-20 bg-white">
        <div className="w-full max-w-md py-8">
          {/* Logo */}
          <div className="mb-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-gradient-to-r from-amber-600 to-amber-800 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">LD</span>
              </div>
              <h1 className="text-2xl font-serif italic text-amber-900">
                Les Délices
              </h1>
            </div>
            <p className="text-gray-600 text-sm">Join our sweet community</p>
          </div>

          {/* Clerk Sign Up */}
          <SignUp
            appearance={{
              elements: {
                rootBox: "w-full mx-auto",
                card: "shadow-none border-0 p-0 bg-transparent w-full",
                headerTitle: "text-2xl font-bold text-gray-900 mb-1",
                headerSubtitle: "text-gray-500 mb-6",
                socialButtonsBlockButton:
                  "border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors text-gray-700",
                socialButtonsBlockButtonText: "text-gray-700 font-medium",
                dividerLine: "bg-gray-200",
                dividerText: "text-gray-500",
                formFieldLabel: "text-gray-700 font-medium text-sm mb-2",
                formFieldInput:
                  "border border-gray-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 rounded-lg w-full px-3 py-2",
                formButtonPrimary:
                  "bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-medium py-3 rounded-lg w-full transition-all",
                footerActionLink:
                  "text-amber-600 hover:text-amber-700 font-medium",
                footer: "mt-4",
              },
            }}
            routing="path"
            path="/sign-up"
            signInUrl="/sign-in"
            redirectUrl="/"
          />

          {/* Terms */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-[11px] text-gray-500 leading-relaxed">
              By creating an account, you agree to our{" "}
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
      <div className="hidden lg:flex lg:w-[60%] xl:w-[65%] relative overflow-hidden h-screen">
        <div className="absolute inset-0">
          <Image
            src="/images/bakery-background.jpg"
            alt="Les Délices Bakery"
            fill
            className="object-cover"
            priority
            sizes="65vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/40" />
        </div>

        {/* Overlay Content */}
        <div className="relative z-10 w-full flex flex-col justify-center p-12 xl:p-24">
          <div className="max-w-2xl">
            <blockquote className="text-2xl xl:text-4xl font-serif italic text-white leading-tight mb-10">
              "Create an account to unlock exclusive benefits at{" "}
              <span className="text-amber-500">Les Délices</span>
              !"
            </blockquote>

            <div className="space-y-6">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center mt-0.5">
                  <span className="text-amber-400">✓</span>
                </div>
                <div>
                  <h4 className="font-bold text-white mb-1">Order Tracking</h4>
                  <p className="text-amber-100/80 text-sm">
                    Track your orders in real-time
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center mt-0.5">
                  <span className="text-amber-400">✓</span>
                </div>
                <div>
                  <h4 className="font-bold text-white mb-1">Fast Checkout</h4>
                  <p className="text-amber-100/80 text-sm">
                    Save your details for faster checkout
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center mt-0.5">
                  <span className="text-amber-400">✓</span>
                </div>
                <div>
                  <h4 className="font-bold text-white mb-1">Order History</h4>
                  <p className="text-amber-100/80 text-sm">
                    Access your complete order history
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center mt-0.5">
                  <span className="text-amber-400">✓</span>
                </div>
                <div>
                  <h4 className="font-bold text-white mb-1">
                    Exclusive Offers
                  </h4>
                  <p className="text-amber-100/80 text-sm">
                    Get special discounts and early access to new products
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-12 xl:mt-16 pt-8 border-t border-white/20">
              <p className="text-amber-100/60 text-[10px] xl:text-xs uppercase tracking-[0.2em]">
                Join 5,000+ happy customers
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
