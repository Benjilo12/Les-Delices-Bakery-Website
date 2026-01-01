"use client";

import { Phone, Mail } from "lucide-react";

export default function Topbar() {
  const phoneNumber = "+1 (234) 567-8900";
  const emailAddress = "info@lesdelices.com";

  return (
    <div className="hidden lg:block bg-linear-to-r from-amber-500 to-amber-500 text-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-10">
          {/* Left: Contact Info */}
          <div className="flex items-center gap-6">
            {/* Phone */}
            <a
              href={`tel:${phoneNumber.replace(/\D/g, "")}`}
              className="flex items-center gap-2 text-sm hover:text-amber-100 transition-colors group"
            >
              <Phone className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
              <span>{phoneNumber}</span>
            </a>

            {/* Email */}
            <a
              href={`mailto:${emailAddress}`}
              className="flex items-center gap-2 text-sm hover:text-amber-100 transition-colors group"
            >
              <Mail className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
              <span>{emailAddress}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
