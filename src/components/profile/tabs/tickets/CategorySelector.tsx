
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
import { getAllCategories } from "./services/CategoryService";
import { getCategoryDisplayName } from "@/utils/categoryMapping";

interface CategorySelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export function CategorySelector({ value, onChange }: CategorySelectorProps) {
  const { currentLanguage } = useLanguage();
  
  const t = (lvText: string, enText: string) => 
    currentLanguage.code === 'lv' ? lvText : enText;

  // Fetch categories using our service function
  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: getAllCategories,
    staleTime: 60000, // Cache for 1 minute
  });

  return (
    <Select 
      value={value} 
      onValueChange={onChange}
      required
    >
      <SelectTrigger className={`${value ? "text-gray-900 dark:text-white" : "text-gray-500 dark:text-gray-400"} border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700`}>
        <SelectValue placeholder={t("Izvēlieties kategoriju", "Select a category")} />
      </SelectTrigger>
      <SelectContent className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600">
        {isLoading ? (
          <SelectItem value="loading" disabled>
            {t("Ielādē...", "Loading...")}
          </SelectItem>
        ) : categories.length > 0 ? (
          categories.map((category) => (
            <SelectItem key={category.id} value={category.name}>
              {getCategoryDisplayName(category.name, currentLanguage.code)}
            </SelectItem>
          ))
        ) : (
          <SelectItem value="other">{t("Cits", "Other")}</SelectItem>
        )}
      </SelectContent>
    </Select>
  );
}
