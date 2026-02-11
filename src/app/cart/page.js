"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useCart, useUI } from "@/lib/store";
import Navbar from "@/components/Navbar";
import PaymentBanner from "@/components/PaymentBanner";
import Footer from "@/components/Footer";
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowLeft,
  Shield,
  Truck,
  Clock,
  Cake,
  User,
  Phone,
  MapPin,
  MessageSquare,
  Lock,
  ChevronRight,
  Sparkles,
  Home,
  CreditCard,
} from "lucide-react";
import { useUser, SignInButton } from "@clerk/nextjs";
import Topbar from "@/components/Topbar";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart, total, count } =
    useCart();
  const { formatPrice } = useUI();
  const router = useRouter();
  const { isSignedIn, user, isLoaded } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [orderNumber, setOrderNumber] = useState(null);
  const [paymentError, setPaymentError] = useState("");
  const [isPaymentInitialized, setIsPaymentInitialized] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    deliveryAddress: "",
    deliveryArea: "Accra",
    deliveryInstructions: "",
    eventType: "Birthday",
    eventDate: "",
  });

  const deliveryFee = cart.length > 0 ? 50.0 : 0;
  const subTotal = total;
  const grandTotal = subTotal + deliveryFee;

  // Load user data if signed in
  useEffect(() => {
    if (isSignedIn && user) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);

      setFormData((prev) => ({
        ...prev,
        fullName:
          user.fullName ||
          `${user.firstName || ""} ${user.lastName || ""}`.trim(),
        email: user.primaryEmailAddress?.emailAddress || "",
        phone: user.primaryPhoneNumber?.phoneNumber || "",
        eventDate: tomorrow.toISOString().split("T")[0],
      }));
    }
  }, [isSignedIn, user]);

  const handleQuantityChange = (cartItemId, change) => {
    const item = cart.find((item) => item.cartItemId === cartItemId);
    if (item) {
      const newQuantity = item.quantity + change;
      if (newQuantity >= 1) {
        updateQuantity(cartItemId, newQuantity);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (paymentError) setPaymentError("");
  };

  const validateForm = () => {
    const errors = [];

    if (!formData.fullName.trim()) errors.push("Full Name");
    if (!formData.email.trim()) errors.push("Email Address");
    if (!formData.phone.trim()) errors.push("Phone Number");
    if (!formData.deliveryAddress.trim()) errors.push("Delivery Address");
    if (!formData.deliveryArea.trim()) errors.push("Delivery Area");
    if (!formData.eventDate) errors.push("Event Date");

    if (errors.length > 0) {
      return `Please fill in: ${errors.join(", ")}`;
    }

    // Validate phone number
    const phoneDigits = formData.phone.replace(/\D/g, "");
    if (phoneDigits.length < 10) {
      return "Please enter a valid phone number (at least 10 digits)";
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return "Please enter a valid email address";
    }

    return null;
  };

  const handleCreateOrder = async () => {
    if (!isSignedIn) {
      alert("Please sign in to proceed with payment.");
      return null;
    }

    const validationError = validateForm();
    if (validationError) {
      alert(validationError);
      return null;
    }

    if (cart.length === 0) {
      alert("Your cart is empty.");
      return null;
    }

    setIsLoading(true);
    setPaymentError("");

    try {
      console.log("=== Creating order ===");
      console.log("Cart items:", cart);
      console.log("Customer info:", formData);

      // Format cart items to match API schema
      const formattedItems = cart.map((item) => {
        if (!item.product?._id) {
          throw new Error(`Product "${item.product?.name}" is missing ID`);
        }

        const itemPrice = item.priceOption?.price || item.product.price || 0;
        const itemTotal = itemPrice * (item.quantity || 1);

        return {
          product: item.product._id,
          productName: item.product.name,
          selectedOption: {
            label: item.priceOption?.label || `${item.product.name} - Standard`,
            price: itemPrice,
          },
          quantity: item.quantity || 1,
          selectedFlavors: item.selectedFlavor ? [item.selectedFlavor] : [],
          customization: {
            requested: !!item.customizationNotes,
            details: item.customizationNotes || "",
            additionalCost: 0,
          },
          itemTotal: itemTotal,
        };
      });

      console.log("Formatted items:", formattedItems);

      // Calculate event date
      let eventDate = new Date(formData.eventDate);
      eventDate.setHours(12, 0, 0, 0);

      // Prepare the request body
      const requestBody = {
        items: formattedItems,
        deliveryMethod: "delivery",
        deliveryAddress: {
          street: formData.deliveryAddress,
          area: formData.deliveryArea,
          city: "Accra",
          additionalInfo: formData.deliveryInstructions || "",
        },
        eventDate: eventDate.toISOString(),
        eventType: formData.eventType || "Birthday",
        specialInstructions: formData.deliveryInstructions || "",
        customerPhone: formData.phone,
      };

      console.log("Sending order request...");

      // Create order
      const orderResponse = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const responseText = await orderResponse.text();
      let orderData;

      try {
        orderData = JSON.parse(responseText);
      } catch (parseError) {
        console.error("Failed to parse JSON:", parseError);
        throw new Error("Invalid response from server");
      }

      console.log("Order response:", orderData);

      if (!orderResponse.ok) {
        let errorMessage =
          orderData.error || `Server error: ${orderResponse.status}`;
        if (orderData.details) {
          if (Array.isArray(orderData.details)) {
            errorMessage += `: ${orderData.details.map((d) => d.message || d).join(", ")}`;
          } else {
            errorMessage += `: ${orderData.details}`;
          }
        }
        throw new Error(errorMessage);
      }

      if (!orderData.success) {
        throw new Error(orderData.error || "Failed to create order");
      }

      if (!orderData.order?.orderNumber) {
        throw new Error("Order created but no order number returned");
      }

      console.log("Order created successfully:", orderData.order.orderNumber);
      return orderData.order;
    } catch (error) {
      console.error("Order creation error:", error);
      setPaymentError(`Failed to create order: ${error.message}`);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const handleInitializePayment = async () => {
    const order = await handleCreateOrder();
    if (order) {
      setOrderNumber(order.orderNumber);
      setIsPaymentInitialized(true);
    }
  };

  const handlePaystackPayment = async () => {
    if (!orderNumber) {
      setPaymentError("Please create an order first");
      return;
    }

    setIsProcessingPayment(true);
    setPaymentError("");

    try {
      // Initialize Paystack payment
      const paymentResponse = await fetch("/api/payments/initialize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderNumber: orderNumber,
        }),
      });

      const paymentData = await paymentResponse.json();

      if (!paymentResponse.ok) {
        throw new Error(paymentData.error || "Failed to initialize payment");
      }

      if (!paymentData.success) {
        throw new Error("Payment initialization failed");
      }

      // Redirect to Paystack payment page
      window.location.href = paymentData.authorization_url;
    } catch (error) {
      console.error("Payment initialization error:", error);
      setPaymentError(`Payment error: ${error.message}`);
      setIsProcessingPayment(false);
    }
  };

  const handleDirectPayment = async () => {
    const order = await handleCreateOrder();
    if (order) {
      setOrderNumber(order.orderNumber);
      // Redirect to payment page with order details
      router.push(`/orders/${order.orderNumber}/payment`);
    }
  };

  const handleClearCart = () => {
    if (window.confirm("Are you sure you want to clear your cart?")) {
      clearCart();
      setOrderNumber(null);
      setIsPaymentInitialized(false);
      setPaymentError("");
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  const canProceedToPayment =
    isSignedIn &&
    cart.length > 0 &&
    formData.fullName &&
    formData.email &&
    formData.phone &&
    formData.deliveryAddress &&
    formData.deliveryArea &&
    formData.eventDate;

  return (
    <>
      <Topbar />
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        {/* Breadcrumb */}
        <div className="border-b border-gray-100 bg-white">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <nav className="flex items-center gap-2 text-sm text-gray-500">
              <Link
                href="/"
                className="hover:text-amber-700 transition-colors cursor-pointer"
              >
                Home
              </Link>
              <ChevronRight className="w-4 h-4 text-gray-300" />
              <Link
                href="/menu"
                className="hover:text-amber-700 transition-colors cursor-pointer"
              >
                Menu
              </Link>
              <ChevronRight className="w-4 h-4 text-gray-300" />
              <span className="text-gray-900 font-medium">Shopping Cart</span>
            </nav>
          </div>
        </div>

        <main className="max-w-7xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-serif text-gray-900">
                Your Shopping Cart
              </h1>
              <p className="text-gray-500 mt-2">
                Review your items and proceed to checkout
              </p>
            </div>

            <div className="flex items-center gap-4">
              <Link
                href="/menu"
                className="inline-flex items-center gap-2 bg-amber-100 hover:bg-amber-200 text-amber-900 px-4 py-3 rounded-lg font-medium transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                Continue Shopping
              </Link>

              {cart.length > 0 && (
                <button
                  onClick={handleClearCart}
                  className="inline-flex items-center gap-2 text-red-600 hover:text-red-700 text-sm font-medium cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                  Clear Cart
                </button>
              )}
            </div>
          </div>

          {/* Auth Notice */}
          {!isSignedIn && (
            <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl border border-blue-200">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <User className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-blue-900 mb-1">
                      Sign in to checkout
                    </h3>
                    <p className="text-sm text-blue-700">
                      Please sign in or create an account to complete your
                      purchase
                    </p>
                  </div>
                </div>
                <SignInButton mode="modal" redirectUrl="/cart">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors cursor-pointer">
                    Sign In
                  </button>
                </SignInButton>
              </div>
            </div>
          )}

          {cart.length === 0 ? (
            <EmptyCart />
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Left Column - Cart Items & Customer Info */}
              <div className="lg:col-span-2 space-y-8">
                {/* Cart Items */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">
                      Your Items ({count} {count === 1 ? "item" : "items"})
                    </h2>
                    <span className="text-lg font-bold text-amber-800">
                      {formatPrice(subTotal)}
                    </span>
                  </div>

                  <div className="space-y-4">
                    {cart.map((item) => (
                      <CartItem
                        key={item.cartItemId}
                        item={item}
                        onRemove={() => removeFromCart(item.cartItemId)}
                        onQuantityChange={(change) =>
                          handleQuantityChange(item.cartItemId, change)
                        }
                        formatPrice={formatPrice}
                      />
                    ))}
                  </div>
                </div>

                {/* Customer Information */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">
                    Delivery Information
                  </h2>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-colors"
                          placeholder="John Doe"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-colors"
                        placeholder="john@example.com"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-colors"
                          placeholder="+233 XX XXX XXXX"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Delivery Area *
                      </label>
                      <div className="relative">
                        <Home className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <select
                          name="deliveryArea"
                          value={formData.deliveryArea}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-colors appearance-none bg-white cursor-pointer"
                          required
                        >
                          <option value="Accra">Accra</option>
                          <option value="East Legon">East Legon</option>
                          <option value="Osu">Osu</option>
                          <option value="Cantonments">Cantonments</option>
                          <option value="Airport Residential">
                            Airport Residential
                          </option>
                          <option value="Labone">Labone</option>
                          <option value="Dansoman">Dansoman</option>
                          <option value="Other">Other Area</option>
                        </select>
                        <ChevronRight className="absolute right-3 top-1/2 transform -translate-y-1/2 rotate-90 w-5 h-5 text-gray-400 pointer-events-none" />
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Delivery Address *
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                        <textarea
                          name="deliveryAddress"
                          value={formData.deliveryAddress}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-colors resize-none"
                          rows={3}
                          placeholder="Full address including house number, street name, and landmarks..."
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Event Date *
                      </label>
                      <input
                        type="date"
                        name="eventDate"
                        value={formData.eventDate}
                        onChange={handleInputChange}
                        min={new Date().toISOString().split("T")[0]}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-colors cursor-pointer"
                        required
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        When do you need the order?
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Event Type
                      </label>
                      <select
                        name="eventType"
                        value={formData.eventType}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-colors cursor-pointer"
                      >
                        <option value="Birthday">Birthday</option>
                        <option value="Wedding">Wedding</option>
                        <option value="Anniversary">Anniversary</option>
                        <option value="Corporate">Corporate</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Special Instructions (Optional)
                      </label>
                      <div className="relative">
                        <MessageSquare className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                        <textarea
                          name="deliveryInstructions"
                          value={formData.deliveryInstructions}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-colors resize-none"
                          rows={3}
                          placeholder="Gate code, delivery time preferences, allergy information, etc."
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Order Summary */}
              <div className="space-y-6">
                <div className="bg-white rounded-2xl border border-gray-200 p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">
                    Order Summary
                  </h2>

                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal ({count} items)</span>
                      <span>{formatPrice(subTotal)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Delivery Fee</span>
                      <span>{formatPrice(deliveryFee)}</span>
                    </div>
                    <div className="pt-4 border-t border-gray-200">
                      <div className="flex justify-between text-lg font-bold text-gray-900">
                        <span>Total</span>
                        <span>{formatPrice(grandTotal)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Order Created Success Message */}
                  {orderNumber && (
                    <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                          <svg
                            className="w-4 h-4 text-green-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M5 13l4 4L19 7"
                            ></path>
                          </svg>
                        </div>
                        <h3 className="font-semibold text-green-900">
                          Order Created!
                        </h3>
                      </div>
                      <p className="text-sm text-green-700 mb-2">
                        Order Number:{" "}
                        <span className="font-mono font-bold">
                          {orderNumber}
                        </span>
                      </p>
                      <p className="text-xs text-green-600">
                        Your order has been created. Proceed to payment.
                      </p>
                    </div>
                  )}

                  {/* Error Message */}
                  {paymentError && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                          <svg
                            className="w-4 h-4 text-red-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M6 18L18 6M6 6l12 12"
                            ></path>
                          </svg>
                        </div>
                        <h3 className="font-semibold text-red-900">Error</h3>
                      </div>
                      <p className="text-sm text-red-700">{paymentError}</p>
                      <button
                        onClick={() => setPaymentError("")}
                        className="text-xs text-red-600 hover:text-red-800 mt-1 font-medium cursor-pointer"
                      >
                        Dismiss
                      </button>
                    </div>
                  )}

                  {/* Validation Message */}
                  {!canProceedToPayment && isSignedIn && !orderNumber && (
                    <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                          <svg
                            className="w-4 h-4 text-amber-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.694-.833-2.464 0L4.232 16.5c-.77.833.192 2.5 1.732 2.5z"
                            ></path>
                          </svg>
                        </div>
                        <h3 className="font-semibold text-amber-900">
                          Action Required
                        </h3>
                      </div>
                      <p className="text-sm text-amber-800">
                        Please fill in all required fields (marked with *) to
                        proceed
                      </p>
                    </div>
                  )}

                  {/* Payment Button */}
                  <div className="space-y-3">
                    {!orderNumber ? (
                      <button
                        onClick={handleInitializePayment}
                        disabled={!canProceedToPayment || isLoading}
                        className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all cursor-pointer ${
                          canProceedToPayment && !isLoading
                            ? "bg-linear-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                            : "bg-gray-200 text-gray-400 cursor-not-allowed"
                        }`}
                      >
                        {isLoading ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            Creating Order...
                          </>
                        ) : (
                          <>
                            <Lock className="w-5 h-5" />
                            Create Order
                          </>
                        )}
                      </button>
                    ) : (
                      <button
                        onClick={handlePaystackPayment}
                        disabled={isProcessingPayment}
                        className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all cursor-pointer ${
                          !isProcessingPayment
                            ? "bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                            : "bg-gray-200 text-gray-400 cursor-not-allowed"
                        }`}
                      >
                        {isProcessingPayment ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            Processing...
                          </>
                        ) : (
                          <>
                            <CreditCard className="w-5 h-5" />
                            Pay GH₵{grandTotal.toFixed(2)} with Paystack
                          </>
                        )}
                      </button>
                    )}

                    <p className="text-xs text-gray-500 text-center mt-3">
                      Secure payment powered by Paystack
                    </p>
                  </div>

                  {/* Trust Badges */}
                  <div className="space-y-3 mt-6">
                    <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                      <Shield className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-green-700 font-medium">
                        256-bit SSL Encryption
                      </span>
                    </div>
                    <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                      <Lock className="w-4 h-4 text-blue-600" />
                      <span className="text-sm text-blue-700 font-medium">
                        Your payment details are secure
                      </span>
                    </div>
                  </div>
                </div>

                {/* Delivery Info */}
                <div className="bg-linear-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-200 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Sparkles className="w-5 h-5 text-amber-600" />
                    <h3 className="font-semibold text-amber-900">
                      Delivery Information
                    </h3>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Truck className="w-4 h-4 text-amber-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-amber-800">
                          Delivery Fee: GH₵50
                        </p>
                        <p className="text-xs text-amber-700">
                          Standard delivery within Accra
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Clock className="w-4 h-4 text-amber-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-amber-800">
                          Same-Day Delivery
                        </p>
                        <p className="text-xs text-amber-700">
                          Available for orders placed before 12 PM
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Cake className="w-4 h-4 text-amber-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-amber-800">
                          Freshly Prepared
                        </p>
                        <p className="text-xs text-amber-700">
                          Made fresh after order confirmation
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Need Help Section */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">
                    Need Help?
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <Phone className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Call Us
                        </p>
                        <p className="text-xs text-gray-500">
                          +233 55 123 4567
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                        <MessageSquare className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          WhatsApp
                        </p>
                        <p className="text-xs text-gray-500">
                          +233 55 123 4567
                        </p>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 text-center mt-4">
                    Available 9 AM - 8 PM daily
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Payment Banner */}
          <div className="mt-12">
            <PaymentBanner />
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
}

// Cart Item Component
function CartItem({ item, onRemove, onQuantityChange, formatPrice }) {
  const itemPrice = item.priceOption?.price || item.product.price || 0;
  const itemTotal = itemPrice * item.quantity;

  return (
    <div className="flex items-start gap-4 p-4 border border-gray-200 rounded-xl hover:border-amber-300 transition-all group bg-white">
      {/* Product Image */}
      <div className="relative w-24 h-24 shrink-0 bg-gray-50 rounded-lg overflow-hidden">
        {item.product.images?.[0] ? (
          <Image
            src={item.product.images[0]}
            alt={item.product.name}
            fill
            className="object-cover"
            sizes="96px"
          />
        ) : (
          <div className="absolute inset-0 bg-amber-50 flex items-center justify-center">
            <Cake className="w-8 h-8 text-amber-300" />
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="font-medium text-gray-900">{item.product.name}</h3>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded">
                {item.product.category}
              </span>
              <span className="text-xs px-2 py-0.5 bg-amber-100 text-amber-700 rounded">
                {item.priceOption?.label || item.product.name}
              </span>
              {item.selectedFlavor && (
                <span className="text-xs px-2 py-0.5 bg-purple-100 text-purple-700 rounded">
                  {item.selectedFlavor}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={onRemove}
            className="text-gray-400 hover:text-red-500 transition-colors p-1 cursor-pointer"
            aria-label="Remove item"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {/* Customization Notes */}
        {item.customizationNotes && (
          <div className="mb-3">
            <p className="text-xs text-gray-500 mb-1">Special Instructions:</p>
            <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded-lg">
              {item.customizationNotes}
            </p>
          </div>
        )}

        {/* Quantity & Price */}
        <div className="flex items-center justify-between">
          <div className="flex items-center border border-gray-300 rounded-lg">
            <button
              onClick={() => onQuantityChange(-1)}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors rounded-l cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={item.quantity <= 1}
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="w-10 text-center text-sm font-medium">
              {item.quantity}
            </span>
            <button
              onClick={() => onQuantityChange(1)}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors rounded-r cursor-pointer"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-amber-800">
              {formatPrice(itemTotal)}
            </div>
            <div className="text-sm text-gray-500">
              {formatPrice(itemPrice)} each
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Empty Cart Component
function EmptyCart() {
  return (
    <div className="text-center py-16">
      <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-amber-100 flex items-center justify-center">
        <ShoppingBag className="w-12 h-12 text-amber-500" />
      </div>
      <h2 className="text-2xl font-medium text-gray-900 mb-3">
        Your cart is empty
      </h2>
      <p className="text-gray-500 mb-8 max-w-md mx-auto">
        Looks like you haven&apos;t added any delicious treats to your cart yet.
      </p>
      <Link
        href="/menu"
        className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-8 py-4 rounded-xl font-medium text-lg transition-colors transform hover:-translate-y-0.5 hover:shadow-lg cursor-pointer"
      >
        <Cake className="w-5 h-5" />
        Start Shopping
      </Link>
    </div>
  );
}
