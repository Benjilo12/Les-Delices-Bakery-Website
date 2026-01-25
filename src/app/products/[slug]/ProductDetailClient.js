"use client";
import { useState, useEffect } from "react";
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

  const isFavorite = isInWishlist(product._id);
  const isAvailable = product.isAvailable && product.priceOptions?.length > 0;
  const totalPrice = selectedPriceOption
    ? selectedPriceOption.price * quantity
    : 0;

  // Debug: Log customization data
  useEffect(() => {
    console.log("🔍 Product customization data:", {
      customizationAvailable: product.customizationAvailable,
      customizationNotes: product.customizationNotes,
      hasCustomizationNotes: !!product.customizationNotes,
      notesLength: product.customizationNotes?.length || 0,
    });
  }, [product]);

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

  const incrementQuantity = () => setQuantity((prev) => prev + 1);
  const decrementQuantity = () => setQuantity((prev) => Math.max(1, prev - 1));

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white">
        {/* Navigation Breadcrumbs */}
        <div className="border-b border-gray-100 bg-white">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <nav className="flex items-center gap-2 text-sm text-gray-500">
              <Link href="/" className="hover:text-amber-700 transition-colors">
                Home
              </Link>
              <ChevronRight className="w-4 h-4 text-gray-300" />
              <Link
                href="/products"
                className="hover:text-amber-700 transition-colors"
              >
                Shop
              </Link>
              <ChevronRight className="w-4 h-4 text-gray-300" />
              <Link
                href={`/products?category=${encodeURIComponent(product.category)}`}
                className="hover:text-amber-700 transition-colors"
              >
                {product.category}
              </Link>
              <ChevronRight className="w-4 h-4 text-gray-300" />
              <span className="text-gray-900 font-medium truncate max-w-xs">
                {product.name}
              </span>
            </nav>
          </div>
        </div>

        <main className="max-w-7xl mx-auto px-4 py-8">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-amber-700 mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Shop
          </Link>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Left Column: Images */}
            <div className="space-y-6">
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-50">
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
                  <div className="absolute inset-0 bg-amber-50 flex items-center justify-center">
                    <Cake className="w-20 h-20 text-amber-300" />
                  </div>
                )}
                <button
                  onClick={() => toggleWishlist(product)}
                  className="absolute top-4 right-4 p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg z-10 hover:shadow-xl transition-shadow"
                  aria-label={
                    isFavorite ? "Remove from wishlist" : "Add to wishlist"
                  }
                >
                  <Heart
                    className={`w-6 h-6 transition-all ${
                      isFavorite
                        ? "fill-red-500 text-red-500"
                        : "text-gray-600 hover:text-red-500"
                    }`}
                  />
                </button>
              </div>
              {product.images?.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`relative w-20 h-20 rounded-lg overflow-hidden shrink-0 transition-all ${
                        selectedImage === index
                          ? "ring-2 ring-amber-600 ring-offset-2"
                          : "opacity-70 hover:opacity-100"
                      }`}
                    >
                      <Image
                        src={image}
                        alt={`${product.name} - View ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column: Content */}
            <div className="space-y-8">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-3 py-1 bg-amber-50 text-amber-700 text-xs font-bold uppercase tracking-widest rounded-full">
                    {product.category}
                  </span>
                  {product.isAvailable ? (
                    <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      In Stock
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-red-50 text-red-700 text-xs font-medium rounded-full">
                      Out of Stock
                    </span>
                  )}
                </div>

                <h1 className="text-3xl md:text-4xl font-serif text-gray-900 mb-4">
                  {product.name}
                </h1>

                <p className="text-gray-600 leading-relaxed text-lg">
                  {product.description}
                </p>
              </div>

              {/* Price & Options */}
              <div className="p-6 bg-amber-50/50 rounded-2xl border border-amber-100">
                <div className="flex items-baseline gap-3 mb-6">
                  {selectedPriceOption ? (
                    <>
                      <span className="text-3xl md:text-4xl font-bold text-gray-900">
                        {formatPrice(selectedPriceOption.price)}
                      </span>
                      <span className="text-sm text-gray-500">
                        per {selectedPriceOption.label.toLowerCase()}
                      </span>
                    </>
                  ) : (
                    <span className="text-gray-500">Select a size option</span>
                  )}
                </div>

                {/* Size Options */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">
                    Select Size
                  </h3>
                  <div className="space-y-3">
                    {product.priceOptions?.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedPriceOption(option)}
                        className={`w-full p-4 rounded-xl border transition-all text-left ${
                          selectedPriceOption?.label === option.label
                            ? "border-amber-600 bg-white shadow-sm"
                            : "border-gray-200 hover:border-amber-400 hover:bg-white"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium text-gray-900">
                              {option.label}
                            </div>
                            <div className="text-sm text-gray-500 mt-1">
                              Perfect for{" "}
                              {option.label.includes("8") ? "small" : "large"}{" "}
                              gatherings
                            </div>
                          </div>
                          <div className="text-lg font-bold text-amber-800">
                            {formatPrice(option.price)}
                          </div>
                        </div>
                        {selectedPriceOption?.label === option.label && (
                          <div className="mt-3 flex items-center gap-2 text-amber-600">
                            <Check className="w-4 h-4" />
                            <span className="text-sm">Selected</span>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Flavor Options */}
                {product.availableFlavors?.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-gray-900 mb-3">
                      Available Flavors
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {product.availableFlavors.map((flavor, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedFlavor(flavor)}
                          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                            selectedFlavor === flavor
                              ? "bg-amber-600 text-white shadow-sm"
                              : "bg-white text-gray-700 border border-gray-200 hover:border-amber-400"
                          }`}
                        >
                          {flavor}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Customization Section - NOW FIXED */}
              {product.customizationAvailable && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-gray-900">
                      Customization
                    </h3>
                    <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-bold uppercase">
                      Optional
                    </span>
                  </div>

                  {/* This will now show if customizationNotes exists */}
                  {product.customizationNotes &&
                    product.customizationNotes.trim() !== "" && (
                      <div className="flex gap-2 p-3 bg-blue-50 border border-blue-100 rounded-lg text-blue-800 text-xs">
                        <Info className="w-4 h-4 shrink-0 mt-0.5" />
                        <p className="italic">{product.customizationNotes}</p>
                      </div>
                    )}

                  <textarea
                    value={customizationNote}
                    onChange={(e) => setCustomizationNote(e.target.value)}
                    placeholder="Message on cake, dietary requirements, etc."
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none text-sm"
                    rows={3}
                  />
                </div>
              )}

              {/* Quantity & Add to Cart */}
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-gray-200 rounded-xl bg-white">
                    <button
                      onClick={decrementQuantity}
                      className="p-3 text-gray-500 hover:text-gray-700 disabled:opacity-30 transition-colors"
                      disabled={quantity <= 1}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-16 text-center text-lg font-medium text-gray-900">
                      {quantity}
                    </span>
                    <button
                      onClick={incrementQuantity}
                      className="p-3 text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="text-sm text-gray-500">
                    Total:{" "}
                    <span className="font-bold text-gray-900 text-xl">
                      {formatPrice(totalPrice)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={!isAvailable}
                  className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-3 transition-all ${
                    isAvailable
                      ? "bg-amber-600 hover:bg-amber-700 text-white shadow-lg hover:shadow-xl active:scale-[0.98]"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  <ShoppingBag className="w-5 h-5" />
                  {isAvailable
                    ? `Add to Cart - ${formatPrice(totalPrice)}`
                    : "Out of Stock"}
                </button>

                {/* Secure Payment Block */}
                <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 flex flex-col items-center space-y-3">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Lock className="w-4 h-4 text-green-600" />
                    <span className="text-xs font-bold uppercase tracking-wider">
                      Secure Payment with Paystack
                    </span>
                  </div>
                  <div className="relative w-full h-12 max-w-[250px]">
                    <Image
                      src="/images/icon.jpeg"
                      alt="Paystack Gateway"
                      fill
                      className="object-contain"
                      sizes="250px"
                    />
                  </div>
                  <p className="text-[11px] text-gray-400 text-center px-4 leading-tight">
                    Your transaction is encrypted. We do not store your credit
                    card details.
                  </p>
                </div>
              </div>

              {/* Delivery Badges */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-gray-100">
                <Badge
                  icon={<Clock className="w-5 h-5" />}
                  text="24-48h Delivery"
                />
                <Badge
                  icon={<Shield className="w-5 h-5" />}
                  text="Quality Guarantee"
                />
                <Badge
                  icon={<Cake className="w-5 h-5" />}
                  text="Freshly Baked"
                />
                <Badge
                  icon={<Truck className="w-5 h-5" />}
                  text="Secure Shipping"
                />
              </div>
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts?.length > 0 && (
            <section className="mt-20 pt-10 border-t border-gray-100">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-serif text-gray-900">
                    You Might Also Like
                  </h2>
                  <p className="text-gray-500 mt-1">
                    More delicious treats from our bakery
                  </p>
                </div>
                <Link
                  href={`/products?category=${encodeURIComponent(product.category)}`}
                  className="text-amber-700 hover:text-amber-800 font-medium flex items-center gap-2"
                >
                  View All {product.category}
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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

function Badge({ icon, text }) {
  return (
    <div className="text-center p-3">
      <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-amber-100 flex items-center justify-center">
        {icon}
      </div>
      <p className="text-xs text-gray-600">{text}</p>
    </div>
  );
}
