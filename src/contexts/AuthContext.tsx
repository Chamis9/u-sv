
import React, { createContext, useContext } from "react";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";

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
  const auth = useSupabaseAuth();

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
};
