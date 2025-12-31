"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SearchBar() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  // const handleSearch = (e) => {
  //   e.preventDefault();
  //   if (searchQuery.trim()) {
  //     router.push(`/menu?search=${encodeURIComponent(searchQuery)}`);
  //   }
  // };

  return (
    <form className="hidden md:flex items-center bg-amber-100 rounded-full px-4 py-2 w-full max-w-md">
      <input
        type="text"
        placeholder="Find Something Pretty..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className=" outline-none text-sm flex-1 text-gray-500 placeholder:text-gray-500"
      />
      <button
        type="submit"
        className="text-gray-600 hover:text-pink-600 cursor-pointer"
      >
        <Search className="w-5 h-5" />
      </button>
    </form>
  );
}
