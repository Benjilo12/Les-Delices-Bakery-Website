"use client";

import { useEffect, useState } from "react";
import { FloatingWhatsApp } from "react-floating-whatsapp";

const WhatsAppWidget = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    const checkMobile = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Don't render until mounted to avoid hydration issues
  if (!isMounted) {
    return null;
  }

  return (
    <FloatingWhatsApp
      phoneNumber="233249826137"
      accountName="les delices"
      avatar="/images/logo.png"
      statusMessage="Typically replies in a few minutes"
      chatMessage="Hi there! 👋 How can we help you?"
      placeholder="Type a message..."
      // Core functionality props
      allowEsc={true}
      allowClickAway={false}
      notification={!isMobile} // Disable notification on mobile
      notificationDelay={30000}
      notificationSound={!isMobile} // Disable sound on mobile
      // Style configuration - only using valid props
      buttonStyle={{
        bottom: isMobile ? "80px" : "30px",
        right: isMobile ? "20px" : "30px",
        width: isMobile ? "50px" : "60px",
        height: isMobile ? "50px" : "60px",
        zIndex: 9999,
      }}
      // Chat box style
      chatboxStyle={{
        bottom: isMobile ? "140px" : "110px",
        right: isMobile ? "20px" : "30px",
        width: isMobile ? "300px" : "350px",
        zIndex: 9998,
      }}
      // Only use valid props that exist in the library
      darkMode={false}
    />
  );
};

export default WhatsAppWidget;
