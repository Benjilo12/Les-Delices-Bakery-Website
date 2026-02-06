import AboutSection from "@/components/AboutSection";
import BlogSection from "@/components/BlogSection";
import CategoryScroll from "@/components/CategoryScroll";
import CustomerReviews from "@/components/CustomerReviews";
import HeroSection from "@/components/HeroSection";
import LesDelicesBanner from "@/components/LesDelicesBanner";
import Navbar from "@/components/Navbar";
import PaymentInfoSection from "@/components/PaymentInfoSection";
import ProductCarousel from "@/components/ProductCarousel";
import Topbar from "@/components/Topbar";

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
      </div>
    </>
  );
}

export default page;
