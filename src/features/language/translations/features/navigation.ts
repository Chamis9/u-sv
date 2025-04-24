export interface NavigationTranslations {
  home: string;
  events: string;
  tickets: string;
  contact: string;
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
    events: "Pasākumi",
    tickets: "Biļetes",
    contact: "Kontakti"
  },
  en: {
    home: "Home",
    events: "Events",
    tickets: "Tickets",
    contact: "Contact"
  },
  ru: {
    home: "Главная",
    events: "События",
    tickets: "Билеты",
    contact: "Контакты"
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
  },
  ru: {
    label: "Тема",
    light: "Светлая",
    dark: "Тёмная",
    system: "Системная"
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
  },
  ru: {
    label: "Язык",
    selector: "Выберите язык"
  }
};
