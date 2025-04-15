
import { Link } from "react-router-dom";
import { Mail, UserCircle } from "lucide-react";
import { useLanguage } from "@/features/language";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

export function Navigation() {
  const { currentLanguage } = useLanguage();
  const { isAuthenticated, userEmail } = useAuth();
  
  const translations = {
    lv: {
      contact: "Kontakti",
      login: "Pieslēgties",
      profile: userEmail || "Profils"
    },
    en: {
      contact: "Contact",
      login: "Login",
      profile: userEmail || "Profile"
    },
    ru: {
      contact: "Контакты",
      login: "Войти",
      profile: userEmail || "Профиль"
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
        <li>
          {isAuthenticated ? (
            <Link
              to="/profile"
              className="text-white hover:text-orange-400 transition-colors flex items-center gap-1.5 relative z-10 text-sm md:text-base"
            >
              <UserCircle size={16} />
              {t.profile}
            </Link>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="text-white hover:text-orange-400"
            >
              <Link to="/admin">
                <UserCircle className="h-5 w-5" />
                {t.login}
              </Link>
            </Button>
          )}
        </li>
      </ul>
    </nav>
  );
}
