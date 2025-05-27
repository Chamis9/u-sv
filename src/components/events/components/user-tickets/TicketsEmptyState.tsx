
import React from "react";
import { Ticket } from "lucide-react";
import { useLanguage } from "@/features/language";

interface TicketsEmptyStateProps {
  t: (lvText: string, enText: string) => string;
}

export const TicketsEmptyState: React.FC<TicketsEmptyStateProps> = ({ t }) => {
  const { currentLanguage } = useLanguage();
  
  const translate = (lvText: string, enText: string, ltText: string, eeText: string) => {
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
    <div className="mt-8 text-center py-8 bg-ticket-bg/70 backdrop-blur-sm border border-ticket-text/10 rounded-lg">
      <Ticket className="h-12 w-12 text-ticket-accent mx-auto mb-4" />
      <h3 className="text-xl font-medium text-ticket-text">
        {translate(
          "Nav pieejamu biļešu no lietotājiem", 
          "No user submitted tickets available",
          "Nėra vartotojų pateiktų bilietų",
          "Kasutajate esitatud pileteid pole saadaval"
        )}
      </h3>
      <p className="text-ticket-text/80 mt-2">
        {translate(
          "Šim pasākumam pašlaik nav pārdošanā biļetes no lietotājiem", 
          "There are no user tickets for sale for this event at the moment",
          "Šiuo metu šiam renginiui nėra pardavime vartotojų bilietų",
          "Hetkel pole selle ürituse jaoks kasutajate pileteid müügis"
        )}
      </p>
    </div>
  );
};
