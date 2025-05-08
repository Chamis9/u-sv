
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
  
  const availableText = {
    lv: "Pieejamas",
    en: "Available"
  };

  const buyTicketText = {
    lv: "Pirkt biļeti",
    en: "Buy ticket"
  };

  return (
    <Card className="flex flex-col bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border border-gray-200 dark:border-gray-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Ticket className="h-5 w-5 text-orange-500" />
          {type}
        </CardTitle>
        <CardDescription>
          {availableText[currentLanguage.code as keyof typeof availableText]}: {available}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-orange-500">
          {price} €
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" variant="orange">
          {buyTicketText[currentLanguage.code as keyof typeof buyTicketText]}
        </Button>
      </CardFooter>
    </Card>
  );
};
