
import { Language } from '../../types';

export type FooterTranslations = {
  allRightsReserved: string;
  madeWith: string;
  location: string;
  cookieSettings: string;
  privacyPolicy: string;
  contactLink: string; // Ensure this is a required property
};

export const footerTranslations: Record<Language['code'], FooterTranslations> = {
  lv: {
    allRightsReserved: "© 2025 netieku.es",
    madeWith: "Radīts ar",
    location: "Latvijā",
    cookieSettings: "Sīkdatņu iestatījumi",
    privacyPolicy: "Privātuma politika",
    contactLink: "Kontakti"
  },
  en: {
    allRightsReserved: "All rights reserved.",
    madeWith: "Made with",
    location: "in Latvia",
    cookieSettings: "Cookie Settings",
    privacyPolicy: "Privacy Policy",
    contactLink: "Contact"
  },
  ru: {
    allRightsReserved: "Все права защищены.",
    madeWith: "Создано с",
    location: "в Латвии",
    cookieSettings: "Настройки файлов cookie",
    privacyPolicy: "Политика конфиденциальности",
    contactLink: "Контакты"
  }
};
