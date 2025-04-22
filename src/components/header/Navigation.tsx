
import { Link } from "react-router-dom";
import { Mail, UserCircle, LogOut, Ticket, Wallet } from "lucide-react";
import { useLanguage } from "@/features/language";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { LoginDialog } from "@/components/auth/LoginDialog";
import { UserAvatar } from "@/components/profile/UserAvatar";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

export function Navigation() {
  const { currentLanguage } = useLanguage();
  const { isAuthenticated, user, logout } = useAuth();
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [initialTab, setInitialTab] = useState<"login" | "register">("login");
  
  const translations = {
    lv: {
      contact: "Kontakti",
      profile: "Mans Konts",
      myProfile: "Mans Profils",
      myTickets: "Manas biļetes",
      myPayments: "Mani maksājumi",
      myAccount: "Mans konts",
      logout: "Iziet",
      settings: "Iestatījumi",
      darkMode: "Tumšais režīms",
      login: "Pieslēgties",
      register: "Reģistrēties"
    },
    en: {
      contact: "Contact",
      profile: "My Account",
      myProfile: "My Profile",
      myTickets: "My Tickets",
      myPayments: "My Payments",
      myAccount: "My Account",
      logout: "Logout",
      settings: "Settings",
      darkMode: "Dark Mode",
      login: "Login",
      register: "Register"
    },
    ru: {
      contact: "Контакты",
      profile: "Мой Аккаунт",
      myProfile: "Мой Профиль",
      myTickets: "Мои билеты",
      myPayments: "Мои платежи",
      myAccount: "Мой аккаунт",
      logout: "Выйти",
      settings: "Настройки",
      darkMode: "Тёмный режим",
      login: "Войти",
      register: "Регистрация"
    }
  };

  const t = translations[currentLanguage.code as keyof typeof translations] || translations.en;

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

  const openLoginDialog = (tab: "login" | "register" = "login") => {
    setInitialTab(tab);
    setShowLoginDialog(true);
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
          {isAuthenticated && user ? (
            <HoverCard>
              <HoverCardTrigger asChild>
                <Link
                  to={`/profile/${user.id}/account`}
                  onClick={handleLinkClick}
                  className="flex items-center gap-2 text-white hover:text-orange-400 transition-colors relative z-10"
                  title={t.myProfile}
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
                    {t.myAccount}
                  </Link>
                  
                  <Link
                    to={`/profile/${user.id}/tickets`}
                    className="px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 block w-full text-left text-sm flex items-center gap-2"
                  >
                    <Ticket size={16} />
                    {t.myTickets}
                  </Link>
                  
                  <Link
                    to={`/profile/${user.id}/payments`}
                    className="px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 block w-full text-left text-sm flex items-center gap-2"
                  >
                    <Wallet size={16} />
                    {t.myPayments}
                  </Link>
                  
                  <div className="border-t">
                    <Button
                      variant="ghost"
                      className="px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 w-full justify-start text-sm flex items-center gap-2"
                      onClick={handleLogout}
                    >
                      <LogOut size={16} />
                      {t.logout}
                    </Button>
                  </div>
                </div>
              </HoverCardContent>
            </HoverCard>
          ) : (
            <HoverCard>
              <HoverCardTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:text-orange-400"
                >
                  <UserCircle size={20} />
                </Button>
              </HoverCardTrigger>
              <HoverCardContent className="w-64 p-0 overflow-hidden">
                <div className="flex flex-col">
                  <Button
                    variant="ghost"
                    className="px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 w-full justify-start text-sm"
                    onClick={() => openLoginDialog("login")}
                  >
                    {t.login}
                  </Button>
                  <Button
                    variant="ghost"
                    className="px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 w-full justify-start text-sm"
                    onClick={() => openLoginDialog("register")}
                  >
                    {t.register}
                  </Button>
                </div>
              </HoverCardContent>
            </HoverCard>
          )}
        </li>
      </ul>
      
      <LoginDialog 
        isOpen={showLoginDialog} 
        onClose={() => setShowLoginDialog(false)}
        defaultTab={initialTab}
      />
    </nav>
  );
}
