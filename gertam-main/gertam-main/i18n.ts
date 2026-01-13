
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import translationEN from "@/public/locales/en/translation.json";
import translationAR from "@/public/locales/ar/translation.json";

const resources = {
    en: { translation: translationEN },
    ar: { translation: translationAR },
};

// استرجاع اللغة من localStorage (قبل تهيئة i18n)
let savedLang: string | null = "ar";
if (typeof window !== "undefined") {
    savedLang = localStorage.getItem("lang") || "ar";
}

// تهيئة i18n لمرة واحدة فقط
if (!i18n.isInitialized) {
    i18n
        .use(LanguageDetector)
        .use(initReactI18next)
        .init({
            resources,
            lng: savedLang, // ← هنا النقطة المهمة
            fallbackLng: "ar",
            interpolation: { escapeValue: false },
            detection: {
                // تعطيل اكتشاف اللغة التلقائي من المتصفح
                order: ["localStorage", "navigator"],
                caches: ["localStorage"],
            },
        });
}

export default i18n;
