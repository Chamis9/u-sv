
import { Link } from "react-router-dom";
import { Mail, UserCircle, LogOut } from "lucide-react";
import { useLanguage } from "@/features/language";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useState, useRef } from "react";
import { LoginDialog } from "@/components/auth/LoginDialog";
import { UserAvatar } from "@/components/profile/UserAvatar";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

export function Navigation() {
  const { currentLanguage } = useLanguage();
  const { isAuthenticated, user, logout } = useAuth();
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  
  const translations = {
    lv: {
      contact: "Kontakti",
      profile: "Mans Konts",
      myProfile: "Mans Profils",
      logout: "Iziet",
      mySubscriptions: "Mani abonamenti",
      subscribe: "Abonēt",
      settings: "Iestatījumi",
      darkMode: "Tumšais režīms"
    },
    en: {
      contact: "Contact",
      profile: "My Account",
      myProfile: "My Profile",
      logout: "Logout",
      mySubscriptions: "My Subscriptions",
      subscribe: "Subscribe",
      settings: "Settings",
      darkMode: "Dark Mode"
    },
    ru: {
      contact: "Контакты",
      profile: "Мой Аккаунт",
      myProfile: "Мой Профиль",
      logout: "Выйти",
      mySubscriptions: "Мои подписки",
      subscribe: "Подписаться",
      settings: "Настройки",
      darkMode: "Тёмный режим"
    }
  };

  const t = translations[currentLanguage.code as keyof typeof translations] || translations.en;

  const handleLinkClick = () => {
    window.scrollTo(0, 0);
  };

  const handleLoginClick = () => {
    setShowLoginDialog(true);
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
                      <p className="text-xs text-gray-500">
                        {t.myProfile}
                      </p>
                    </div>
                  </div>
                  
                  <Link
                    to={`/profile/${user.id}/account`}
                    className="px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 block w-full text-left text-sm"
                  >
                    {t.myProfile}
                  </Link>
                  
                  <div className="border-t">
                    <Link
                      to="/subscriptions" 
                      className="px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 block w-full text-left text-sm"
                    >
                      {t.mySubscriptions}
                    </Link>
                  </div>
                  
                  <div className="p-3 border-t">
                    <Button 
                      variant="orange" 
                      className="w-full" 
                      onClick={() => {}}
                    >
                      {t.subscribe}
                    </Button>
                  </div>
                  
                  <div className="border-t p-4 flex justify-between items-center">
                    <span className="text-sm">{t.darkMode}</span>
                    <div className="rounded-full w-10 h-5 bg-gray-300 relative flex items-center px-1">
                      <div className="w-3 h-3 bg-white rounded-full"></div>
                    </div>
                  </div>
                  
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
            <Button
              ref={buttonRef}
              variant="ghost"
              size="icon"
              className="text-white hover:text-orange-400"
              onClick={handleLoginClick}
            >
              <UserCircle size={20} />
            </Button>
          )}
        </li>
      </ul>
      
      <LoginDialog 
        isOpen={showLoginDialog} 
        onClose={() => setShowLoginDialog(false)}
      />
    </nav>
  );
}
