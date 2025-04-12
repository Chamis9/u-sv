
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Contact from "./pages/Contact";
import Admin from "./pages/Admin";
import { LanguageProvider } from "./features/language";
import { CookieConsent } from "./components/CookieConsent";
import { clearAllCookies } from "./utils/cookieManager";

const queryClient = new QueryClient();

// Global logout function
const handleLogout = () => {
  clearAllCookies();
  console.log("User logged out and cookies cleared");
};

// Make the logout function globally available
window.logout = handleLogout;

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
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
    </HelmetProvider>
  </QueryClientProvider>
);

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
