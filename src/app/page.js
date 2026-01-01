import Navbar from "@/components/Navbar";
import Topbar from "@/components/Topbar";

function page() {
  return (
    <>
    <Topbar />
    <Navbar />
    <div className="text-3xl text-green-400  mx-auto max-w-7xl justify-items-center items-center">
      <h1>hello this is my websites</h1>
    </div>
    </>
  );
}

export default page;
