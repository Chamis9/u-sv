
import { useState, useEffect } from "react";
import { checkAdminStatus as checkUserAdminStatus } from "@/utils/auth/authUtils";

export function useAdminStatus(isAuthenticated: boolean, userEmail: string | null) {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  
  // Check if admin status is stored in localStorage on initial load
  useEffect(() => {
    const storedAdminStatus = localStorage.getItem('admin_authenticated') === 'true';
    setIsAdmin(storedAdminStatus);
  }, []);
  
  // Check admin status on mount and when authentication changes
  useEffect(() => {
    if (isAuthenticated) {
      checkAdminStatus();
    } else {
      setIsAdmin(false);
    }
  }, [isAuthenticated, userEmail]);
  
  // Function to check admin status
  const checkAdminStatus = async () => {
    const result = await checkUserAdminStatus(userEmail);
    setIsAdmin(result);
    return result;
  };

  return { isAdmin, checkAdminStatus };
}
