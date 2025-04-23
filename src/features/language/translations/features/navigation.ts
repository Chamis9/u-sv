
export type NavigationTranslations = {
  contact: string;
  login: string;
  register: string;
  profile: string;
  logout: string;
};

export const navigationTranslations: Record<string, NavigationTranslations> = {
  lv: {
    contact: "Kontakti",
    login: "Pieslēgties",
    register: "Reģistrēties",
    profile: "Profils",
    logout: "Iziet"
  },
  en: {
    contact: "Contact",
    login: "Login",
    register: "Register",
    profile: "Profile",
    logout: "Logout"
  },
  ru: {
    contact: "Контакты",
    login: "Войти",
    register: "Регистрация",
    profile: "Профиль",
    logout: "Выйти"
  }
};
