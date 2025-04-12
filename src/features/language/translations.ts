
import { Translations } from './types';

const translationsData: Record<string, Translations> = {
  lv: {
    hero: {
      title: "Pārdodiet un pērciet biļetes",
      titleHighlight: "vienkārši un droši",
      subtitle: "Pirmā platforma biļešu apmaiņai Latvijā",
      subscribeText: "Piesakies, lai jau laicīgi uzzinātu par platformas atklāšanu!",
      learnMoreBtn: "Uzzināt vairāk",
    },
    howItWorks: {
      title: "Kā tas strādā",
      subtitle: "Vienkāršs un drošs veids, kā pārdot vai iegādāties biļeti uz pasākumiem",
      steps: [
        {
          title: "Ievieto biļeti",
          description: "Ievietojiet pasākuma biļeti platformā ātri un vienkārši"
        },
        {
          title: "Sazinies ar pircēju",
          description: "Izmantojiet platformas saziņas iespējas"
        },
        {
          title: "Droša apmaiņa",
          description: "Vienkāršs un drošs apmaiņas process"
        },
        {
          title: "Apmeklē pasākumu",
          description: "Pasākuma apmeklējums un emocijas ir garantētas"
        }
      ]
    },
    cookieConsent: {
      message: "Mēs izmantojam sīkdatnes. Turpinot lietot šo mājas lapu, Jūs piekrītat sīkdatņu lietošanas noteikumiem.",
      learnMore: "Uzzināt vairāk",
      accept: "Piekrītu",
      decline: "Atteikties",
      dialogTitle: "Sīkdatņu lietošanas noteikumi",
      dialogDescription: "Informācija par sīkdatnēm un to lietošanu mūsu platformā.",
      whatAreCookies: "Sīkdatnes ir nelieli teksta faili, kas tiek saglabāti jūsu ierīcē, kad apmeklējat mūsu vietni. Tās palīdz mums nodrošināt labāku lietotāja pieredzi.",
      whyWeUseCookies: "Mēs izmantojam sīkdatnes, lai uzlabotu vietnes funkcionalitāti, analizētu lietotāju plūsmu un personalizētu jūsu pieredzi.",
      typesOfCookies: "Mēs izmantojam šādus sīkdatņu veidus:",
      essentialCookiesTitle: "Nepieciešamās sīkdatnes",
      essentialCookiesDescription: "Šīs sīkdatnes ir nepieciešamas vietnes pamatfunkciju darbībai. Tās ļauj jums pārvietoties pa vietni un izmantot tās funkcijas.",
      analyticsCookiesTitle: "Analītiskās sīkdatnes",
      analyticsCookiesDescription: "Šīs sīkdatnes palīdz mums saprast, kā lietotāji mijiedarbojas ar vietni, vācot un ziņojot informāciju anonīmi.",
      privacyPolicy: "Plašāku informāciju par to, kā mēs izmantojam jūsu datus, varat skatīt mūsu privātuma politikā.",
      required: "Obligāti",
      savePreferences: "Saglabāt iestatījumus",
      cookieSettings: "Sīkdatņu iestatījumi",
      marketingCookies: "Mārketinga sīkdatnes",
      marketingCookiesDescription: "Šīs sīkdatnes tiek izmantotas, lai izsekotu lietotājus dažādās vietnēs un parādītu attiecīgas reklāmas, kas ir aktuālas un saistošas konkrētajam lietotājam."
    },
    footer: {
      allRightsReserved: "© 2025 netieku.es",
      madeWith: "Radīts ar",
      location: "Latvijā",
      cookieSettings: "Sīkdatņu iestatījumi",
      privacyPolicy: "Privātuma politika"
    },
    admin: {
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
    }
  },
  en: {
    hero: {
      title: "Buy and sell tickets",
      titleHighlight: "simply and securely",
      subtitle: "The first platform for ticket exchange in Latvia",
      subscribeText: "Subscribe to learn about platform launch",
      learnMoreBtn: "Learn more",
    },
    howItWorks: {
      title: "How it works",
      subtitle: "A simple and secure way to sell or purchase event tickets",
      steps: [
        {
          title: "List your ticket",
          description: "List your event ticket on the platform quickly and easily"
        },
        {
          title: "Connect with buyers",
          description: "Use the platform's communication features"
        },
        {
          title: "Secure exchange",
          description: "Simple and secure exchange process"
        },
        {
          title: "Attend the event",
          description: "Event attendance and emotions are guaranteed"
        }
      ]
    },
    cookieConsent: {
      message: "We use cookies on our website. By continuing to use this site, you agree to our cookie policy.",
      learnMore: "Learn more",
      accept: "Accept",
      decline: "Decline",
      dialogTitle: "Cookie Policy",
      dialogDescription: "Information about cookies and their usage on our platform.",
      whatAreCookies: "Cookies are small text files that are stored on your device when you visit our website. They help us provide you with a better user experience.",
      whyWeUseCookies: "We use cookies to improve site functionality, analyze user traffic, and personalize your experience.",
      typesOfCookies: "We use the following types of cookies:",
      essentialCookiesTitle: "Essential Cookies",
      essentialCookiesDescription: "These cookies are necessary for the basic functions of the website. They allow you to navigate around the site and use its features.",
      analyticsCookiesTitle: "Analytics Cookies",
      analyticsCookiesDescription: "These cookies help us understand how users interact with the website by collecting and reporting information anonymously.",
      privacyPolicy: "For more information about how we use your data, please see our privacy policy.",
      required: "Required",
      savePreferences: "Save preferences",
      cookieSettings: "Cookie Settings",
      marketingCookies: "Marketing cookies",
      marketingCookiesDescription: "These cookies are used to track users across websites and display relevant advertisements that are relevant and engaging to the individual user."
    },
    footer: {
      allRightsReserved: "All rights reserved.",
      madeWith: "Made with",
      location: "in Latvia",
      cookieSettings: "Cookie Settings",
      privacyPolicy: "Privacy Policy"
    },
    admin: {
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
    }
  },
  ru: {
    hero: {
      title: "Продавайте и покупайте билеты",
      titleHighlight: "просто и безопасно",
      subtitle: "Первая платформа для обмена билетами в Латвии",
      subscribeText: "Подпишитесь, чтобы узнать о запуске платформы",
      learnMoreBtn: "Узнать больше",
    },
    howItWorks: {
      title: "Как это работает",
      subtitle: "Простой и безопасный способ продать или купить билеты на мероприятия",
      steps: [
        {
          title: "Разместите билет",
          description: "Разместите билет на мероприятие на платформе быстро и легко"
        },
        {
          title: "Свяжитесь с покупателем",
          description: "Используйте возможности общения платформы"
        },
        {
          title: "Безопасный обмен",
          description: "Простой и безопасный процесс обмена"
        },
        {
          title: "Посетите мероприятие",
          description: "Посещение мероприятия и эмоции гарантированы"
        }
      ]
    },
    cookieConsent: {
      message: "Мы используем файлы cookie. Продолжая использовать этот сайт, вы соглашаетесь с нашей политикой в отношении файлов cookie.",
      learnMore: "Узнать больше",
      accept: "Принять",
      decline: "Отклонить",
      dialogTitle: "Политика использования файлов cookie",
      dialogDescription: "Информация о файлах cookie и их использовании на нашей платформе.",
      whatAreCookies: "Файлы cookie — это небольшие текстовые файлы, которые сохраняются на вашем устройстве при посещении нашего сайта. Они помогают нам обеспечить вам лучший пользовательский опыт.",
      whyWeUseCookies: "Мы используем файлы cookie для улучшения функциональности сайта, анализа пользовательского трафика и персонализации вашего опыта.",
      typesOfCookies: "Мы используем следующие типы файлов cookie:",
      essentialCookiesTitle: "Необходимые файлы cookie",
      essentialCookiesDescription: "Эти файлы cookie необходимы для основных функций сайта. Они позволяют перемещаться по сайту и использовать его функции.",
      analyticsCookiesTitle: "Аналитические файлы cookie",
      analyticsCookiesDescription: "Эти файлы cookie помогают нам понять, как пользователи взаимодействуют с сайтом, собирая и сообщая информацию анонимно.",
      privacyPolicy: "Для получения дополнительной информации о том, как мы используем ваши данные, пожалуйста, ознакомьтесь с нашей политикой конфиденциальности.",
      required: "Обязательно",
      savePreferences: "Сохранить настройки",
      cookieSettings: "Настройки файлов cookie",
      marketingCookies: "Маркетинговые файлы cookie",
      marketingCookiesDescription: "Эти файлы cookie используются для отслеживания пользователей на разных веб-сайтах и отображения соответствующей рекламы, которая актуальна и привлекательна для конкретного пользователя."
    },
    footer: {
      allRightsReserved: "Все права защищены.",
      madeWith: "Создано с",
      location: "в Латвии",
      cookieSettings: "Настройки файлов cookie",
      privacyPolicy: "Политика конфиденциальности"
    },
    admin: {
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
  }
};

export const languages = [
  { code: "lv", name: "Latviešu", flag: "🇱🇻" },
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "ru", name: "Русский", flag: "🇷🇺" },
];

export default translationsData;
