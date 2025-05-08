
import React from 'react';
import { TabsList as UITabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/features/language";

interface TabsListProps {
  addedCount: number;
  purchasedCount: number;
}

export function TabsList({ addedCount, purchasedCount }: TabsListProps) {
  const { currentLanguage } = useLanguage();
  
  const t = (lvText: string, enText: string) => 
    currentLanguage.code === 'lv' ? lvText : enText;
    
  return (
    <UITabsList className="mb-4">
      <TabsTrigger value="added">
        {t("Pievienotās biļetes", "Added Tickets")} {addedCount > 0 && `(${addedCount})`}
      </TabsTrigger>
      <TabsTrigger value="purchased">
        {t("Iegādātās biļetes", "Purchased Tickets")} {purchasedCount > 0 && `(${purchasedCount})`}
      </TabsTrigger>
    </UITabsList>
  );
}
