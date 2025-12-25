import React, { useState } from "react";
import { Send } from "lucide-react";
import { translations } from "../data/translations";
import { Language } from "../types";

interface ContactFormData {
  name: string;
  email: string;
  message: string;
  phone?: string;
}

type FormErrors = Partial<Record<keyof ContactFormData | "submit", string>>;

/* =========================
   🔐 САНИТИЗАЦИЯ
========================= */

const sanitizeText = (value: string) =>
  value.replace(/[<>[\]{}'"\\/|;:=]/g, "");

const sanitizeEmail = (value: string) =>
  value.replace(/[^\w@.+-]/g, "").trim();

const sanitizePhone = (value: string) =>
  value.replace(/\D/g, "").slice(0, 9);

/* =========================
   📱 ФОРМАТ ТЕЛЕФОНА
========================= */

const formatPhone = (value: string) => {
  const d = value.replace(/\D/g, "");
  if (d.length <= 2) return d;
  if (d.length <= 5) return `${d.slice(0, 2)} ${d.slice(2)}`;
  if (d.length <= 7)
    return `${d.slice(0, 2)} ${d.slice(2, 5)} ${d.slice(5)}`;
  return `${d.slice(0, 2)} ${d.slice(2, 5)} ${d.slice(
    5,
    7
  )} ${d.slice(7, 9)}`;
};

/* =========================
   ✅ ВАЛИДАЦИЯ
========================= */

const validateEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const validatePhone = (phone: string) => /^\d{9}$/.test(phone);

const validateInput = (input: string, maxLength: number) =>
  input.length > 1 && input.length <= maxLength;

/* =========================
   ⏱ RATE LIMIT
========================= */

const isRateLimited = () => {
  const now = Date.now();
  const windowMs = 10 * 60 * 1000;
  const stored = localStorage.getItem("successfulSubmissions");
  const submissions: number[] = stored ? JSON.parse(stored) : [];
  const recent = submissions.filter((t) => now - t <= windowMs);
  return recent.length >= 5;
};

const recordSubmission = () => {
  const stored = localStorage.getItem("successfulSubmissions");
  const submissions: number[] = stored ? JSON.parse(stored) : [];
  submissions.push(Date.now());
  localStorage.setItem("successfulSubmissions", JSON.stringify(submissions));
};

/* =========================
   📱 DEVICE DETECTION
========================= */

const getDeviceModel = () => {
  const ua = navigator.userAgent;

  // 🍎 iPhone
  if (/iPhone/.test(ua)) {
    if (/iPhone15,3|iPhone15,2/.test(ua)) return "iPhone 14 Pro Max";
    if (/iPhone14,7|iPhone14,8/.test(ua)) return "iPhone 14 / 14 Plus";
    if (/iPhone16/.test(ua)) return "iPhone 15";
    return "iPhone";
  }

  // 🍎 Mac
  if (/Macintosh/.test(ua)) {
    if (/Mac OS X 14/.test(ua)) return "MacBook Pro (M3)";
    if (/Mac OS X 13/.test(ua)) return "MacBook Pro (M2)";
    return "MacBook";
  }

  // 🤖 Android
  if (/Android/.test(ua)) {
    if (/Mi|Redmi/.test(ua)) return "Xiaomi";
    if (/SM-G/.test(ua)) return "Samsung Galaxy";
    if (/Pixel/.test(ua)) return "Google Pixel";
    return "Android phone";
  }

  // 🖥 Windows
  if (/Windows/.test(ua)) return "Windows PC";

  return "Unknown device";
};

/* =========================
   🧩 COMPONENT
========================= */

interface SecureContactFormProps {
  currentLanguage: Language;
}

const SecureContactForm: React.FC<SecureContactFormProps> = ({
  currentLanguage,
}) => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    message: "",
    phone: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const t = translations[currentLanguage]?.form || translations.ru.form;

  const validateForm = (): boolean => {
    const e: FormErrors = {};
    if (!validateInput(formData.name, 100)) e.name = t.formInputName;
    if (!validateInput(formData.message, 1000))
      e.message = t.formInputMessage;
    if (formData.email && !validateEmail(formData.email))
      e.email = t.formInputMessage;
    if (formData.phone && !validatePhone(formData.phone))
      e.phone = t.formTelephone;
    if (isRateLimited()) e.submit = t.formSendError;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleInputChange = (field: keyof ContactFormData, value: string) => {
    let cleanValue = value;
    if (field === "email") cleanValue = sanitizeEmail(value);
    else if (field === "phone") cleanValue = sanitizePhone(value);
    else cleanValue = sanitizeText(value);

    setFormData((prev) => ({ ...prev, [field]: cleanValue }));

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    const device = getDeviceModel();

    const payload = new URLSearchParams({
      name: formData.name,
      email: formData.email,
      message: formData.message,
      device, // 👈 МОДЕЛЬ УСТРОЙСТВА
      ...(formData.phone ? { phone: `+998${formData.phone}` } : {}),
    });

    try {
      const res = await fetch(
        "https://script.google.com/macros/s/AKfycbzknqi83jOfSo9UswTP3hwoAjdV3SDbf5-5yEGwmYVqAzR2V7VB2xkPDFIp-zEkRe0/exec",
        {
          method: "POST",
          body: payload,
        }
      );

      if ((await res.text()) === "OK") {
        recordSubmission();
        setSubmitted(true);
        setFormData({ name: "", email: "", message: "", phone: "" });
      } else {
        setErrors({ submit: t.formSendError });
      }
    } catch {
      setErrors({ submit: t.formSendError });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Send className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {t.formMessageSucces}
        </h3>
        <p className="text-gray-600 mb-4">{t.formWeTypeYou}</p>
        <button
          onClick={() => setSubmitted(false)}
          className="text-purple-600 hover:text-purple-700 font-medium"
        >
          {t.formSentRepeatMessage}
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-8 shadow-lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        {errors.submit && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
            {errors.submit}
          </div>
        )}

        <div className="grid gap-6">
          {/* Имя */}
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            placeholder={t.formInputName}
            required
            className="w-full px-4 py-3 border rounded-lg"
          />

          {/* Email */}
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            placeholder="example@mail.com"
            className="w-full px-4 py-3 border rounded-lg"
          />

          {/* Телефон */}
          <input
            type="tel"
            value={formatPhone(formData.phone || "")}
            onChange={(e) => handleInputChange("phone", e.target.value)}
            placeholder="+998 XX XXX XX XX"
            className="w-full px-4 py-3 border rounded-lg"
          />

          {/* Сообщение */}
          <textarea
            rows={6}
            value={formData.message}
            onChange={(e) => handleInputChange("message", e.target.value)}
            placeholder={t.formInputMessage}
            required
            className="w-full px-4 py-3 border rounded-lg resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-500 text-white py-4 rounded-lg font-semibold"
        >
          <Send className="inline mr-2" />
          {isSubmitting ? t.formSending : t.formMessage}
        </button>
      </form>
    </div>
  );
};

export default SecureContactForm;