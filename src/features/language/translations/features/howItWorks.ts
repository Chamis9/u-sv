
import { Language } from '../../types';

export type HowItWorksTranslations = {
  title: string;
  subtitle: string;
  steps: {
    title: string;
    description: string;
  }[];
};

export const howItWorksTranslations: Record<string, HowItWorksTranslations> = {
  lv: {
    title: "Kā tas strādā",
    subtitle: "Vienkāršs un drošs veids, kā pārdot vai iegādāties biļeti uz pasākumiem",
    steps: [
      {
        title: "Reģistrējies un verificē sevi",
        description: "Izveido kontu un verificē savu identitāti"
      },
      {
        title: "Ievieto biļeti",
        description: "Ievietojiet pasākuma biļeti platformā ātri un vienkārši"
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
  en: {
    title: "How it works",
    subtitle: "A simple and secure way to sell or purchase event tickets",
    steps: [
      {
        title: "Register and verify",
        description: "Create an account and verify your identity"
      },
      {
        title: "List your ticket",
        description: "List your event ticket on the platform quickly and easily"
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
  ru: {
    title: "Как это работает",
    subtitle: "Простой и безопасный способ продать или купить билеты на мероприятия",
    steps: [
      {
        title: "Зарегистрируйся и верифицируй себя",
        description: "Создайте аккаунт и подтвердите свою личность"
      },
      {
        title: "Разместите билет",
        description: "Разместите билет на мероприятие на платформе быстро и легко"
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
  }
};
