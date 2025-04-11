
import { Link } from "react-router-dom";
import { Mail } from "lucide-react";
import { useLanguage } from "@/features/language";
import { useIsMobile } from "@/hooks/use-mobile";

export function Navigation() {
  const { currentLanguage } = useLanguage();
  const isMobile = useIsMobile();
  
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
      <ul className={isMobile ? "flex items-center justify-center" : "flex items-center md:space-x-6"}>
        <li>
          <Link 
            to="/contact" 
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
