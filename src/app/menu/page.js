import MenuContent from "./MenuContent";
import Navbar from "@/components/Navbar";

import { Suspense } from "react";

function page() {
  return (
    <div>
      <Navbar />
      <Suspense
        fallback={<div className="p-20 text-center">Loading Menu...</div>}
      >
        <MenuContent />
      </Suspense>
    </div>
  );
}

export default page;
