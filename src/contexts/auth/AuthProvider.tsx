
import React, { useEffect } from "react";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { useUserAuth } from "@/hooks/useUserAuth";
import { AuthContext } from "./AuthContext";
import { useAdminStatus } from "./hooks/useAdminStatus";
import { useSessionRefresh } from "./hooks/useSessionRefresh";
import { useEnhancedAuthActions } from "./hooks/useEnhancedAuthActions";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const supabaseAuth = useSupabaseAuth();
  const userAuth = useUserAuth();
  
  // Use the admin status hook
  const { isAdmin, checkAdminStatus } = useAdminStatus(
    supabaseAuth.isAuthenticated,
    supabaseAuth.userEmail
  );
  
  // Use the session refresh hook
  const { refreshSession } = useSessionRefresh(
    supabaseAuth.refreshUserData,
    checkAdminStatus
  );
  
  // Use the enhanced auth actions hook
  const {
    enhancedLogin: login,
    enhancedRegister: register,
    enhancedLogout: logout,
    enhancedRefreshUserData: refreshUserData,
    lastAvatarUpdate
  } = useEnhancedAuthActions(
    userAuth.login,
    userAuth.register,
    supabaseAuth.logout,
    supabaseAuth.refreshUserData,
    refreshSession,
    (value: boolean) => checkAdminStatus()
  );

  // Debug log to track auth state changes
  useEffect(() => {
    console.log("AuthProvider state update: ", {
      isAuthenticated: supabaseAuth.isAuthenticated || userAuth.isAuth,
      user: supabaseAuth.user,
      userEmail: supabaseAuth.userEmail
    });
  }, [supabaseAuth.isAuthenticated, userAuth.isAuth, supabaseAuth.user, supabaseAuth.userEmail]);

  // Combine both auth implementations with enhanced functions
  const auth = {
    ...supabaseAuth,
    login,
    register,
    logout,
    refreshUserData,
    isAuthLoading: supabaseAuth.isAuthLoading || userAuth.isLoading,
    isAuthenticated: supabaseAuth.isAuthenticated || userAuth.isAuth,
    lastAvatarUpdate,
    refreshSession,
    isAdmin,
    checkAdminStatus
  };

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
};
