
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
    unknown?: string;
    loading?: string;
    noData?: string;
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
    },
    subscribers: {
      title: "Abonenti",
      subtitle: "Pārvaldiet e-pasta jaunumu abonentus",
      edit: "Rediģēt",
      save: "Saglabāt",
      cancel: "Atcelt",
      delete: "Dzēst",
      email: "E-pasts",
      search: "Meklēt abonentu",
      actions: "Darbības",
      noSubscribers: "Nav abonentu",
      updateSuccess: "Abonents veiksmīgi atjaunināts",
      updateError: "Neizdevās atjaunināt abonentu",
      deleteSuccess: "Abonents veiksmīgi dzēsts",
      deleteError: "Neizdevās dzēst abonentu",
      exportCsv: "Eksportēt CSV",
      sendMessage: "Sūtīt ziņojumu",
      unknown: "Nezināms",
      loading: "Ielādē...",
      noData: "Nav abonentu"
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
    },
    subscribers: {
      title: "Subscribers",
      subtitle: "Manage newsletter subscribers",
      edit: "Edit",
      save: "Save",
      cancel: "Cancel",
      delete: "Delete",
      email: "Email",
      search: "Search subscriber",
      actions: "Actions",
      noSubscribers: "No subscribers",
      updateSuccess: "Subscriber successfully updated",
      updateError: "Failed to update subscriber",
      deleteSuccess: "Subscriber successfully deleted",
      deleteError: "Failed to delete subscriber",
      exportCsv: "Export CSV",
      sendMessage: "Send Message",
      unknown: "Unknown",
      loading: "Loading...",
      noData: "No subscribers"
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
    },
    subscribers: {
      title: "Подписчики",
      subtitle: "Управление подписчиками на новостную рассылку",
      edit: "Редактировать",
      save: "Сохранить",
      cancel: "Отменить",
      delete: "Удалить",
      email: "Эл. почта",
      search: "Поиск подписчика",
      actions: "Действия",
      noSubscribers: "Нет подписчиков",
      updateSuccess: "Подписчик успешно обновлен",
      updateError: "Не удалось обновить подписчика",
      deleteSuccess: "Подписчик успешно удален",
      deleteError: "Не удалось удалить подписчика",
      exportCsv: "Экспорт CSV",
      sendMessage: "Отправить сообщение",
      unknown: "Неизвестно",
      loading: "Загрузка...",
      noData: "Нет подписчиков"
    }
  }
};
