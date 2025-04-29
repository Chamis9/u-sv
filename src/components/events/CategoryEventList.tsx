import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, MapPin, Ticket } from "lucide-react";
import { useLanguage } from "@/features/language";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { GlobalThemeToggle } from "@/components/theme/GlobalThemeToggle";
import { useEvents } from '@/hooks/useEvents';
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { UserTicket } from "@/hooks/tickets/types";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";

export function CategoryEventList() {
  const { category } = useParams<{ category: string }>();
  const { data: events, isLoading, error } = useEvents(category);
  const { currentLanguage } = useLanguage();
  const [availableTickets, setAvailableTickets] = useState<Record<string, UserTicket[]>>({});
  const [allCategoryTickets, setAllCategoryTickets] = useState<UserTicket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<UserTicket | null>(null);
  const [isPurchaseDialogOpen, setIsPurchaseDialogOpen] = useState(false);

  // Fetch available tickets for this category
  useEffect(() => {
    const fetchAvailableTickets = async () => {
      const categoryId = getCategoryIdFromName(category || '');
      
      const { data: ticketsData, error } = await supabase
        .from('tickets')
        .select('*')
        .eq('status', 'available')
        .eq('category_id', categoryId);
      
      if (error) {
        console.error('Error fetching available tickets:', error);
        return;
      }
      
      // Transform the data to match UserTicket type
      const formattedTickets: UserTicket[] = ticketsData.map(ticket => ({
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
      
      // Group tickets by event_id
      const ticketsByEvent: Record<string, UserTicket[]> = {};
      
      formattedTickets.forEach(ticket => {
        const eventId = ticket.event_id || 'unassigned';
        if (!ticketsByEvent[eventId]) {
          ticketsByEvent[eventId] = [];
        }
        
        ticketsByEvent[eventId].push(ticket);
      });
      
      setAvailableTickets(ticketsByEvent);
      setAllCategoryTickets(formattedTickets);
    };
    
    if (category) {
      fetchAvailableTickets();
    }
  }, [category]);

  const purchaseTicket = async (ticket: UserTicket) => {
    try {
      // Get the current user's ID
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData.user?.id;
      
      if (!userId) {
        throw new Error("No authenticated user found");
      }

      // Update the ticket status in the database
      const { error } = await supabase
        .from('tickets')
        .update({ 
          status: 'sold', 
          buyer_id: userId 
        })
        .eq('id', ticket.id);

      if (error) {
        throw error;
      }

      // Remove the purchased ticket from state
      const updatedAllTickets = allCategoryTickets.filter(t => t.id !== ticket.id);
      setAllCategoryTickets(updatedAllTickets);
      
      // Update the grouped tickets as well
      const updatedTicketsByEvent = { ...availableTickets };
      if (ticket.event_id && updatedTicketsByEvent[ticket.event_id]) {
        updatedTicketsByEvent[ticket.event_id] = updatedTicketsByEvent[ticket.event_id].filter(
          t => t.id !== ticket.id
        );
      }
      setAvailableTickets(updatedTicketsByEvent);
      
      setIsPurchaseDialogOpen(false);
      
      toast({
        title: currentLanguage.code === 'lv' ? "Biļete nopirkta!" : "Ticket purchased!",
        description: currentLanguage.code === 'lv' 
          ? "Biļete ir veiksmīgi pievienota jūsu kontam" 
          : "The ticket has been successfully added to your account",
        variant: "default"
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

  const backButtonText = {
    lv: "Atpakaļ",
    en: "Back"
  };

  // Helper function to get category ID from name
  const getCategoryIdFromName = (name: string): string => {
    switch(name.toLowerCase()) {
      case 'teatris':
      case 'theatre':
        return 'theatre';
      case 'koncerti':
      case 'concerts':
        return 'concerts';
      case 'sports':
        return 'sports';
      default:
        return name;
    }
  };

  const t = (lv: string, en: string) => currentLanguage.code === 'lv' ? lv : en;

  if (error) {
    return (
      <div className="text-center p-8">
        {currentLanguage.code === 'lv' ? 'Kļūda ielādējot datus' : 'Error loading data'}
      </div>
    );
  }

  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-white via-gray-50 to-gray-100 dark:from-black dark:via-gray-900 dark:to-gray-800 text-gray-900 dark:text-white">
        <SEO />
        <Header />
        <main className="flex-grow pt-24 pb-12">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-7xl mx-auto">
              <div className="mb-6">
                <Link to="/events">
                  <Button variant="ghost" className="mb-4">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    {backButtonText[currentLanguage.code as keyof typeof backButtonText]}
                  </Button>
                </Link>
              </div>
              
              {/* All Available Tickets Section */}
              {allCategoryTickets.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-2xl font-bold mb-4">
                    {t("Pieejamās biļetes", "Available Tickets")}
                  </h2>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {allCategoryTickets.map((ticket) => (
                      <Card key={ticket.id} className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border border-gray-200 dark:border-gray-800">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Ticket className="h-5 w-5 text-orange-500" />
                            {ticket.title}
                          </CardTitle>
                          {ticket.description && (
                            <CardDescription>
                              {ticket.description}
                            </CardDescription>
                          )}
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-orange-500">
                            {ticket.price} €
                          </div>
                        </CardContent>
                        <CardFooter>
                          <Button 
                            onClick={() => openPurchaseDialog(ticket)} 
                            variant="orange" 
                            className="w-full"
                          >
                            {t("Pirkt biļeti", "Buy Ticket")}
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              <h2 className="text-2xl font-bold mb-4">
                {t("Pasākumi", "Events")}
              </h2>
              
              {isLoading ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 animate-pulse">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-64 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
                  ))}
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {events?.map((event) => (
                    <Card key={event.id} className="flex flex-col bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border border-gray-200 dark:border-gray-800">
                      <CardHeader>
                        <CardTitle>{event.title}</CardTitle>
                        <CardDescription>
                          <div className="flex items-center gap-2 text-orange-500">
                            <Calendar className="h-4 w-4" />
                            {new Date(event.start_date).toLocaleDateString(currentLanguage.code)}
                          </div>
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600 dark:text-gray-400">
                          {event.description}
                        </p>
                        
                        {/* Display available tickets if any */}
                        {availableTickets[event.id]?.length > 0 && (
                          <div className="mt-4">
                            <div className="flex items-center gap-2 mb-2">
                              <Ticket className="h-4 w-4 text-green-500" />
                              <span className="font-medium">
                                {t('Pieejamās biļetes', 'Available tickets')}
                              </span>
                            </div>
                            
                            <div className="space-y-2">
                              {availableTickets[event.id].map((ticket) => (
                                <div key={ticket.id} className="flex justify-between items-center p-2 border border-gray-200 dark:border-gray-700 rounded-md">
                                  <div>
                                    <div className="font-medium">{ticket.title}</div>
                                    <div className="text-sm text-gray-500">{ticket.description}</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="font-bold">{ticket.price} €</div>
                                    <Badge className="bg-green-500">
                                      {t('Aktīva', 'Active')}
                                    </Badge>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                      <CardFooter className="mt-auto">
                        <div className="flex justify-between items-center w-full">
                          <span className="text-lg font-semibold">
                            {event.price_range ? `${event.price_range[0]} - ${event.price_range[1]} €` : ''}
                          </span>
                          <Link to={`/events/${category}/${event.id}`}>
                            <Button variant="outline">
                              <Ticket className="mr-2 h-4 w-4" />
                              {t('Biļetes', 'Tickets')}
                            </Button>
                          </Link>
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}

              {/* No tickets found message */}
              {!isLoading && events?.length === 0 && allCategoryTickets.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-xl text-gray-600 dark:text-gray-400">
                    {t('Šajā kategorijā nav pieejami pasākumi vai biļetes', 'No events or tickets available in this category')}
                  </p>
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
                variant="orange" 
                onClick={() => selectedTicket && purchaseTicket(selectedTicket)}
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
