import React from "react";
import Image from "next/image";

export default function PaymentInfoSection() {
  return (
    <section className="w-full bg-white py-12 md:py-16 px-4 border-t border-gray-100">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          {/* Left Side: Branding */}
          <div>
            <span className="text-amber-600 font-bold uppercase tracking-[0.4em] text-[10px] mb-4 block">
              Secure Checkout
            </span>
            <h2 className="text-3xl md:text-5xl font-serif text-gray-900 mb-6 leading-tight">
              Your <span className="italic text-amber-700">Payment</span> Safety{" "}
              <br />
              is Our Priority
            </h2>

            {/* Paystack Logo & Text Label */}
            <div className="flex items-center gap-4 mt-8">
              <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-lg border border-gray-100">
                <div className="relative w-6 h-6">
                  <Image
                    src="/images/icon.jpeg"
                    alt="Paystack"
                    fill
                    className="object-contain"
                  />
                </div>
                <span className="text-sm font-bold text-[#011b33] tracking-tight">
                  paystack
                </span>
              </div>
              <div className="flex items-center gap-2 text-green-600">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-widest">
                  Verified Partner
                </span>
              </div>
            </div>
          </div>

          {/* Right Side: Gateway Image */}
          <div className="space-y-6">
            <div className="bg-white p-6 md:p-10 rounded-3xl border border-gray-200 shadow-sm hover:shadow-md transition-all">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6 text-center lg:text-left">
                We accept all major payment methods
              </p>

              {/* Main Gateway Image with Next.js Optimization */}
              <div className="relative w-full h-24 md:h-32">
                <Image
                  src="/images/gateway.png"
                  alt="Visa, Mastercard, MoMo, AT Money"
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 500px"
                />
              </div>
            </div>

            <p className="text-[10px] text-gray-400 font-light italic text-center lg:text-right">
              © {new Date().getFullYear()} Les Délices By Akorfa • Secured by
              Paystack
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
