
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useLanguage } from "@/features/language";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { categoryEvents } from '@/utils/eventData';
import { EventHeader } from './components/EventHeader';
import { OrganizerTickets } from './components/OrganizerTickets';
import { AvailableTicketsSection } from './components/AvailableTicketsSection';
import { PurchaseDialog } from './components/PurchaseDialog';
import { UserTicket } from "@/hooks/tickets";
import { useTicketPurchase } from '@/hooks/useTicketPurchase';
import { Toaster } from "@/components/ui/toaster";

export function EventTickets() {
  const { category, eventId } = useParams<{ category: string; eventId: string }>();
  const { currentLanguage } = useLanguage();
  const [availableTickets, setAvailableTickets] = useState<UserTicket[]>([]);
  
  const {
    selectedTicket,
    isPurchaseDialogOpen,
    setIsPurchaseDialogOpen,
    openPurchaseDialog,
    purchaseTicket
  } = useTicketPurchase();
  
  const event = category && eventId 
    ? categoryEvents[category]?.find(e => e.id === Number(eventId))
    : null;

  useEffect(() => {
    // Fetching logic is now moved to a separate hook component
    const fetchTickets = async () => {
      try {
        const { data, error } = await import('@/hooks/useEventTickets').then(
          module => module.useEventTickets(eventId)
        );
        
        if (!error && data) {
          setAvailableTickets(data);
        }
      } catch (err) {
        console.error("Error loading tickets:", err);
      }
    };

    if (eventId) {
      fetchTickets();
    }
  }, [eventId]);

  const handlePurchaseSuccess = (ticketId: string) => {
    // Remove the purchased ticket from state
    setAvailableTickets(prev => prev.filter(t => t.id !== ticketId));
  };

  if (!event) {
    const notFoundText = {
      lv: "Pasākums nav atrasts",
      en: "Event not found"
    };
    return <div className="text-center p-8">{notFoundText[currentLanguage.code as keyof typeof notFoundText]}</div>;
  }

  const backText = {
    lv: "Atpakaļ",
    en: "Back"
  };

  return (
    <div className="min-h-screen flex flex-col bg-teal-500 text-cream">
      <SEO />
      <Header />
      <main className="flex-grow pt-24 pb-12">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-7xl mx-auto">
            <Link to={`/events/${category}`}>
              <Button variant="ghost" className="mb-4 text-cream hover:bg-teal-600/30">
                <ArrowLeft className="mr-2 h-4 w-4" />
                {backText[currentLanguage.code as keyof typeof backText]}
              </Button>
            </Link>
            
            <EventHeader 
              title={event.title}
              date={event.date}
              time={event.time}
              location={event.location}
              description={event.description}
            />

            {/* Standard tickets */}
            <OrganizerTickets />

            {/* User posted available tickets - now using AvailableTicketsSection */}
            <AvailableTicketsSection
              tickets={availableTickets}
              onPurchase={openPurchaseDialog}
            />
          </div>
        </div>
      </main>

      {/* Purchase Dialog */}
      <PurchaseDialog
        ticket={selectedTicket}
        isOpen={isPurchaseDialogOpen}
        onOpenChange={setIsPurchaseDialogOpen}
        onPurchaseConfirm={(ticket) => {
          purchaseTicket(ticket).then(success => {
            if (success && ticket) {
              handlePurchaseSuccess(ticket.id);
            }
          });
        }}
      />
      
      <Footer />
      <Toaster />
    </div>
  );
}
