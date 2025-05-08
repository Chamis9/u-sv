
import React from 'react';
import { Link } from 'react-router-dom';
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { useLanguage } from "@/features/language";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Drama, Music, Film, Trophy, PartyPopper, Baby, Gift, MoreHorizontal, Plane, Ticket } from "lucide-react";
import { useCategories } from '@/hooks/useCategories';
import { Badge } from '@/components/ui/badge';

const categoryIcons: Record<string, React.FC<React.SVGProps<SVGSVGElement>>> = {
  "Teātris": Drama,
  "Koncerti": Music,
  "Festivāli": PartyPopper,
  "Sports": Trophy,
  "Kino": Film,
  "Bērniem": Baby,
  "Ceļojumi": Plane,
  "Dāvanu kartes": Gift,
  "Citi pasākumi": MoreHorizontal
};

// Map category names to URL slugs
const categorySlugMap: Record<string, string> = {
  "Teātris": "teatris",
  "Koncerti": "koncerti",
  "Festivāli": "festivali",
  "Sports": "sports",
  "Kino": "kino",
  "Bērniem": "berniem",
  "Ceļojumi": "celojumi",
  "Dāvanu kartes": "davanu-kartes",
  "Citi pasākumi": "citi-pasākumi"
};

const Events = () => {
  const { translations, currentLanguage } = useLanguage();
  const { data: categories, isLoading: categoriesLoading } = useCategories();
  
  const t = (lv: string, en: string) => currentLanguage.code === 'lv' ? lv : en;

  if (categoriesLoading) {
    return (
      <ThemeProvider>
        <div className="min-h-screen flex flex-col bg-ticket-bg">
          <SEO />
          <Header />
          <main className="flex-grow pt-24 pb-12">
            <div className="container mx-auto px-4">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 animate-pulse">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-48 bg-ticket-text/10 rounded-lg"></div>
                ))}
              </div>
            </div>
          </main>
          <Footer />
        </div>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col bg-ticket-bg text-ticket-text">
        <SEO />
        <Header />
        <main className="flex-grow pt-24 pb-12">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-7xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="text-ticket-accent">
                  {translations.events?.title || "Biļetes"}
                </span>
              </h1>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {categories?.map((category) => {
                  const IconComponent = categoryIcons[category.name as keyof typeof categoryIcons] || MoreHorizontal;
                  // Get the correct URL slug for this category
                  const slug = categorySlugMap[category.name] || category.name.toLowerCase().replace(/\s+/g, '-');
                  
                  return (
                    <Link to={`/events/${slug}`} key={category.id}>
                      <Card className="h-full transition-all hover:scale-105 bg-ticket-bg/70 border border-ticket-text/20 shadow-lg backdrop-blur-md hover:shadow-xl hover:border-ticket-text/40">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-ticket-accent">
                            <IconComponent className="h-6 w-6" />
                            {category.name}
                          </CardTitle>
                          <CardDescription className="text-ticket-text/90 font-medium">
                            {category.description}
                          </CardDescription>
                        </CardHeader>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
};

export default Events;
