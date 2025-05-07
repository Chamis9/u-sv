
import { LanguageSelector } from "@/features/language";
import { Logo } from "./header/Logo";
import { Navigation, getNavigationLinks } from "./header/Navigation";
import { ThemeToggle } from "./theme/ThemeToggle";
import { MobileMenu } from "./header/MobileMenu";
import { UserCircle } from "lucide-react";
import { useLanguage } from "@/features/language";
import { useAuth } from "@/contexts/AuthContext";
import { UserHoverCard } from "./auth/user-menu/UserHoverCard";
import { useNavigate } from "react-router-dom";
import { LoginButton } from "./auth/LoginButton";

export function Header() {
  const navigationLinks = getNavigationLinks();
  const { currentLanguage } = useLanguage();
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const t = (lvText: string, enText: string, ruText?: string) => {
    if (currentLanguage.code === 'lv') return lvText;
    if (currentLanguage.code === 'ru') return ruText || enText;
    return enText;
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };
  
  return (
    <header className="fixed top-0 left-0 right-0 z-50 py-3 md:py-4 px-4 md:px-6 bg-ticket-bg/80 backdrop-blur-sm">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <MobileMenu links={navigationLinks} />
          <Logo />
        </div>
        
        <Navigation />
        
        <div className="flex items-center gap-2 md:gap-4 text-ticket-text">
          <ThemeToggle />
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
              <UserCircle size={20} className="hover:text-ticket-accent" />
            </LoginButton>
          )}
          <LanguageSelector />
        </div>
      </div>
    </header>
  );
}
