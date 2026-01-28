import React from "react";
import Image from "next/image";

const PaymentBanner = () => {
  return (
    <section className="w-full bg-white py-10 border-t border-gray-100">
      {/* Max-width 7xl for a wide layout spread */}
      <div className="max-w-7xl mx-auto px-4 text-center">
        <div className="mb-3">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Accept all major payments
          </h2>
          <p className="text-gray-500 text-base">
            Receive payments via card or mobile money
          </p>
        </div>

        {/* Main Gateway Logos Container */}
        <div className="flex flex-wrap items-center justify-center mb-5">
          <div className="relative w-full max-w-6xl h-20 md:h-28">
            <Image
              src="/images/gateway.png"
              alt="Accepted Payment Methods"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>

        {/* Paystack Button Section */}
        <div className="flex flex-col items-center justify-center gap-2">
          <div className="flex justify-center">
            <button className="flex items-center gap-1  text-sky-600 px-6 py-3 rounded-md font-semibold text-sm tracking-wide uppercase transition-all shadow hover:shadow-md active:scale-[0.98]">
              {/* Paystack Logo placeholder - Add your logo file to /public/images/ */}
              <div className="relative w-5 h-5">
                <Image
                  src="/images/icon.jpeg"
                  alt="Paystack"
                  fill
                  className="object-contain"
                />
              </div>
              Paystack
            </button>
          </div>

          {/* Trust Caption */}
          <div className="flex items-center gap-1 text-gray-500 text-xs font-medium uppercase tracking-wide">
            <span>All payments are secured and powered by</span>
            <span className="text-[#4ba2c5] font-semibold">Paystack</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PaymentBanner;
