
import React from 'react';
import { Link } from 'react-router-dom';
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { useLanguage } from "@/features/language";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Globe, MapPin, Trophy, Music, Drama, PartyPopper } from "lucide-react";

const Tickets = () => {
  const { translations } = useLanguage();

  const ticketCategories = [
    {
      title: "Teātris",
      description: "Dramaturģija, opera, balets",
      venues: ["Latvijas Nacionālā opera", "Dailes teātris", "JRT"],
      iconColor: "text-ticket-accent",
      icon: Drama,
      route: "teatris"
    },
    {
      title: "Koncerti",
      description: "Klasiskā mūzika, džezs, populārā mūzika",
      venues: ["Dzintaru koncertzāle", "Arēna Rīga", "Lielais dzintars"],
      iconColor: "text-ticket-accent",
      icon: Music,
      route: "koncerti"
    },
    {
      title: "Festivāli",
      description: "Mūzikas, mākslas un kultūras festivāli",
      venues: ["Lucavsala", "Mežaparks", "Līvu laukums"],
      iconColor: "text-ticket-accent",
      icon: PartyPopper,
      route: "festivali"
    },
    {
      title: "Sports",
      description: "Basketbols, futbols, hokejs, teniss",
      venues: ["Arēna Rīga", "Daugavas stadions", "Skonto stadions"],
      iconColor: "text-ticket-accent",
      icon: Trophy,
      route: "sports"
    }
  ];

  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col bg-ticket-bg text-ticket-text">
        <SEO />
        <Header />
        <main className="flex-grow pt-24 pb-12">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-7xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="text-ticket-accent">Biļetes</span>
              </h1>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {ticketCategories.map((category, index) => (
                  <Link to={`/events/${category.route}`} key={index}>
                    <Card className="flex flex-col bg-ticket-bg/50 backdrop-blur-sm border-2 border-ticket-accent hover:shadow-md transition-shadow">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <category.icon className={`h-6 w-6 ${category.iconColor}`} />
                          {category.title}
                        </CardTitle>
                        <CardDescription className="text-ticket-text/70">
                          {category.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {category.venues.map((venue, vIndex) => (
                            <div key={vIndex} className="flex items-center gap-2 text-ticket-text/60">
                              <MapPin className="h-4 w-4" />
                              {venue}
                            </div>
                          ))}
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button className="w-full bg-ticket-accent hover:bg-ticket-accent/80 text-ticket-check">Skatīt piedāvājumu</Button>
                      </CardFooter>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
};

export default Tickets;
