
import { Link } from "react-router-dom";
import { Mail } from "lucide-react";
import { useLanguage } from "@/features/language";
import { useAuth } from "@/contexts/AuthContext";

export function Navigation() {
  const { currentLanguage } = useLanguage();
  const { isAuthenticated } = useAuth();
  
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

  const handleLinkClick = () => {
    window.scrollTo(0, 0);
  };

  return (
    <nav className="relative z-10">
      <ul className="flex space-x-4 md:space-x-6 items-center">
        <li>
          <Link 
            to="/contact" 
            onClick={handleLinkClick}
            className="text-white hover:text-orange-400 transition-colors flex items-center gap-1.5 relative z-10 text-sm md:text-base"
          >
            <Mail size={16} />
            {t.contact}
          </Link>
        </li>
      </ul>
    </nav>
  );
}
