
import { useEffect, useCallback } from "react";
import { refreshSession as refreshAuthSession } from "@/utils/auth/authUtils";

type RefreshUserDataFn = () => Promise<void>;
type CheckAdminStatusFn = () => Promise<boolean>;

export function useSessionRefresh(
  refreshUserData: RefreshUserDataFn,
  checkAdminStatus: CheckAdminStatusFn
) {
  // Add refreshSession function to refresh auth session
  const refreshSession = useCallback(async () => {
    try {
      const success = await refreshAuthSession();
      if (success) {
        // After refreshing, also fetch the latest user data
        await refreshUserData();
        // Check admin status after refreshing
        await checkAdminStatus();
      }
    } catch (err) {
      console.error("Exception in refreshSession:", err);
    }
  }, [refreshUserData, checkAdminStatus]);

  // Add an effect to refresh the session periodically
  useEffect(() => {
    // Refresh the session every 15 minutes
    const interval = setInterval(() => {
      refreshSession();
    }, 1000 * 60 * 15); // 15 minutes
    
    return () => clearInterval(interval);
  }, [refreshSession]);

  return { refreshSession };
}
