import AboutSection from "@/components/AboutSection";
import BlogSection from "@/components/BlogSection";
import CategoryScroll from "@/components/CategoryScroll";
import CustomerReviews from "@/components/CustomerReviews";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import LesDelicesBanner from "@/components/LesDelicesBanner";
import Navbar from "@/components/Navbar";
import PaymentInfoSection from "@/components/PaymentInfoSection";
import ProductCarousel from "@/components/ProductCarousel";
import Topbar from "@/components/Topbar";
import WhatsAppWidget from "@/components/WhatsAppWidget";

function page() {
  return (
    <>
      <Topbar />
      <Navbar />
      <div className="overflow-hidden">
        <HeroSection />
        <LesDelicesBanner />
        <CategoryScroll />
        <ProductCarousel />
        <AboutSection />
        <CustomerReviews />
        <BlogSection />
        <PaymentInfoSection />
        <Footer />
        <WhatsAppWidget />
      </div>
    </>
  );
}

export default page;
