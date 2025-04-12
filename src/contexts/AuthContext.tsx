
import React, { createContext, useContext, useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface AuthContextType {
  isAuthenticated: boolean;
  isAuthLoading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isAuthLoading: true,
  logout: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);
  const { toast } = useToast();

  useEffect(() => {
    // Pārbaudam autentifikācijas statusu
    const checkAuthStatus = async () => {
      try {
        // Pārbaudam lokālās glabātuves vērtību
        const isAuth = localStorage.getItem('admin_authenticated') === 'true';
        
        if (isAuth) {
          // Pārbaudam vai ir aktīva Supabase sesija
          const { data } = await supabase.auth.getSession();
          if (!data.session) {
            // Ja nav aktīvas sesijas, notīrām iestatījumus
            localStorage.removeItem('admin_authenticated');
            setIsAuthenticated(false);
          } else {
            setIsAuthenticated(true);
          }
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Auth status check error:', error);
        setIsAuthenticated(false);
      } finally {
        setIsAuthLoading(false);
      }
    };

    checkAuthStatus();

    // Pievienojam sesijas statusu maiņas notikumu klausītāju
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_OUT') {
          localStorage.removeItem('admin_authenticated');
          setIsAuthenticated(false);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const logout = async () => {
    try {
      // Izrakstāmies no Supabase
      await supabase.auth.signOut();
      
      // Notīrām lokālos autorizācijas datus
      localStorage.removeItem('admin_authenticated');
      setIsAuthenticated(false);
      
      toast({
        description: "Jūs esat veiksmīgi izrakstījies",
      });
      
      // Izmantojam globālo logout funkciju, ja tāda ir definēta
      if (window.logout) {
        window.logout();
      }
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Neizdevās izrakstīties. Lūdzu, mēģiniet vēlreiz.",
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isAuthLoading,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
