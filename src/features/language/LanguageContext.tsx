
import { useState, useContext, createContext, ReactNode } from "react";
import { Language, Translations } from './types';
import translationsData, { languages } from './translations';

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
