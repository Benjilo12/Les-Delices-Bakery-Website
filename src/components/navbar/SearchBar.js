// components/navbar/SearchBar.js
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";

export default function SearchBar() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  // Category mapping with synonyms for better search
  const categoryMap = [
    { 
      name: "Birthday Cakes", 
      keywords: ["birthday", "birthday cake", "birthday cakes", "celebration cake"] 
    },
    { 
      name: "Wedding Cakes", 
      keywords: ["wedding", "wedding cake", "wedding cakes", "bridal", "marriage"] 
    },
    { 
      name: "Cupcakes", 
      keywords: ["cupcake", "cupcakes", "small cake", "mini cake"] 
    },
    { 
      name: "Cake Loaves", 
      keywords: ["loaf", "loaves", "cake loaf", "loaf cake", "bread cake"] 
    },
    { 
      name: "Pastries & Snacks", 
      keywords: ["pastry", "pastries", "snack", "snacks", "biscuit", "cookie"] 
    },
  ];

  const placeholders = [
    "Find Something Pretty...",
    "Search Birthday Cakes...",
    "Looking for Wedding Cakes?",
    "Find Cupcakes...",
    "Search for Cake Loaves...",
    "Looking for Pastries & Snacks?",
    "Find custom cakes...",
    "Looking for desserts...",
    "Search catering options...",
    "Find vegan options...",
  ];

  const handleChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const searchTerm = searchQuery.toLowerCase().trim();
    
    // Check for category matches
    let matchedCategory = null;
    
    for (const category of categoryMap) {
      // Check if search term matches category name
      if (category.name.toLowerCase().includes(searchTerm) || 
          searchTerm.includes(category.name.toLowerCase())) {
        matchedCategory = category.name;
        break;
      }
      
      // Check for keyword matches
      for (const keyword of category.keywords) {
        if (searchTerm.includes(keyword) || keyword.includes(searchTerm)) {
          matchedCategory = category.name;
          break;
        }
      }
      
      if (matchedCategory) break;
    }

    if (matchedCategory) {
      // Redirect to menu with category filter
      router.push(`/menu?category=${encodeURIComponent(matchedCategory)}`);
    } else {
      // Redirect to menu with search filter
      router.push(`/menu?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="hidden md:flex items-center w-full max-w-md">
      <PlaceholdersAndVanishInput
        placeholders={placeholders}
        onChange={handleChange}
        onSubmit={handleSubmit}
      />
    </div>
  );
}