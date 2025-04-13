
import { Link } from "react-router-dom";
import { Mail, User } from "lucide-react";
import { useLanguage } from "@/features/language";
import { useAuth } from "@/contexts/AuthContext";

export function Navigation() {
  const { currentLanguage } = useLanguage();
  const { isAuthenticated } = useAuth();
  
  const translations = {
    lv: {
      contact: "Kontakti",
      profile: "Mans profils"
    },
    en: {
      contact: "Contact",
      profile: "My Profile"
    },
    ru: {
      contact: "Контакты",
      profile: "Мой профиль"
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
        
        {isAuthenticated && (
          <li>
            <Link 
              to="/profile" 
              onClick={handleLinkClick}
              className="text-white hover:text-orange-400 transition-colors flex items-center gap-1.5 relative z-10 text-sm md:text-base"
            >
              <User size={16} />
              {t.profile}
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
}
