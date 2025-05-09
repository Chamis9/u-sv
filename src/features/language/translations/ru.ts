
import { Translations } from '../types';
import { 
  heroTranslations, 
  howItWorksTranslations, 
  footerTranslations, 
  cookieConsentTranslations,
  adminTranslations,
  navigationTranslations,
  themeTranslations,
  languageSelectorTranslations,
  eventsTranslations,
  aboutUsTranslations
} from './features';

// Create a Russian version of aboutUsTranslations since it doesn't exist
const ruAboutUsTranslations = {
  title: "О нас",
  content: [
    "netieku.es - это платформа, где пользователи могут безопасно продавать и покупать билеты у других пользователей.",
    "Наша платформа позволяет пользователям продавать и покупать билеты у других пользователей. Для обеспечения безопасности только проверенные пользователи могут совершать транзакции на нашей платформе.",
    "Мы основываемся на трех основных ценностях: честность, безопасность и удовлетворенность клиентов. Мы гарантируем 100% безопасные транзакции."
  ]
};

export const ruTranslations: Translations = {
  hero: heroTranslations.ru,
  howItWorks: howItWorksTranslations.ru,
  cookieConsent: cookieConsentTranslations.ru,
  footer: footerTranslations.ru,
  admin: adminTranslations.ru,
  navigation: navigationTranslations.ru,
  theme: themeTranslations.ru,
  language: languageSelectorTranslations.ru,
  events: eventsTranslations.ru,
  aboutUs: ruAboutUsTranslations // Using our custom Russian translations
};
