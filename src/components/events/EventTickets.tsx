
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useLanguage } from "@/features/language";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { GlobalThemeToggle } from "@/components/theme/GlobalThemeToggle";
import { categoryEvents } from '@/utils/eventData';
import { EventHeader } from './components/EventHeader';
import { TicketCard } from './components/TicketCard';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface TicketType {
  id: number;
  type: string;
  price: number;
  available: number;
}

const mockTickets: TicketType[] = [
  { id: 1, type: "VIP", price: 50, available: 10 },
  { id: 2, type: "Standard", price: 30, available: 50 },
  { id: 3, type: "Economy", price: 20, available: 100 },
];

export function EventTickets() {
  const { categoryId, eventId } = useParams<{ categoryId: string; eventId: string }>();
  const { currentLanguage } = useLanguage();
  
  const { data: event, isLoading } = useQuery({
    queryKey: ['event', eventId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          categories:category_id(name)
        `)
        .eq('id', eventId)
        .single();
        
      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return (
      <ThemeProvider>
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-white via-gray-50 to-gray-100 dark:from-black dark:via-gray-900 dark:to-gray-800">
          <SEO />
          <Header />
          <main className="flex-grow pt-24 pb-12 flex items-center justify-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-orange-500"></div>
          </main>
          <Footer />
          <GlobalThemeToggle />
        </div>
      </ThemeProvider>
    );
  }

  if (!event) {
    const notFoundText = {
      lv: "Pasākums nav atrasts",
      en: "Event not found"
    };
    return (
      <ThemeProvider>
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-white via-gray-50 to-gray-100 dark:from-black dark:via-gray-900 dark:to-gray-800">
          <SEO />
          <Header />
          <main className="flex-grow pt-24 pb-12 flex items-center justify-center">
            <div className="text-center p-8">{notFoundText[currentLanguage.code as keyof typeof notFoundText]}</div>
          </main>
          <Footer />
          <GlobalThemeToggle />
        </div>
      </ThemeProvider>
    );
  }

  const backText = {
    lv: "Atpakaļ",
    en: "Back"
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-white via-gray-50 to-gray-100 dark:from-black dark:via-gray-900 dark:to-gray-800 text-gray-900 dark:text-white">
        <SEO />
        <Header />
        <main className="flex-grow pt-24 pb-12">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-7xl mx-auto">
              <Link to={`/events/${categoryId}`}>
                <Button variant="ghost" className="mb-4">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  {backText[currentLanguage.code as keyof typeof backText]}
                </Button>
              </Link>
              
              <EventHeader 
                title={event.title}
                date={new Date(event.start_date).toLocaleDateString(currentLanguage.code)}
                time={new Date(event.start_date).toLocaleTimeString(currentLanguage.code, { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
                location={event.venue_id ? "Venue" : "TBD"}
                description={event.description || ""}
              />

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {mockTickets.map((ticket) => (
                  <TicketCard
                    key={ticket.id}
                    type={ticket.type}
                    price={ticket.price}
                    available={ticket.available}
                  />
                ))}
              </div>
            </div>
          </div>
        </main>
        <Footer />
        <GlobalThemeToggle />
      </div>
    </ThemeProvider>
  );
}
