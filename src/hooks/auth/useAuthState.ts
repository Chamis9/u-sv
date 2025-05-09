
import { useState } from "react";
import { User } from "@/types/users";

export function useAuthState() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  
  return {
    isAuthenticated,
    setIsAuthenticated,
    isAuthLoading,
    setIsAuthLoading,
    userEmail,
    setUserEmail,
    user,
    setUser
  };
}
