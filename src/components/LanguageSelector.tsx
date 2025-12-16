import React from "react";
import { Globe } from "lucide-react";
import { Language } from "../types";

interface LanguageSelectorProps {
  currentLanguage: Language;
  onLanguageChange: (lang: Language) => void;
  isScrolled: boolean;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  currentLanguage,
  onLanguageChange,
  isScrolled,
}) => {
  const languages = [
    { code: "ru" as Language, name: "RU", flag: "🇷🇺" },
    { code: "en" as Language, name: "EN", flag: "🇺🇸" },
    { code: "uz" as Language, name: "UZ", flag: "🇺🇿" },
  ];

  const textColor = isScrolled
    ? "text-gray-900"
    : "text-gray-900 md:text-white";

  const buttonStyle = isScrolled
    ? "border-gray-300 hover:bg-gray-100"
    : "border-gray-300 hover:bg-gray-100 md:border-white/70 md:hover:bg-white/40";

  return (
    <div
      className={`relative group transition-colors duration-300 ${textColor}`}
    >
      {/* Button */}
      <button
        type="button"
        className={`flex items-center gap-2 px-3 py-2 rounded-lg backdrop-blur-sm border transition-all duration-300 ${buttonStyle}`}
      >
        <Globe size={16} className="transition-colors duration-300" />
        <span className="text-sm font-medium">
          {languages.find((l) => l.code === currentLanguage)?.name}
        </span>
      </button>

      {/* Dropdown */}
      <div
        className="absolute top-full right-0 mt-2 w-32 rounded-lg bg-white shadow-xl border border-gray-200 overflow-hidden
                   opacity-0 invisible group-hover:opacity-100 group-hover:visible
                   transition-all duration-300 z-50"
      >
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => onLanguageChange(lang.code)}
            className={`flex items-center gap-3 w-full px-4 py-2 text-left transition-colors ${
              currentLanguage === lang.code
                ? "bg-purple-50 text-purple-600"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            <span className="text-lg">{lang.flag}</span>
            <span className="text-sm font-medium">{lang.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default LanguageSelector;
