
import { LanguageSelector } from "@/features/language";
import { Logo } from "./header/Logo";
import { Navigation, getNavigationLinks } from "./header/Navigation";
import { ThemeToggle } from "./theme/ThemeToggle";
import { MobileMenu } from "./header/MobileMenu";
import { useState } from "react";
import { Button } from "./ui/button";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "./ui/hover-card";
import { UserCircle, LogIn, UserPlus } from "lucide-react";
import { LoginDialog } from "./auth/LoginDialog";
import { useLanguage } from "@/features/language";
import { useAuth } from "@/contexts/AuthContext";
import { UserHoverCard } from "./auth/user-menu/UserHoverCard";
import { useNavigate } from "react-router-dom";

export function Header() {
  const navigationLinks = getNavigationLinks();
  const { currentLanguage } = useLanguage();
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
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
    <header className="fixed top-0 left-0 right-0 z-50 py-3 md:py-4 px-4 md:px-6 bg-black/40 backdrop-blur-sm">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <MobileMenu links={navigationLinks} />
          <Logo />
        </div>
        
        <Navigation />
        
        <div className="flex items-center gap-2 md:gap-4 text-white">
          <ThemeToggle />
          {isAuthenticated && user ? (
            <UserHoverCard 
              user={user}
              onLogout={handleLogout}
              onLinkClick={() => {}}
            />
          ) : (
            <HoverCard>
              <HoverCardTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:text-orange-400 transition-colors hover:bg-transparent"
                >
                  <UserCircle size={20} className="hover:text-orange-400" />
                </Button>
              </HoverCardTrigger>
              <HoverCardContent className="w-64 p-4">
                <div className="space-y-4">
                  <h4 className="text-sm font-medium">{t("Pieslēgties", "Login", "Войти")}</h4>
                  <div className="grid gap-3">
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">
                          {t("vai", "or", "или")}
                        </span>
                      </div>
                    </div>
                    <form>
                      <div className="grid gap-2">
                        <div className="grid gap-1">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              setAuthMode('login');
                              setIsAuthDialogOpen(true);
                            }}
                            className="w-full"
                          >
                            <LogIn className="mr-2 h-4 w-4" />
                            {t("Ieiet", "Login", "Войти")}
                          </Button>
                        </div>
                        <div className="grid gap-1">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              setAuthMode('register');
                              setIsAuthDialogOpen(true);
                            }}
                            className="w-full"
                          >
                            <UserPlus className="mr-2 h-4 w-4" />
                            {t("Reģistrēties", "Register", "Регистрация")}
                          </Button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </HoverCardContent>
            </HoverCard>
          )}
          <LanguageSelector />
        </div>
      </div>

      <LoginDialog 
        isOpen={isAuthDialogOpen} 
        onClose={() => setIsAuthDialogOpen(false)}
        defaultTab={authMode}
      />
    </header>
  );
}
