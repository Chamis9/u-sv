
import { useState, useCallback } from 'react';

export function useEnhancedAuthActions(
  login: (email: string, password: string) => Promise<boolean>,
  register: (email: string, password: string, userData: any) => Promise<boolean>,
  logout: () => Promise<any>,
  refreshUserData: () => Promise<any>,
  refreshSession: () => Promise<boolean>,
  setIsAdmin: (value: boolean) => void
) {
  const [lastAvatarUpdate, setLastAvatarUpdate] = useState<number>(Date.now());
  
  // Enhanced login with additional operations
  const enhancedLogin = useCallback(async (email: string, password: string): Promise<boolean> => {
    try {
      console.log("Enhanced login starting for:", email);
      const loginSuccess = await login(email, password);
      
      if (loginSuccess) {
        console.log("Login successful, refreshing session");
        await refreshSession();
        await refreshUserData();
        setIsAdmin(true); // Check admin status after login
        console.log("Session and user data refreshed");
      } else {
        console.log("Login failed");
      }
      
      return loginSuccess;
    } catch (error) {
      console.error("Error in enhancedLogin:", error);
      return false;
    }
  }, [login, refreshSession, refreshUserData, setIsAdmin]);
  
  // Enhanced register with additional operations
  const enhancedRegister = useCallback(async (email: string, password: string, userData: any): Promise<boolean> => {
    try {
      console.log("Enhanced register starting for:", email);
      const registerSuccess = await register(email, password, userData);
      
      if (registerSuccess) {
        console.log("Registration successful, refreshing session");
        await refreshSession();
        await refreshUserData();
      }
      
      return registerSuccess;
    } catch (error) {
      console.error("Error in enhancedRegister:", error);
      return false;
    }
  }, [register, refreshSession, refreshUserData]);
  
  // Enhanced logout with additional operations
  const enhancedLogout = useCallback(async () => {
    try {
      console.log("Enhanced logout starting");
      await logout();
      setIsAdmin(false);
      console.log("Logout complete");
    } catch (error) {
      console.error("Error in enhancedLogout:", error);
      throw error;
    }
  }, [logout, setIsAdmin]);
  
  // Enhanced refreshUserData with avatar update tracking
  const enhancedRefreshUserData = useCallback(async () => {
    try {
      await refreshUserData();
      setLastAvatarUpdate(Date.now());
    } catch (error) {
      console.error("Error in enhancedRefreshUserData:", error);
    }
  }, [refreshUserData]);
  
  return {
    enhancedLogin,
    enhancedRegister,
    enhancedLogout,
    enhancedRefreshUserData,
    lastAvatarUpdate
  };
}
