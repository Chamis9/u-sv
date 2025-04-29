
import React from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Category } from "@/hooks/useCategories";
import { useLanguage } from "@/features/language";

interface EventDetailsFieldsProps {
  form: any;
  categories?: Category[];
}

export const EventDetailsFields = ({ form, categories }: EventDetailsFieldsProps) => {
  const { currentLanguage } = useLanguage();
  
  // Translate helper
  const t = (lv: string, en: string) => currentLanguage.code === 'lv' ? lv : en;
  
  return (
    <>
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("Pasākuma nosaukums", "Event title")}</FormLabel>
            <FormControl>
              <Input placeholder={t("Ievadiet pasākuma nosaukumu", "Enter event title")} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("Apraksts", "Description")}</FormLabel>
            <FormControl>
              <Textarea placeholder={t("Pasākuma apraksts", "Event description")} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="category_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("Kategorija", "Category")}</FormLabel>
            <Select 
              onValueChange={field.onChange} 
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder={t("Izvēlieties kategoriju", "Select category")} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {categories?.map(category => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};
