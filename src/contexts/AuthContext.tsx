
import React, { createContext, useContext, useState, useEffect } from "react";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { User } from "@/types/users";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/features/language";

interface AuthContextType {
  isAuthenticated: boolean;
  isAuthLoading: boolean;
  userEmail: string | null;
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, userData: any) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshUserData: () => Promise<void>;
  lastAvatarUpdate: number;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isAuthLoading: true,
  userEmail: null,
  user: null,
  login: async () => false,
  register: async () => false,
  logout: async () => {},
  refreshUserData: async () => {},
  lastAvatarUpdate: Date.now(),
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentLanguage } = useLanguage();
  const navigate = useNavigate();
  const {
    isAuthenticated,
    isAuthLoading,
    userEmail,
    user,
    logout: supabaseLogout,
    refreshUserData,
    lastAvatarUpdate
  } = useSupabaseAuth();
  
  const t = (lvText: string, enText: string) => {
    return currentLanguage.code === 'lv' ? lvText : enText;
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error("Login error:", error);
        toast({
          title: t("Kļūda", "Error"),
          description: error.message,
          variant: "destructive"
        });
        return false;
      }
      
      toast({
        title: t("Veiksmīgi", "Success"),
        description: t("Jūs esat veiksmīgi pieslēdzies", "You have successfully logged in")
      });
      
      return true;
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: t("Kļūda", "Error"),
        description: t("Radās kļūda pieslēdzoties", "An error occurred while logging in"),
        variant: "destructive"
      });
      return false;
    }
  };
  
  const register = async (email: string, password: string, userData: any): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: userData.firstName,
            last_name: userData.lastName,
            phone: userData.phoneNumber ? `${userData.countryCode}${userData.phoneNumber}` : null,
          },
        }
      });
      
      if (error) {
        console.error("Registration error:", error);
        toast({
          title: t("Kļūda", "Error"),
          description: error.message,
          variant: "destructive"
        });
        return false;
      }
      
      toast({
        title: t("Veiksmīgi", "Success"),
        description: t(
          "Reģistrācija veiksmīga! Lūdzu pārbaudiet savu e-pastu, lai apstiprinātu kontu.",
          "Registration successful! Please check your email to confirm your account."
        )
      });
      
      return true;
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        title: t("Kļūda", "Error"),
        description: t("Radās kļūda reģistrējoties", "An error occurred during registration"),
        variant: "destructive"
      });
      return false;
    }
  };
  
  const logout = async () => {
    try {
      await supabaseLogout();
      navigate('/');
      toast({
        title: t("Veiksmīgi", "Success"),
        description: t("Jūs esat veiksmīgi atslēdzies", "You have successfully logged out")
      });
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: t("Kļūda", "Error"),
        description: t("Radās kļūda atslēdzoties", "An error occurred while logging out"),
        variant: "destructive"
      });
    }
  };

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      isAuthLoading,
      userEmail,
      user,
      login,
      register,
      logout,
      refreshUserData,
      lastAvatarUpdate
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Add supabase import to the top of the file
import { supabase } from "@/integrations/supabase/client";
