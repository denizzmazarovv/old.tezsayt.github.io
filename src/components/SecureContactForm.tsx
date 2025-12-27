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

const sanitizeEmail = (value: string) => value.replace(/[^\w@.+-]/g, "").trim();

/* =========================
   📱 ТЕЛЕФОН
========================= */

const formatPhone = (value: string) => {
  const d = value.replace(/\D/g, "");
  if (d.length <= 2) return d;
  if (d.length <= 5) return `${d.slice(0, 2)} ${d.slice(2)}`;
  if (d.length <= 7) return `${d.slice(0, 2)} ${d.slice(2, 5)} ${d.slice(5)}`;
  return `${d.slice(0, 2)} ${d.slice(2, 5)} ${d.slice(5, 7)} ${d.slice(7, 9)}`;
};

const validateEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

/* =========================
   📱 DEVICE DETECTION (РЕАЛЬНАЯ)
========================= */

const getDeviceModel = () => {
  const ua = navigator.userAgent;

  if (/iPhone/i.test(ua)) return "iPhone (iOS)";

  if (/Android/i.test(ua)) {
    if (/Samsung/i.test(ua)) return "Samsung (Android)";
    if (/Xiaomi|Mi|Redmi/i.test(ua)) return "Xiaomi (Android)";
    if (/Pixel/i.test(ua)) return "Google Pixel (Android)";
    return "Android phone";
  }

  if (/Macintosh/i.test(ua)) return "MacBook / macOS";
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

    if (formData.name.length < 2) e.name = t.formInputName;
    if (formData.message.length < 5) e.message = t.formInputMessage;
    if (formData.email && !validateEmail(formData.email))
      e.email = t.formInputMessage;
    if (formData.phone && formData.phone.length !== 9)
      e.phone = t.formTelephone;

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleInputChange = (field: keyof ContactFormData, value: string) => {
    let cleanValue = value;

    if (field === "email") cleanValue = sanitizeEmail(value);
    else if (field === "phone")
      cleanValue = value.replace(/\D/g, "").slice(0, 9);
    else cleanValue = sanitizeText(value);

    setFormData((prev) => ({ ...prev, [field]: cleanValue }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    /* 🔥 ВАЖНО: ТОЛЬКО append(), чтобы device НЕ ТЕРЯЛСЯ */
    const payload = new URLSearchParams();
    payload.append("name", formData.name);
    payload.append("email", formData.email || "");
    payload.append("message", formData.message);

    if (formData.phone) {
      payload.append("phone", `+998${formData.phone}`);
    }

    const device = getDeviceModel() || "Unknown device";
    payload.append("device", device);

    try {
      const res = await fetch(
        "https://script.google.com/macros/s/AKfycbyv4FO3pn4IxGHeBhqqItmdXUWWhlqvH0ijZLn7O1k06u9DTPAP-ZQIlWo8x8ZNmPSv/exec",
        {
          method: "POST",
          body: payload,
        }
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

  /* ===== FORM ===== */

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
              className="w-full px-4 py-3 border rounded-lg border-gray-300"
              required
            />
          </div>

          {/* Email */}
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            className="w-full px-4 py-3 border rounded-lg border-gray-300"
            placeholder="example@mail.com"
          />

          {/* Телефон */}
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
              +998
            </span>
            <input
              type="tel"
              value={formatPhone(formData.phone || "")}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              className="w-full pl-16 pr-4 py-3 border rounded-lg border-gray-300"
              placeholder="XX XXX XX XX"
            />
          </div>

          {/* Сообщение */}
          <textarea
            rows={6}
            value={formData.message}
            onChange={(e) => handleInputChange("message", e.target.value)}
            className="w-full px-4 py-3 border rounded-lg border-gray-300"
            required
            maxLength={500}
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-500 text-white py-4 rounded-lg font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <Send className="w-5 h-5" />
          {isSubmitting ? t.formSending : t.formMessage}
        </button>
      </form>
    </div>
  );
};

export default SecureContactForm;
