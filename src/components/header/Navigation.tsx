
import { Link } from "react-router-dom";
import { Mail, UserCircle, LogOut, Ticket, Wallet, Moon, Sun } from "lucide-react";
import { useLanguage } from "@/features/language";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/components/theme/ThemeProvider";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/profile/UserAvatar";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { LoginForm } from "@/components/auth/forms/LoginForm";
import { RegistrationForm } from "@/components/auth/forms/RegistrationForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getLoginTranslations } from "@/components/auth/translations";
import { useState } from "react";

// Navigation translations for different languages
const navigationTranslations = {
  lv: {
    contact: "Kontakti",
    myAccount: "Mans konts",
    myTickets: "Manas biļetes",
    myPayments: "Mani maksājumi",
    logout: "Iziet"
  },
  en: {
    contact: "Contact",
    myAccount: "My Account",
    myTickets: "My Tickets",
    myPayments: "My Payments",
    logout: "Logout"
  },
  ru: {
    contact: "Контакты",
    myAccount: "Мой аккаунт",
    myTickets: "Мои билеты",
    myPayments: "Мои платежи",
    logout: "Выйти"
  }
};

export function Navigation() {
  const { currentLanguage } = useLanguage();
  const { isAuthenticated, user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const translations = getLoginTranslations(currentLanguage.code);
  const [isAuthCardOpen, setIsAuthCardOpen] = useState(false);
  
  // Get navigation translations based on current language
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
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="text-white hover:text-orange-400"
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </Button>
        </li>
        <li>
          {isAuthenticated && user ? (
            <HoverCard>
              <HoverCardTrigger asChild>
                <Link
                  to={`/profile/${user.id}/account`}
                  onClick={handleLinkClick}
                  className="flex items-center gap-2 text-white hover:text-orange-400 transition-colors relative z-10"
                  title="My Profile"
                >
                  <UserAvatar user={user} size="sm" />
                </Link>
              </HoverCardTrigger>
              <HoverCardContent className="w-64 p-0 overflow-hidden">
                <div className="flex flex-col">
                  <div className="flex items-center gap-3 p-4 border-b">
                    <UserAvatar user={user} size="md" />
                    <div>
                      <p className="font-medium text-sm">
                        {user.first_name} {user.last_name}
                      </p>
                    </div>
                  </div>
                  
                  <Link
                    to={`/profile/${user.id}/account`}
                    className="px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 block w-full text-left text-sm flex items-center gap-2"
                  >
                    <UserCircle size={16} />
                    {navTranslations.myAccount}
                  </Link>
                  
                  <Link
                    to={`/profile/${user.id}/tickets`}
                    className="px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 block w-full text-left text-sm flex items-center gap-2"
                  >
                    <Ticket size={16} />
                    {navTranslations.myTickets}
                  </Link>
                  
                  <Link
                    to={`/profile/${user.id}/payments`}
                    className="px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 block w-full text-left text-sm flex items-center gap-2"
                  >
                    <Wallet size={16} />
                    {navTranslations.myPayments}
                  </Link>
                  
                  <div className="border-t">
                    <Button
                      variant="ghost"
                      className="px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 w-full justify-start text-sm flex items-center gap-2"
                      onClick={handleLogout}
                    >
                      <LogOut size={16} />
                      {navTranslations.logout}
                    </Button>
                  </div>
                </div>
              </HoverCardContent>
            </HoverCard>
          ) : (
            <HoverCard open={isAuthCardOpen} onOpenChange={setIsAuthCardOpen}>
              <HoverCardTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:text-orange-400"
                >
                  <UserCircle size={20} />
                </Button>
              </HoverCardTrigger>
              <HoverCardContent 
                className="w-[400px] p-4"
                onInteractOutside={(e) => {
                  // Prevent closing when interacting with form elements
                  if (e.target && (
                    (e.target as HTMLElement).tagName === 'INPUT' || 
                    (e.target as HTMLElement).closest('form')
                  )) {
                    e.preventDefault();
                  }
                }}
              >
                <Tabs defaultValue="login" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="login">{translations.login}</TabsTrigger>
                    <TabsTrigger value="register">{translations.register}</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="login" className="space-y-4 mt-4">
                    <LoginForm 
                      onClose={() => setIsAuthCardOpen(false)} 
                      translations={translations} 
                    />
                  </TabsContent>
                  
                  <TabsContent value="register" className="space-y-4 mt-4">
                    <RegistrationForm 
                      translations={translations} 
                      languageCode={currentLanguage.code}
                      onClose={() => setIsAuthCardOpen(false)}
                    />
                  </TabsContent>
                </Tabs>
              </HoverCardContent>
            </HoverCard>
          )}
        </li>
      </ul>
    </nav>
  );
}
