
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Bell, Menu, UserCircle, LogOut } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/features/language";
import { useToast } from "@/components/ui/use-toast";

export function AdminHeader() {
  const isMobile = useIsMobile();
  const { isAuthenticated, logout } = useAuth();
  const { currentLanguage } = useLanguage();
  const { toast } = useToast();
  
  // Translation helper function
  const t = (lvText: string, enText: string) => 
    currentLanguage.code === 'lv' ? lvText : enText;
  
  const handleLogout = async () => {
    try {
      await logout();
      toast({
        description: t("Jūs esat veiksmīgi izrakstījies", "You have been successfully logged out"),
      });
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        variant: "destructive",
        description: t("Kļūda izrakstīšanās procesā", "Error during logout process"),
      });
    }
  };
  
  // Get current user email from localStorage or session
  const getUserEmail = () => {
    try {
      const session = localStorage.getItem('supabase.auth.token');
      if (session) {
        const parsedSession = JSON.parse(session);
        if (parsedSession?.currentSession?.user?.email) {
          return parsedSession.currentSession.user.email;
        }
      }
      
      // Fallback to checking if we have the email in localStorage
      const emailFromStorage = localStorage.getItem('admin_email');
      if (emailFromStorage) {
        return emailFromStorage;
      }
      
      return t("Administrators", "Administrator");
    } catch (error) {
      console.error("Error getting user email:", error);
      return t("Administrators", "Administrator");
    }
  };
  
  const userEmail = getUserEmail();
  
  return (
    <header className="fixed top-0 left-0 right-0 z-50 py-3 md:py-4 px-4 md:px-6 bg-black/40 backdrop-blur-sm h-16">
      <div className="container mx-auto flex justify-between items-center">
        {isMobile ? (
          <>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-6 w-6" />
            </Button>
            <Link 
              to="/admin" 
              className="flex items-center gap-2 font-semibold"
            >
              <span className="text-xl font-bold text-white">netieku.es</span>
              <span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 text-xs font-medium px-2 py-0.5 rounded">
                Admin
              </span>
            </Link>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5 text-white" />
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center space-x-4">
              <Link 
                to="/admin" 
                className="flex items-center gap-2 font-semibold"
              >
                <span className="text-xl font-bold text-white">netieku.es</span>
                <span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 text-xs font-medium px-2 py-0.5 rounded">
                  Admin
                </span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              {isAuthenticated && (
                <div className="flex items-center gap-2">
                  <span className="text-white text-sm hidden md:inline-block truncate max-w-[150px]">
                    {userEmail}
                  </span>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={handleLogout}
                    title={t("Izrakstīties", "Logout")}
                  >
                    <LogOut className="h-5 w-5 text-white" />
                  </Button>
                </div>
              )}
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5 text-white" />
              </Button>
              <Button variant="ghost" size="icon">
                <UserCircle className="h-6 w-6 text-white" />
              </Button>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
