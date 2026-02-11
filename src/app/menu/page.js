import Footer from "@/components/Footer";
import MenuContent from "./MenuContent";
import Navbar from "@/components/Navbar";

import { Suspense } from "react";
import Topbar from "@/components/Topbar";

function page() {
  return (
    <div>
      <Topbar />
      <Navbar />
      <Suspense
        fallback={<div className="p-20 text-center">Loading Menu...</div>}
      >
        <MenuContent />
      </Suspense>
      <Footer />
    </div>
  );
}

export default page;
