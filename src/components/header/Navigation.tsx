
import { Link } from "react-router-dom";
import { Mail } from "lucide-react";
import { useLanguage } from "@/features/language";
import { useAuth } from "@/contexts/AuthContext";
import { getLoginTranslations } from "@/components/auth/translations";
import { AuthHoverCard } from "@/components/auth/hover-card/AuthHoverCard";
import { UserHoverCard } from "@/components/auth/user-menu/UserHoverCard";

const navigationTranslations = {
  lv: {
    contact: "Kontakti",
    myAccount: "Mans konts",
    myTickets: "Manas biļetes",
    myPayments: "Mani maksājumi",
    logout: "Iziet",
    darkMode: "Tumšais režīms",
    lightMode: "Gaišais režīms"
  },
  en: {
    contact: "Contact",
    myAccount: "My Account",
    myTickets: "My Tickets",
    myPayments: "My Payments",
    logout: "Logout",
    darkMode: "Dark Mode",
    lightMode: "Light Mode"
  },
  ru: {
    contact: "Контакты",
    myAccount: "Мой аккаунт",
    myTickets: "Мои билеты",
    myPayments: "Мои платежи",
    logout: "Выйти",
    darkMode: "Темный режим",
    lightMode: "Светлый режим"
  }
};

export function Navigation() {
  const { currentLanguage } = useLanguage();
  const { isAuthenticated, user, logout } = useAuth();
  const translations = getLoginTranslations(currentLanguage.code);
  
  const navTranslations = navigationTranslations[currentLanguage.code as keyof typeof navigationTranslations] || navigationTranslations.en;
  
  const handleLinkClick = () => {
    window.scrollTo(0, 0);
  };
  
  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    }
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
            {navTranslations.contact}
          </Link>
        </li>
        <li>
          {isAuthenticated && user ? (
            <UserHoverCard 
              user={user}
              translations={navTranslations}
              onLogout={handleLogout}
              onLinkClick={handleLinkClick}
            />
          ) : (
            <AuthHoverCard 
              translations={translations}
              currentLanguage={currentLanguage}
            />
          )}
        </li>
      </ul>
    </nav>
  );
}
