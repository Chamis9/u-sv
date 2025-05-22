
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
  },
  et: {
    title: "Kuidas see toimib",
    subtitle: "Müü või osta pileteid turvaliselt ja mugavalt",
    steps: [
      {
        title: "Registreeri ja verifitseeri",
        description: "Loo konto ja verifitseeri oma identiteet"
      },
      {
        title: "Lisa pilet",
        description: "Lisa oma üritus platvormile kiiresti ja lihtsalt"
      },
      {
        title: "Turvaline vahetus",
        description: "Lihtne ja turvaline vahetusprotsess"
      },
      {
        title: "Külasta üritust",
        description: "Ürituse külastus ja emotsioonid on garanteeritud"
      }
    ]
  },
  lt: {
    title: "Kaip tai veikia",
    subtitle: "Parduokite arba pirkite bilietus saugiai ir patogiai",
    steps: [
      {
        title: "Užsiregistruokite ir patvirtinkite",
        description: "Sukurkite paskyrą ir patvirtinkite savo tapatybę"
      },
      {
        title: "Įkelkite bilietą",
        description: "Greitai ir lengvai įkelkite renginio bilietą į platformą"
      },
      {
        title: "Saugus keitimasis",
        description: "Paprastas ir saugus keitimosi procesas"
      },
      {
        title: "Apsilankykite renginyje",
        description: "Renginio lankymas ir emocijos garantuojamos"
      }
    ]
  }
};
