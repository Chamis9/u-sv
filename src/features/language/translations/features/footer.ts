
import { Language } from '../../types';

export type FooterTranslations = {
  allRightsReserved: string;
  madeWith: string;
  location: string;
  cookieSettings: string;
  privacyPolicy: string;
  contactLink: string;
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
    allRightsReserved: "© 2025 netieku.es",
    madeWith: "Made with",
    location: "in Latvia",
    cookieSettings: "Cookie Settings",
    privacyPolicy: "Privacy Policy",
    contactLink: "Contact"
  },
  et: {
    allRightsReserved: "© 2025 netieku.es",
    madeWith: "Tehtud",
    location: "Lätis",
    cookieSettings: "Küpsiste seaded",
    privacyPolicy: "Privaatsuspoliitika",
    contactLink: "Kontakt"
  },
  lt: {
    allRightsReserved: "© 2025 netieku.es",
    madeWith: "Sukurta su",
    location: "Latvijoje",
    cookieSettings: "Slapukų nustatymai",
    privacyPolicy: "Privatumo politika",
    contactLink: "Kontaktai"
  }
};
