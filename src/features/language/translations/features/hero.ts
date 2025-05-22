
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
  et: {
    title: "Müü ja osta pileteid",
    titleHighlight: "lihtsalt ja turvaliselt",
    subtitle: "Esimene piletite vahetusplatvorm Baltikumis",
    subscribeText: "Liitu, et saada teada platvormi käivitamisest",
    learnMoreBtn: "Loe lähemalt",
  },
  lt: {
    title: "Parduokite ir pirkite bilietus",
    titleHighlight: "paprastai ir saugiai",
    subtitle: "Pirmoji bilietų mainų platforma Baltijos šalyse",
    subscribeText: "Užsiregistruokite, kad sužinotumėte apie platformos paleidimą",
    learnMoreBtn: "Sužinoti daugiau",
  }
};
