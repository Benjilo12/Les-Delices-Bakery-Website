"use client";

import { Globe } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === "en" ? "fr" : "en";
    i18n.changeLanguage(newLang);
    document.cookie = `NEXT_LOCALE=${newLang};path=/;max-age=31536000`;
  };

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
    >
      <Globe className="w-5 h-5" />
      <span className="font-medium">
        {i18n.language === "en" ? "🇬🇧 EN" : "🇫🇷 FR"}
      </span>
    </button>
  );
}
