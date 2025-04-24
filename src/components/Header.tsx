
import { LanguageSelector } from "@/features/language";
import { Logo } from "./header/Logo";
import { Navigation, getNavigationLinks } from "./header/Navigation";
import { ThemeToggle } from "./theme/ThemeToggle";
import { MobileMenu } from "./header/MobileMenu";
import { useState } from "react";
import { Button } from "./ui/button";
import { UserCircle } from "lucide-react";
import { LoginDialog } from "./auth/LoginDialog";
import { useLanguage } from "@/features/language";
import { useAuth } from "@/contexts/AuthContext";
import { UserHoverCard } from "./auth/user-menu/UserHoverCard";

export function Header() {
  const navigationLinks = getNavigationLinks();
  const { translations, currentLanguage } = useLanguage();
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  
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
              translations={translations}
              onLogout={logout}
              onLinkClick={() => {}}
            />
          ) : (
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:text-orange-400 transition-colors duration-300 hover:bg-transparent"
              onClick={() => setIsAuthDialogOpen(true)}
            >
              <UserCircle size={20} className="hover:text-orange-400" />
            </Button>
          )}
          <LanguageSelector />
        </div>
      </div>

      <LoginDialog 
        isOpen={isAuthDialogOpen} 
        onClose={() => setIsAuthDialogOpen(false)} 
      />
    </header>
  );
}
