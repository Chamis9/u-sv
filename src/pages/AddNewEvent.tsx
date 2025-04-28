
import React from 'react';
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { GlobalThemeToggle } from "@/components/theme/GlobalThemeToggle";
import { AddEventForm } from "@/components/events/AddEventForm";
import { useLanguage } from "@/features/language";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { LoginDialog } from "@/components/auth/LoginDialog";

export function AddNewEvent() {
  const { currentLanguage } = useLanguage();
  const { isAuthenticated } = useAuth();
  const [showLoginDialog, setShowLoginDialog] = React.useState(false);

  // Translate helper
  const t = (lv: string, en: string) => currentLanguage.code === 'lv' ? lv : en;

  React.useEffect(() => {
    // Show login dialog if user is not authenticated
    if (!isAuthenticated) {
      setShowLoginDialog(true);
    }
  }, [isAuthenticated]);

  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-white via-gray-50 to-gray-100 dark:from-black dark:via-gray-900 dark:to-gray-800 text-gray-900 dark:text-white">
        <SEO 
          title={t("Pievienot jaunu pasākumu - netieku.es", "Add new event - netieku.es")} 
          description={t("Pievienot jaunu pasākumu un biļeti pārdošanai", "Add a new event and ticket for sale")}
        />
        <Header />
        
        <main className="flex-grow pt-24 pb-12">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-3xl mx-auto">
              <div className="mb-6">
                <Link to="/events">
                  <Button variant="ghost" className="mb-4">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    {currentLanguage.code === 'lv' ? 'Atpakaļ' : 'Back'}
                  </Button>
                </Link>
                <h1 className="text-3xl font-bold mb-6">
                  {t("Pievienot jaunu pasākumu", "Add new event")}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {t("Šeit varat pievienot jaunu pasākumu un biļeti pārdošanai. Pēc pievienošanas, jūsu pasākums būs redzams attiecīgajā kategorijā.", 
                    "Here you can add a new event and ticket for sale. After adding, your event will be visible in the respective category.")}
                </p>
              </div>
              
              <AddEventForm />
            </div>
          </div>
        </main>
        
        <Footer />
        <GlobalThemeToggle />
        <LoginDialog isOpen={showLoginDialog} onClose={() => setShowLoginDialog(false)} />
      </div>
    </ThemeProvider>
  );
}
