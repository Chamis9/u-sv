
import { Translations } from '../types';
import { 
  heroTranslations, 
  howItWorksTranslations, 
  footerTranslations, 
  cookieConsentTranslations,
  adminTranslations,
  navigationTranslations,
  themeTranslations,
  languageSelectorTranslations
} from './features';

export const enTranslations: Translations = {
  hero: heroTranslations.en,
  howItWorks: howItWorksTranslations.en,
  cookieConsent: cookieConsentTranslations.en,
  footer: footerTranslations.en,
  admin: adminTranslations.en,
  // Add the new translations
  navigation: navigationTranslations.en,
  theme: themeTranslations.en,
  language: languageSelectorTranslations.en
};
