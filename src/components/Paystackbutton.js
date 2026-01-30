"use client";

import { useState } from "react";

export default function PaystackButton({
  orderNumber,
  amount,
  email,
  onSuccess,
  onClose,
  disabled,
  buttonText = "Pay with Paystack",
}) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");

  const initializePayment = async () => {
    if (disabled || isProcessing) return;

    setIsProcessing(true);
    setError("");

    try {
      console.log("Initializing payment for order:", orderNumber);

      const response = await fetch("/api/payments/initialize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderNumber }),
      });

      console.log("Payment initialization response status:", response.status);

      // Get response as text first
      const responseText = await response.text();
      console.log("Raw payment response:", responseText);

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error("Failed to parse payment response:", parseError);
        throw new Error("Invalid response from payment server");
      }

      if (!response.ok) {
        throw new Error(data.error || "Failed to initialize payment");
      }

      if (!data.authorization_url) {
        throw new Error("No payment URL received");
      }

      console.log("Redirecting to Paystack:", data.authorization_url);
      window.location.href = data.authorization_url;
    } catch (error) {
      console.error("Payment initialization error:", error);
      setError(error.message);
      onClose?.();
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full">
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <button
        onClick={initializePayment}
        disabled={disabled || isProcessing}
        className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all ${
          !disabled && !isProcessing
            ? "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl"
            : "bg-gray-200 text-gray-400 cursor-not-allowed"
        }`}
      >
        {isProcessing ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            Processing...
          </>
        ) : (
          <>
            <div className="text-lg">💰</div>
            {buttonText}
          </>
        )}
      </button>
    </div>
  );
}
