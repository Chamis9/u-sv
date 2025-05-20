
export type NavigationTranslations = {
  home: string;
  events: string;
  tickets: string;
  about: string;
  contact: string;
  docs: string;
  profile: string;
  admin: string;
  login: string;
  logout: string;
  register: string;
  account: string;
  payments: string;
  settings: string;
  users: string;
  subscribers: string;
  events_admin: string;
  categories: string;
  activity: string;
  system: string;
};

export type ThemeTranslations = {
  light: string;
  dark: string;
  system: string;
};

export type LanguageSelectorTranslations = {
  selectLanguage: string;
  label: string;  // Added this property
};

export const navigationTranslations = {
  lv: {
    home: "Sākums",
    events: "Pasākumi",
    tickets: "Biļetes",
    about: "Par mums",
    contact: "Kontakti",
    docs: "Dokumentācija",
    profile: "Profils",
    admin: "Admin Panelis",
    login: "Ielogoties",
    logout: "Izlogoties",
    register: "Reģistrēties",
    account: "Konts",
    payments: "Maksājumi",
    settings: "Iestatījumi",
    users: "Lietotāji",
    subscribers: "Abonenti",
    events_admin: "Pasākumi",
    categories: "Kategorijas",
    activity: "Aktivitāte",
    system: "Sistēma",
  },
  en: {
    home: "Home",
    events: "Events",
    tickets: "Tickets",
    about: "About Us",
    contact: "Contact",
    docs: "Documentation",
    profile: "Profile",
    admin: "Admin Panel",
    login: "Login",
    logout: "Logout",
    register: "Register",
    account: "Account",
    payments: "Payments",
    settings: "Settings",
    users: "Users",
    subscribers: "Subscribers",
    events_admin: "Events",
    categories: "Categories",
    activity: "Activity",
    system: "System",
  },
};

export const themeTranslations = {
  lv: {
    light: "Gaišs",
    dark: "Tumšs",
    system: "Sistēmas"
  },
  en: {
    light: "Light",
    dark: "Dark",
    system: "System"
  }
};

export const languageSelectorTranslations = {
  lv: {
    selectLanguage: "Izvēlieties valodu",
    label: "Valoda"
  },
  en: {
    selectLanguage: "Select language",
    label: "Language"
  }
};
