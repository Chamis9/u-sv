
import React from "react";
import { Ticket } from "lucide-react";

interface TicketsEmptyStateProps {
  t: (lvText: string, enText: string) => string;
}

export const TicketsEmptyState: React.FC<TicketsEmptyStateProps> = ({ t }) => {
  return (
    <div className="mt-8 text-center py-8 bg-ticket-bg/50 border border-ticket-text/20 backdrop-blur-sm rounded-lg shadow-md">
      <Ticket className="h-12 w-12 text-ticket-text/50 mx-auto mb-4" />
      <h3 className="text-xl font-medium text-ticket-text">
        {t("Nav pieejamu biļešu no lietotājiem", "No user submitted tickets available")}
      </h3>
      <p className="text-ticket-text/80 mt-2">
        {t("Šim pasākumam pašlaik nav pārdošanā biļetes no lietotājiem", "There are no user tickets for sale for this event at the moment")}
      </p>
    </div>
  );
};
