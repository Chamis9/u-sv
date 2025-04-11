
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
import { LanguageProvider } from "./features/language";
import { CookieConsent } from "./components/CookieConsent";
import { clearAllCookies } from "./utils/cookieManager";

const queryClient = new QueryClient();

// Global logout function that also clears cookies
const handleLogout = () => {
  // Clear cookies first
  clearAllCookies();
  
  // Then perform any other logout operations such as:
  // - Clear local storage (except for language preference if needed)
  // - Clear application state
  // - Redirect to login page
  // - etc.
  
  console.log("User logged out and cookies cleared");
  
  // Example: You might want to reload the page or redirect
  // window.location.href = '/login';
};

// Make the logout function globally available
window.logout = handleLogout;

const App = () => (
  <React.StrictMode>
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
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </LanguageProvider>
        </TooltipProvider>
      </HelmetProvider>
    </QueryClientProvider>
  </React.StrictMode>
);

// Update TypeScript declaration
declare global {
  interface Window {
    logout?: () => void;
    // Other global functions from before
  }
}

export default App;
