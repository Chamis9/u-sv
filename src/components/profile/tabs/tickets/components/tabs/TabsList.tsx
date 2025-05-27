
import React from "react";
import { Tabs, TabsList as ShadcnTabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/features/language";

interface TabsListProps {
  addedCount: number;
  purchasedCount: number;
}

export function TabsList({ addedCount, purchasedCount }: TabsListProps) {
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
  
  return (
    <ShadcnTabsList className="flex w-full mb-6 bg-background/50 p-1 border rounded-lg overflow-x-auto">
      <TabsTrigger 
        value="added" 
        className="flex-1 min-w-[160px] data-[state=active]:bg-background relative"
      >
        {t("Pievienotās biļetes", "Added Tickets", "Pridėti bilietai", "Lisatud piletid")}
        <span className="ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
          {addedCount}
        </span>
      </TabsTrigger>
      <TabsTrigger 
        value="purchased" 
        className="flex-1 min-w-[160px] data-[state=active]:bg-background relative"
      >
        {t("Iegādātās biļetes", "Purchased Tickets", "Įsigyti bilietai", "Ostetud piletid")}
        <span className="ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
          {purchasedCount}
        </span>
      </TabsTrigger>
    </ShadcnTabsList>
  );
}
