
import React from 'react';
import { Ticket } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/features/language";

interface TicketCardProps {
  type: string;
  price: number;
  available: number;
  category?: string;
}

export const TicketCard: React.FC<TicketCardProps> = ({
  type,
  price,
  available,
  category
}) => {
  const { currentLanguage } = useLanguage();
  
  const t = (lv: string, en: string, lt: string, ee: string) => {
    switch (currentLanguage.code) {
      case 'lv': return lv;
      case 'en': return en;
      case 'lt': return lt;
      case 'et':
      case 'ee': return ee;
      default: return lv;
    }
  };

  // Function to get localized category name
  const getLocalizedCategory = (categoryName?: string) => {
    if (!categoryName) return '';
    
    switch (categoryName.toLowerCase()) {
      case 'teātris':
      case 'theatre':
      case 'teatras':
      case 'teater':
        return t('Teātris', 'Theatre', 'Teatras', 'Teater');
      case 'koncerti':
      case 'concerts':
      case 'koncertai':
      case 'kontserdid':
        return t('Koncerti', 'Concerts', 'Koncertai', 'Kontserdid');
      case 'festivāli':
      case 'festivals':
      case 'festivaliai':
      case 'festivalid':
        return t('Festivāli', 'Festivals', 'Festivaliai', 'Festivalid');
      case 'sports':
      case 'sportas':
      case 'sport':
        return t('Sports', 'Sports', 'Sportas', 'Sport');
      case 'kino':
      case 'cinema':
      case 'kinas':
        return t('Kino', 'Cinema', 'Kinas', 'Kino');
      case 'bērniem':
      case 'for children':
      case 'vaikams':
      case 'lastele':
        return t('Bērniem', 'For Children', 'Vaikams', 'Lastele');
      case 'ceļojumi':
      case 'travel':
      case 'kelionės':
      case 'reisimine':
        return t('Ceļojumi', 'Travel', 'Kelionės', 'Reisimine');
      case 'dāvanu kartes':
      case 'gift cards':
      case 'dovanų kortelės':
      case 'kinkekaardid':
        return t('Dāvanu kartes', 'Gift Cards', 'Dovanų kortelės', 'Kinkekaardid');
      case 'citi pasākumi':
      case 'other events':
      case 'kiti renginiai':
      case 'muud üritused':
        return t('Citi pasākumi', 'Other Events', 'Kiti renginiai', 'Muud üritused');
      default:
        return categoryName;
    }
  };

  return (
    <Card className="flex flex-col bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border border-gray-200 dark:border-gray-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Ticket className="h-5 w-5 text-orange-500" />
          {type}
        </CardTitle>
        <CardDescription>
          {t("Pieejamas", "Available", "Prieinama", "Saadaval")}: {available}
          {category && (
            <span className="block text-xs text-muted-foreground mt-1">
              {getLocalizedCategory(category)}
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-orange-500">
          {price} €
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" variant="orange">
          {t("Pirkt biļeti", "Buy ticket", "Pirkti bilietą", "Osta pilet")}
        </Button>
      </CardFooter>
    </Card>
  );
};
