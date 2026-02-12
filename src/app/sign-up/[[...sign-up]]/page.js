// app/sign-up/page.js
import Logo from "@/components/navbar/Logo";
import { SignUp } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen flex-col lg:flex-row bg-white">
      {/* Mobile Logo Header (only on mobile) */}
      <div className="lg:hidden sticky top-0 z-10 bg-white border-b border-gray-100 py-4 px-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Logo />
            <p className="text-gray-600 text-xs whitespace-nowrap">
              Join our sweet community
            </p>
          </div>
        </div>
      </div>

      {/* LEFT SIDE: Sign Up */}
      <div className="w-full lg:w-[40%] xl:w-[35%] flex-1 flex flex-col justify-center items-center lg:items-start p-4 sm:p-6 lg:p-8 xl:p-12 bg-white overflow-y-auto">
        <div className="w-full max-w-[90vw] sm:max-w-md mx-auto py-4 sm:py-6 lg:py-8">
          {/* Logo - Desktop only - Side by side */}
          <div className="hidden lg:flex lg:flex-row lg:items-center lg:justify-between  lg:mb-8 w-full">
            <div className="flex items-center gap-2">
              <Image
                src="/images/logo 2.png"
                alt="Les Délices"
                width={120}
                height={120}
              />
            </div>
            <p className="text-gray-600 text-sm lg:text-base whitespace-nowrap ml-4">
              Join our sweet community
            </p>
          </div>

          {/* Clerk Sign Up - Responsive with overflow handling */}
          <div className="w-full overflow-visible">
            <SignUp
              appearance={{
                elements: {
                  rootBox: "w-full mx-auto overflow-visible",
                  card: "shadow-none border-0 p-0 bg-transparent w-full overflow-visible",
                  headerTitle:
                    "text-xl sm:text-2xl font-bold text-gray-900 mb-1 text-center lg:text-left",
                  headerSubtitle:
                    "text-gray-500 mb-4 sm:mb-6 text-sm sm:text-base text-center lg:text-left",
                  socialButtonsBlockButton:
                    "border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors text-gray-700 h-12",
                  socialButtonsBlockButtonText:
                    "text-gray-700 font-medium text-sm",
                  dividerLine: "bg-gray-200",
                  dividerText: "text-gray-500 text-xs sm:text-sm",
                  formFieldLabel: "text-gray-700 font-medium text-sm mb-2",
                  formFieldInput:
                    "border border-gray-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 rounded-lg w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base h-12",
                  formButtonPrimary:
                    "bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-medium py-3 sm:py-3.5 rounded-lg w-full transition-all text-sm sm:text-base h-12",
                  footerActionLink:
                    "text-amber-600 hover:text-amber-700 font-medium text-sm",
                  footer: "mt-4 text-sm",
                  identityPreview: "py-2 sm:py-3",
                  identityPreviewText: "text-sm sm:text-base",
                  formFieldInputShowPasswordButton:
                    "text-gray-500 hover:text-amber-600",
                  formFieldSuccessText: "text-sm",
                  formFieldWarningText: "text-sm",
                  formFieldErrorText: "text-sm",
                  phoneInput: "h-12",
                  otpCodeFieldInput: "h-12 w-12 sm:w-14",
                  alert: "text-sm p-3",
                  alertText: "text-sm",
                  // Mobile-specific fixes with overflow
                  card__content: "px-0 sm:px-0 overflow-visible",
                  pageScrollBox: "px-0 sm:px-0 overflow-visible",
                  modalContent: "px-4 sm:px-6 overflow-visible",
                  form: "space-y-4 sm:space-y-6 overflow-visible",
                  formFieldRow: "mb-4 sm:mb-6 overflow-visible",
                  // Ensure Clerk container allows overflow
                  main: "overflow-visible",
                  scrollBox: "overflow-visible",
                  form__scrollBox: "overflow-visible",
                },
              }}
              routing="path"
              path="/sign-up"
              signInUrl="/sign-in"
              redirectUrl="/"
            />
          </div>

          {/* Terms */}
          <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200">
            <p className="text-[10px] sm:text-[11px] text-gray-500 leading-relaxed text-center lg:text-left">
              By creating an account, you agree to our{" "}
              <Link href="/terms" className="text-amber-600 hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-amber-600 hover:underline">
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: Fixed Image */}
      <div className="hidden lg:flex lg:w-[60%] xl:w-[65%] relative">
        {/* Fixed image container */}
        <div className="fixed inset-0 left-[40%] xl:left-[35%] h-full w-[60%] xl:w-[65%]">
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
          <div className="relative z-10 w-full h-full flex flex-col justify-center p-8 lg:p-12 xl:p-24">
            <div className="max-w-2xl">
              <blockquote className="text-2xl xl:text-4xl font-serif italic text-white leading-tight mb-8 lg:mb-10">
                &quot;Create an account to unlock exclusive benefits at{" "}
                <span className="text-amber-500">Les Délices</span>
                !&quot;
              </blockquote>

              <div className="space-y-4 lg:space-y-6">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center mt-0.5 shrink-0">
                    <span className="text-amber-400">✓</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-1 text-sm lg:text-base">
                      Order Tracking
                    </h4>
                    <p className="text-amber-100/80 text-xs lg:text-sm">
                      Track your orders in real-time
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center mt-0.5 shrink-0">
                    <span className="text-amber-400">✓</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-1 text-sm lg:text-base">
                      Fast Checkout
                    </h4>
                    <p className="text-amber-100/80 text-xs lg:text-sm">
                      Save your details for faster checkout
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center mt-0.5 shrink-0">
                    <span className="text-amber-400">✓</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-1 text-sm lg:text-base">
                      Order History
                    </h4>
                    <p className="text-amber-100/80 text-xs lg:text-sm">
                      Access your complete order history
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center mt-0.5 shrink-0">
                    <span className="text-amber-400">✓</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-1 text-sm lg:text-base">
                      Exclusive Offers
                    </h4>
                    <p className="text-amber-100/80 text-xs lg:text-sm">
                      Get special discounts and early access to new products
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 lg:mt-12 pt-6 border-t border-white/20">
                <p className="text-amber-100/60 text-[10px] xl:text-xs uppercase tracking-[0.2em]">
                  Join 200+ happy customers
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
