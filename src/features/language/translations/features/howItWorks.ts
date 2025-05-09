
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
    title: "Kā tas darbojas",
    subtitle: "Pārdod vai iegādājies biļeti droši un ērti",
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
    subtitle: "Sell or buy tickets safely and conveniently",
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
  }
};
