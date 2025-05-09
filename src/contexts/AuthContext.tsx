
import React from "react";
import { AuthProvider as NewAuthProvider } from "./auth/AuthProvider";
import { useAuth as newUseAuth } from "./auth/useAuth";

// Re-export the useAuth hook from the new location
export const useAuth = newUseAuth;

// Re-export the AuthProvider to maintain backward compatibility
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <NewAuthProvider>{children}</NewAuthProvider>;
};
