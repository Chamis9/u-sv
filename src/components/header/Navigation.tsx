
import { Link } from "react-router-dom";
import { Mail, UserCircle } from "lucide-react";
import { useLanguage } from "@/features/language";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { LoginDialog } from "@/components/auth/LoginDialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function Navigation() {
  const { currentLanguage } = useLanguage();
  const { isAuthenticated, user, lastAvatarUpdate } = useAuth();
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [avatarKey, setAvatarKey] = useState(Date.now());
  
  // Refresh avatar when lastAvatarUpdate changes
  useEffect(() => {
    if (lastAvatarUpdate) {
      setAvatarKey(lastAvatarUpdate);
    }
  }, [lastAvatarUpdate]);
  
  const translations = {
    lv: {
      contact: "Kontakti",
      profile: "Mans Konts",
      myProfile: "Mans Profils"
    },
    en: {
      contact: "Contact",
      profile: "My Account",
      myProfile: "My Profile"
    },
    ru: {
      contact: "Контакты",
      profile: "Мой Аккаунт",
      myProfile: "Мой Профиль"
    }
  };

  const t = translations[currentLanguage.code as keyof typeof translations] || translations.en;

  const handleLinkClick = () => {
    window.scrollTo(0, 0);
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
            <Link
              to={`/profile/${user.id}/account`}
              onClick={handleLinkClick}
              className="flex items-center gap-2 text-white hover:text-orange-400 transition-colors relative z-10"
              title={t.myProfile}
            >
              <Avatar className="h-8 w-8">
                <AvatarImage 
                  src={user.avatar_url || ""} 
                  alt={t.myProfile} 
                  key={avatarKey} // Key forces rerender when avatar changes
                />
                <AvatarFallback>
                  <UserCircle className="h-6 w-6" />
                </AvatarFallback>
              </Avatar>
              <span className="hidden md:inline text-sm">{t.profile}</span>
            </Link>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:text-orange-400"
              onClick={() => setShowLoginDialog(true)}
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
