
import React from "react";
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { TicketIcon, ShoppingBag, PlusCircle } from "lucide-react";
import { useLanguage } from "@/features/language";

interface EmptyTicketsListProps {
  type: 'listed' | 'purchased';
}

export const EmptyTicketsList: React.FC<EmptyTicketsListProps> = ({ type }) => {
  const { currentLanguage } = useLanguage();
  
  const t = (lvText: string, enText: string) => 
    currentLanguage.code === 'lv' ? lvText : enText;

  if (type === 'listed') {
    return (
      <div className="text-center p-8">
        <TicketIcon className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
        <p className="mt-2 text-lg font-medium">{t("Nav pievienotu biļešu", "No listed tickets")}</p>
        <p className="text-sm text-muted-foreground">{t("Jūs vēl neesat pievienojis nevienu biļeti pārdošanā", "You haven't listed any tickets for sale yet")}</p>
        <Link to="/events">
          <Button variant="outline" className="mt-4">
            <PlusCircle className="mr-2 h-4 w-4" />
            {t("Pievienot biļetes", "Add tickets")}
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="text-center p-8">
      <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
      <p className="mt-2 text-lg font-medium">{t("Nav iegādātu biļešu", "No purchased tickets")}</p>
      <p className="text-sm text-muted-foreground">{t("Jūs vēl neesat iegādājies nevienu biļeti", "You haven't purchased any tickets yet")}</p>
      <Link to="/events">
        <Button variant="outline" className="mt-4">
          {t("Atrast pasākumus", "Find events")}
        </Button>
      </Link>
    </div>
  );
};
