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

// ✅ Включено согласие с политикой
type FormErrors = Partial<
  Record<keyof ContactFormData | "submit" | "agree", string>
>;

/* =========================
   🔐 SANТИЗАЦИЯ
========================= */

const sanitizeText = (value: string) =>
  value.replace(/[<>[\]{}"'\\/|;:=]/g, "");

const sanitizeEmail = (value: string) => value.replace(/[^\w@.+-]/g, "").trim();

const sanitizePhone = (value: string) => value.replace(/\D/g, "").slice(0, 9);

/* =========================
   📱 ФОРМАТ ТЕЛЕФОНА
========================= */

const formatPhone = (value: string) => {
  const d = value.replace(/\D/g, "");
  if (d.length <= 2) return d;
  if (d.length <= 5) return `${d.slice(0, 2)} ${d.slice(2)}`;
  if (d.length <= 7) return `${d.slice(0, 2)} ${d.slice(2, 5)} ${d.slice(5)}`;
  return `${d.slice(0, 2)} ${d.slice(2, 5)} ${d.slice(5, 7)} ${d.slice(7, 9)}`;
};

/* =========================
   ✅ ВАЛИДАЦИЯ
========================= */

const validateEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const validatePhone = (phone: string) => /^\d{9}$/.test(phone);

const validateInput = (value: string, max: number) =>
  value.length > 1 && value.length <= max;

/* =========================
   📱 ОПРЕДЕЛЕНИЕ УСТРОЙСТВА
========================= */

const getDeviceModel = (): string => {
  const ua = navigator.userAgent;
  const platform = navigator.platform;
  const dpr = window.devicePixelRatio || 1;

  const width = screen.width * dpr;
  const height = screen.height * dpr;
  const resolution = `${width}x${height}`;

  const isIOS = /iPhone|iPad|iPod/i.test(ua);
  const isMac = /Mac/i.test(platform);
  const isIPad = /iPad/i.test(ua) || (isMac && navigator.maxTouchPoints > 1);
  const isMobile = /Mobi/i.test(ua);

  if (isIOS && !isIPad && isMobile) {
    const map: Record<string, string> = {
      "1290x2796": "iPhone 15-16-17 Pro Max",
      "1179x2556": "iPhone 15-16 Pro",
      "1170x2532": "iPhone 13-14-15",
      "1284x2778": "iPhone 11-12-13-14 Pro Max",
      "1792x828": "iPhone (XR-11)",
      "1334x750": "iPhone (6-7-8)",
      "1080x2340": "iPhone 13 mini",
      "750x1334": "iPhone SE (2022/2024)",
    };
    return map[resolution] || "iPhone";
  }

  if (isIPad) {
    const map: Record<string, string> = {
      "2208x3200": 'iPad Pro M4 13"',
      "2156x3036": 'iPad Pro M4 11"',
      "2048x2732": 'iPad Pro 12.9"',
      "1668x2388": 'iPad Pro 11"',
      "1640x2360": "iPad Air M2",
      "1620x2160": "iPad 10 / 11",
      "1488x2266": "iPad mini",
    };
    return map[resolution] || "iPad";
  }

  if (isMac && !isMobile) {
    const map: Record<string, string> = {
      "3456x2234": 'MacBook Pro 16"',
      "3024x1964": 'MacBook Pro 16"',
      "3024x1890": 'MacBook Pro 14"',
      "2880x1800": 'MacBook Pro 14"',
      "2880x1864": 'MacBook Air 15"',
      "2560x1664": 'MacBook Air 13"',
    };

    let model = map[resolution] || "Mac";

    try {
      const gl = document.createElement("canvas").getContext("webgl");
      const dbg = gl?.getExtension("WEBGL_debug_renderer_info");
      const r = dbg && gl?.getParameter(dbg.UNMASKED_RENDERER_WEBGL);
      if (r?.includes("M3")) model += " M3";
      else if (r?.includes("M2")) model += " M2";
      else if (r?.includes("M1")) model += " M1";
    } catch {}

    return model;
  }

  if (/Android/i.test(ua)) {
    const match = ua.match(/Android.*; ([^;)]+)/i);
    if (match?.[1]) return match[1].replace("Build", "").trim();
    return "Android Phone";
  }

  if (/Windows/i.test(ua)) return "Windows PC";
  if (/Linux/i.test(ua)) return "Linux PC";

  return isMobile ? "Mobile Device" : "Desktop Device";
};

/* =========================
   🧩 КОМПОНЕНТ
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

  // ✅ Добавлено состояние для согласия с политикой
  const [agree, setAgree] = useState(false);

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const t = translations[currentLanguage]?.form || translations.ru.form;

  /* =========================
     🔍 ВАЛИДАЦИЯ ФОРМЫ
  ========================= */

  const validateForm = (): boolean => {
    const e: FormErrors = {};

    if (!validateInput(formData.name, 100)) {
      e.name = t.errors?.name;
    }

    if (!validateInput(formData.message, 1000)) {
      e.message = t.errors?.message;
    }

    // ❗ Требуется телефон ИЛИ email
    if (!formData.email && !formData.phone) {
      const contactError = t.errors?.contact || t.formTelephone + " / Email";
      e.email = contactError;
      e.phone = contactError;
    }

    if (formData.email && !validateEmail(formData.email)) {
      e.email = t.errors?.email;
    }

    if (formData.phone && !validatePhone(formData.phone)) {
      e.phone = t.errors?.phone;
    }

    // ✅ Добавлена проверка согласия с политикой
    if (!agree) {
      e.agree = t.formPolicyError;
    }

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

    const payload = new URLSearchParams();
    payload.append("name", formData.name);
    payload.append("email", formData.email || "");
    payload.append("message", formData.message);
    if (formData.phone) payload.append("phone", `+998${formData.phone}`);
    payload.append("device", getDeviceModel());

    try {
      const res = await fetch(
        "https://script.google.com/macros/s/AKfycbyv4FO3pn4IxGHeBhqqItmdXUWWhlqvH0ijZLn7O1k06u9DTPAP-ZQIlWo8x8ZNmPSv/exec",
        { method: "POST", body: payload }
      );

      if ((await res.text()) === "OK") {
        setSubmitted(true);
        setFormData({
          name: "",
          email: "",
          message: "",
          phone: "",
        });
        setAgree(false);
      } else {
        setErrors({ submit: t.formSendError });
      }
    } catch {
      setErrors({ submit: t.formSendError });
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ===== УСПЕШНАЯ ОТПРАВКА ===== */

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

  /* ===== ФОРМА ===== */

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
              maxLength={40}
              required
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-500">{errors.name}</p>
            )}
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
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="example@mail.com"
              maxLength={70}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email}</p>
            )}
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
                className={`w-full pl-16 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 ${
                  errors.phone ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="XX XXX XX XX"
              />
            </div>
            {errors.phone && (
              <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
            )}
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
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 resize-none ${
                errors.message ? "border-red-500" : "border-gray-300"
              }`}
              required
              maxLength={500}
            />
            <div className="text-right text-sm text-gray-500 mt-1">
              {formData.message.length}/500
            </div>
            {errors.message && (
              <p className="mt-1 text-sm text-red-500">{errors.message}</p>
            )}
          </div>

          {/* ✅ Согласие с политикой конфиденциальности */}
          <div>
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="policy"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <label
                htmlFor="policy"
                className="text-sm text-gray-600 leading-snug cursor-pointer"
              >
                {t.formPolicyText}{" "}
                <a
                  href="/privacy.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-600 hover:underline font-medium"
                >
                  {t.formPolicyLink}
                </a>
              </label>
            </div>

            {errors.agree && (
              <p className="mt-1 text-sm text-red-500">{errors.agree}</p>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !agree}
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
