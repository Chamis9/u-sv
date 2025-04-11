
import { Link } from "react-router-dom";
import { Mail } from "lucide-react";
import { useLanguage } from "@/features/language";

export function Navigation() {
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
    <nav className="relative z-10">
      <ul className="flex space-x-6 items-center">
        <li>
          <Link 
            to="/contact" 
            className="text-white hover:text-orange-400 transition-colors flex items-center gap-1.5 relative z-10"
          >
            <Mail size={16} />
            {t.contact}
          </Link>
        </li>
      </ul>
    </nav>
  );
}
