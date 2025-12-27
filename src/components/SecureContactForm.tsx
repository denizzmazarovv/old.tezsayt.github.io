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
   🔐 САНИТИЗАЦИЯ (ТВОЯ)
========================= */

const sanitizeText = (value: string) =>
  value.replace(/[<>[\]{}'"\\/|;:=]/g, "");

const sanitizeEmail = (value: string) => value.replace(/[^\w@.+-]/g, "").trim();

const sanitizePhone = (value: string) => value.replace(/\D/g, "").slice(0, 9);

/* =========================
   📱 АВТОФОРМАТ ТЕЛЕФОНА
========================= */

const formatPhone = (value: string) => {
  const d = value.replace(/\D/g, "");
  if (d.length <= 2) return d;
  if (d.length <= 5) return `${d.slice(0, 2)} ${d.slice(2)}`;
  if (d.length <= 7) return `${d.slice(0, 2)} ${d.slice(2, 5)} ${d.slice(5)}`;
  return `${d.slice(0, 2)} ${d.slice(2, 5)} ${d.slice(5, 7)} ${d.slice(7, 9)}`;
};

/* =========================
   ✅ ВАЛИДАЦИЯ (ТВОЯ)
========================= */

const validateEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const validatePhone = (phone: string) => /^\d{9}$/.test(phone);

const validateInput = (input: string, maxLength: number) =>
  input.length > 1 && input.length <= maxLength;

/* =========================
   📱 DEVICE DETECTION (МАКСИМУМ ВОЗМОЖНОГО)
========================= */

const getDeviceModel = () => {
  const ua = navigator.userAgent;

  // 🍎 iPhone — модель браузер НЕ даёт
  if (/iPhone/i.test(ua)) return "iPhone (iOS)";

  // 🤖 Android — модель можно вытащить
  if (/Android/i.test(ua)) {
    const match = ua.match(/Android.*; ([^;)]*)/i);
    if (match && match[1]) return match[1].trim();
    return "Android phone";
  }

  if (/Macintosh/i.test(ua)) return "MacBook (macOS)";
  if (/Windows/i.test(ua)) return "Windows PC";

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
    if (!validateInput(formData.message, 1000)) e.message = t.formInputMessage;
    if (formData.email && !validateEmail(formData.email))
      e.email = t.formInputMessage;
    if (formData.phone && !validatePhone(formData.phone))
      e.phone = t.formTelephone;

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleInputChange = (field: keyof ContactFormData, value: string) => {
    let cleanValue = value;

    if (field === "email") cleanValue = sanitizeEmail(value);
    else if (field === "phone") cleanValue = sanitizePhone(value);
    else cleanValue = sanitizeText(value);

    setFormData((prev) => ({ ...prev, [field]: cleanValue }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    // 🔥 ГАРАНТИРОВАННАЯ ОТПРАВКА device
    const payload = new URLSearchParams();
    payload.append("name", formData.name);
    payload.append("email", formData.email || "");
    payload.append("message", formData.message);

    if (formData.phone) {
      payload.append("phone", `+998${formData.phone}`);
    }

    payload.append("device", getDeviceModel());

    try {
      const res = await fetch(
        "https://script.google.com/macros/s/AKfycbyv4FO3pn4IxGHeBhqqItmdXUWWhlqvH0ijZLn7O1k06u9DTPAP-ZQIlWo8x8ZNmPSv/exec",
        { method: "POST", body: payload }
      );

      if ((await res.text()) === "OK") {
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

  /* ===== SUCCESS ===== */

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

  /* ===== FORM (СТИЛИ 1-В-1 ТВОИ) ===== */

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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t.formName} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
              placeholder={t.formInputName}
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 border-gray-300"
              placeholder="example@mail.com"
            />
          </div>

          {/* Телефон */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t.formTelephone}
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                +998
              </span>
              <input
                type="tel"
                value={formatPhone(formData.phone || "")}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                className="w-full pl-16 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 border-gray-300"
                placeholder="XX XXX XX XX"
              />
            </div>
          </div>

          {/* Сообщение */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t.formMessage} <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={6}
              value={formData.message}
              onChange={(e) => handleInputChange("message", e.target.value)}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 resize-none border-gray-300"
              required
              maxLength={500}
            />
            <div className="text-right text-sm text-gray-500 mt-1">
              {formData.message.length}/500
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-500 text-white py-4 rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <Send className="w-5 h-5" />
          {isSubmitting ? t.formSending : t.formMessage}
        </button>
      </form>
    </div>
  );
};

export default SecureContactForm;
