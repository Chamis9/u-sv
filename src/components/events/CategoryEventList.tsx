
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

export function CategoryEventList() {
  const { category } = useParams<{ category: string }>();
  const { data: events, isLoading, error } = useEvents(category);
  const { currentLanguage } = useLanguage();
  const [availableTickets, setAvailableTickets] = useState<Record<string, UserTicket[]>>({});

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
      
      // Group tickets by event_id
      const ticketsByEvent: Record<string, UserTicket[]> = {};
      
      ticketsData.forEach(ticket => {
        const eventId = ticket.event_id || 'unassigned';
        if (!ticketsByEvent[eventId]) {
          ticketsByEvent[eventId] = [];
        }
        
        ticketsByEvent[eventId].push({
          id: ticket.id,
          title: ticket.description || "Ticket",
          description: ticket.description,
          category: ticket.category_id || "",
          price: ticket.price,
          event_id: ticket.event_id,
          status: 'available', // Fixed status as a literal
          file_path: ticket.file_path,
          created_at: ticket.created_at,
          seller_id: ticket.seller_id,
          buyer_id: ticket.buyer_id,
          owner_id: ticket.owner_id
        });
      });
      
      setAvailableTickets(ticketsByEvent);
    };
    
    if (category) {
      fetchAvailableTickets();
    }
  }, [category]);

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
                                {currentLanguage.code === 'lv' ? 'Pieejamās biļetes' : 'Available tickets'}
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
                                      {currentLanguage.code === 'lv' ? 'Aktīva' : 'Active'}
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
                              {currentLanguage.code === 'lv' ? 'Biļetes' : 'Tickets'}
                            </Button>
                          </Link>
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
        <Footer />
        <GlobalThemeToggle />
      </div>
    </ThemeProvider>
  );
}
