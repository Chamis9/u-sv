
import React from 'react';
import { Ticket } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/features/language";

interface TicketCardProps {
  type: string;
  price: number;
  available: number;
}

export const TicketCard: React.FC<TicketCardProps> = ({
  type,
  price,
  available
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

  return (
    <Card className="flex flex-col bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border border-gray-200 dark:border-gray-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Ticket className="h-5 w-5 text-orange-500" />
          {type}
        </CardTitle>
        <CardDescription>
          {t("Pieejamas", "Available", "Prieinama", "Saadaval")}: {available}
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
