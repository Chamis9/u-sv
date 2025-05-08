
import React from 'react';
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { Toaster } from "@/components/ui/toaster";

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
      <div className="min-h-screen flex flex-col bg-ticket-bg text-ticket-text">
        <SEO title={title} description={description} />
        <Header />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(247,183,49,0.1),transparent_20%),radial-gradient(circle_at_20%_30%,rgba(247,183,49,0.13),transparent_20%)] pointer-events-none"></div>
        <main className="flex-grow pt-24 pb-12 relative z-10">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </div>
        </main>
        <Footer />
        <Toaster />
      </div>
    </ThemeProvider>
  );
};
