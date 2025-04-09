
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
    <div className="relative language-selector">
      <Button
        variant="outline"
        size="icon"
        className="rounded-full w-10 h-10 flex items-center justify-center bg-white/20 backdrop-blur-sm border-white/10 hover:bg-white/30"
        aria-label="Select language"
      >
        <span className="text-xl">{currentLanguage.flag}</span>
      </Button>
    </div>
  );
}
