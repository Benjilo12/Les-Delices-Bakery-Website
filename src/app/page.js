import AboutSection from "@/components/AboutSection";
import CategoryScroll from "@/components/CategoryScroll";
import CustomerReviews from "@/components/CustomerReviews";
import HeroSection from "@/components/HeroSection";
import LesDelicesBanner from "@/components/LesDelicesBanner";
import Navbar from "@/components/Navbar";
import ProductCarousel from "@/components/ProductCarousel";
import Topbar from "@/components/Topbar";

function page() {
  return (
    <>
      <Topbar />
      <Navbar />
      <div>
        <HeroSection />
        <LesDelicesBanner />
        <CategoryScroll />
        <ProductCarousel />
        <AboutSection />
        <CustomerReviews />
      </div>
    </>
  );
}

export default page;
