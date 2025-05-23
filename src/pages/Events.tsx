
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
import { getCategoryDisplayName } from "@/utils/categoryMapping";

const categoryIcons: Record<string, React.FC<React.SVGProps<SVGSVGElement>>> = {
  "Teātris": Drama,
  "Theatre": Drama,
  "Teatras": Drama,
  "Teater": Drama,
  
  "Koncerti": Music,
  "Concerts": Music,
  "Koncertai": Music,
  "Kontserdid": Music,
  
  "Festivāli": PartyPopper,
  "Festivals": PartyPopper,
  "Festivaliai": PartyPopper,
  "Festivalid": PartyPopper,
  
  "Sports": Trophy,
  "Sportas": Trophy,
  "Sport": Trophy,
  
  "Kino": Film,
  "Cinema": Film,
  "Kinas": Film,
  
  "Bērniem": Baby,
  "For Children": Baby,
  "Vaikams": Baby,
  "Lastele": Baby,
  
  "Ceļojumi": Plane,
  "Travel": Plane,
  "Kelionės": Plane,
  "Reisimine": Plane,
  
  "Dāvanu kartes": Gift,
  "Gift Cards": Gift,
  "Dovanų kortelės": Gift,
  "Kinkekaardid": Gift,
  
  "Citi pasākumi": MoreHorizontal,
  "Other Events": MoreHorizontal,
  "Kiti renginiai": MoreHorizontal,
  "Muud üritused": MoreHorizontal
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
  "Citi pasākumi": "citi-pasakumi"
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
                  const categoryDisplayName = getCategoryDisplayName(category.name, currentLanguage.code);
                  const IconComponent = categoryIcons[categoryDisplayName] || MoreHorizontal;
                  // Get the correct URL slug for this category
                  const slug = categorySlugMap[category.name] || category.name.toLowerCase().replace(/\s+/g, '-');
                  
                  return (
                    <Link to={`/events/${slug}`} key={category.id}>
                      <Card className="h-full transition-transform hover:scale-105 bg-ticket-bg/50 border-2 border-ticket-accent backdrop-blur-sm shadow-lg">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <IconComponent className="h-6 w-6 text-ticket-accent" />
                            <span className="text-ticket-accent">{categoryDisplayName}</span>
                          </CardTitle>
                          <CardDescription className="text-ticket-text/80">
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
