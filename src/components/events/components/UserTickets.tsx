
import React from 'react';
import { useLanguage } from "@/features/language";
import { Button } from "@/components/ui/button";
import { Ticket } from "lucide-react";
import { UserTicket } from "@/hooks/tickets";

interface UserTicketsProps {
  availableTickets: UserTicket[];
  onPurchase: (ticket: UserTicket) => void;
}

export const UserTickets: React.FC<UserTicketsProps> = ({ availableTickets, onPurchase }) => {
  const { currentLanguage } = useLanguage();
  const t = (lv: string, en: string) => currentLanguage.code === 'lv' ? lv : en;

  if (availableTickets.length === 0) {
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
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold mb-4">
        {t("Pieejamās biļetes no lietotājiem", "User submitted tickets")}
      </h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {availableTickets.map((ticket) => (
          <div key={ticket.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-lg">{ticket.title}</h3>
                {ticket.description && (
                  <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">{ticket.description}</p>
                )}
              </div>
              <div className="text-lg font-bold">{ticket.price} €</div>
            </div>
            
            <div className="mt-4 flex justify-end">
              <Button onClick={() => onPurchase(ticket)} variant="orange">
                <Ticket className="mr-2 h-4 w-4" />
                {t("Pirkt biļeti", "Buy ticket")}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
