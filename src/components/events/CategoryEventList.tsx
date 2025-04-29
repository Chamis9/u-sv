
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, MapPin, Ticket, User } from "lucide-react";
import { useLanguage } from "@/features/language";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { GlobalThemeToggle } from "@/components/theme/GlobalThemeToggle";
import { useEvents } from '@/hooks/useEvents';
import { useUserTickets } from '@/hooks/useUserTickets';
import { format } from 'date-fns';

export function CategoryEventList() {
  const { category } = useParams<{ category: string }>();
  const { data: events, isLoading: isLoadingEvents, error } = useEvents(category);
  const { allTickets, isLoadingAll } = useUserTickets();
  const { currentLanguage } = useLanguage();

  const backButtonText = {
    lv: "Atpakaļ",
    en: "Back"
  };

  // Get tickets for the current category
  const categoryTickets = category ? 
    allTickets?.filter(ticket => ticket.category.toLowerCase() === category.toLowerCase()) : 
    [];
  
  const isLoading = isLoadingEvents || isLoadingAll;

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
                <>
                  {/* Regular events from the events table */}
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

                  {/* User-added tickets */}
                  {categoryTickets && categoryTickets.length > 0 && (
                    <>
                      <h2 className="text-2xl font-bold mt-12 mb-6">
                        {currentLanguage.code === 'lv' ? 'Lietotāju piedāvātās biļetes' : 'User tickets'}
                      </h2>
                      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {categoryTickets.map((ticket) => (
                          <Card key={ticket.id} className="flex flex-col bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border border-gray-200 dark:border-gray-800">
                            {ticket.image_url && (
                              <img 
                                src={ticket.image_url} 
                                alt={ticket.title} 
                                className="w-full h-48 object-cover"
                              />
                            )}
                            <CardHeader>
                              <CardTitle>{ticket.title}</CardTitle>
                              <CardDescription>
                                <div className="flex items-center gap-2">
                                  <User className="h-4 w-4 text-orange-500" />
                                  {currentLanguage.code === 'lv' ? 'Lietotāja biļete' : 'User ticket'}
                                </div>
                                {ticket.event_date && (
                                  <div className="flex items-center gap-2 mt-1">
                                    <Calendar className="h-4 w-4 text-orange-500" />
                                    {format(new Date(ticket.event_date), 'PPP')}
                                  </div>
                                )}
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              <p className="text-gray-600 dark:text-gray-400 line-clamp-2">
                                {ticket.description || 
                                  (currentLanguage.code === 'lv' ? 'Nav apraksta' : 'No description')}
                              </p>
                            </CardContent>
                            <CardFooter className="mt-auto">
                              <div className="flex justify-between items-center w-full">
                                <div>
                                  <span className="text-lg font-semibold">
                                    {ticket.price} €
                                  </span>
                                  <div className="text-sm text-gray-500">
                                    {currentLanguage.code === 'lv' ? 'Pieejams' : 'Available'}: {ticket.quantity}
                                  </div>
                                </div>
                                <Button variant="outline">
                                  <Ticket className="mr-2 h-4 w-4" />
                                  {currentLanguage.code === 'lv' ? 'Skatīt' : 'View'}
                                </Button>
                              </div>
                            </CardFooter>
                          </Card>
                        ))}
                      </div>
                    </>
                  )}

                  {events?.length === 0 && (!categoryTickets || categoryTickets.length === 0) && (
                    <div className="text-center py-12">
                      <p className="text-lg text-gray-600 dark:text-gray-400">
                        {currentLanguage.code === 'lv' 
                          ? "Nav atrasti pasākumi šajā kategorijā" 
                          : "No events found in this category"}
                      </p>
                    </div>
                  )}
                </>
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
