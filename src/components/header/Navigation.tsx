
import { Link } from "react-router-dom";
import { Mail, UserCircle } from "lucide-react";
import { useLanguage } from "@/features/language";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { LoginDialog } from "@/components/auth/LoginDialog";

export function Navigation() {
  const { currentLanguage } = useLanguage();
  const { isAuthenticated, userEmail } = useAuth();
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  
  const translations = {
    lv: {
      contact: "Kontakti",
      profile: userEmail || "Profils"
    },
    en: {
      contact: "Contact",
      profile: userEmail || "Profile"
    },
    ru: {
      contact: "Контакты",
      profile: userEmail || "Профиль"
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
              className="text-white hover:text-orange-400 transition-colors flex items-center relative z-10"
            >
              <UserCircle size={20} />
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
