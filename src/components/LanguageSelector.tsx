import { useState, useContext, createContext, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Language = {
  code: string;
  name: string;
  flag: string;
};

const languages: Language[] = [
  { code: "lv", name: "Latviešu", flag: "🇱🇻" },
];

// Create the language context
interface LanguageContextType {
  currentLanguage: Language;
  setLanguage: (language: Language) => void;
}

const LanguageContext = createContext<LanguageContextType>({
  currentLanguage: languages[0],
  setLanguage: () => {},
});

// Create the provider component
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [currentLanguage, setCurrentLanguage] = useState(languages[0]);

  const setLanguage = (language: Language) => {
    setCurrentLanguage(language);
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

// Hook to use the language context
export function useLanguage() {
  return useContext(LanguageContext);
}

export function LanguageSelector() {
  const { currentLanguage } = useLanguage();

  return (
    <div className="language-selector">
      <Button
        variant="outline"
        className="rounded text-xl bg-transparent border-none hover:bg-transparent"
        aria-label="Select language"
      >
        {currentLanguage.flag}
      </Button>
    </div>
  );
}
