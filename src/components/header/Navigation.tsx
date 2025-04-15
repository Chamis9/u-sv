
import { Link } from "react-router-dom";
import { Mail, UserCircle } from "lucide-react";
import { useLanguage } from "@/features/language";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { LoginDialog } from "@/components/auth/LoginDialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function Navigation() {
  const { currentLanguage } = useLanguage();
  const { isAuthenticated, userEmail } = useAuth();
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  
  const translations = {
    lv: {
      contact: "Kontakti",
      profile: userEmail || "Profils",
      myProfile: "Mans Profils"
    },
    en: {
      contact: "Contact",
      profile: userEmail || "Profile",
      myProfile: "My Profile"
    },
    ru: {
      contact: "Контакты",
      profile: userEmail || "Профиль",
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
          {isAuthenticated ? (
            <Link
              to="/profile"
              onClick={handleLinkClick}
              className="flex items-center gap-2 text-white hover:text-orange-400 transition-colors relative z-10"
              title={t.myProfile}
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src="" alt={t.myProfile} />
                <AvatarFallback>
                  <UserCircle className="h-6 w-6" />
                </AvatarFallback>
              </Avatar>
              <span className="hidden md:inline text-sm">{t.myProfile}</span>
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
