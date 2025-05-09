
import { useState, useEffect } from "react";

export function useAdminSetup() {
  const [setupComplete, setSetupComplete] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    // Initialize with a simple check that always completes 
    // without relying on a non-existent function
    setIsInitializing(true);
    
    try {
      // Check if admin user exists in localStorage
      const adminAuthenticated = localStorage.getItem('admin_authenticated') === 'true';
      setSetupComplete(adminAuthenticated);
      
      if (adminAuthenticated) {
        console.log("Administrator account is available");
      } else {
        console.log("No administrator account is configured");
      }
    } catch (error) {
      console.error("Error checking admin status:", error);
      setSetupComplete(false);
    } finally {
      setIsInitializing(false);
    }
  }, []);

  return { setupComplete, isInitializing };
}
