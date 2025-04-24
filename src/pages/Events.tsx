
import React from 'react';
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { useLanguage } from "@/features/language";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Theater, Music, Globe, Trophy, Film } from "lucide-react";
import { GlobalThemeToggle } from "@/components/theme/GlobalThemeToggle";
import { Link } from "react-router-dom";

const Events = () => {
  const { translations } = useLanguage();

  const categories = [
    {
      title: "Teātris",
      urlPath: "teatris",
      description: "Dramaturģija, opera, balets",
      venues: ["Latvijas Nacionālā opera", "Dailes teātris", "JRT"],
      iconColor: "text-purple-500",
      icon: Theater
    },
    {
      title: "Koncerti",
      urlPath: "koncerti",
      description: "Klasiskā mūzika, džezs, populārā mūzika",
      venues: ["Dzintaru koncertzāle", "Arēna Rīga", "Lielais dzintars"],
      iconColor: "text-orange-500",
      icon: Music
    },
    {
      title: "Festivāli",
      urlPath: "festivali",
      description: "Mūzikas, mākslas un kultūras festivāli",
      venues: ["Lucavsala", "Mežaparks", "Līvu laukums"],
      iconColor: "text-green-500",
      icon: Globe
    },
    {
      title: "Sports",
      urlPath: "sports",
      description: "Basketbols, hokejs, futbols",
      venues: ["Arena Riga", "Skonto stadions", "Daugavas stadions"],
      iconColor: "text-blue-500",
      icon: Trophy
    },
    {
      title: "Kino",
      urlPath: "kino",
      description: "Filmu seansi un festivāli",
      venues: ["Splendid Palace", "K.Suns", "Cinamon"],
      iconColor: "text-red-500",
      icon: Film
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
                  <Link 
                    to={`/events/${category.urlPath}`} 
                    key={index}
                    className="transition-transform hover:scale-[1.02]"
                  >
                    <Card className="h-full bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border border-gray-200 dark:border-gray-800">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <category.icon className={`h-6 w-6 ${category.iconColor}`} />
                          {category.title}
                        </CardTitle>
                        <CardDescription>
                          {category.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {category.venues.map((venue, vIndex) => (
                            <div key={vIndex} className="text-gray-600 dark:text-gray-400">
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
