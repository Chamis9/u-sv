
import { Translations } from './types';

// Define all translations
const translationsData: Record<string, Translations> = {
  lv: {
    hero: {
      title: "Pārdodiet un pērciet biļetes",
      titleHighlight: "vienkārši un droši",
      subtitle: "Pirmā platforma biļešu apmaiņai Latvijā",
      c2cExplanation: "",
      comingSoon: "Drīzumā",
      subscribeText: "Piesakies, lai jau laicīgi uzzinātu par platformas atklāšanu!",
      learnMoreBtn: "Uzzināt vairāk",
    },
    howItWorks: {
      title: "Kā tas strādā",
      subtitle: "Vienkāršs un drošs veids, kā pārdot vai iegādāties biļetes uz pasākumiem",
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
    footer: {
      allRightsReserved: "Visas tiesības aizsargātas.",
      madeWith: "Radīts ar",
      location: "Latvijā",
      c2cExplanation: "",
    }
  },
  en: {
    hero: {
      title: "Buy and sell tickets",
      titleHighlight: "simply and securely",
      subtitle: "The first platform for ticket exchange in Latvia",
      c2cExplanation: "",
      comingSoon: "Coming soon",
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
    footer: {
      allRightsReserved: "All rights reserved.",
      madeWith: "Made with",
      location: "in Latvia",
      c2cExplanation: "",
    }
  },
  ru: {
    hero: {
      title: "Продавайте и покупайте билеты",
      titleHighlight: "просто и безопасно",
      subtitle: "Первая платформа для обмена билетами в Латвии",
      c2cExplanation: "",
      comingSoon: "Скоро",
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
    footer: {
      allRightsReserved: "Все права защищены.",
      madeWith: "Создано с",
      location: "Латвии",
      c2cExplanation: "",
    }
  }
};

export const languages = [
  { code: "lv", name: "Latviešu", flag: "🇱🇻" },
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "ru", name: "Русский", flag: "🇷🇺" },
];

export default translationsData;
