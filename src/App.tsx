import React, { Suspense, useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { Helmet } from 'react-helmet-async';
import { useLanguage } from "@/features/language";
import { Toaster } from "@/components/ui/toaster"
import { useIsDesktop } from "./hooks/useIsDesktop";
import { ScrollToTop } from "./utils/operations/clientOperations";

import Index from "./pages/Index";
import AboutUs from "./pages/AboutUs";
import Contact from "./pages/Contact";
import Events from "./pages/Events";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Profile from "./pages/Profile";
import Tickets from "./pages/Tickets";
import NotFound from "./pages/NotFound";
import Admin from "./pages/Admin";
import { SiteHeader } from "./components/Header";
import { SiteFooter } from "./components/Footer";
import { AuthProvider } from "./contexts/AuthContext";
import { MobileHeader } from "./components/MobileHeader";
import { SupabaseListener } from "./components/SupabaseListener";
import Documentation from './pages/Documentation';

function AppContent() {
  const { currentLanguage } = useLanguage();
  const isDesktop = useIsDesktop();

  // Function to translate text based on current language
  const t = (lvText: string, enText: string) =>
    currentLanguage.code === 'lv' ? lvText : enText;

  return (
    <>
      <Helmet>
        <html lang={currentLanguage.code} />
        <title>netieku.es</title>
        <meta name="description" content={t(
          'netieku.es - pirkt, pārdot un apmainīt biļetes uz pasākumiem',
          'netieku.es - buy, sell and exchange tickets to events'
        )} />
      </Helmet>

      <AuthProvider>
        <SupabaseListener />
        {isDesktop ? <SiteHeader /> : <MobileHeader />}

        <main className="flex-1">
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/events" element={<Events />} />
            <Route path="/events/:category" element={<Events />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/:tab" element={<Profile />} />
            <Route path="/tickets" element={<Tickets />} />
            <Route path="/tickets/:category" element={<Tickets />} />
            <Route path="/docs" element={<Documentation />} /> {/* Add this line */}
            <Route path="/admin/*" element={<Admin />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        <SiteFooter />
      </AuthProvider>
      <Toaster />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
