
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
import { getLocalizedCategoryName, getLocalizedCategoryDescription } from '@/utils/categoryLocalization';
import { Badge } from '@/components/ui/badge';

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

// Map category names to URL slugs (using base Latvian names for consistency)
const categorySlugMap: Record<string, string> = {
  "Teātris": "teatris",
  "Theatre": "teatris",
  "Teatras": "teatris",
  "Teater": "teatris",
  "Koncerti": "koncerti",
  "Concerts": "koncerti",
  "Koncertai": "koncerti",
  "Kontserdid": "koncerti",
  "Festivāli": "festivali",
  "Festivals": "festivali",
  "Festivaliai": "festivali",
  "Festivalid": "festivali",
  "Sports": "sports",
  "Sportas": "sports",
  "Sport": "sports",
  "Kino": "kino",
  "Cinema": "kino",
  "Kinas": "kino",
  "Bērniem": "berniem",
  "For Children": "berniem",
  "Vaikams": "berniem",
  "Lastele": "berniem",
  "Ceļojumi": "celojumi",
  "Travel": "celojumi",
  "Kelionės": "celojumi",
  "Reisimine": "celojumi",
  "Dāvanu kartes": "davanu-kartes",
  "Gift Cards": "davanu-kartes",
  "Dovanų kortelės": "davanu-kartes",
  "Kinkekaardid": "davanu-kartes",
  "Citi pasākumi": "citi-pasākumi",
  "Other Events": "citi-pasākumi",
  "Kiti renginiai": "citi-pasākumi",
  "Muud üritused": "citi-pasākumi"
};

const Tickets = () => {
  const { translations, currentLanguage } = useLanguage();
  const { data: categories, isLoading: categoriesLoading } = useCategories();
  
  const t = (lv: string, en: string) => currentLanguage.code === 'lv' ? lv : en;

  // Debug function to check category data
  React.useEffect(() => {
    if (categories) {
      console.log('Categories data:', categories);
      categories.forEach(category => {
        console.log(`Category: ${category.name}`, {
          name_lv: category.name_lv,
          name_en: category.name_en,
          name_lt: category.name_lt,
          name_ee: category.name_ee,
          localizedName: getLocalizedCategoryName(category, currentLanguage.code)
        });
      });
    }
  }, [categories, currentLanguage.code]);

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
                  const localizedName = getLocalizedCategoryName(category, currentLanguage.code);
                  const localizedDescription = getLocalizedCategoryDescription(category, currentLanguage.code);
                  const IconComponent = categoryIcons[localizedName] || categoryIcons[category.name] || MoreHorizontal;
                  // Get the correct URL slug for this category (always use base slug for consistency)
                  const slug = categorySlugMap[category.name] || category.name.toLowerCase().replace(/\s+/g, '-');
                  
                  return (
                    <Link to={`/${currentLanguage.code}/events/${slug}`} key={category.id}>
                      <Card className="h-full transition-transform hover:scale-105 bg-ticket-bg/50 border-2 border-ticket-accent backdrop-blur-sm shadow-lg">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <IconComponent className="h-6 w-6 text-ticket-accent" />
                            <span className="text-ticket-accent">{localizedName}</span>
                          </CardTitle>
                          <CardDescription className="text-ticket-text/80">
                            {localizedDescription}
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

export default Tickets;
