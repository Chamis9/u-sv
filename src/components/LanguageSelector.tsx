
import { useState, useEffect, useContext, createContext } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Language = {
  code: string;
  name: string;
  flag: string;
};

const languages: Language[] = [
  { code: "lv", name: "Latviešu", flag: "🇱🇻" },
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "ru", name: "Русский", flag: "🇷🇺" },
  { code: "ee", name: "Eesti", flag: "🇪🇪" },
  { code: "lt", name: "Lietuvių", flag: "🇱🇹" },
];

// Create a context for language state
export const LanguageContext = createContext<{
  currentLanguage: Language;
  setLanguage: (language: Language) => void;
}>({
  currentLanguage: languages[0],
  setLanguage: () => {},
});

// Provider component
export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [currentLanguage, setCurrentLanguage] = useState(languages[0]);

  const setLanguage = (language: Language) => {
    setCurrentLanguage(language);
    console.log(`Language changed to ${language.name}`);
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function LanguageSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const { currentLanguage, setLanguage } = useContext(LanguageContext);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".language-selector")) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLanguageChange = (language: Language) => {
    setLanguage(language);
    setIsOpen(false);
  };

  return (
    <div className="relative language-selector">
      <Button
        variant="outline"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="rounded-full w-10 h-10 flex items-center justify-center bg-white/20 backdrop-blur-sm border-white/10 hover:bg-white/30"
        aria-label="Select language"
      >
        <span className="text-xl">{currentLanguage.flag}</span>
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="p-2">
            {languages.map((language) => (
              <button
                key={language.code}
                onClick={() => handleLanguageChange(language)}
                className={cn(
                  "flex items-center w-full px-3 py-2 text-sm rounded-md hover:bg-gray-100 transition-colors",
                  currentLanguage.code === language.code && "bg-orange-100 text-orange-600"
                )}
              >
                <span className="mr-2 text-lg">{language.flag}</span>
                <span>{language.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
