import { Project, PricingPlan } from "../types";

export const initialProjects: Project[] = [
  {
    id: "1",
    title: {
      ru: "Презентация Геля",
      en: "Gel Presentation",
      uz: "Gel taqdimoti",
    },
    description: {
      ru: "Одностраничный сайт-презентация для косметического геля. Включает описание продукта, преимущества, изображения и форму заявки.",
      en: "A one-page presentation website for a cosmetic gel. Includes product description, key benefits, images, and an application form.",
      uz: "Kosmetik gel uchun bir sahifali taqdimot sayti. Mahsulot tavsifi, afzalliklari, rasmlar va ariza shaklini o‘z ichiga oladi.",
    },

    image: "/images/LaRoche.webp",
    category: "landing",
    technologies: ["Vue.js", "React", "GoogleApi"],
    url: "https://larocheuz.netlify.app/",
  },
  {
    id: "2",
    title: {
      ru: "Planet Consulting",
      en: "Planet Consulting",
      uz: "Planet Consulting",
    },
    description: {
      ru: "Консалтинговая компания, предоставляющая услуги в 12 странах. Мы помогаем бизнесу развиваться, оптимизировать процессы и выходить на новые рынки.",
      en: "A consulting company operating in 12 countries. We help businesses grow, optimize processes, and expand into new markets.",
      uz: "12 mamlakatda faoliyat yurituvchi konsalting kompaniyasi. Biz biznesga rivojlanishga, jarayonlarni optimallashtirishga va yangi bozorlar ochishga yordam beramiz.",
    },

    image: "/images/PlanetConsulting.webp",
    category: "ecommerce",
    technologies: ["Vue.js", "React", "GoogleApi", "TelegramBotApi"],
    url: "https://planetconsulting.netlify.app/",
  },
  {
    id: "3",
    title: {
      ru: "Мужской барбершоп",
      en: "Mens Barbershop",
      uz: "Erkaklar sartaroshxonasi",
    },
    description: {
      ru: "Современный сайт для барбершопа с онлайн-записью прямо в Telegram и наглядным прайсом",
      en: "Modern barbershop website with instant booking to Telegram and a clear price list",
      uz: "Zamonaviy barber-shop sayti: Telegram’ga tezkor yozilish va ochiq narxlar ro‘yxati",
    },
    image: "/images/razor.webp",
    category: "ecommerce",
    technologies: ["React", "GoogleApi", "TelegramBotApi"],
    url: "https://razorcraft.netlify.app/",
  },
  {
    id: "4",
    title: {
      ru: "Сайт, который заменяет администратора",
      en: "A site that replaces the administrator",
      uz: "Administratorni almashtiradigan sayt",
    },
    description: {
      ru: "Сайт для салона красоты с онлайн-записью в Telegram и автоматическим отображением актуальных цен из таблицы",
      en: "Beauty salon website with Telegram booking and real-time price updates from a spreadsheets",
      uz: "Go‘zallik saloni uchun sayt: Telegram orqali yozilish va jadvallardan avtomatik yangilanadigan narxlar",
    },
    image: "/images/salonSpa.webp",
    category: "ecommerce",
    technologies: ["React", "GoogleApi", "TelegramBotApi"],
    url: "https://salonbeautyspa.netlify.app/",
  },
  {
    id: "5",
    title: {
      ru: "Сайт для строительной компании",
      en: "Website for a construction company",
      uz: "Qurilish kompaniyasi uchun sayt",
    },
    description: {
      ru: "Современный одностраничный сайт для строительной компании. Включает описание услуг, примеры работ, контакты и форму заявки.",
      en: "A modern one-page website for a construction company. Includes services overview, portfolio examples, contact details, and an application form.",
      uz: "Qurilish kompaniyasi uchun zamonaviy bir sahifali sayt. Unda xizmatlar tavsifi, ish namunalar, aloqa ma’lumotlari va ariza shakli mavjud.",
    },

    image: "/images/stroyMaster.webp",
    category: "ecommerce",
    technologies: ["Vue.js", "Laravel", "MySQL"],
    url: "https://webstroymaster.netlify.app/",
  },
];

export const pricingPlans: PricingPlan[] = [
  {
    id: "basic",
    name: {
      ru: "Необходимый",
      en: "Essential",
      uz: "Asosiy",
    },
    price: {
      ru: "1 500 000 сум",
      en: "1 500 000 sum",
      uz: "1 500 000 sum",
    },
    features: {
      ru: [
        "Одностраничный лендинг",
        "Адаптивный дизайн",
        "Базовая SEO оптимизация",
        "1 месяц поддержки",
      ],
      en: [
        "One-page landing",
        "Responsive design",
        "Basic SEO optimization",
        "1 month support",
      ],
      uz: [
        "Bir sahifali lending",
        "Moslashuvchan dizayn",
        "Asosiy SEO optimallashtirish",
        "1 oylik yordam",
      ],
    },
  },
  {
    id: "standard",
    name: {
      ru: "Популярный",
      en: "Popular",
      uz: "Ommabop",
    },
    price: {
      ru: "2 500 000 сум",
      en: "2 500 000 sum",
      uz: "2 500 000 sum",
    },
    features: {
      ru: [
        "Полное управление сайтом",
        "До 3 изменений в месяц",
        "Домен .UZ и хостинг",
        "Дизайн сайта",
        "Разработка сайта",
        "Интеграции и формы заявок",
      ],
      en: [
        "Full website management",
        "Up to 3 edits per month",
        ".UZ domain and hosting",
        "Website design",
        "Website development",
        "Integrations & contact forms",
      ],
      uz: [
        "Saytni to‘liq boshqarish",
        "Oyiga 3 tagacha o‘zgarish",
        ".UZ domen va hosting",
        "Sayt dizayni",
        "Sayt ishlab chiqish",
        "Integratsiya va murojaat formasi",
      ],
    },
    highlighted: true,
  },
  {
    id: "premium",
    name: {
      ru: "Премиум",
      en: "Premium",
      uz: "Premium",
    },
    price: {
      ru: "7 000 000 сум",
      en: "7 000 000 sum",
      uz: "7 000 000 sum",
    },
    features: {
      ru: [
        "Уникальный дизайн",
        "Логотип и фирменный стиль",
        "Интеграции с сервисами",
        "CRM подключение",
        "3 месяца поддержки",
      ],
      en: [
        "Unique design",
        "Logo & brand identity",
        "Service integrations",
        "CRM connection",
        "3 months support",
      ],
      uz: [
        "Noyob dizayn",
        "Logo va brend uslubi",
        "Xizmatlarga integratsiya",
        "CRM ulanishi",
        "3 oylik yordam",
      ],
    },
  },
];
