
import React, { createContext, useContext, useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface AuthContextType {
  isAuthenticated: boolean;
  isAuthLoading: boolean;
  userEmail: string | null;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isAuthLoading: true,
  userEmail: null,
  logout: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);
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
            localStorage.removeItem('admin_email');
            setIsAuthenticated(false);
            setUserEmail(null);
          } else {
            // Saglabājam e-pastu
            const email = data.session.user?.email;
            if (email) {
              localStorage.setItem('admin_email', email);
              setUserEmail(email);
            }
            setIsAuthenticated(true);
          }
        } else {
          setIsAuthenticated(false);
          setUserEmail(null);
        }
      } catch (error) {
        console.error('Auth status check error:', error);
        setIsAuthenticated(false);
        setUserEmail(null);
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
          localStorage.removeItem('admin_email');
          setIsAuthenticated(false);
          setUserEmail(null);
        } else if (event === 'SIGNED_IN' && session) {
          localStorage.setItem('admin_authenticated', 'true');
          const email = session.user?.email;
          if (email) {
            localStorage.setItem('admin_email', email);
            setUserEmail(email);
          }
          setIsAuthenticated(true);
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
      localStorage.removeItem('admin_email');
      setIsAuthenticated(false);
      setUserEmail(null);
      
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
        userEmail,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
