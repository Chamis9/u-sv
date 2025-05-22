
import { Language } from '../../types';

export type HeroTranslations = {
  title: string;
  titleHighlight: string;
  subtitle: string;
  subscribeText: string;
  learnMoreBtn: string;
};

export const heroTranslations: Record<string, HeroTranslations> = {
  lv: {
    title: "Pārdodiet un pērciet biļetes",
    titleHighlight: "vienkārši un droši",
    subtitle: "Pirmā platforma biļešu apmaiņai Baltijā",
    subscribeText: "Piesakies, lai jau laicīgi uzzinātu par platformas atklāšanu!",
    learnMoreBtn: "Uzzināt vairāk",
  },
  en: {
    title: "Buy and sell tickets",
    titleHighlight: "simply and securely",
    subtitle: "The first platform for ticket exchange in the Baltics",
    subscribeText: "Subscribe to learn about platform launch",
    learnMoreBtn: "Learn more",
  },
  ru: {
    title: "Покупайте и продавайте билеты",
    titleHighlight: "просто и безопасно",
    subtitle: "Первая платформа для обмена билетами в странах Балтии",
    subscribeText: "Подпишитесь, чтобы узнать о запуске платформы",
    learnMoreBtn: "Узнать больше",
  }
};
