
import React from 'react';
import { Link } from 'react-router-dom';
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { useLanguage } from "@/features/language";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Drama, Music, Film, Trophy, PartyPopper, Baby, Gift, MoreHorizontal } from "lucide-react";
import { GlobalThemeToggle } from "@/components/theme/GlobalThemeToggle";

const Events = () => {
  const { translations } = useLanguage();

  const categories = [
    {
      title: translations.events?.theatre || "Teātris",
      route: "theatre",
      icon: Drama,
      description: translations.events?.theatreDesc || "Dramaturģija, opera, balets",
      venues: ["Latvijas Nacionālā opera", "Dailes teātris", "JRT"]
    },
    {
      title: translations.events?.concerts || "Koncerti",
      route: "concerts",
      icon: Music,
      description: translations.events?.concertsDesc || "Klasiskā mūzika, džezs, populārā mūzika",
      venues: ["Dzintaru koncertzāle", "Arēna Rīga", "Lielais dzintars"]
    },
    {
      title: translations.events?.festivals || "Festivāli",
      route: "festivals",
      icon: PartyPopper,
      description: translations.events?.festivalsDesc || "Mūzikas, mākslas un kultūras festivāli",
      venues: ["Lucavsala", "Mežaparks", "Līvu laukums"]
    },
    {
      title: translations.events?.sports || "Sports",
      route: "sports",
      icon: Trophy,
      description: translations.events?.sportsDesc || "Basketbols, hokejs, futbols",
      venues: ["Arēna Rīga", "Daugavas stadions", "Skonto stadions"]
    },
    {
      title: translations.events?.cinema || "Kino",
      route: "cinema",
      icon: Film,
      description: translations.events?.cinemaDesc || "Filmu festivāli, pirmizrādes, kinoteātri",
      venues: ["Splendid Palace", "K.Suns", "Kino Citadele"]
    },
    {
      title: translations.events?.children || "Bērniem",
      route: "children",
      icon: Baby,
      description: translations.events?.childrenDesc || "Izrādes un pasākumi bērniem",
      venues: ["Latvijas Leļļu teātris", "VEF Kultūras pils", "Rīgas Cirks"]
    },
    {
      title: translations.events?.giftCards || "Dāvanu kartes",
      route: "gift-cards",
      icon: Gift,
      description: translations.events?.giftCardsDesc || "Dāvanu kartes pasākumiem",
      venues: ["Biļešu serviss", "Biļešu paradīze"]
    },
    {
      title: translations.events?.other || "Citi",
      route: "other",
      icon: MoreHorizontal,
      description: translations.events?.otherDesc || "Citi pasākumi",
      venues: ["Dažādas norises vietas"]
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
                {categories.map((category, index) => (
                  <Link to={`/events/${category.route}`} key={index}>
                    <Card className="h-full transition-transform hover:scale-105 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border border-gray-200 dark:border-gray-800">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <category.icon className="h-6 w-6 text-orange-500" />
                          {category.title}
                        </CardTitle>
                        <CardDescription>
                          {category.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {category.venues.map((venue, vIndex) => (
                            <div key={vIndex} className="text-sm text-gray-600 dark:text-gray-400">
                              {venue}
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
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
