import { useState, useContext, createContext, ReactNode } from "react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

type Language = {
  code: string;
  name: string;
  flag: string;
};

const languages: Language[] = [
  { code: "lv", name: "Latviešu", flag: "🇱🇻" },
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "ru", name: "Русский", flag: "🇷🇺" },
];

// Create translations for all content
export type Translations = {
  hero: {
    title: string;
    titleHighlight: string;
    subtitle: string;
    c2cExplanation: string;
    comingSoon: string;
    subscribeText: string;
    learnMoreBtn: string;
  };
  howItWorks: {
    title: string;
    subtitle: string;
    steps: {
      title: string;
      description: string;
    }[];
  };
  footer: {
    allRightsReserved: string;
    madeWith: string;
    c2cExplanation: string;
  };
};

// Define all translations
const translationsData: Record<string, Translations> = {
  lv: {
    hero: {
      title: "Pārdodiet un pērciet biļetes",
      titleHighlight: "vienkārši un droši",
      subtitle: "Pirmā C2C* platforma biļešu apmaiņai Latvijā",
      c2cExplanation: "* C2C (Consumer-to-Consumer) ir tirdzniecības modelis, kur privātpersonas pārdod preces vai pakalpojumus citām privātpersonām.",
      comingSoon: "Drīzumā",
      subscribeText: "Piesakieties, lai uzzinātu par platformas atklāšanu",
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
          description: "Izmantojiet platformas drošās saziņas iespējas"
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
      madeWith: "Veidots ar Latvijā",
      c2cExplanation: "",
    }
  },
  en: {
    hero: {
      title: "Buy and sell tickets",
      titleHighlight: "simply and securely",
      subtitle: "The first C2C* platform for ticket exchange in Latvia",
      c2cExplanation: "* C2C (Consumer-to-Consumer) is a trading model where individuals sell products or services to other individuals.",
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
          description: "Use the platform's secure communication features"
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
      madeWith: "Made with in Latvia",
      c2cExplanation: "",
    }
  },
  ru: {
    hero: {
      title: "Продавайте и покупайте билеты",
      titleHighlight: "просто и безопасно",
      subtitle: "Первая C2C* платформа для обмена билетами в Латвии",
      c2cExplanation: "* C2C (Consumer-to-Consumer) — это модель торговли, при которой частные лица продают товары или услуги другим частным лицам.",
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
          description: "Используйте безопасные возможности связи платформы"
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
      madeWith: "Создано с Латвии",
      c2cExplanation: "",
    }
  }
};

interface LanguageContextType {
  currentLanguage: Language;
  setLanguage: (language: Language) => void;
  translations: Translations;
}

const LanguageContext = createContext<LanguageContextType>({
  currentLanguage: languages[0],
  setLanguage: () => {},
  translations: translationsData.lv,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [currentLanguage, setCurrentLanguage] = useState(languages[0]);

  const setLanguage = (language: Language) => {
    setCurrentLanguage(language);
  };

  return (
    <LanguageContext.Provider 
      value={{ 
        currentLanguage, 
        setLanguage, 
        translations: translationsData[currentLanguage.code] 
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}

export function LanguageSelector() {
  const { currentLanguage, setLanguage } = useLanguage();

  return (
    <div className="language-selector">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            className="rounded-full bg-white/10 backdrop-blur-sm text-white border-white/20 hover:bg-white/20"
          >
            {currentLanguage.flag} <span className="ml-1">{currentLanguage.name}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-white/90 backdrop-blur-sm border-white/20">
          {languages.map((language) => (
            <DropdownMenuItem
              key={language.code}
              onClick={() => setLanguage(language)}
              className="cursor-pointer hover:bg-orange-100"
            >
              <span className="mr-2">{language.flag}</span>
              {language.name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
