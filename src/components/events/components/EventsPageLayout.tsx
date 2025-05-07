
import React from 'react';
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { Toaster } from "@/components/ui/toaster";
import { GlobalThemeToggle } from "@/components/theme/GlobalThemeToggle";

interface EventsPageLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

export const EventsPageLayout: React.FC<EventsPageLayoutProps> = ({ 
  children, 
  title,
  description
}) => {
  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-white via-gray-50 to-gray-100 dark:from-black dark:via-gray-900 dark:to-gray-800 text-gray-900 dark:text-white">
        <SEO title={title} description={description} />
        <Header />
        <main className="flex-grow pt-24 pb-12">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </div>
        </main>
        <Footer />
        <GlobalThemeToggle />
        <Toaster />
      </div>
    </ThemeProvider>
  );
};
