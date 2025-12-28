import React from "react";
import { Monitor, Smartphone, UtensilsCrossed } from "lucide-react";
import { Language } from "../types";
import { translations } from "../data/translations";

interface ServicesProps {
  currentLanguage: Language;
}

const Services: React.FC<ServicesProps> = ({ currentLanguage }) => {
  const t = translations[currentLanguage];

  const services = [
    {
      icon: <Monitor className="w-12 h-12" />,
      title: t.services.landing.title,
      description: t.services.landing.description,
      gradient: "from-purple-500 to-purple-600",
    },
    {
      icon: <Smartphone className="w-12 h-12" />,
      title: t.services.website.title,
      description: t.services.website.description,
      gradient: "from-blue-500 to-blue-600",
    },
    {
      icon: <UtensilsCrossed className="w-12 h-12" />,
      title: t.services.ecommerce.title,
      description: t.services.ecommerce.description,
      gradient: "from-purple-600 to-blue-500",
    },
  ];

  return (
    <section id="services" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t.services.title}
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-purple-200 transform hover:-translate-y-2"
            >
              <div
                className={`bg-gradient-to-r ${service.gradient} text-white w-20 h-20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
              >
                {service.icon}
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {service.title}
              </h3>

              <p className="text-gray-600 leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
