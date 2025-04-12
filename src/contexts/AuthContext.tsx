import React, { createContext, useContext, useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { logActivity } from "@/utils/activityLogger";

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
    // Check authentication status
    const checkAuthStatus = async () => {
      try {
        // Check if we have an active Supabase session
        const { data } = await supabase.auth.getSession();
        
        if (data.session) {
          // We have an active session, now check if the user is in the admin_user table
          const email = data.session.user?.email;
          
          if (email) {
            const { data: adminData, error: adminError } = await supabase
              .from('admin_user')
              .select('*')
              .eq('email', email)
              .maybeSingle();

            if (adminError) {
              console.error('Error checking admin status:', adminError);
              setIsAuthenticated(false);
              setUserEmail(null);
            } else if (adminData) {
              // User is authenticated and is an admin
              setIsAuthenticated(true);
              setUserEmail(email);
              localStorage.setItem('admin_authenticated', 'true');
              localStorage.setItem('admin_email', email);
              
              // Log login activity
              logActivity({
                activityType: 'login',
                description: `Admin user logged in`,
                email: email,
              });
            } else {
              // User is authenticated but not an admin
              console.error('User is not an admin');
              await supabase.auth.signOut();
              setIsAuthenticated(false);
              setUserEmail(null);
            }
          } else {
            setIsAuthenticated(false);
            setUserEmail(null);
          }
        } else {
          // No active session
          setIsAuthenticated(false);
          setUserEmail(null);
          localStorage.removeItem('admin_authenticated');
          localStorage.removeItem('admin_email');
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

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_OUT') {
          const email = localStorage.getItem('admin_email');
          if (email) {
            // Log logout activity
            logActivity({
              activityType: 'logout',
              description: `Admin user logged out`,
              email: email,
            });
          }
          
          localStorage.removeItem('admin_authenticated');
          localStorage.removeItem('admin_email');
          setIsAuthenticated(false);
          setUserEmail(null);
        } else if (event === 'SIGNED_IN' && session) {
          // When signed in, check if the user is an admin
          const email = session.user?.email;
          if (email) {
            // Use setTimeout to avoid nested Supabase calls
            setTimeout(async () => {
              const { data: adminData, error: adminError } = await supabase
                .from('admin_user')
                .select('*')
                .eq('email', email)
                .maybeSingle();

              if (!adminError && adminData) {
                localStorage.setItem('admin_authenticated', 'true');
                localStorage.setItem('admin_email', email);
                setIsAuthenticated(true);
                setUserEmail(email);
                
                // Log login activity
                logActivity({
                  activityType: 'login',
                  description: `Admin user logged in`,
                  email: email,
                });
              } else {
                // Not an admin, sign out
                await supabase.auth.signOut();
                setIsAuthenticated(false);
                setUserEmail(null);
              }
            }, 0);
          }
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const logout = async () => {
    try {
      const email = userEmail;
      
      // Sign out from Supabase
      await supabase.auth.signOut();
      
      // Clear local auth data
      localStorage.removeItem('admin_authenticated');
      localStorage.removeItem('admin_email');
      setIsAuthenticated(false);
      setUserEmail(null);
      
      // Log logout activity
      if (email) {
        logActivity({
          activityType: 'logout',
          description: `Admin user logged out`,
          email: email,
        });
      }
      
      toast({
        description: "You have been successfully logged out",
      });
      
      // Use global logout function if defined
      if (window.logout) {
        window.logout();
      }
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Failed to log out. Please try again.",
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
