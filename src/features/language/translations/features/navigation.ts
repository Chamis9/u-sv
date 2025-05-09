
export interface NavigationTranslations {
  home: string;
  events: string;
  tickets: string;
  contact: string;
  aboutUs: string;
}

export interface ThemeTranslations {
  label: string;
  light: string;
  dark: string;
  system: string;
}

export interface LanguageSelectorTranslations {
  label: string;
  selector: string;
}

export const navigationTranslations = {
  lv: {
    home: "Sākumlapa",
    events: "Biļetes",
    tickets: "Biļetes",
    contact: "Kontakti",
    aboutUs: "Par mums"
  },
  en: {
    home: "Home",
    events: "Tickets",
    tickets: "Tickets",
    contact: "Contact",
    aboutUs: "About Us"
  }
};

export const themeTranslations = {
  lv: {
    label: "Motīvs",
    light: "Gaišs",
    dark: "Tumšs",
    system: "Sistēmas"
  },
  en: {
    label: "Theme",
    light: "Light",
    dark: "Dark",
    system: "System"
  }
};

export const languageSelectorTranslations = {
  lv: {
    label: "Valoda",
    selector: "Izvēlieties valodu"
  },
  en: {
    label: "Language",
    selector: "Select language"
  }
};
