import HeroSection from "@/components/HeroSection";
import LesDelicesBanner from "@/components/LesDelicesBanner";
import Navbar from "@/components/Navbar";
import Topbar from "@/components/Topbar";

function page() {
  return (
    <>
      <Topbar />
      <Navbar />
      <div>
        <HeroSection />
        <LesDelicesBanner />
      </div>
    </>
  );
}

export default page;
