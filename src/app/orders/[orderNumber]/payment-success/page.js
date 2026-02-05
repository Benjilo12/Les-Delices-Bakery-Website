// app/orders/[orderNumber]/payment-success/page.js
"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useCart } from "@/lib/store";
import Navbar from "@/components/Navbar";
import {
  CheckCircle,
  Clock,
  Home,
  ShoppingBag,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";

export default function PaymentSuccessPage() {
  const router = useRouter();
  const params = useParams();
  const { clearCart } = useCart();
  const [isLoading, setIsLoading] = useState(true);
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        console.log("=== Starting payment verification ===");

        // Get reference from URL query params
        const urlParams = new URLSearchParams(window.location.search);
        const reference = urlParams.get("reference");
        const orderNumber = params.orderNumber;

        console.log("Order Number:", orderNumber);
        console.log("Payment Reference:", reference);
        console.log("Full URL:", window.location.href);

        if (!reference) {
          console.error("No payment reference in URL");
          throw new Error(
            "No payment reference found. Please check your email for order confirmation.",
          );
        }

        console.log("Calling verify API...");

        // Verify payment
        const response = await fetch("/api/payments/verify", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ reference }),
        });

        console.log("Verify API response status:", response.status);

        const data = await response.json();
        console.log("Verify API response data:", data);

        if (!response.ok) {
          throw new Error(
            data.error || `Verification failed with status ${response.status}`,
          );
        }

        if (data.success) {
          console.log("Payment verified successfully!");

          // Clear cart on successful payment
          clearCart();
          setOrder(data.order);

          // Update local storage
          localStorage.removeItem("cart");

          console.log("Cart cleared and order set");
        } else {
          throw new Error(data.error || "Payment verification failed");
        }
      } catch (error) {
        console.error("=== Payment verification error ===");
        console.error("Error:", error);
        console.error("Error message:", error.message);
        setError(error.message);
      } finally {
        setIsLoading(false);
        console.log("=== Verification process complete ===");
      }
    };

    verifyPayment();
  }, [params.orderNumber, clearCart]);

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex flex-col items-center justify-center bg-linear-to-b from-amber-50 to-white">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-amber-600 mb-6"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Verifying your payment...
          </h2>
          <p className="text-gray-600">
            Please wait while we confirm your transaction
          </p>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex flex-col items-center justify-center bg-linear-to-b from-orange-50 to-white px-4">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-lg border border-orange-200 p-8">
            <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center mb-6 mx-auto">
              <AlertCircle className="w-8 h-8 text-orange-500" />
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-3 text-center">
              Payment Processing
            </h1>

            <p className="text-gray-600 mb-6 text-center">{error}</p>

            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-700">
                <strong>What to do next:</strong>
              </p>
              <ul className="text-sm text-gray-600 mt-2 space-y-1 list-disc list-inside">
                <li>Check your email for order confirmation</li>
                <li>View your orders to see the status</li>
                <li>Contact support if you need help</li>
              </ul>
            </div>

            <div className="flex flex-col gap-3">
              <Link
                href="/orders"
                className="w-full bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg font-medium transition-colors text-center"
              >
                View My Orders
              </Link>

              <Link
                href="/"
                className="w-full border border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-3 rounded-lg font-medium transition-colors text-center"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-linear-to-b from-green-50 to-white">
        <div className="max-w-2xl mx-auto px-4 py-16">
          <div className="text-center">
            {/* Success Icon */}
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center animate-bounce">
              <CheckCircle className="w-12 h-12 text-green-500" />
            </div>

            {/* Success Message */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Payment Successful! 🎉
            </h1>

            <p className="text-lg text-gray-600 mb-8">
              Thank you for your order! We&apos;ve received your payment and are
              preparing your delicious treats.
            </p>

            {/* Order Details Card */}
            {order && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Order Details
                </h2>
                <div className="space-y-3 text-left">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Order Number:</span>
                    <span className="font-medium text-gray-900">
                      {order.orderNumber}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Status:</span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      {order.status}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Payment Status:</span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      {order.paymentStatus}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                    <span className="text-gray-600 font-medium text-lg">
                      Total Paid:
                    </span>
                    <span className="text-2xl font-bold text-amber-600">
                      GHS {order.totalAmount?.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-md hover:shadow-lg"
              >
                <Home className="w-4 h-4" />
                Back to Home
              </Link>

              <Link
                href="/orders"
                className="inline-flex items-center justify-center gap-2 border-2 border-amber-600 text-amber-600 hover:bg-amber-50 px-6 py-3 rounded-lg font-medium transition-colors"
              >
                <ShoppingBag className="w-4 h-4" />
                View My Orders
              </Link>
            </div>

            {/* Additional Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-gray-700 mb-2">
                📧 <strong>Confirmation Email Sent</strong>
              </p>
              <p className="text-sm text-gray-600">
                A confirmation email has been sent to you. Our team will contact
                you soon regarding delivery details.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
