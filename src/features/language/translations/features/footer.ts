
import { Language } from '../../types';

export type FooterTranslations = {
  allRightsReserved: string;
  madeWith: string;
  location: string;
  cookieSettings: string;
  privacyPolicy: string;
};

export const footerTranslations: Record<string, FooterTranslations> = {
  lv: {
    allRightsReserved: "© 2025 netieku.es",
    madeWith: "Radīts ar",
    location: "Latvijā",
    cookieSettings: "Sīkdatņu iestatījumi",
    privacyPolicy: "Privātuma politika"
  },
  en: {
    allRightsReserved: "All rights reserved.",
    madeWith: "Made with",
    location: "in Latvia",
    cookieSettings: "Cookie Settings",
    privacyPolicy: "Privacy Policy"
  },
  ru: {
    allRightsReserved: "Все права защищены.",
    madeWith: "Создано с",
    location: "в Латвии",
    cookieSettings: "Настройки файлов cookie",
    privacyPolicy: "Политика конфиденциальности"
  }
};
