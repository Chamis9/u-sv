
import { useAuthState } from './auth/useAuthState';
import { useAuthListeners } from './auth/useAuthListeners';
import { useUserData } from './auth/useUserData';
import { useCallback } from 'react';

export function useSupabaseAuth() {
  const { 
    isAuthenticated, setIsAuthenticated,
    isAuthLoading, setIsAuthLoading,
    userEmail, setUserEmail,
    user, setUser
  } = useAuthState();
  
  const { fetchUserData, refreshUserData } = useUserData();
  
  // Use the auth listeners
  useAuthListeners({
    setIsAuthenticated,
    setIsAuthLoading,
    setUserEmail,
    setUser,
    fetchUserData
  });

  const logout = useCallback(async () => {
    try {
      setIsAuthenticated(false);
      setUserEmail(null);
      setUser(null);
    } catch (error) {
      console.error("Error in logout:", error);
      throw error;
    }
  }, [setIsAuthenticated, setUserEmail, setUser]);

  return { 
    isAuthenticated, 
    isAuthLoading, 
    userEmail, 
    user, 
    logout,
    refreshUserData: useCallback(() => refreshUserData(userEmail), [refreshUserData, userEmail])
  };
}
