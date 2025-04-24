
import { 
  HeroTranslations,
  HowItWorksTranslations,
  FooterTranslations,
  CookieConsentTranslations,
  AdminTranslations,
  NavigationTranslations,
  ThemeTranslations,
  LanguageSelectorTranslations,
  EventsTranslations
} from './translations/features';

export interface TranslationObject {
  [key: string]: string | TranslationObject | undefined;
}

export interface Language {
  code: string;
  name: string;
  flag: string;
}

export interface Translations {
  hero?: HeroTranslations;
  howItWorks?: HowItWorksTranslations;
  footer?: FooterTranslations;
  cookieConsent?: CookieConsentTranslations;
  admin?: AdminTranslations;
  navigation?: NavigationTranslations;
  theme?: ThemeTranslations;
  language?: LanguageSelectorTranslations;
  events?: EventsTranslations;
  aboutUs?: { title: string; }; // Added this property
}

export type { 
  HeroTranslations,
  HowItWorksTranslations,
  FooterTranslations,
  CookieConsentTranslations,
  AdminTranslations,
  NavigationTranslations,
  ThemeTranslations,
  LanguageSelectorTranslations,
  EventsTranslations
};
