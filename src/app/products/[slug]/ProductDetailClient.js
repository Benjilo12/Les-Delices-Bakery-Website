"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Heart,
  Plus,
  Minus,
  ShoppingBag,
  Cake,
  Clock,
  Truck,
  ChevronRight,
  Shield,
  Check,
  Info,
  Lock,
  AlertCircle,
  Calendar,
  Phone,
  ChevronDown,
  MessageSquare,
  Sparkles,
} from "lucide-react";
import { useCart, useWishlist, useUI } from "@/lib/store";
import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";

export default function ProductDetailClient({ product, relatedProducts }) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { formatPrice } = useUI();

  const [selectedPriceOption, setSelectedPriceOption] = useState(
    product.priceOptions?.length > 0 ? product.priceOptions[0] : null,
  );
  const [selectedFlavor, setSelectedFlavor] = useState(
    product.availableFlavors?.length > 0 ? product.availableFlavors[0] : "",
  );
  const [quantity, setQuantity] = useState(1);
  const [customizationNote, setCustomizationNote] = useState("");
  const [selectedImage, setSelectedImage] = useState(0);
  const [isOrderTimingOpen, setIsOrderTimingOpen] = useState(false);
  const [isSpecialRequestsOpen, setIsSpecialRequestsOpen] = useState(false);

  const isFavorite = isInWishlist(product._id);
  const isAvailable = product.isAvailable && product.priceOptions?.length > 0;
  const totalPrice = selectedPriceOption
    ? selectedPriceOption.price * quantity
    : 0;

  const getCategoryInfo = () => {
    const categoryMap = {
      "Birthday Cakes": {
        icon: "🎂",
        color: "blue",
        note: "All cakes are whipped cream frosted with standard decorations. Custom designs (characters, edible prints, custom toppers) available at additional cost.",
        tagline: "Elegance in Every Bite. Healthy in Every Slice.",
      },
      "Wedding Cakes": {
        icon: "💒",
        color: "pink",
        note: "Custom wedding cake designs available. Contact us for consultation and pricing on multi-tier designs.",
        tagline: "Exquisite Creations for Your Special Day",
      },
      Cupcakes: {
        icon: "🧁",
        color: "purple",
        note: "Artisanal designs for any occasion. Perfect for parties, corporate events, and celebrations.",
        tagline: "Premium Cupcakes Handcrafted Daily",
      },
      "Cake Loaves": {
        icon: "🍞",
        color: "amber",
        note: "Fresh, moist, and perfect for tea time. Available with or without premium toppings.",
        tagline: "Freshly Baked Daily in Accra",
      },
      "Pastries & Snacks": {
        icon: "🥐",
        color: "orange",
        note: "Includes our signature items made fresh daily. Perfect for quick snacks or refreshments.",
        tagline: "Crunchy Delights & Sweet Treats",
      },
    };
    return categoryMap[product.category] || categoryMap["Birthday Cakes"];
  };

  const categoryInfo = getCategoryInfo();

  const handleAddToCart = () => {
    if (!isAvailable || !selectedPriceOption) return;
    addToCart(
      product,
      selectedPriceOption,
      quantity,
      customizationNote,
      selectedFlavor,
    );
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
        {/* Breadcrumbs */}
        <div className="border-b border-gray-100 bg-white sticky top-0 z-40 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <nav className="flex items-center gap-2 text-xs sm:text-sm text-gray-500">
              <Link href="/" className="hover:text-amber-700 transition-colors">
                Home
              </Link>
              <ChevronRight className="w-3 h-3 text-gray-300" />
              <Link
                href="/menu"
                className="hover:text-amber-700 transition-colors"
              >
                Menu
              </Link>
              <ChevronRight className="w-3 h-3 text-gray-300" />
              <Link
                href={`/menu?category=${encodeURIComponent(product.category)}`}
                className="hover:text-amber-700 transition-colors"
              >
                {product.category}
              </Link>
              <ChevronRight className="w-3 h-3 text-gray-300" />
              <span className="text-gray-900 font-medium truncate">
                {product.name}
              </span>
            </nav>
          </div>
        </div>

        <main className="max-w-7xl mx-auto px-4 py-6 sm:py-10">
          {/* Back Button */}
          <Link
            href="/menu"
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-amber-700 mb-6 group transition-colors"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Menu
          </Link>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Left: Images */}
            <div className="space-y-4">
              <div className="relative aspect-square rounded-3xl overflow-hidden bg-gradient-to-br from-amber-50 to-orange-50 shadow-xl">
                {product.images?.[selectedImage] ? (
                  <Image
                    src={product.images[selectedImage]}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Cake className="w-24 h-24 text-amber-300" />
                  </div>
                )}

                {/* Wishlist Heart */}
                <button
                  onClick={() => toggleWishlist(product)}
                  className="absolute top-4 right-4 p-3 bg-white/95 backdrop-blur-md rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 z-10"
                >
                  <Heart
                    className={`w-5 h-5 transition-all ${isFavorite ? "fill-red-500 text-red-500" : "text-gray-600"}`}
                  />
                </button>

                {/* Category Badge */}
                <div className="absolute top-4 left-4 px-3 py-1.5 bg-white/95 backdrop-blur-md rounded-full shadow-md">
                  <span className="text-xs font-bold text-gray-800 flex items-center gap-1">
                    <span>{categoryInfo.icon}</span>
                    {product.category}
                  </span>
                </div>
              </div>

              {/* Thumbnail Gallery */}
              {product.images?.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`relative w-20 h-20 rounded-xl overflow-hidden shrink-0 transition-all ${selectedImage === index ? "ring-3 ring-amber-500 ring-offset-2 scale-105" : "opacity-60 hover:opacity-100"}`}
                    >
                      <Image
                        src={image}
                        alt={`View ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Details */}
            <div className="space-y-6">
              {/* Header */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  {product.isAvailable ? (
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                      In Stock
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full">
                      Out of Stock
                    </span>
                  )}
                </div>

                <h1 className="text-3xl sm:text-4xl font-serif text-gray-900 mb-3 leading-tight">
                  {product.name}
                </h1>

                {product.description && (
                  <p className="text-gray-600 leading-relaxed mb-4">
                    {product.description}
                  </p>
                )}

                {/* Category Tagline */}
                <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200">
                  <div className="flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-amber-900 mb-1">
                        {categoryInfo.tagline}
                      </p>
                      <p className="text-xs text-amber-700 leading-relaxed">
                        Handcrafted in Accra for your most cherished
                        celebrations.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Price & Options Card */}
              <div className="p-6 bg-white rounded-2xl border-2 border-gray-100 shadow-sm">
                {/* Price Display */}
                <div className="mb-6 pb-6 border-b border-gray-100">
                  {selectedPriceOption ? (
                    <div className="flex items-baseline gap-3">
                      <span className="text-4xl font-bold text-gray-900">
                        {formatPrice(selectedPriceOption.price)}
                      </span>
                      <span className="text-sm text-gray-500">
                        per {selectedPriceOption.label.toLowerCase()}
                      </span>
                    </div>
                  ) : (
                    <span className="text-gray-500">Select a size</span>
                  )}
                </div>

                {/* Size Selection */}
                <div className="space-y-3 mb-6">
                  <h3 className="text-sm font-semibold text-gray-900">
                    Select Size
                  </h3>
                  {product.priceOptions?.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedPriceOption(option)}
                      className={`w-full p-4 rounded-xl border-2 transition-all text-left ${selectedPriceOption?.label === option.label ? "border-amber-500 bg-amber-50 shadow-sm" : "border-gray-200 hover:border-amber-300"}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {selectedPriceOption?.label === option.label && (
                            <div className="w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center">
                              <Check className="w-3 h-3 text-white" />
                            </div>
                          )}
                          <div>
                            <div className="font-semibold text-gray-900">
                              {option.label}
                            </div>
                            <div className="text-xs text-gray-500 mt-0.5">
                              Perfect for gatherings
                            </div>
                          </div>
                        </div>
                        <div className="text-xl font-bold text-amber-700">
                          {formatPrice(option.price)}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Flavor Selection */}
                {product.availableFlavors?.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-gray-900">
                      Choose Flavor
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {product.availableFlavors.map((flavor, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedFlavor(flavor)}
                          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedFlavor === flavor ? "bg-amber-600 text-white shadow-md" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                        >
                          {flavor}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Expandable Sections */}
              <div className="space-y-3">
                {/* Order Timing */}
                <ExpandableSection
                  icon={<Calendar className="w-4 h-4" />}
                  title="Order Timing & Delivery"
                  isOpen={isOrderTimingOpen}
                  onToggle={() => setIsOrderTimingOpen(!isOrderTimingOpen)}
                >
                  <div className="space-y-4 p-4">
                    <InfoItem
                      icon={<Clock className="w-4 h-4 text-amber-600" />}
                      title="48-Hour Notice Required"
                      text="Please order at least 48 hours in advance for optimal freshness and quality."
                    />
                    <InfoItem
                      icon={<Truck className="w-4 h-4 text-amber-600" />}
                      title="Delivery in Accra"
                      text="We deliver within Accra. Pickup also available at our bakery. Delivery fees may apply."
                    />
                    <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                      <p className="text-xs text-amber-800">
                        💡 For urgent orders, contact us via WhatsApp to check
                        availability.
                      </p>
                    </div>
                  </div>
                </ExpandableSection>

                {/* Special Requests */}
                <ExpandableSection
                  icon={<MessageSquare className="w-4 h-4" />}
                  title="Customization & Special Requests"
                  badge="Optional"
                  isOpen={isSpecialRequestsOpen}
                  onToggle={() =>
                    setIsSpecialRequestsOpen(!isSpecialRequestsOpen)
                  }
                >
                  <div className="space-y-4 p-4">
                    {/* Category-specific note */}
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex gap-2">
                        <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                        <p className="text-xs text-blue-800">
                          {categoryInfo.note}
                        </p>
                      </div>
                    </div>

                    {/* Product-specific notes */}
                    {product.customizationNotes && (
                      <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                        <p className="text-xs text-purple-800 italic">
                          {product.customizationNotes}
                        </p>
                      </div>
                    )}

                    {/* Textarea */}
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Your Special Instructions
                      </label>
                      <textarea
                        value={customizationNote}
                        onChange={(e) => setCustomizationNote(e.target.value)}
                        placeholder="E.g., 'Happy Birthday Sarah!', dietary requirements, custom design ideas..."
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-amber-500 focus:ring-4 focus:ring-amber-100 outline-none text-sm resize-none"
                        rows={3}
                        maxLength={200}
                      />
                      <p className="text-xs text-gray-500 mt-2 text-right">
                        {customizationNote.length}/200
                      </p>
                    </div>
                  </div>
                </ExpandableSection>
              </div>

              {/* Quantity & Add to Cart */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center border-2 border-gray-200 rounded-xl bg-white shadow-sm">
                    <button
                      onClick={() =>
                        setQuantity((prev) => Math.max(1, prev - 1))
                      }
                      disabled={quantity <= 1}
                      className="p-3 text-gray-600 hover:text-gray-900 disabled:opacity-30"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-16 text-center text-lg font-bold text-gray-900">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity((prev) => prev + 1)}
                      className="p-3 text-gray-600 hover:text-gray-900"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500">Total Price</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatPrice(totalPrice)}
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={!isAvailable}
                  className={`w-full py-4 rounded-xl font-bold text-base flex items-center justify-center gap-3 transition-all ${isAvailable ? "bg-amber-600 hover:bg-amber-700 text-white shadow-lg hover:shadow-xl hover:scale-[1.02]" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}
                >
                  <ShoppingBag className="w-5 h-5" />
                  {isAvailable
                    ? `Add to Cart • ${formatPrice(totalPrice)}`
                    : "Currently Unavailable"}
                </button>

                {/* Contact for Help */}
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="flex items-start gap-3">
                    <Phone className="w-4 h-4 text-gray-600 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-gray-800 mb-1">
                        Need Help?
                      </p>
                      <p className="text-xs text-gray-600">
                        Contact us via WhatsApp for custom orders, bulk
                        inquiries, or any questions.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Payment Security */}
                <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Lock className="w-4 h-4 text-green-600" />
                    <span className="text-xs font-bold text-green-800 uppercase">
                      Secure Payment
                    </span>
                  </div>
                  <p className="text-[10px] text-green-700 text-center">
                    Powered by Paystack • SSL Encrypted • Card details never
                    stored
                  </p>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-4 gap-3 pt-6 border-t border-gray-200">
                <TrustBadge
                  icon={<Clock className="w-4 h-4" />}
                  text="48h Notice"
                />
                <TrustBadge
                  icon={<Cake className="w-4 h-4" />}
                  text="Fresh Daily"
                />
                <TrustBadge
                  icon={<Shield className="w-4 h-4" />}
                  text="Quality Ingredients"
                />
                <TrustBadge
                  icon={<Truck className="w-4 h-4" />}
                  text="Accra Delivery"
                />
              </div>
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts?.length > 0 && (
            <section className="mt-16 pt-12 border-t border-gray-200">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl md:text-3xl font-serif text-gray-900">
                    You Might Also Like
                  </h2>
                  <p className="text-gray-500 text-sm mt-1">
                    More delicious treats from our bakery
                  </p>
                </div>
                <Link
                  href={`/menu?category=${encodeURIComponent(product.category)}`}
                  className="text-amber-700 hover:text-amber-800 font-medium text-sm flex items-center gap-1"
                >
                  View All
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {relatedProducts.map((item) => (
                  <ProductCard key={item._id} product={item} />
                ))}
              </div>
            </section>
          )}
        </main>
      </div>
    </>
  );
}

function ExpandableSection({ icon, title, badge, isOpen, onToggle, children }) {
  return (
    <div className="border-2 border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
      <button
        onClick={onToggle}
        className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center text-amber-600">
            {icon}
          </div>
          <span className="text-sm font-semibold text-gray-900">{title}</span>
          {badge && (
            <span className="text-[9px] bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full font-bold uppercase">
              {badge}
            </span>
          )}
        </div>
        <ChevronDown
          className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      {isOpen && <div className="border-t border-gray-100">{children}</div>}
    </div>
  );
}

function InfoItem({ icon, title, text }) {
  return (
    <div className="flex gap-3">
      <div className="shrink-0 mt-0.5">{icon}</div>
      <div>
        <p className="text-sm font-semibold text-gray-900 mb-1">{title}</p>
        <p className="text-xs text-gray-600 leading-relaxed">{text}</p>
      </div>
    </div>
  );
}

function TrustBadge({ icon, text }) {
  return (
    <div className="text-center">
      <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
        {icon}
      </div>
      <p className="text-[10px] text-gray-600 font-medium leading-tight">
        {text}
      </p>
    </div>
  );
}
