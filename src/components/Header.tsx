
import { Link } from "react-router-dom";
import { LanguageSelector } from "@/features/language";
import { Home, Phone } from "lucide-react";
import { useLanguage } from "@/features/language";
import { Button } from "@/components/ui/button";

export function Header() {
  const { currentLanguage } = useLanguage();
  
  const translations = {
    lv: {
      contact: "Kontakti"
    },
    en: {
      contact: "Contact"
    },
    ru: {
      contact: "Контакты"
    }
  };

  const t = translations[currentLanguage.code as keyof typeof translations] || translations.en;

  return (
    <header className="absolute top-0 left-0 right-0 z-10 py-4 px-6">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <Link to="/" className="text-2xl font-bold text-white hover:opacity-90 transition-opacity">
            <span className="text-orange-500">netieku</span>.es
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          <nav>
            <ul className="flex space-x-6 items-center">
              <li>
                <Link 
                  to="/contact" 
                  className="text-white hover:text-orange-400 transition-colors flex items-center gap-1.5"
                >
                  <Phone size={16} />
                  {t.contact}
                </Link>
              </li>
            </ul>
          </nav>
          <LanguageSelector />
        </div>
      </div>
    </header>
  );
}
