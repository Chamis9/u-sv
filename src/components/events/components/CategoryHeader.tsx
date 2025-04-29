
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/features/language";

interface CategoryHeaderProps {
  categoryDisplayName: string;
}

export const CategoryHeader: React.FC<CategoryHeaderProps> = ({ categoryDisplayName }) => {
  const { currentLanguage } = useLanguage();
  
  const backButtonText = {
    lv: "Atpakaļ",
    en: "Back"
  };
  
  // Capitalize the first letter of the category name
  const capitalizedCategoryName = categoryDisplayName.charAt(0).toUpperCase() + categoryDisplayName.slice(1);

  return (
    <div className="mb-8">
      <Link to="/events">
        <Button variant="ghost" className="mb-4 hover:bg-transparent p-0">
          <ArrowLeft className="mr-2 h-4 w-4" />
          {backButtonText[currentLanguage.code as keyof typeof backButtonText]}
        </Button>
      </Link>
      <h1 className="text-4xl font-bold mb-8 text-orange-500">{capitalizedCategoryName}</h1>
    </div>
  );
};
