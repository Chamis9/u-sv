
import React from 'react';
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { useLanguage } from "@/features/language";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { GlobalThemeToggle } from "@/components/theme/GlobalThemeToggle";

const Events = () => {
  const { translations } = useLanguage();

  const sampleEvents = [
    {
      title: "Liepājas Simfoniskā orķestra koncerts",
      date: "2025-05-15",
      time: "19:00",
      location: "Lielais dzintars",
      description: "Klasiskās mūzikas koncerts ar pasaules līmeņa solistiem",
      price: "25-45"
    },
    {
      title: "Rīgas Ritmi 2025",
      date: "2025-06-20",
      time: "20:00",
      location: "Arēna Rīga",
      description: "Starptautiskais džeza festivāls",
      price: "30-60"
    },
    {
      title: "Latvijas Nacionālās operas izrāde",
      date: "2025-07-10",
      time: "18:30",
      location: "LNO",
      description: "G. Pučīni 'Turandota'",
      price: "20-80"
    }
  ];

  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-white via-gray-50 to-gray-100 dark:from-black dark:via-gray-900 dark:to-gray-800 text-gray-900 dark:text-white">
        <SEO />
        <Header />
        <main className="flex-grow pt-24 pb-12">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-7xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="text-orange-500">Pasākumi</span>
              </h1>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {sampleEvents.map((event, index) => (
                  <Card key={index} className="flex flex-col bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border border-gray-200 dark:border-gray-800">
                    <CardHeader>
                      <CardTitle>{event.title}</CardTitle>
                      <CardDescription>
                        <div className="flex items-center gap-2 text-orange-500">
                          <Calendar className="h-4 w-4" />
                          {event.date} | {event.time}
                        </div>
                        <div className="mt-1 text-gray-600 dark:text-gray-400">
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
                        <Button variant="outline">Pirkt biļeti</Button>
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
};

export default Events;
