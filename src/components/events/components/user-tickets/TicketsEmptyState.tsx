
import React from "react";
import { Ticket } from "lucide-react";

interface TicketsEmptyStateProps {
  t: (lvText: string, enText: string) => string;
}

export const TicketsEmptyState: React.FC<TicketsEmptyStateProps> = ({ t }) => {
  return (
    <div className="mt-8 text-center py-8 bg-gray-100/50 dark:bg-gray-800/50 rounded-lg">
      <Ticket className="h-12 w-12 text-gray-400 mx-auto mb-4" />
      <h3 className="text-xl font-medium">
        {t("Nav pieejamu biļešu no lietotājiem", "No user submitted tickets available")}
      </h3>
      <p className="text-gray-500 dark:text-gray-400 mt-2">
        {t("Šim pasākumam pašlaik nav pārdošanā biļetes no lietotājiem", "There are no user tickets for sale for this event at the moment")}
      </p>
    </div>
  );
};
