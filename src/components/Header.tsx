
import { LanguageSelector } from "@/features/language";
import { Logo } from "./header/Logo";
import { Navigation, getNavigationLinks } from "./header/Navigation";
import { ThemeToggle } from "./theme/ThemeToggle";
import { MobileMenu } from "./header/MobileMenu";
import { useState } from "react";
import { Button } from "./ui/button";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "./ui/hover-card";
import { UserCircle } from "lucide-react";
import { useLanguage } from "@/features/language";
import { useAuth } from "@/contexts/AuthContext";
import { UserHoverCard } from "./auth/user-menu/UserHoverCard";
import { useNavigate } from "react-router-dom";
import { LoginForm } from "./auth/forms/LoginForm";
import { RegistrationForm } from "./auth/forms/RegistrationForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { loginFormTranslations, registrationFormTranslations } from "./auth/translations";

export function Header() {
  const navigationLinks = getNavigationLinks();
  const { currentLanguage } = useLanguage();
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>("login");
  const [keepHoverOpen, setKeepHoverOpen] = useState(false);

  const t = (lvText: string, enText: string, ruText?: string) => {
    if (currentLanguage.code === 'lv') return lvText;
    if (currentLanguage.code === 'ru') return ruText || enText;
    return enText;
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };
  
  // Get the translated values from the imported translation files
  const loginTranslations = loginFormTranslations[currentLanguage.code] || loginFormTranslations.en;
  const regTranslations = registrationFormTranslations[currentLanguage.code] || registrationFormTranslations.en;
  
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
            <HoverCard open={keepHoverOpen}>
              <HoverCardTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:text-orange-400 transition-colors hover:bg-transparent"
                  onClick={() => setKeepHoverOpen(true)}
                >
                  <UserCircle size={20} className="hover:text-orange-400" />
                </Button>
              </HoverCardTrigger>
              <HoverCardContent 
                className="w-80 p-0 overflow-hidden"
                onKeyDown={(e) => {
                  if (e.key === 'Tab') {
                    e.stopPropagation();
                  }
                }}
                onFocus={(e) => {
                  e.stopPropagation();
                  setKeepHoverOpen(true);
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  setKeepHoverOpen(true);
                }}
                onInteractOutside={(e) => {
                  if (e.target instanceof Element) {
                    const isAutofillOption = e.target.closest('[role="option"]') || 
                                            e.target.closest('[role="listbox"]') ||
                                            e.target.closest('.autofill-suggestion') ||
                                            e.target.closest('.dropdown-option');
                    if (!isAutofillOption) {
                      setKeepHoverOpen(false);
                    } else {
                      e.preventDefault();
                    }
                  } else {
                    setKeepHoverOpen(false);
                  }
                }}
              >
                <Tabs 
                  defaultValue={activeTab} 
                  className="w-full" 
                  onValueChange={setActiveTab}
                >
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="login">{t("Ienākt", "Login", "Войти")}</TabsTrigger>
                    <TabsTrigger value="register">{t("Reģistrēties", "Register", "Регистрация")}</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="login" className="p-4">
                    <LoginForm 
                      translations={loginTranslations} 
                      onClose={() => setKeepHoverOpen(false)} 
                    />
                  </TabsContent>
                  
                  <TabsContent value="register" className="p-4">
                    <RegistrationForm 
                      translations={regTranslations}
                      onClose={() => setKeepHoverOpen(false)}
                    />
                  </TabsContent>
                </Tabs>
              </HoverCardContent>
            </HoverCard>
          )}
          <LanguageSelector />
        </div>
      </div>
    </header>
  );
}
