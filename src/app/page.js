import HeroSection from "@/components/HeroSection";
import Navbar from "@/components/Navbar";
import Topbar from "@/components/Topbar";

function page() {
  return (
    <>
      <Topbar />
      <Navbar />
      <div>
        <HeroSection />
      </div>
    </>
  );
}

export default page;
