
import { LanguageSelector } from "@/features/language";
import { Logo } from "./header/Logo";
import { Navigation, getNavigationLinks } from "./header/Navigation";
import { MobileMenu } from "./header/MobileMenu";
import { UserCircle, LogIn } from "lucide-react";
import { useLanguage } from "@/features/language";
import { useAuth } from "@/contexts/AuthContext";
import { UserHoverCard } from "./auth/user-menu/UserHoverCard";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "./ui/button";

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
          {isAuthenticated && user ? (
            <UserHoverCard 
              user={user}
              onLogout={handleLogout}
              onLinkClick={() => {}}
            />
          ) : (
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost"
                size="sm"
                className="text-ticket-text hover:text-ticket-accent transition-colors"
                asChild
              >
                <Link to="/login">
                  <LogIn size={18} className="mr-1" />
                  {t('Ienākt', 'Login')}
                </Link>
              </Button>
              <Button 
                variant="outline"
                size="sm"
                className="hidden md:flex"
                asChild
              >
                <Link to="/registration">
                  {t('Reģistrēties', 'Register')}
                </Link>
              </Button>
            </div>
          )}
          <LanguageSelector />
        </div>
      </div>
    </header>
  );
}
