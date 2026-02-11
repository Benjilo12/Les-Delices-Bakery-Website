import Navbar from "@/components/Navbar";
import Topbar from "@/components/Topbar";
import Footer from "@/components/Footer";
import { Cake, Shield, Clock, CreditCard, Truck, Phone } from "lucide-react";
import Link from "next/link";

function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Topbar />
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 py-12 md:py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Shield className="w-8 h-8 text-amber-600" />
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900">
              Terms & Conditions
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            Last Updated:{" "}
            {new Date().toLocaleDateString("en-GB", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-amber-400 to-amber-600 mx-auto mt-4 rounded-full"></div>
        </div>

        {/* Introduction */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 md:p-8 mb-8">
          <div className="flex items-start gap-4">
            <Cake className="w-6 h-6 text-amber-600 mt-1 flex-shrink-0" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                Welcome to Les Délices By Akorfa
              </h2>
              <p className="text-gray-700 mb-4">
                By accessing or using our website and ordering our products, you
                agree to be bound by these Terms & Conditions. Please read them
                carefully before placing an order.
              </p>
              <p className="text-gray-700">
                These terms govern your use of our website and the purchase of
                our premium cakes, pastries, and baked goods. We reserve the
                right to update these terms at any time.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* Section 1: Ordering Policy */}
          <section className="border border-gray-200 rounded-xl p-6 hover:border-amber-200 transition-colors">
            <div className="flex items-center gap-3 mb-4">
              <Clock className="w-6 h-6 text-amber-600" />
              <h2 className="text-xl font-semibold text-gray-900">
                1. Ordering Policy
              </h2>
            </div>
            <div className="space-y-4 text-gray-700">
              <p>
                To ensure the highest quality and freshness of our products, we
                require:
              </p>
              <ul className="space-y-3 pl-5">
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold mt-1">•</span>
                  <span>
                    <strong>Minimum 48-hour notice</strong> for all orders
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold mt-1">•</span>
                  <span>
                    All orders are <strong>custom-made</strong> and prepared
                    fresh
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold mt-1">•</span>
                  <span>
                    Same-day orders may be available for an additional fee,
                    subject to our capacity
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold mt-1">•</span>
                  <span>
                    Orders must be confirmed with a <strong>50% deposit</strong>{" "}
                    or full payment
                  </span>
                </li>
              </ul>
            </div>
          </section>

          {/* Section 2: Pricing & Payment */}
          <section className="border border-gray-200 rounded-xl p-6 hover:border-amber-200 transition-colors">
            <div className="flex items-center gap-3 mb-4">
              <CreditCard className="w-6 h-6 text-amber-600" />
              <h2 className="text-xl font-semibold text-gray-900">
                2. Pricing & Payment
              </h2>
            </div>
            <div className="space-y-4 text-gray-700">
              <p>
                All prices are quoted in <strong>Ghanaian Cedis (GH₵)</strong>{" "}
                and include standard preparation. Additional costs may apply
                for:
              </p>
              <ul className="space-y-3 pl-5">
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold mt-1">•</span>
                  <span>
                    <strong>Custom designs</strong> (character cakes, edible
                    prints, custom toppers)
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold mt-1">•</span>
                  <span>
                    <strong>Premium toppings</strong> (assorted fruits,
                    chocolate decorations)
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold mt-1">•</span>
                  <span>
                    <strong>Delivery fees</strong> based on location in Accra
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold mt-1">•</span>
                  <span>
                    <strong>Multiple flavors</strong> in single cakes (see
                    pricing table)
                  </span>
                </li>
              </ul>
              <div className="bg-gray-50 p-4 rounded-lg mt-4">
                <p className="text-sm text-gray-600">
                  <strong>Note:</strong> Prices are subject to change without
                  prior notice. Final pricing will be confirmed at order
                  confirmation.
                </p>
              </div>
            </div>
          </section>

          {/* Section 3: Delivery & Pickup */}
          <section className="border border-gray-200 rounded-xl p-6 hover:border-amber-200 transition-colors">
            <div className="flex items-center gap-3 mb-4">
              <Truck className="w-6 h-6 text-amber-600" />
              <h2 className="text-xl font-semibold text-gray-900">
                3. Delivery & Pickup
              </h2>
            </div>
            <div className="space-y-4 text-gray-700">
              <p>
                We offer both delivery and pickup options for your convenience:
              </p>
              <ul className="space-y-3 pl-5">
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold mt-1">•</span>
                  <span>
                    <strong>Delivery Areas:</strong> Accra and surrounding areas
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold mt-1">•</span>
                  <span>
                    <strong>Delivery Times:</strong> Scheduled based on order
                    confirmation
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold mt-1">•</span>
                  <span>
                    <strong>Pickup Location:</strong> Our bakery in Accra
                    (address provided upon order confirmation)
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold mt-1">•</span>
                  <span>
                    <strong>Late Pickups:</strong> Items held for maximum 2
                    hours after scheduled pickup time
                  </span>
                </li>
              </ul>
              <div className="bg-amber-50 p-4 rounded-lg mt-4 border border-amber-200">
                <p className="text-sm text-amber-800">
                  <strong>Important:</strong> We are not responsible for damage
                  to products after delivery/pickup. Handle all items with care.
                </p>
              </div>
            </div>
          </section>

          {/* Section 4: Cancellations & Refunds */}
          <section className="border border-gray-200 rounded-xl p-6 hover:border-amber-200 transition-colors">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-6 h-6 text-amber-600" />
              <h2 className="text-xl font-semibold text-gray-900">
                4. Cancellations & Refunds
              </h2>
            </div>
            <div className="space-y-4 text-gray-700">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="border border-gray-300 px-4 py-3 text-left text-sm font-medium text-gray-700">
                        Timeframe
                      </th>
                      <th className="border border-gray-300 px-4 py-3 text-left text-sm font-medium text-gray-700">
                        Cancellation Policy
                      </th>
                      <th className="border border-gray-300 px-4 py-3 text-left text-sm font-medium text-gray-700">
                        Refund Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-4 py-3 text-sm">
                        48+ hours before delivery
                      </td>
                      <td className="border border-gray-300 px-4 py-3 text-sm">
                        Full cancellation accepted
                      </td>
                      <td className="border border-gray-300 px-4 py-3 text-sm font-medium text-green-600">
                        100% refund
                      </td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-300 px-4 py-3 text-sm">
                        24-48 hours before delivery
                      </td>
                      <td className="border border-gray-300 px-4 py-3 text-sm">
                        Partial cancellation accepted
                      </td>
                      <td className="border border-gray-300 px-4 py-3 text-sm font-medium text-amber-600">
                        50% refund
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-3 text-sm">
                        Less than 24 hours
                      </td>
                      <td className="border border-gray-300 px-4 py-3 text-sm">
                        No cancellation accepted
                      </td>
                      <td className="border border-gray-300 px-4 py-3 text-sm font-medium text-red-600">
                        No refund
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">
                  <strong>Note:</strong> Custom orders and specialized designs
                  may have different cancellation policies communicated at order
                  confirmation.
                </p>
              </div>
            </div>
          </section>

          {/* Section 5: Allergies & Dietary Restrictions */}
          <section className="border border-gray-200 rounded-xl p-6 hover:border-amber-200 transition-colors">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              5. Allergies & Dietary Restrictions
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>Your health and safety are important to us:</p>
              <ul className="space-y-3 pl-5">
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold mt-1">•</span>
                  <span>
                    <strong>Allergy Information:</strong> We handle common
                    allergens including nuts, dairy, eggs, and gluten
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold mt-1">•</span>
                  <span>
                    <strong>Cross-Contamination:</strong> While we take
                    precautions, we cannot guarantee allergen-free environments
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold mt-1">•</span>
                  <span>
                    <strong>Special Requests:</strong> Inform us of any dietary
                    restrictions during ordering
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold mt-1">•</span>
                  <span>
                    <strong>Ingredients List:</strong> Available upon request
                    for all products
                  </span>
                </li>
              </ul>
            </div>
          </section>

          {/* Section 6: Quality Guarantee */}
          <section className="border border-gray-200 rounded-xl p-6 hover:border-amber-200 transition-colors">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              6. Quality Guarantee
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>We take pride in the quality of our products:</p>
              <ul className="space-y-3 pl-5">
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold mt-1">•</span>
                  <span>
                    All products are made with{" "}
                    <strong>fresh, high-quality ingredients</strong>
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold mt-1">•</span>
                  <span>
                    Products are <strong>handcrafted</strong> with attention to
                    detail
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold mt-1">•</span>
                  <span>
                    <strong>Whipped cream frosting</strong> is our standard for
                    birthday cakes
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold mt-1">•</span>
                  <span>
                    <strong>Freshness guarantee:</strong> All products are made
                    within 24 hours of delivery
                  </span>
                </li>
              </ul>
            </div>
          </section>

          {/* Section 7: Contact & Support */}
          <section className="border border-gray-200 rounded-xl p-6 hover:border-amber-200 transition-colors">
            <div className="flex items-center gap-3 mb-4">
              <Phone className="w-6 h-6 text-amber-600" />
              <h2 className="text-xl font-semibold text-gray-900">
                7. Contact & Support
              </h2>
            </div>
            <div className="space-y-4 text-gray-700">
              <p>For questions, concerns, or order inquiries:</p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    WhatsApp/Phone
                  </h3>
                  <p className="text-amber-700 font-medium">
                    [Your Contact Number]
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Instagram
                  </h3>
                  <p className="text-amber-700 font-medium">
                    @LesDelicesByAkorfa
                  </p>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                <strong>Business Hours:</strong> Monday - Saturday, 9:00 AM -
                6:00 PM
              </p>
            </div>
          </section>

          {/* Agreement Section */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-6 md:p-8 text-center">
            <div className="flex flex-col items-center">
              <Cake className="w-12 h-12 text-amber-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Your Agreement
              </h3>
              <p className="text-gray-700 mb-4 max-w-2xl">
                By placing an order with Les Délices By Akorfa, you acknowledge
                that you have read, understood, and agree to these Terms &
                Conditions. These terms form a binding agreement between you and
                Les Délices By Akorfa.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mt-2">
                <Link
                  href="/menu"
                  className="inline-flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Explore Our Menu
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default TermsPage;
