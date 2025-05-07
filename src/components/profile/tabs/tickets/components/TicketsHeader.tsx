
import React, { useState } from "react";
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
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const t = (lvText: string, enText: string) => 
    currentLanguage.code === 'lv' ? lvText : enText;
  
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await onRefresh();
    } finally {
      // Add a small delay to make the refreshing state visible
      setTimeout(() => {
        setIsRefreshing(false);
      }, 500);
    }
  };
  
  return (
    <CardHeader className="flex flex-row items-center justify-between">
      <CardTitle>{t("Manas biļetes", "My Tickets")}</CardTitle>
      <div className="flex space-x-2">
        <Button onClick={handleRefresh} size="sm" variant="outline" disabled={isRefreshing}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          {isRefreshing 
            ? t("Atsvaidzina...", "Refreshing...") 
            : t("Atsvaidzināt", "Refresh")
          }
        </Button>
        <Button onClick={onAddTicket} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          {t("Pievienot biļeti", "Add Ticket")}
        </Button>
      </div>
    </CardHeader>
  );
}
