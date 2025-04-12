
import React, { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Contact from "./pages/Contact";
import Admin from "./pages/Admin";
import { LanguageProvider } from "./features/language";
import { CookieConsent } from "./components/CookieConsent";
import { clearAllCookies } from "./utils/cookieManager";
import { ThemeProvider } from "./components/theme/ThemeProvider";
import { supabase } from "./integrations/supabase/client";
import { createAdminUser } from "./utils/authHelpers";

const queryClient = new QueryClient();

// Global logout function
const handleLogout = () => {
  clearAllCookies();
  supabase.auth.signOut();
  console.log("User logged out and cookies cleared");
};

// Make the logout function globally available
window.logout = handleLogout;

// Create admin account for demonstration purposes
// In a real application, this would be done through a secure setup process
const setupAdmin = async () => {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (!session) {
    try {
      // Try to sign up the admin user - this is just for demo purposes
      // In a real app, user creation would be handled through a secure admin panel or backend
      const { data, error } = await supabase.auth.signUp({
        email: 'admin@netieku.es',
        password: 'raivis2025!',
      });
      
      if (error) {
        console.error("Admin setup error:", error);
      } else {
        console.log("Admin account created or already exists");
      }
    } catch (err) {
      console.error("Setup admin error:", err);
    }
  }
};

const App = () => {
  const [isInitializing, setIsInitializing] = useState(true);
  
  useEffect(() => {
    const init = async () => {
      // Try to setup admin account (only for demo)
      await setupAdmin();
      setIsInitializing(false);
    };
    
    init();
  }, []);

  if (isInitializing) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <ThemeProvider defaultTheme="light">
          <TooltipProvider>
            <LanguageProvider>
              <Toaster />
              <Sonner />
              <CookieConsent />
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/admin" element={<Admin />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </LanguageProvider>
          </TooltipProvider>
        </ThemeProvider>
      </HelmetProvider>
    </QueryClientProvider>
  );
};

// Update TypeScript declaration
declare global {
  interface Window {
    logout?: () => void;
    openCookieSettings?: () => void;
    manageCookieConsent?: () => void;
    clearAllCookiesOnLogout?: () => void;
  }
}

export default App;
