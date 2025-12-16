import React, { useState } from "react";
import { Send } from "lucide-react";
import { translations } from "../data/translations";
import { Language } from "../types";

/* =========================
   🧾 TYPES
========================= */

interface ContactFormData {
  name: string;
  email: string;
  message: string;
  phone: string;
}

type FormErrors = Partial<Record<keyof ContactFormData | "submit", string>>;

/* =========================
   🔐 SANITIZE
========================= */

const sanitizeText = (v: string) => v.replace(/[<>[\]{}'"\\/|;:=]/g, "").trim();

const sanitizeEmail = (v: string) => v.replace(/[^\w@.+-]/g, "").trim();

const sanitizePhone = (v: string) => v.replace(/\D/g, "").slice(0, 9); // только 9 цифр

/* =========================
   ✅ VALIDATE
========================= */

const validateEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const validatePhone = (phone: string) => /^\d{9}$/.test(phone);

/* =========================
   📱 FORMAT PHONE
========================= */

const formatUzPhone = (value: string) => {
  const d = value.replace(/\D/g, "");

  if (d.length <= 2) return d;
  if (d.length <= 5) return `${d.slice(0, 2)} ${d.slice(2)}`;
  if (d.length <= 7) return `${d.slice(0, 2)} ${d.slice(2, 5)} ${d.slice(5)}`;

  return `${d.slice(0, 2)} ${d.slice(2, 5)} ${d.slice(5, 7)} ${d.slice(7, 9)}`;
};

/* =========================
   ⏱ RATE LIMIT
========================= */

const isRateLimited = () => {
  const now = Date.now();
  const stored = localStorage.getItem("submits");
  const list: number[] = stored ? JSON.parse(stored) : [];
  return list.filter((t) => now - t < 10 * 60 * 1000).length >= 5;
};

const recordSubmit = () => {
  const stored = localStorage.getItem("submits");
  const list: number[] = stored ? JSON.parse(stored) : [];
  list.push(Date.now());
  localStorage.setItem("submits", JSON.stringify(list));
};

/* =========================
   🧩 COMPONENT
========================= */

interface Props {
  currentLanguage: Language;
}

const SecureContactForm: React.FC<Props> = ({ currentLanguage }) => {
  const t = translations[currentLanguage]?.form || translations.ru.form;

  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    message: "",
    phone: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (field: keyof ContactFormData, value: string) => {
    let clean = value;

    if (field === "email") clean = sanitizeEmail(value);
    if (field === "phone") clean = sanitizePhone(value);
    if (field === "name" || field === "message") clean = sanitizeText(value);

    setFormData((p) => ({ ...p, [field]: clean }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }));
  };

  const validateForm = () => {
    const e: FormErrors = {};

    if (formData.name.length < 2) e.name = t.formInputName;
    if (formData.message.length < 2) e.message = t.formInputMessage;
    if (formData.email && !validateEmail(formData.email))
      e.email = t.formInputMessage;
    if (formData.phone && !validatePhone(formData.phone))
      e.phone = t.formTelephone;
    if (isRateLimited()) e.submit = t.formSendError;

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    const payload = new URLSearchParams({
      name: formData.name,
      email: formData.email,
      message: formData.message,
      phone: formData.phone ? `+998${formData.phone}` : "",
    });

    try {
      const res = await fetch(
        "https://script.google.com/macros/s/AKfycbzknqi83jOfSo9UswTP3hwoAjdV3SDbf5-5yEGwmYVqAzR2V7VB2xkPDFIp-zEkRe0/exec",
        { method: "POST", body: payload }
      );

      if ((await res.text()) === "OK") {
        recordSubmit();
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
        <h3 className="text-xl font-semibold mb-2">{t.formMessageSucces}</h3>
        <p className="text-gray-600 mb-4">{t.formWeTypeYou}</p>
        <button
          onClick={() => setSubmitted(false)}
          className="text-purple-600 font-medium"
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
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
            {errors.submit}
          </div>
        )}

        {/* Name */}
        <input
          type="text"
          value={formData.name}
          onChange={(e) => handleChange("name", e.target.value)}
          placeholder={t.formName}
          className="w-full px-4 py-3 border rounded-lg"
          required
        />

        {/* Email */}
        <input
          type="email"
          value={formData.email}
          onChange={(e) => handleChange("email", e.target.value)}
          placeholder="example@mail.com"
          className="w-full px-4 py-3 border rounded-lg"
        />

        {/* Phone */}
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
            +998
          </span>
          <input
            type="tel"
            inputMode="numeric"
            value={formatUzPhone(formData.phone)}
            onChange={(e) => handleChange("phone", e.target.value)}
            placeholder="XX XXX XX XX"
            className="w-full pl-16 pr-4 py-3 border rounded-lg"
          />
        </div>

        {/* Message */}
        <textarea
          rows={5}
          value={formData.message}
          onChange={(e) => handleChange("message", e.target.value)}
          placeholder={t.formMessage}
          className="w-full px-4 py-3 border rounded-lg resize-none"
          maxLength={1000}
          required
        />

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
