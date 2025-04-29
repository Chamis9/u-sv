
import React from "react";
import { useLanguage } from "@/features/language";
import { useQuery } from "@tanstack/react-query";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { TicketFormValues } from "./schema";
import { getAllCategories } from "./services/CategoryService";
import { getCategoryTableName } from "@/utils/categoryMapping";

interface CategorySelectorProps {
  form: UseFormReturn<TicketFormValues>;
}

export function CategorySelector({ form }: CategorySelectorProps) {
  const { currentLanguage } = useLanguage();
  
  const t = (lvText: string, enText: string) => 
    currentLanguage.code === 'lv' ? lvText : enText;

  // Fetch categories using our service function
  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: getAllCategories,
    staleTime: 60000, // Cache for 1 minute
  });

  const handleCategoryChange = (value: string) => {
    form.setValue("category", value);
    
    // Log the table that will be used for this category
    const tableName = getCategoryTableName(value);
    console.log(`Selected category: ${value}, will use table: ${tableName}`);
    
    // Additionally log the normalized category to help debug mapping issues
    const normalizedCategory = value.toLowerCase().trim();
    console.log(`Normalized category name: ${normalizedCategory}`);
  };

  return (
    <FormField
      control={form.control}
      name="category"
      render={({ field }) => (
        <FormItem>
          <FormLabel>{t("Kategorija", "Category")}</FormLabel>
          <Select 
            onValueChange={(value) => {
              field.onChange(value);
              handleCategoryChange(value);
            }} 
            defaultValue={field.value}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={t("Izvēlieties kategoriju", "Select a category")} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {isLoading ? (
                <SelectItem value="loading" disabled>
                  {t("Ielādē...", "Loading...")}
                </SelectItem>
              ) : categories.length > 0 ? (
                categories.map((category) => (
                  <SelectItem key={category.id} value={category.name}>
                    {category.name}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="other">{t("Cits", "Other")}</SelectItem>
              )}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
