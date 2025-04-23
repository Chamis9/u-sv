
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { getLoginTranslations } from "@/components/auth/translations";
import { useLanguage } from "@/features/language";
import { AuthHoverCard } from "@/components/auth/hover-card/AuthHoverCard";
import { UserHoverCard } from "@/components/auth/user-menu/UserHoverCard";

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
