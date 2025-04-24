
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
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog";

export function Header() {
  const navigationLinks = getNavigationLinks();
  const { translations, currentLanguage } = useLanguage();
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const { isAuthenticated, user, logout, lastAvatarUpdate } = useAuth();
  
  const handleLogout = async () => {
    await logout();
    setIsLogoutDialogOpen(false);
  };
  
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
            <AlertDialog open={isLogoutDialogOpen} onOpenChange={setIsLogoutDialogOpen}>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="rounded-full overflow-hidden border-2 border-transparent hover:border-orange-400"
                >
                  <Avatar className="h-8 w-8">
                    {user.avatar_url ? (
                      <AvatarImage 
                        src={`${user.avatar_url}?t=${lastAvatarUpdate}`} 
                        alt={user.first_name || "User"} 
                      />
                    ) : (
                      <AvatarFallback className="bg-orange-400 text-white">
                        {user.first_name?.[0]}{user.last_name?.[0]}
                      </AvatarFallback>
                    )}
                  </Avatar>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Izlogoties</AlertDialogTitle>
                  <AlertDialogDescription>
                    Vai tiešām vēlaties izlogoties no savas konta?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Atcelt</AlertDialogCancel>
                  <AlertDialogAction onClick={handleLogout}>Izlogoties</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
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
