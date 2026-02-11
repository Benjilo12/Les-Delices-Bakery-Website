"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Topbar from "@/components/Topbar";
import Footer from "@/components/Footer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Cake,
  CreditCard,
  Truck,
  Clock,
  Shield,
  Phone,
  MessageCircle,
  Search,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

function FAQPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const categories = [
    { id: "all", name: "All" },
    { id: "ordering", name: "Orders" },
    { id: "delivery", name: "Delivery" },
    { id: "payment", name: "Payment" },
    { id: "cakes", name: "Cakes" },
  ];

  const faqs = [
    {
      id: "order-1",
      category: "ordering",
      question: "How far in advance should I order?",
      answer:
        "48 hours minimum notice for all orders. For complex designs, 1-2 weeks recommended.",
    },
    {
      id: "order-2",
      category: "ordering",
      question: "How do I place an order?",
      answer:
        "Order through our website or contact us directly via WhatsApp/phone.",
    },
    {
      id: "order-3",
      category: "ordering",
      question: "Can I modify or cancel my order?",
      answer:
        "Yes, up to 48 hours before delivery. Full refund 48+ hours, 50% refund 24-48 hours, no refund within 24 hours.",
    },
    {
      id: "delivery-1",
      category: "delivery",
      question: "Do you deliver outside Accra?",
      answer:
        "Currently delivering within Accra and select surrounding areas. Contact us for special arrangements.",
    },
    {
      id: "delivery-2",
      category: "delivery",
      question: "What are your delivery hours?",
      answer:
        "Monday-Saturday, 9 AM - 6 PM. Free pickup also available in Accra.",
    },
    {
      id: "payment-1",
      category: "payment",
      question: "What payment methods do you accept?",
      answer:
        "Mobile money, bank transfers, and cards via Paystack. 50% deposit required for custom orders.",
    },
    {
      id: "payment-2",
      category: "payment",
      question: "Is online payment secure?",
      answer:
        "Yes, we use Paystack with 256-bit SSL encryption. We never store your card details.",
    },
    {
      id: "cake-1",
      category: "cakes",
      question: "What flavors do you offer?",
      answer:
        "Chocolate, Vanilla, Banana, Carrot, Cookies & Cream, Lemon, Orange, Red Velvet, Coconut.",
    },
    {
      id: "cake-2",
      category: "cakes",
      question: "What size cake should I order?",
      answer:
        "6-inch (8-10 ppl), 8-inch (12-15), 9-inch (18-20), 10-inch (25-30), 12-inch (35-40).",
    },
    {
      id: "cake-3",
      category: "cakes",
      question: "Are your cakes healthy?",
      answer:
        "Yes! We specialize in healthier cakes with whipped cream frosting. 'Elegance in every bite. Healthy in every slice.'",
    },
  ];

  const filteredFaqs = faqs.filter((faq) => {
    const matchesSearch = faq.question
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      activeCategory === "all" || faq.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-white">
      <Topbar />
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
            <MessageCircle className="w-8 h-8 text-amber-600" />
          </div>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-2">
            FAQs
          </h1>
          <p className="text-gray-600">Quick answers to common questions</p>
        </motion.div>

        {/* Search - Wider */}
        <div className="relative mb-6 max-w-3xl mx-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search questions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-200 focus:border-amber-500 outline-none"
          />
        </div>

        {/* Categories - Centered */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-colors ${
                activeCategory === category.id
                  ? "bg-amber-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* FAQ Accordion - Full width */}
        {filteredFaqs.length > 0 ? (
          <Accordion type="single" collapsible className="space-y-3 w-full">
            {filteredFaqs.map((faq) => (
              <AccordionItem
                key={faq.id}
                value={faq.id}
                className="border border-gray-200 rounded-lg overflow-hidden bg-white w-full"
              >
                <AccordionTrigger className="px-6 py-4 hover:bg-gray-50 text-left font-medium text-gray-900">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 text-gray-600">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg w-full">
            <p className="text-gray-600">No questions found</p>
            <button
              onClick={() => {
                setSearchTerm("");
                setActiveCategory("all");
              }}
              className="mt-4 text-amber-600 hover:text-amber-700 font-medium"
            >
              Clear filters
            </button>
          </div>
        )}

        {/* Contact Section - Wider */}
        <div className="mt-12 text-center p-8 bg-amber-50 rounded-xl border border-amber-200 w-full">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Still have questions?
          </h2>
          <p className="text-gray-600 mb-4">We&apos;re here to help!</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="https://wa.me/233000000000"
              className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default FAQPage;
