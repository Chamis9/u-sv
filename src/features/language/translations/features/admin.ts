
import { Language } from '../../types';

export type AdminTranslations = {
  title?: string;
  defaultUser?: string;
  logout?: string;
  returnToHome?: string;
  logoutSuccess?: string;
  logoutError?: string;
  tabs?: {
    dashboard?: string;
    users?: string;
    subscribers?: string;
    settings?: string;
  };
  auth?: {
    supabaseAuthAvailable?: string;
  };
  settings?: {
    security?: {
      title?: string;
      description?: string;
      comingSoon?: string;
    };
    integrations?: {
      title?: string;
      description?: string;
      comingSoon?: string;
    };
  };
  subscribers?: {
    title?: string;
    subtitle?: string;
    edit?: string;
    save?: string;
    cancel?: string;
    delete?: string;
    email?: string;
    search?: string;
    actions?: string;
    noSubscribers?: string;
    updateSuccess?: string;
    updateError?: string;
    deleteSuccess?: string;
    deleteError?: string;
    exportCsv?: string;
    sendMessage?: string;
  };
};

export const adminTranslations: Record<string, AdminTranslations> = {
  lv: {
    title: "Administratora panelis",
    defaultUser: "Administrators",
    logout: "Izrakstīties",
    returnToHome: "Atgriezties uz sākumlapu",
    logoutSuccess: "Jūs esat veiksmīgi izrakstījies",
    logoutError: "Kļūda izrakstīšanās laikā",
    tabs: {
      dashboard: "Pārskats",
      users: "Lietotāji",
      subscribers: "Abonenti",
      settings: "Iestatījumi"
    },
    auth: {
      supabaseAuthAvailable: "Supabase autentifikācija ir pieejama. Lūdzu, izmantojiet administratora kontu, lai pieslēgtos."
    },
    settings: {
      security: {
        title: "Drošības iestatījumi",
        description: "Pārvaldiet platformas drošības iestatījumus",
        comingSoon: "Drošības iestatījumi tiks pievienoti drīzumā..."
      },
      integrations: {
        title: "Integrācijas",
        description: "Pārvaldiet trešo pušu integrācijas",
        comingSoon: "Integrāciju iestatījumi tiks pievienoti drīzumā..."
      }
    }
  },
  en: {
    title: "Administrator Panel",
    defaultUser: "Administrator",
    logout: "Logout",
    returnToHome: "Return to Home Page",
    logoutSuccess: "You have been successfully logged out",
    logoutError: "Error during logout process",
    tabs: {
      dashboard: "Dashboard",
      users: "Users",
      subscribers: "Subscribers",
      settings: "Settings"
    },
    auth: {
      supabaseAuthAvailable: "Supabase authentication is available. Please use an admin account to log in."
    },
    settings: {
      security: {
        title: "Security Settings",
        description: "Manage platform security settings",
        comingSoon: "Security settings will be added soon..."
      },
      integrations: {
        title: "Integrations",
        description: "Manage third-party integrations",
        comingSoon: "Integration settings will be added soon..."
      }
    }
  },
  ru: {
    title: "Панель администратора",
    defaultUser: "Администратор",
    logout: "Выйти",
    returnToHome: "Вернуться на главную страницу",
    logoutSuccess: "Вы успешно вышли из системы",
    logoutError: "Ошибка при выходе из системы",
    tabs: {
      dashboard: "Панель управления",
      users: "Пользователи",
      subscribers: "Подписчики",
      settings: "Настройки"
    },
    auth: {
      supabaseAuthAvailable: "Аутентификация Supabase доступна. Пожалуйста, используйте учетную запись администратора для входа."
    },
    settings: {
      security: {
        title: "Настройки безопасности",
        description: "Управление настройками безопасности платформы",
        comingSoon: "Настройки безопасности будут добавлены в ближайшее время..."
      },
      integrations: {
        title: "Интеграции",
        description: "Управление интеграциями с третьими сторонами",
        comingSoon: "Настройки интеграции будут добавлены в ближайшее время..."
      }
    }
  }
};
