
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
  
  // Check if we're on mobile screen
  const [isMobile, setIsMobile] = useState(false);
  
  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    // Check initially
    checkMobile();
    
    // Add window resize listener
    window.addEventListener('resize', checkMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  return (
    <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
      <CardTitle>{t("Manas biļetes", "My Tickets")}</CardTitle>
      <div className="flex w-full sm:w-auto space-x-2">
        <Button onClick={handleRefresh} size={isMobile ? "icon" : "sm"} variant="outline" disabled={isRefreshing} className="flex-1 sm:flex-none">
          <RefreshCw className={`h-4 w-4 ${isMobile ? '' : 'mr-2'} ${isRefreshing ? 'animate-spin' : ''}`} />
          {!isMobile && (isRefreshing 
            ? t("Atjaunojās...", "Refreshing...") 
            : t("Atjaunot", "Refresh")
          )}
        </Button>
        <Button onClick={onAddTicket} size={isMobile ? "icon" : "sm"} className="flex-1 sm:flex-none">
          <Plus className={`h-4 w-4 ${isMobile ? '' : 'mr-2'}`} />
          {!isMobile && t("Pievienot biļeti", "Add Ticket")}
        </Button>
      </div>
    </CardHeader>
  );
}
