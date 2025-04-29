
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

  return (
    <div className="mb-6 flex items-center justify-between">
      <div>
        <Link to="/events">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {backButtonText[currentLanguage.code as keyof typeof backButtonText]}
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">{categoryDisplayName}</h1>
      </div>
    </div>
  );
};
