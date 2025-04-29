
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@/types/users";

export function useSupabaseAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [lastAvatarUpdate, setLastAvatarUpdate] = useState<number>(Date.now());

  // Function to fetch user data from the database
  const fetchUserData = async (email: string) => {
    try {
      const { data: userData, error } = await supabase
        .from('registered_users')
        .select('*')
        .eq('email', email)
        .single();
      
      if (!error && userData) {
        setUser({
          id: userData.id,
          email: userData.email,
          first_name: userData.first_name,
          last_name: userData.last_name,
          phone: userData.phone,
          created_at: userData.created_at,
          updated_at: userData.updated_at,
          last_sign_in_at: userData.last_sign_in_at,
          role: 'user',
          status: userData.status as 'active' | 'inactive',
          avatar_url: userData.avatar_url
        });
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  // Set up subscription to user avatar changes
  useEffect(() => {
    if (!user || !user.id) return;
    
    console.log("Setting up avatar change subscription for user:", user.id);
    
    const subscription = supabase
      .channel('avatar_changes')
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'registered_users',
        filter: `id=eq.${user.id}`
      }, (payload) => {
        console.log("User data changed:", payload);
        if (payload.new && payload.new.avatar_url !== user?.avatar_url) {
          console.log("Avatar URL changed, updating user object");
          setUser(prev => prev ? {...prev, avatar_url: payload.new.avatar_url} : null);
          setLastAvatarUpdate(Date.now());
        }
      })
      .subscribe();

    return () => {
      console.log("Removing avatar change subscription");
      supabase.removeChannel(subscription);
    };
  }, [user?.id]);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsAuthLoading(true);
        console.log("Checking authentication status...");
        
        // Get current session
        const { data: sessionData } = await supabase.auth.getSession();
        const session = sessionData.session;
        
        if (session) {
          console.log("User is authenticated:", session.user.email);
          setIsAuthenticated(true);
          setUserEmail(session.user.email);
          
          // Fetch user data if authenticated
          if (session.user.email) {
            await fetchUserData(session.user.email);
          }
        } else {
          console.log("No active session found");
          setIsAuthenticated(false);
          setUserEmail(null);
          setUser(null);
        }
      } catch (error) {
        console.error("Error checking auth:", error);
        setIsAuthenticated(false);
        setUserEmail(null);
        setUser(null);
      } finally {
        setIsAuthLoading(false);
      }
    };
    
    checkAuth();
    
    // Set up auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event);
        if (event === 'SIGNED_IN' && session) {
          setIsAuthenticated(true);
          setUserEmail(session.user.email);
          
          // Fetch user data if authenticated
          if (session.user.email) {
            await fetchUserData(session.user.email);
          }
        } else if (event === 'SIGNED_OUT') {
          setIsAuthenticated(false);
          setUserEmail(null);
          setUser(null);
        }
      }
    );
    
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Function to refresh user data (e.g., after avatar update)
  const refreshUserData = async () => {
    console.log("Refreshing user data...");
    if (userEmail) {
      await fetchUserData(userEmail);
      setLastAvatarUpdate(Date.now());
    }
  };

  const logout = async () => {
    try {
      console.log("Logging out...");
      await supabase.auth.signOut();
      setIsAuthenticated(false);
      setUserEmail(null);
      setUser(null);
    } catch (error) {
      console.error("Error logging out:", error);
      throw error;
    }
  };

  return { 
    isAuthenticated, 
    isAuthLoading, 
    userEmail, 
    user, 
    logout,
    refreshUserData,
    lastAvatarUpdate
  };
}
