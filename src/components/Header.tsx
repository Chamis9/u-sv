
import { LanguageSelector } from "@/features/language";
import { Logo } from "./header/Logo";
import Navigation from "./header/Navigation";
import MobileMenu from "./header/MobileMenu";
import { UserCircle } from "lucide-react";
import { useLanguage } from "@/features/language";
import { useAuth } from "@/contexts/AuthContext";
import { UserHoverCard } from "./auth/user-menu/UserHoverCard";
import { useNavigate } from "react-router-dom";
import { LoginButton } from "./auth/LoginButton";

export function Header() {
  const { currentLanguage, translations } = useLanguage();
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const t = (lvText: string, enText: string) => {
    if (currentLanguage.code === 'lv') return lvText;
    if (currentLanguage.code === 'et') return enText;
    if (currentLanguage.code === 'lt') return enText;
    return enText;
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };
  
  return (
    <header className="fixed top-0 left-0 right-0 z-50 py-3 md:py-4 px-4 md:px-6 bg-ticket-bg/90 backdrop-blur-sm border-b border-ticket-accent/10">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <MobileMenu />
          <Logo />
        </div>
        
        <Navigation />
        
        <div className="flex items-center gap-2 md:gap-4 text-ticket-text">
          {/* Login/Register ikona ir paslēpta, bet funkcionalitāte saglabāta */}
          <div className="hidden">
            {isAuthenticated && user ? (
              <UserHoverCard 
                user={user}
                onLogout={handleLogout}
                onLinkClick={() => {}}
              />
            ) : (
              <LoginButton 
                variant="ghost" 
                className="text-ticket-text hover:text-ticket-accent transition-colors hover:bg-transparent"
                showIcon={false}
              >
                <UserCircle size={20} className="text-ticket-accent hover:text-ticket-accent" />
              </LoginButton>
            )}
          </div>
          <LanguageSelector />
        </div>
      </div>
    </header>
  );
}
