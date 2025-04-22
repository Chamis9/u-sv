import { Link } from "react-router-dom";
import { Mail, UserCircle } from "lucide-react";
import { useLanguage } from "@/features/language";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useState, useRef } from "react";
import { LoginDialog } from "@/components/auth/LoginDialog";
import { UserAvatar } from "@/components/profile/UserAvatar";

export function Navigation() {
  const { currentLanguage } = useLanguage();
  const { isAuthenticated, user } = useAuth();
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [buttonPosition, setButtonPosition] = useState<{ x: number; y: number } | undefined>();
  
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

  const handleLoginClick = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setButtonPosition({ x: rect.left + rect.width / 2, y: rect.bottom });
    }
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
            <Link
              to={`/profile/${user.id}/account`}
              onClick={handleLinkClick}
              className="flex items-center gap-2 text-white hover:text-orange-400 transition-colors relative z-10"
              title={t.myProfile}
            >
              <UserAvatar user={user} size="sm" />
            </Link>
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
        anchorPosition={buttonPosition}
      />
    </nav>
  );
}
