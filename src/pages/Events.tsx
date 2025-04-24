
import React from 'react';
import { Link } from 'react-router-dom';
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { useLanguage } from "@/features/language";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Theater, Music, Film, Calendar, Activity } from "lucide-react";
import { GlobalThemeToggle } from "@/components/theme/GlobalThemeToggle";

const Events = () => {
  const { translations } = useLanguage();

  const categories = [
    {
      title: "Teātris",
      route: "theatre",
      icon: Theater,
      description: "Dramaturģija, opera, balets",
      venues: ["Latvijas Nacionālā opera", "Dailes teātris", "JRT"]
    },
    {
      title: "Koncerti",
      route: "concerts",
      icon: Music,
      description: "Klasiskā mūzika, džezs, populārā mūzika",
      venues: ["Dzintaru koncertzāle", "Arēna Rīga", "Lielais dzintars"]
    },
    {
      title: "Festivāli",
      route: "festivals",
      icon: Calendar,
      description: "Mūzikas, mākslas un kultūras festivāli",
      venues: ["Lucavsala", "Mežaparks", "Līvu laukums"]
    },
    {
      title: "Sports",
      route: "sports",
      icon: Activity,
      description: "Basketbols, hokejs, futbols",
      venues: ["Arēna Rīga", "Daugavas stadions", "Skonto stadions"]
    },
    {
      title: "Kino",
      route: "cinema",
      icon: Film,
      description: "Filmu festivāli, pirmizrādes, kinoteātri",
      venues: ["Splendid Palace", "K.Suns", "Kino Citadele"]
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
