import Navbar from "@/components/Navbar";
import Topbar from "@/components/Topbar";
import Footer from "@/components/Footer";
import {
  Shield,
  Lock,
  Eye,
  CreditCard,
  Mail,
  Cookie,
  UserCheck,
  Globe,
  Heart,
  Cake,
} from "lucide-react";
import Link from "next/link";

function PrivacyPage() {
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
              Privacy Policy
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
          <div className="w-24 h-1 bg-linear-to-r from-amber-400 to-amber-600 mx-auto mt-4 rounded-full"></div>
        </div>

        {/* Introduction - Brand Promise */}
        <div className="bg-linear-to-br from-amber-50 to-orange-50 rounded-2xl p-6 md:p-8 mb-8 border border-amber-200">
          <div className="flex items-start gap-4">
            <Heart className="w-6 h-6 text-amber-600 mt-1 shrink-0" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                Our Commitment to Your Privacy
              </h2>
              <p className="text-gray-700 mb-4">
                At <strong>Les Délices By Akorfa</strong>, we treat your
                personal information with the same care and attention we put
                into crafting our signature cakes. Founded by Mrs. Eleanor
                Dartey, our bakery is built on trust, quality, and respect for
                our cherished customers.
              </p>
              <p className="text-gray-700">
                This Privacy Policy explains how we collect, use, and protect
                your information when you visit our website or place orders with
                us in Accra, Ghana.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* Section 1: Information We Collect */}
          <section className="border border-gray-200 rounded-xl p-6 hover:border-amber-200 transition-colors">
            <div className="flex items-center gap-3 mb-4">
              <Eye className="w-6 h-6 text-amber-600" />
              <h2 className="text-xl font-semibold text-gray-900">
                1. Information We Collect
              </h2>
            </div>
            <div className="space-y-4 text-gray-700">
              <p className="font-medium text-amber-800">
                To serve you better, we collect:
              </p>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-amber-600" />
                    Personal Information
                  </h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-amber-600">•</span>
                      Full name
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-600">•</span>
                      Email address
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-600">•</span>
                      Phone number
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-600">•</span>
                      Delivery address in Accra
                    </li>
                  </ul>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <Cake className="w-4 h-4 text-amber-600" />
                    Order Information
                  </h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-amber-600">•</span>
                      Cake preferences & flavors
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-600">•</span>
                      Event dates & types
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-600">•</span>
                      Customization requests
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-600">•</span>
                      Special instructions
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg mt-2">
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <Cookie className="w-4 h-4 text-amber-600" />
                  Automated Information
                </h3>
                <p className="text-sm text-gray-700">
                  When you visit our website, we automatically collect certain
                  information through cookies and similar technologies,
                  including your IP address, browser type, and pages visited.
                </p>
              </div>
            </div>
          </section>

          {/* Section 2: How We Use Your Information */}
          <section className="border border-gray-200 rounded-xl p-6 hover:border-amber-200 transition-colors">
            <div className="flex items-center gap-3 mb-4">
              <Globe className="w-6 h-6 text-amber-600" />
              <h2 className="text-xl font-semibold text-gray-900">
                2. How We Use Your Information
              </h2>
            </div>
            <div className="space-y-4 text-gray-700">
              <p>Your information helps us:</p>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  "Process and deliver your orders",
                  "Communicate order confirmations and updates",
                  "Respond to your questions and requests",
                  "Customize cakes to your specifications",
                  "Improve our products and services",
                  "Send birthday reminders and special offers",
                  "Ensure 48-hour advance order processing",
                  "Maintain quality standards",
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold">✓</span>
                    <span className="text-sm">{item}</span>
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-600 mt-2 italic">
                We will NEVER sell your personal information to third parties.
              </p>
            </div>
          </section>

          {/* Section 3: Payment Security */}
          <section className="border border-gray-200 rounded-xl p-6 hover:border-amber-200 transition-colors">
            <div className="flex items-center gap-3 mb-4">
              <CreditCard className="w-6 h-6 text-amber-600" />
              <h2 className="text-xl font-semibold text-gray-900">
                3. Payment Security
              </h2>
            </div>
            <div className="space-y-4 text-gray-700">
              <p>
                Your payment security is our priority. All transactions are
                processed through secure, PCI-compliant payment gateways.
              </p>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <Lock className="w-5 h-5 text-green-600" />
                  <div>
                    <h3 className="font-semibold text-green-800">
                      256-bit SSL Encryption
                    </h3>
                    <p className="text-sm text-green-700">
                      We do not store your credit card information on our
                      servers. All payment data is encrypted and processed
                      directly by our payment partners.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 4: Data Storage & Retention */}
          <section className="border border-gray-200 rounded-xl p-6 hover:border-amber-200 transition-colors">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              4. Data Storage & Retention
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>
                As a Ghana-based bakery serving Accra and beyond, your data is
                stored and processed in accordance with Ghanaian data protection
                laws.
              </p>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="border border-gray-300 px-4 py-3 text-left font-medium text-gray-700">
                        Information Type
                      </th>
                      <th className="border border-gray-300 px-4 py-3 text-left font-medium text-gray-700">
                        Retention Period
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-4 py-3">
                        Order history
                      </td>
                      <td className="border border-gray-300 px-4 py-3">
                        5 years
                      </td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-300 px-4 py-3">
                        Customer account information
                      </td>
                      <td className="border border-gray-300 px-4 py-3">
                        Until account deletion
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-3">
                        Marketing preferences
                      </td>
                      <td className="border border-gray-300 px-4 py-3">
                        2 years after last interaction
                      </td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-300 px-4 py-3">
                        Communication records
                      </td>
                      <td className="border border-gray-300 px-4 py-3">
                        2 years
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Section 5: Your Rights */}
          <section className="border border-gray-200 rounded-xl p-6 hover:border-amber-200 transition-colors">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              5. Your Privacy Rights
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>You have the right to:</p>
              <ul className="space-y-3">
                {[
                  "Access the personal information we hold about you",
                  "Correct inaccurate or incomplete information",
                  "Request deletion of your personal data",
                  "Opt-out of marketing communications",
                  "Export your data in a portable format",
                  "Withdraw consent at any time",
                ].map((right, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                      {index + 1}
                    </span>
                    <span>{right}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Section 6: Cookies Policy */}
          <section className="border border-gray-200 rounded-xl p-6 hover:border-amber-200 transition-colors">
            <div className="flex items-center gap-3 mb-4">
              <Cookie className="w-6 h-6 text-amber-600" />
              <h2 className="text-xl font-semibold text-gray-900">
                6. Cookies Policy
              </h2>
            </div>
            <div className="space-y-4 text-gray-700">
              <p>
                Like a perfectly baked cookie, our website uses cookies to
                enhance your experience:
              </p>
              <div className="grid md:grid-cols-3 gap-3">
                <div className="bg-amber-50 p-3 rounded-lg">
                  <h3 className="font-semibold text-amber-800 text-sm mb-1">
                    Essential Cookies
                  </h3>
                  <p className="text-xs text-gray-600">
                    Required for website functionality and order processing
                  </p>
                </div>
                <div className="bg-amber-50 p-3 rounded-lg">
                  <h3 className="font-semibold text-amber-800 text-sm mb-1">
                    Preference Cookies
                  </h3>
                  <p className="text-xs text-gray-600">
                    Remember your flavor preferences and customization choices
                  </p>
                </div>
                <div className="bg-amber-50 p-3 rounded-lg">
                  <h3 className="font-semibold text-amber-800 text-sm mb-1">
                    Analytics Cookies
                  </h3>
                  <p className="text-xs text-gray-600">
                    Help us improve our website and customer experience
                  </p>
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                You can control cookies through your browser settings. However,
                disabling cookies may affect your ability to place orders.
              </p>
            </div>
          </section>

          {/* Section 7: Children's Privacy */}
          <section className="border border-gray-200 rounded-xl p-6 hover:border-amber-200 transition-colors">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              7. Children&apos;s Privacy
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>
                While we love creating birthday cakes for children, our website
                is not directed at individuals under 13. We do not knowingly
                collect personal information from children. If you believe a
                child has provided us with personal information, please contact
                us immediately.
              </p>
              <div className="bg-amber-50 p-4 rounded-lg">
                <p className="text-sm text-amber-800">
                  <strong>For parents:</strong> All orders must be placed by an
                  adult. We&apos;re happy to help you create the perfect cake
                  for your child&apos;s celebration!
                </p>
              </div>
            </div>
          </section>

          {/* Section 8: Updates to This Policy */}
          <section className="border border-gray-200 rounded-xl p-6 hover:border-amber-200 transition-colors">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              8. Updates to This Policy
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>
                We may update this Privacy Policy from time to time to reflect
                changes in our practices or legal requirements. We will notify
                you of any material changes by:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Posting the new policy on this page</li>
                <li>Updating the &quot;Last Updated&quot; date at the top</li>
                <li>Sending an email notification for significant changes</li>
              </ul>
              <p className="text-sm text-gray-600">
                We encourage you to review this policy periodically.
              </p>
            </div>
          </section>

          {/* Section 9: Contact Us */}
          <section className="border border-gray-200 rounded-xl p-6 hover:border-amber-200 transition-colors">
            <div className="flex items-center gap-3 mb-4">
              <Mail className="w-6 h-6 text-amber-600" />
              <h2 className="text-xl font-semibold text-gray-900">
                9. Contact Us
              </h2>
            </div>
            <div className="space-y-4 text-gray-700">
              <p>
                If you have questions about this Privacy Policy or how we handle
                your data, please contact our founder, Mrs. Eleanor Dartey:
              </p>
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    📍 Location
                  </h3>
                  <p className="text-gray-700">Accra, Ghana</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    📱 WhatsApp/Phone
                  </h3>
                  <p className="text-amber-700 font-medium">
                    [Your Contact Number]
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">📧 Email</h3>
                  <p className="text-amber-700 font-medium">
                    [Your Email Address]
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    📸 Instagram
                  </h3>
                  <p className="text-amber-700 font-medium">
                    @LesDelicesByAkorfa
                  </p>
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                <strong>Response Time:</strong> We typically respond within
                24-48 hours.
              </p>
            </div>
          </section>

          {/* Trust Seal */}
          <div className="bg-linear-to-r from-amber-50 to-orange-50 border-2 border-amber-300 rounded-2xl p-6 md:p-8 text-center">
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-white border-4 border-amber-200 flex items-center justify-center mb-4">
                <Shield className="w-10 h-10 text-amber-600" />
              </div>
              <h3 className="text-xl font-serif font-bold text-gray-900 mb-2">
                Your Trust, Our Promise
              </h3>
              <p className="text-gray-700 mb-6 max-w-2xl">
                At Les Délices By Akorfa, we&apos;re committed to protecting
                your privacy with the same dedication we bring to every cake we
                create. Thank you for trusting us with your celebrations.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/menu"
                  className="inline-flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  <Cake className="w-4 h-4" />
                  Explore Our Cakes
                </Link>
                <Link
                  href="/terms"
                  className="inline-flex items-center justify-center gap-2 border border-amber-300 bg-white hover:bg-amber-50 text-amber-700 px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  <Shield className="w-4 h-4" />
                  View Terms & Conditions
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

export default PrivacyPage;
