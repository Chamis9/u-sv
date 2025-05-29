
import { useState, useContext, createContext, ReactNode, useEffect } from "react";
import { Language, Translations } from './types';
import translationsData, { languages } from './translations';
import { useLocation, useNavigate } from "react-router-dom";

interface LanguageContextType {
  currentLanguage: Language;
  setLanguage: (language: Language) => void;
  translations: Translations;
}

const LanguageContext = createContext<LanguageContextType>({
  currentLanguage: languages[1], // Default to English (index 1)
  setLanguage: () => {},
  translations: translationsData.en,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();

  // Get language from URL path or use English as default
  const getLanguageFromPath = (): Language => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const langCode = pathSegments[0];
    
    // Check if the first segment is a language code
    const langObject = languages.find(lang => lang.code === langCode);
    if (langObject) {
      return langObject;
    }
    
    // Check localStorage for saved preference
    const savedLanguageCode = localStorage.getItem('language');
    if (savedLanguageCode) {
      const found = languages.find(lang => lang.code === savedLanguageCode);
      if (found) return found;
    }
    
    // Default to English
    return languages.find(lang => lang.code === 'en') || languages[1];
  };

  const [currentLanguage, setCurrentLanguage] = useState<Language>(getLanguageFromPath());

  const setLanguage = (language: Language) => {
    setCurrentLanguage(language);
    localStorage.setItem('language', language.code);
    
    // Update URL to include language code
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const isLanguageInPath = languages.some(lang => lang.code === pathSegments[0]);
    
    let newPath;
    if (isLanguageInPath) {
      // Replace existing language code
      pathSegments[0] = language.code;
      newPath = '/' + pathSegments.join('/');
    } else {
      // Add language code to beginning
      newPath = '/' + language.code + location.pathname;
    }
    
    // Remove duplicate slashes
    newPath = newPath.replace(/\/+/g, '/');
    
    navigate(newPath + location.search);
  };

  // Update language when URL changes
  useEffect(() => {
    const newLanguage = getLanguageFromPath();
    if (newLanguage.code !== currentLanguage.code) {
      setCurrentLanguage(newLanguage);
      localStorage.setItem('language', newLanguage.code);
    }
  }, [location.pathname]);

  // Redirect to language-prefixed URL on initial load
  useEffect(() => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const isLanguageInPath = languages.some(lang => lang.code === pathSegments[0]);
    
    if (!isLanguageInPath && location.pathname !== '/') {
      // Add current language to URL
      const newPath = '/' + currentLanguage.code + location.pathname;
      navigate(newPath.replace(/\/+/g, '/') + location.search, { replace: true });
    } else if (!isLanguageInPath && location.pathname === '/') {
      // For root path, redirect to /en
      navigate('/en', { replace: true });
    }
  }, []);

  // Make sure language state is synchronized on all pages
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'language' && e.newValue) {
        const langObject = languages.find(lang => lang.code === e.newValue);
        if (langObject && langObject.code !== currentLanguage.code) {
          setCurrentLanguage(langObject);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [currentLanguage]);

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
