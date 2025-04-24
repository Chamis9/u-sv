
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
import { categoryEvents, categoryTitles, backButtonText } from '@/utils/eventData';

export function CategoryEventList() {
  const { category } = useParams<{ category: string }>();
  const events = category ? categoryEvents[category] : [];
  const { currentLanguage } = useLanguage();
  const categoryTitle = category ? categoryTitles[category][currentLanguage.code] : "";

  if (!events) {
    const notFoundText = {
      lv: "Kategorija nav atrasta",
      en: "Category not found"
    };
    return <div className="text-center p-8">{notFoundText[currentLanguage.code as keyof typeof notFoundText]}</div>;
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
                <h1 className="text-4xl md:text-5xl font-bold">
                  <span className="text-orange-500">{categoryTitle}</span>
                </h1>
              </div>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {events.map((event) => (
                  <Card key={event.id} className="flex flex-col bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border border-gray-200 dark:border-gray-800">
                    <CardHeader>
                      <CardTitle>{event.title}</CardTitle>
                      <CardDescription>
                        <div className="flex items-center gap-2 text-orange-500">
                          <Calendar className="h-4 w-4" />
                          {event.date} | {event.time}
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-gray-600 dark:text-gray-400">
                          <MapPin className="h-4 w-4" />
                          {event.location}
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
                          {event.price} €
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
            </div>
          </div>
        </main>
        <Footer />
        <GlobalThemeToggle />
      </div>
    </ThemeProvider>
  );
}
