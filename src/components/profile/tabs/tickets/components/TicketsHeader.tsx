
import React from "react";
import { useLanguage } from "@/features/language";
import { Button } from "@/components/ui/button";
import { Plus, RefreshCw } from "lucide-react";
import { CardHeader, CardTitle } from "@/components/ui/card";

interface TicketsHeaderProps {
  onAddTicket: () => void;
  onRefresh: () => void;
}

export function TicketsHeader({ onAddTicket, onRefresh }: TicketsHeaderProps) {
  const { currentLanguage } = useLanguage();
  
  const t = (lvText: string, enText: string) => 
    currentLanguage.code === 'lv' ? lvText : enText;
  
  return (
    <CardHeader className="flex flex-row items-center justify-between">
      <CardTitle>{t("Manas biļetes", "My Tickets")}</CardTitle>
      <div className="flex space-x-2">
        <Button onClick={onRefresh} size="sm" variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          {t("Atsvaidzināt", "Refresh")}
        </Button>
        <Button onClick={onAddTicket} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          {t("Pievienot biļeti", "Add Ticket")}
        </Button>
      </div>
    </CardHeader>
  );
}
