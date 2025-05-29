
import React, { useEffect, useState, lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import { LanguageProvider } from "./features/language";
import { clearAllCookies } from "./utils/cookieManager";
import { ThemeProvider } from "./components/theme/ThemeProvider";
import { AuthProvider } from "./contexts/AuthContext";

// Import pages
import Index from "./pages/Index";
import Contact from "./pages/Contact";
import Events from "./pages/Events";
import Tickets from "./pages/Tickets";
import AboutUs from "./pages/AboutUs";
import Profile from "./pages/Profile";

// Lazy load other pages for better performance
const NotFound = lazy(() => import("./pages/NotFound"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const Admin = lazy(() => import("./pages/Admin"));

// Import the CategoryEventList component
import { CategoryEventList } from "./components/events/CategoryEventList";

// Import the EventTickets component
import { EventTickets } from "./components/events/EventTickets";

// Create a loading component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
  </div>
);

// Create the query client only once
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

// Global logout function - updated for local auth
const handleLogout = () => {
  clearAllCookies();
  localStorage.removeItem('admin_authenticated');
  console.log("User logged out and cookies cleared");
};

// Make the logout function globally available
window.logout = handleLogout;

const App = () => {
  const [isInitializing, setIsInitializing] = useState(true);
  
  useEffect(() => {
    // Simplified initialization
    const timer = setTimeout(() => {
      setIsInitializing(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  if (isInitializing) {
    return <PageLoader />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <TooltipProvider>
          <ThemeProvider defaultTheme="light" storageKey="ui-theme">
            <AuthProvider>
              <BrowserRouter>
                <LanguageProvider>
                  <Toaster />
                  <Sonner />
                  <Suspense fallback={<PageLoader />}>
                    <Routes>
                      {/* Redirect root to /en */}
                      <Route path="/" element={<Navigate to="/en" replace />} />
                      
                      {/* Language-prefixed routes */}
                      <Route path="/:lang" element={<Index />} />
                      <Route path="/:lang/events" element={<Events />} />
                      <Route path="/:lang/events/:category" element={<CategoryEventList />} />
                      <Route path="/:lang/events/:category/:eventId" element={<EventTickets />} />
                      <Route path="/:lang/tickets" element={<Tickets />} />
                      <Route path="/:lang/about-us" element={<AboutUs />} />
                      <Route path="/:lang/privacy-policy" element={<PrivacyPolicy />} />
                      <Route path="/:lang/contact" element={<Contact />} />
                      <Route path="/:lang/admin/*" element={<Admin />} />
                      <Route path="/:lang/profile/*" element={<Profile />} />
                      
                      {/* Legacy routes without language prefix - redirect to English */}
                      <Route path="/events" element={<Navigate to="/en/events" replace />} />
                      <Route path="/events/:category" element={<Navigate to="/en/events" replace />} />
                      <Route path="/events/:category/:eventId" element={<Navigate to="/en/events" replace />} />
                      <Route path="/tickets" element={<Navigate to="/en/tickets" replace />} />
                      <Route path="/about-us" element={<Navigate to="/en/about-us" replace />} />
                      <Route path="/privacy-policy" element={<Navigate to="/en/privacy-policy" replace />} />
                      <Route path="/contact" element={<Navigate to="/en/contact" replace />} />
                      <Route path="/admin/*" element={<Navigate to="/en/admin" replace />} />
                      <Route path="/profile/*" element={<Navigate to="/en/profile" replace />} />
                      
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </Suspense>
                </LanguageProvider>
              </BrowserRouter>
            </AuthProvider>
          </ThemeProvider>
        </TooltipProvider>
      </HelmetProvider>
    </QueryClientProvider>
  );
}

// Update TypeScript declaration
declare global {
  interface Window {
    logout?: () => void;
  }
}

export default App;
