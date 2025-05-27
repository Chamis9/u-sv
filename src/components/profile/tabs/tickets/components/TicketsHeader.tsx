
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
    <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 border-b border-border pb-4">
      <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
        {t("Manas biļetes", "My Tickets", "Mano bilietai", "Minu piletid")}
      </CardTitle>
      <div className="flex w-full sm:w-auto space-x-3">
        <Button 
          onClick={handleRefresh} 
          size={isMobile ? "icon" : "default"} 
          variant="outline" 
          disabled={isRefreshing} 
          className="flex-1 sm:flex-none border-2 border-gray-300 dark:border-gray-600 font-medium text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <RefreshCw className={`h-5 w-5 ${isMobile ? '' : 'mr-2'} ${isRefreshing ? 'animate-spin' : ''} text-gray-700 dark:text-gray-200`} />
          {!isMobile && (isRefreshing 
            ? t("Atjaunojās...", "Refreshing...", "Atnaujinama...", "Värskendatakse...") 
            : t("Atjaunot", "Refresh", "Atnaujinti", "Värskenda")
          )}
        </Button>
        <Button 
          onClick={onAddTicket} 
          size={isMobile ? "icon" : "default"} 
          className="flex-1 sm:flex-none bg-orange-500 hover:bg-orange-600 text-white font-medium"
        >
          <Plus className={`h-5 w-5 ${isMobile ? '' : 'mr-2'}`} />
          {!isMobile && t("Pievienot biļeti", "Add Ticket", "Pridėti bilietą", "Lisa pilet")}
        </Button>
      </div>
    </CardHeader>
  );
}
