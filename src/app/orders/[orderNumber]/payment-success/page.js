"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useCart } from "@/lib/store";
import Navbar from "@/components/Navbar";
import { CheckCircle, Home, ShoppingBag, AlertCircle } from "lucide-react";
import Link from "next/link";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";

export default function PaymentSuccessPage() {
  const router = useRouter();
  const params = useParams();
  const { clearCart } = useCart();

  const [isLoading, setIsLoading] = useState(true);
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");
  const [showConfetti, setShowConfetti] = useState(false);

  const { width, height } = useWindowSize();

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const reference = urlParams.get("reference");
        const orderNumber = params.orderNumber;

        if (!reference) {
          throw new Error(
            "No payment reference found. Please check your email for order confirmation.",
          );
        }

        const response = await fetch("/api/payments/verify", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ reference }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Payment verification failed");
        }

        if (data.success) {
          clearCart();
          localStorage.removeItem("cart");
          setOrder(data.order);

          // 🎉 CONFETTI TRIGGER
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 5000);
        } else {
          throw new Error(data.error || "Payment verification failed");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    verifyPayment();
  }, [params.orderNumber, clearCart]);

  // ⏳ LOADING STATE
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

  // ❌ ERROR STATE
  if (error) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-orange-50 to-white px-4">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-lg border border-orange-200 p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-orange-100 flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-orange-500" />
            </div>

            <h1 className="text-2xl font-bold mb-3">Payment Processing</h1>
            <p className="text-gray-600 mb-6">{error}</p>

            <div className="flex flex-col gap-3">
              <Link
                href="/orders"
                className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg font-medium"
              >
                View My Orders
              </Link>

              <Link
                href="/"
                className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  // ✅ SUCCESS STATE
  return (
    <>
      <Navbar />

      {showConfetti && (
        <Confetti
          width={width}
          height={height}
          numberOfPieces={350}
          recycle={false}
          gravity={0.3}
        />
      )}

      <div className="min-h-screen bg-linear-to-b from-green-50 to-white">
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center animate-bounce">
            <CheckCircle className="w-12 h-12 text-green-500" />
          </div>

          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            Payment Successful! 🎉
          </h1>

          <p className="text-lg text-gray-600 mb-8">
            Thank you for your order. We’re preparing your items!
          </p>

          {order && (
            <div className="bg-white rounded-2xl shadow-lg border p-6 mb-8 text-left">
              <h2 className="text-xl font-semibold mb-4">Order Details</h2>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Order Number:</span>
                  <span className="font-medium">{order.orderNumber}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                    {order.status}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Payment:</span>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                    {order.paymentStatus}
                  </span>
                </div>

                <div className="flex justify-between pt-3 border-t">
                  <span className="font-medium text-lg">Total Paid:</span>
                  <span className="text-2xl font-bold text-amber-600">
                    GHS {order.totalAmount?.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg font-medium"
            >
              <Home className="w-4 h-4" />
              Back to Home
            </Link>

            <Link
              href="/orders"
              className="flex items-center justify-center gap-2 border-2 border-amber-600 text-amber-600 px-6 py-3 rounded-lg font-medium"
            >
              <ShoppingBag className="w-4 h-4" />
              View My Orders
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
