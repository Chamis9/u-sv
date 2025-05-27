
import React from "react";
import { useLanguage } from "@/features/language";
import { useQuery } from "@tanstack/react-query";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { Category } from "@/hooks/useCategories";
import { getLocalizedCategoryName } from "@/utils/categoryLocalization";

interface CategorySelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export function CategorySelector({ value, onChange }: CategorySelectorProps) {
  const { currentLanguage } = useLanguage();
  
  const t = (lvText: string, enText: string, ltText: string, eeText: string) => {
    switch (currentLanguage.code) {
      case 'lv': return lvText;
      case 'en': return enText;
      case 'lt': return ltText;
      case 'et':
      case 'ee': return eeText;
      default: return lvText;
    }
  };

  // Fetch categories directly from supabase to get all language columns
  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: async (): Promise<Category[]> => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('status', 'active')
        .order('priority', { ascending: true });
      
      if (error) {
        console.error('Error fetching categories:', error);
        return [];
      }
      
      return data || [];
    },
    staleTime: 60000, // Cache for 1 minute
  });

  return (
    <Select 
      value={value} 
      onValueChange={onChange}
      required
    >
      <SelectTrigger className={`${value ? "text-gray-900 dark:text-white" : "text-gray-500 dark:text-gray-400"} border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700`}>
        <SelectValue placeholder={t("Izvēlieties kategoriju", "Select a category", "Pasirinkite kategoriją", "Valige kategooria")} />
      </SelectTrigger>
      <SelectContent className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600">
        {isLoading ? (
          <SelectItem value="loading" disabled>
            {t("Ielādē...", "Loading...", "Kraunama...", "Laadimine...")}
          </SelectItem>
        ) : categories.length > 0 ? (
          categories.map((category) => {
            const localizedName = getLocalizedCategoryName(category, currentLanguage.code);
            return (
              <SelectItem key={category.id} value={localizedName}>
                {localizedName}
              </SelectItem>
            );
          })
        ) : (
          <SelectItem value="other">{t("Cits", "Other", "Kita", "Muu")}</SelectItem>
        )}
      </SelectContent>
    </Select>
  );
}
