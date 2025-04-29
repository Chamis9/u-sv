
import React from 'react';
import { useLanguage } from '@/features/language';
import { Ticket } from 'lucide-react';

export interface EmptyTicketStateProps {
  ticketType: "added" | "purchased";
}

export function EmptyTicketState({ ticketType }: EmptyTicketStateProps) {
  const { currentLanguage } = useLanguage();
  
  const t = (lvText: string, enText: string) => 
    currentLanguage.code === 'lv' ? lvText : enText;
  
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="rounded-full bg-muted p-3 mb-4">
        <Ticket className="h-6 w-6 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-1">
        {ticketType === "added" 
          ? t("Nav pievienotu biļešu", "No tickets added") 
          : t("Nav iegādātu biļešu", "No purchased tickets")}
      </h3>
      <p className="text-muted-foreground max-w-sm">
        {ticketType === "added" 
          ? t("Jūs vēl neesat pievienojis nevienu biļeti. Izmantojiet pogu 'Pievienot biļeti', lai sāktu.", 
              "You haven't added any tickets yet. Use the 'Add Ticket' button to get started.")
          : t("Jūs vēl neesat iegādājies nevienu biļeti.", 
              "You haven't purchased any tickets yet.")}
      </p>
    </div>
  );
}
