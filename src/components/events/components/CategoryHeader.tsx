
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/features/language";
import { eventsTranslations } from "@/features/language/translations/features/events";

interface CategoryHeaderProps {
  categoryDisplayName: string;
}

export const CategoryHeader: React.FC<CategoryHeaderProps> = ({ categoryDisplayName }) => {
  const { currentLanguage } = useLanguage();
  
  const backButtonText = {
    lv: "Atpakaļ",
    en: "Back",
    lt: "Atgal",
    et: "Tagasi",
    ee: "Tagasi"
  };
  
  // Get proper display name from translations
  const getTranslatedCategoryName = () => {
    const langCode = currentLanguage.code === 'ee' ? 'et' : currentLanguage.code;
    const translations = eventsTranslations[langCode as keyof typeof eventsTranslations];
    
    if (!translations) {
      return categoryDisplayName.charAt(0).toUpperCase() + categoryDisplayName.slice(1);
    }
    
    // Map category display names to translation keys
    const categoryName = categoryDisplayName.toLowerCase();
    
    if (categoryName === 'teatris' || categoryName === 'theatre' || categoryName === 'teatras' || categoryName === 'teater') {
      return translations.theatre;
    }
    if (categoryName === 'koncerti' || categoryName === 'concerts' || categoryName === 'koncertai' || categoryName === 'kontserdid') {
      return translations.concerts;
    }
    if (categoryName === 'festivāli' || categoryName === 'festivals' || categoryName === 'festivaliai' || categoryName === 'festivalid') {
      return translations.festivals;
    }
    if (categoryName === 'sports' || categoryName === 'sportas' || categoryName === 'sport') {
      return translations.sports;
    }
    if (categoryName === 'kino' || categoryName === 'cinema' || categoryName === 'kinas') {
      return translations.cinema;
    }
    if (categoryName === 'bērniem' || categoryName === 'for children' || categoryName === 'vaikams' || categoryName === 'lastele') {
      return translations.children;
    }
    if (categoryName === 'ceļojumi' || categoryName === 'travel' || categoryName === 'kelionės' || categoryName === 'reisimine') {
      return translations.travel;
    }
    if (categoryName === 'dāvanu kartes' || categoryName === 'gift cards' || categoryName === 'dovanų kortelės' || categoryName === 'kinkekaardid') {
      return translations.giftCards;
    }
    if (categoryName === 'citi pasākumi' || categoryName === 'other events' || categoryName === 'kiti renginiai' || categoryName === 'muud üritused') {
      return translations.other;
    }
    
    // For other categories, capitalize first letter as fallback
    return categoryDisplayName.charAt(0).toUpperCase() + categoryDisplayName.slice(1);
  };
  
  const displayName = getTranslatedCategoryName();

  return (
    <div className="mb-8">
      <Link to="/events">
        <Button variant="ghost" className="mb-4 hover:bg-transparent p-0">
          <ArrowLeft className="mr-2 h-4 w-4" />
          {backButtonText[currentLanguage.code as keyof typeof backButtonText]}
        </Button>
      </Link>
      <h1 className="text-4xl font-bold mb-8 text-ticket-accent">{displayName}</h1>
    </div>
  );
};
