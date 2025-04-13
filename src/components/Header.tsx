
import { LanguageSelector } from "@/features/language";
import { Logo } from "./header/Logo";
import { Navigation } from "./header/Navigation";
import { useIsMobile } from "@/hooks/use-mobile";
import { User } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export function Header() {
  const isMobile = useIsMobile();
  const { isAuthenticated } = useAuth();
  
  return (
    <header className="fixed top-0 left-0 right-0 z-50 py-3 md:py-4 px-4 md:px-6 bg-black/40 backdrop-blur-sm">
      <div className="container mx-auto flex justify-between items-center">
        {isMobile ? (
          <>
            <Logo />
            <div className="flex-1 flex justify-center">
              <Navigation />
            </div>
            <div className="flex items-center space-x-2">
              {isAuthenticated && (
                <Link 
                  to="/profile" 
                  className="text-white hover:text-orange-400 transition-colors"
                >
                  <User size={20} />
                </Link>
              )}
              <LanguageSelector />
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center">
              <Logo />
            </div>
            <div className="flex items-center space-x-4">
              <Navigation />
              {isAuthenticated && (
                <Link 
                  to="/profile" 
                  className="text-white hover:text-orange-400 transition-colors"
                >
                  <User size={20} />
                </Link>
              )}
              <LanguageSelector />
            </div>
          </>
        )}
      </div>
    </header>
  );
}
