
import React from 'react';
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { useLanguage } from "@/features/language";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Globe, MapPin } from "lucide-react";

const Tickets = () => {
  const { translations } = useLanguage();

  const ticketCategories = [
    {
      title: "Teātris",
      description: "Dramaturģija, opera, balets",
      venues: ["Latvijas Nacionālā opera", "Dailes teātris", "JRT"],
      iconColor: "text-purple-500"
    },
    {
      title: "Koncerti",
      description: "Klasiskā mūzika, džezs, populārā mūzika",
      venues: ["Dzintaru koncertzāle", "Arēna Rīga", "Lielais dzintars"],
      iconColor: "text-orange-500"
    },
    {
      title: "Festivāli",
      description: "Mūzikas, mākslas un kultūras festivāli",
      venues: ["Lucavsala", "Mežaparks", "Līvu laukums"],
      iconColor: "text-green-500"
    }
  ];

  return (
    <ThemeProvider defaultTheme="light" disableToggle={false}>
      <div className="min-h-screen flex flex-col dark:bg-gray-900">
        <SEO />
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold mb-8 dark:text-white">Biļetes</h1>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {ticketCategories.map((category, index) => (
              <Card key={index} className="transition-transform hover:scale-105">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className={`h-6 w-6 ${category.iconColor}`} />
                    {category.title}
                  </CardTitle>
                  <CardDescription>
                    {category.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {category.venues.map((venue, vIndex) => (
                      <div key={vIndex} className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <MapPin className="h-4 w-4" />
                        {venue}
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">Skatīt piedāvājumu</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
};

export default Tickets;
