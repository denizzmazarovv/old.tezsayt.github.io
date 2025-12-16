import React from "react";
import { Phone, Mail, MapPin, Send } from "lucide-react";
import { Language } from "../types";
import { translations } from "../data/translations";
import SecureContactForm from "./SecureContactForm";
import { FaInstagram, FaTelegramPlane } from "react-icons/fa";

interface ContactProps {
  currentLanguage: Language;
}

const Contact: React.FC<ContactProps> = ({ currentLanguage }) => {
  const t = translations[currentLanguage];

  const contactInfo = [
    {
      icon: <Phone className="w-6 h-6" />,
      label: t.contact.phone,
      value: "+998 94 171 71 94",
      href: "tel:+998941717194",
    },
    {
      icon: <FaTelegramPlane className="w-6 h-6" />,
      value: "@weblezen",
      href: "https://t.me/weblezen",
    },
    {
      icon: <FaInstagram className="w-6 h-6" />,
      value: "@tezsayt",
      href: "https://www.instagram.com/tezsayt",
    },
    {
      icon: <Mail className="w-6 h-6" />,
      label: t.contact.email,
      value: "lezenuz@gmail.com",
      href: "mailto:lezenuz@gmail.com",
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      label: t.contact.address,
      value: "Tashkent, Uzbekistan",
      href: "#",
    },
  ];

  return (
    <section id="contact" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t.contact.title}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t.contact.subtitle}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            {contactInfo.map((info, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="bg-gradient-to-r from-purple-600 to-blue-500 text-white w-12 h-12 rounded-full flex items-center justify-center">
                  {info.icon}
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">{info.label}</div>
                  <a
                    href={info.href}
                    className="text-lg font-semibold text-gray-900 hover:text-purple-600 transition-colors"
                  >
                    {info.value}
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Contact Form */}
          <SecureContactForm currentLanguage={currentLanguage} />
        </div>
      </div>
    </section>
  );
};

export default Contact;
