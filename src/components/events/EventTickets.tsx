
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Ticket } from "lucide-react";
import { useLanguage } from "@/features/language";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { GlobalThemeToggle } from "@/components/theme/GlobalThemeToggle";
import { categoryEvents } from '@/utils/eventData';
import { EventHeader } from './components/EventHeader';
import { TicketCard } from './components/TicketCard';
import { supabase } from "@/integrations/supabase/client";
import { UserTicket } from "@/hooks/tickets";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";

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
  const { category, eventId } = useParams<{ category: string; eventId: string }>();
  const { currentLanguage } = useLanguage();
  const [availableTickets, setAvailableTickets] = useState<UserTicket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<UserTicket | null>(null);
  const [isPurchaseDialogOpen, setIsPurchaseDialogOpen] = useState(false);
  
  const event = category && eventId 
    ? categoryEvents[category]?.find(e => e.id === Number(eventId))
    : null;

  useEffect(() => {
    const fetchAvailableTickets = async () => {
      // Get available tickets that match this event
      const { data, error } = await supabase
        .from('tickets')
        .select('*')
        .eq('status', 'available')
        .eq('event_id', eventId);

      if (error) {
        console.error("Error fetching available tickets:", error);
        return;
      }

      // Transform to UserTicket format
      const formattedTickets: UserTicket[] = data.map(ticket => ({
        id: ticket.id,
        title: ticket.description || "Ticket",
        description: ticket.description,
        category: ticket.category_id || "",
        price: ticket.price,
        event_id: ticket.event_id,
        status: 'available' as const, // Type assertion to match UserTicket.status
        file_path: ticket.file_path,
        created_at: ticket.created_at,
        seller_id: ticket.seller_id,
        buyer_id: ticket.buyer_id,
        owner_id: ticket.owner_id
      }));

      setAvailableTickets(formattedTickets);
    };

    if (eventId) {
      fetchAvailableTickets();
    }
  }, [eventId]);

  const purchaseTicket = async (ticket: UserTicket) => {
    try {
      // Update the ticket status in the database
      const { error } = await supabase
        .from('tickets')
        .update({ 
          status: 'sold',
          buyer_id: supabase.auth.getUser().then(({ data }) => data.user?.id) 
        })
        .eq('id', ticket.id);

      if (error) {
        throw error;
      }

      // Remove the purchased ticket from state
      setAvailableTickets(prev => prev.filter(t => t.id !== ticket.id));
      setIsPurchaseDialogOpen(false);
      
      toast({
        title: currentLanguage.code === 'lv' ? "Biļete nopirkta!" : "Ticket purchased!",
        description: currentLanguage.code === 'lv' 
          ? "Biļete ir veiksmīgi pievienota jūsu kontam" 
          : "The ticket has been successfully added to your account",
        variant: "success"
      });
    } catch (error) {
      console.error("Error purchasing ticket:", error);
      toast({
        title: currentLanguage.code === 'lv' ? "Kļūda" : "Error",
        description: currentLanguage.code === 'lv'
          ? "Neizdevās iegādāties biļeti. Lūdzu, mēģiniet vēlreiz."
          : "Failed to purchase ticket. Please try again.",
        variant: "destructive"
      });
    }
  };

  const openPurchaseDialog = (ticket: UserTicket) => {
    setSelectedTicket(ticket);
    setIsPurchaseDialogOpen(true);
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

  const t = (lv: string, en: string) => currentLanguage.code === 'lv' ? lv : en;

  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-white via-gray-50 to-gray-100 dark:from-black dark:via-gray-900 dark:to-gray-800 text-gray-900 dark:text-white">
        <SEO />
        <Header />
        <main className="flex-grow pt-24 pb-12">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-7xl mx-auto">
              <Link to={`/events/${category}`}>
                <Button variant="ghost" className="mb-4">
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
              <div className="mt-8 mb-4">
                <h2 className="text-2xl font-semibold mb-4">
                  {t("Biļetes no organizatora", "Tickets from organizer")}
                </h2>
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

              {/* User posted available tickets */}
              {availableTickets.length > 0 && (
                <div className="mt-8">
                  <h2 className="text-2xl font-semibold mb-4">
                    {t("Pieejamās biļetes no lietotājiem", "User submitted tickets")}
                  </h2>
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {availableTickets.map((ticket) => (
                      <div key={ticket.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 border border-gray-200 dark:border-gray-700">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-lg">{ticket.title}</h3>
                            {ticket.description && (
                              <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">{ticket.description}</p>
                            )}
                          </div>
                          <div className="text-lg font-bold">{ticket.price} €</div>
                        </div>
                        
                        <div className="mt-4 flex justify-end">
                          <Button onClick={() => openPurchaseDialog(ticket)}>
                            <Ticket className="mr-2 h-4 w-4" />
                            {t("Pirkt biļeti", "Buy ticket")}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>

        {/* Purchase Dialog */}
        <Dialog open={isPurchaseDialogOpen} onOpenChange={setIsPurchaseDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t("Biļetes pirkšana", "Purchase Ticket")}</DialogTitle>
              <DialogDescription>
                {t("Vai vēlaties iegādāties šo biļeti?", "Do you want to purchase this ticket?")}
              </DialogDescription>
            </DialogHeader>
            
            {selectedTicket && (
              <div className="py-4">
                <h3 className="font-medium">{selectedTicket.title}</h3>
                {selectedTicket.description && (
                  <p className="text-sm text-gray-500 mt-1">{selectedTicket.description}</p>
                )}
                <p className="text-xl font-bold mt-2">{selectedTicket.price} €</p>
              </div>
            )}
            
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setIsPurchaseDialogOpen(false)}
              >
                {t("Atcelt", "Cancel")}
              </Button>
              <Button 
                onClick={() => selectedTicket && purchaseTicket(selectedTicket)}
                variant="orange"
              >
                {t("Apstiprināt pirkumu", "Confirm Purchase")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        <Footer />
        <GlobalThemeToggle />
      </div>
    </ThemeProvider>
  );
}
