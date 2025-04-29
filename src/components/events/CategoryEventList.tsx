
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
import { useFilteredEvents } from '@/hooks/useFilteredEvents';
import { Badge } from '@/components/ui/badge';

export function CategoryEventList() {
  const { categoryId } = useParams<{ categoryId: string }>();
  // Get both official events and user listings
  const { data: events, isLoading, error } = useFilteredEvents({ 
    categoryId,
    includeUserListings: true 
  });
  const { currentLanguage } = useLanguage();

  const backButtonText = {
    lv: "Atpakaļ",
    en: "Back"
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
                        <div className="flex justify-between items-start">
                          <CardTitle>{event.title}</CardTitle>
                          {event.status === 'temp_listing' && (
                            <Badge className="bg-orange-500">
                              {currentLanguage.code === 'lv' ? 'Lietotāja biļete' : 'User ticket'}
                            </Badge>
                          )}
                        </div>
                        <CardDescription>
                          <div className="flex items-center gap-2 text-orange-500">
                            <Calendar className="h-4 w-4" />
                            {new Date(event.start_date).toLocaleDateString(currentLanguage.code)}
                          </div>
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600 dark:text-gray-400 line-clamp-3">
                          {event.description}
                        </p>
                        {event.ticketCount > 0 && (
                          <div className="mt-4 text-sm font-medium text-orange-500">
                            {event.ticketCount} {currentLanguage.code === 'lv' ? 'biļetes pieejamas' : 'tickets available'}
                          </div>
                        )}
                      </CardContent>
                      <CardFooter className="mt-auto">
                        <div className="flex justify-between items-center w-full">
                          <span className="text-lg font-semibold">
                            {event.price_range ? `${event.price_range.lower} - ${event.price_range.upper} €` : ''}
                          </span>
                          <Link to={`/events/${categoryId}/${event.id}`}>
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

              {events && events.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-lg text-gray-600 dark:text-gray-400">
                    {currentLanguage.code === 'lv' 
                      ? "Nav atrasti pasākumi šajā kategorijā" 
                      : "No events found in this category"}
                  </p>
                  <Link to="/profile" className="mt-4 inline-block">
                    <Button>
                      {currentLanguage.code === 'lv' 
                        ? "Pievienot savu biļeti" 
                        : "Add your ticket"}
                    </Button>
                  </Link>
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
