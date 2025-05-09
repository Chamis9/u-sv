
import { createContext } from "react";
import { User } from "@/types/users";

export interface AuthContextType {
  isAuthenticated: boolean;
  isAuthLoading: boolean;
  userEmail: string | null;
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, userData: any) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshUserData: () => Promise<void>;
  lastAvatarUpdate: number;
  refreshSession: () => Promise<void>;
  isAdmin: boolean;
  checkAdminStatus: () => Promise<boolean>;
}

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isAuthLoading: true,
  userEmail: null,
  user: null,
  login: async () => false,
  register: async () => false,
  logout: async () => {},
  refreshUserData: async () => {},
  lastAvatarUpdate: Date.now(),
  refreshSession: async () => {},
  isAdmin: false,
  checkAdminStatus: async () => false,
});
