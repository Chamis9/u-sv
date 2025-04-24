
import React from 'react';
import { useParams } from 'react-router-dom';
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin } from "lucide-react";
import { GlobalThemeToggle } from "@/components/theme/GlobalThemeToggle";

const categoryEvents = {
  "teātris": [
    {
      title: "Liepājas teātra viesizrāde",
      date: "2025-05-15",
      time: "19:00",
      location: "Dailes teātris",
      description: "Viesizrāde ar izciliem aktieriem",
      price: "25-45"
    },
    {
      title: "Hamlets",
      date: "2025-06-01",
      time: "19:30",
      location: "Latvijas Nacionālais teātris",
      description: "Šekspīra traģēdija",
      price: "20-50"
    },
    {
      title: "Romeo un Džuljeta",
      date: "2025-07-15",
      time: "19:00",
      location: "Dailes teātris",
      description: "Šekspīra traģēdija",
      price: "22-48"
    }
  ],
  "koncerti": [
    {
      title: "Rīgas Ritmi 2025",
      date: "2025-06-20",
      time: "20:00",
      location: "Arēna Rīga",
      description: "Starptautiskais džeza festivāls",
      price: "30-60"
    },
    {
      title: "Prāta Vētra",
      date: "2025-08-10",
      time: "21:00",
      location: "Mežaparks",
      description: "Latvijas populārākā grupa",
      price: "35-70"
    },
    {
      title: "Muzikāla pastaiga Jūrmalā",
      date: "2025-07-04",
      time: "19:00",
      location: "Dzintaru koncertzāle",
      description: "Klasiskās mūzikas koncerts",
      price: "20-50"
    }
  ],
  "festivāli": [
    {
      title: "Summer Sound",
      date: "2025-07-08",
      time: "12:00",
      location: "Liepāja",
      description: "Mūzikas festivāls",
      price: "40-80"
    },
    {
      title: "Positivus",
      date: "2025-07-16",
      time: "12:00",
      location: "Lucavsala",
      description: "Mūzikas festivāls",
      price: "50-90"
    }
  ],
  "sports": [
    {
      title: "Latvijas Basketbola līgas fināls",
      date: "2025-05-28",
      time: "19:00",
      location: "Arēna Rīga",
      description: "Spraiga spēle par čempionu titulu",
      price: "15-30"
    },
    {
      title: "Pasaules čempionāts hokejā",
      date: "2025-06-10",
      time: "20:00",
      location: "Arēna Rīga",
      description: "Atbalsti savu valsti!",
      price: "20-60"
    }
  ],
  "kino": [
    {
      title: "Filmu festivāls 'Baltijas Pērle'",
      date: "2025-09-01",
      time: "10:00",
      location: "Splendid Palace",
      description: "Labākās filmas no Baltijas reģiona",
      price: "7-12"
    },
    {
      title: "Kinolektorijs",
      date: "2025-06-15",
      time: "16:00",
      location: "K.Suns",
      description: "Lekcijas un filmu demonstrācijas",
      price: "5-10"
    }
  ]
};

const categoryTitles = {
  "teatris": "Teātris",
  "koncerti": "Koncerti",
  "festivali": "Festivāli",
  "sports": "Sports",
  "kino": "Kino"
};

const EventCategory = () => {
  const { category } = useParams();
  const normalizedCategory = category?.toLowerCase() || '';
  const categoryKey = normalizedCategory.replace(/[āā]/g, 'a').replace(/[īi]/g, 'i');
  const events = categoryEvents[categoryKey as keyof typeof categoryEvents] || [];
  const categoryTitle = categoryTitles[categoryKey as keyof typeof categoryTitles] || category;

  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-white via-gray-50 to-gray-100 dark:from-black dark:via-gray-900 dark:to-gray-800 text-gray-900 dark:text-white">
        <SEO title={`${categoryTitle} - Pasākumi`} />
        <Header />
        <main className="flex-grow pt-24 pb-12">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-7xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="text-orange-500">{categoryTitle}</span>
              </h1>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {events.map((event, index) => (
                  <Card key={index} className="flex flex-col bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border border-gray-200 dark:border-gray-800">
                    <CardHeader>
                      <CardTitle>{event.title}</CardTitle>
                      <CardDescription>
                        <div className="flex items-center gap-2 text-orange-500">
                          <Calendar className="h-4 w-4" />
                          {event.date} | {event.time}
                        </div>
                        <div className="mt-1 text-gray-600 dark:text-gray-400">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            {event.location}
                          </div>
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

export default EventCategory;
