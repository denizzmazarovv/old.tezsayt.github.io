import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import LanguageSelector from "./LanguageSelector";
import { Language } from "../types";
import { translations } from "../data/translations";

interface HeaderProps {
  currentLanguage: Language;
  onLanguageChange: (lang: Language) => void;
}

const SCROLL_THRESHOLD = 10;

const Header: React.FC<HeaderProps> = ({
  currentLanguage,
  onLanguageChange,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // ✅ ВАЖНО: инициализация сразу из scrollY
  const [isScrolled, setIsScrolled] = useState(() => {
    if (typeof window !== "undefined") {
      return window.scrollY > SCROLL_THRESHOLD;
    }
    return false;
  });

  const t = translations[currentLanguage];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > SCROLL_THRESHOLD);
    };

    // ✅ сразу проверяем при маунте (и после смены языка)
    handleScroll();

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMenuOpen(false);
  };

  const navigation = [
    { id: "home", label: t.navigation.home },
    { id: "about", label: t.navigation.about },
    { id: "services", label: t.navigation.services },
    { id: "portfolio", label: t.navigation.portfolio },
    { id: "pricing", label: t.navigation.pricing },
    { id: "contact", label: t.navigation.contact },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white/95 backdrop-blur-md shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-12">
              <img src="/images/logo_png_gradient.png" alt="Tez Sayt logo" />
            </div>
            <span
              className={`text-xl font-bold transition-colors ${
                isScrolled ? "text-gray-900" : "text-white"
              }`}
            >
              Tez Sayt
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navigation.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`text-sm font-medium transition-colors hover:text-purple-600 ${
                  isScrolled
                    ? "text-gray-700"
                    : "text-white hover:text-purple-300"
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Language Selector */}
          <div className="hidden md:block">
            <LanguageSelector
              currentLanguage={currentLanguage}
              onLanguageChange={onLanguageChange}
              isScrolled={isScrolled}
            />
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`md:hidden p-2 rounded-lg transition-colors ${
              isScrolled
                ? "text-gray-700 hover:bg-gray-100"
                : "text-white hover:bg-white/10"
            }`}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 py-4">
            <nav className="flex flex-col gap-2">
              {navigation.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="text-left px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-purple-600 transition-colors"
                >
                  {item.label}
                </button>
              ))}

              <div className="px-4 pt-4 border-t border-gray-200 mt-2">
                <LanguageSelector
                  currentLanguage={currentLanguage}
                  onLanguageChange={onLanguageChange}
                  isScrolled={true}
                />
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
