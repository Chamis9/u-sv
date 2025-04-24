
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
  
  const event = category && eventId 
    ? categoryEvents[category]?.find(e => e.id === Number(eventId))
    : null;

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

  const buyTicketText = {
    lv: "Pirkt biļeti",
    en: "Buy ticket"
  };

  const availableText = {
    lv: "Pieejamas",
    en: "Available"
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-white via-gray-50 to-gray-100 dark:from-black dark:via-gray-900 dark:to-gray-800 text-gray-900 dark:text-white">
        <SEO />
        <Header />
        <main className="flex-grow pt-24 pb-12">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-7xl mx-auto">
              <div className="mb-6">
                <Link to={`/events/${category}`}>
                  <Button variant="ghost" className="mb-4">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    {backText[currentLanguage.code as keyof typeof backText]}
                  </Button>
                </Link>
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                  {event.title}
                </h1>
                <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400 mb-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-orange-500" />
                    {event.date} | {event.time}
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-orange-500" />
                    {event.location}
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-8">
                  {event.description}
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {mockTickets.map((ticket) => (
                  <Card key={ticket.id} className="flex flex-col bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border border-gray-200 dark:border-gray-800">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Ticket className="h-5 w-5 text-orange-500" />
                        {ticket.type}
                      </CardTitle>
                      <CardDescription>
                        {availableText[currentLanguage.code as keyof typeof availableText]}: {ticket.available}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-orange-500">
                        {ticket.price} €
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full" variant="orange">
                        {buyTicketText[currentLanguage.code as keyof typeof buyTicketText]}
                      </Button>
                    </CardFooter>
                  </Card>
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
