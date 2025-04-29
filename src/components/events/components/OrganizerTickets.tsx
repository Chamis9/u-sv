
import React from 'react';
import { useLanguage } from "@/features/language";
import { TicketCard } from './TicketCard';

interface TicketType {
  id: number;
  type: string;
  price: number;
  available: number;
}

const mockTickets: TicketType[] = [
  { id: 1, type: "VIP", price: 50, available: 10 },
  { id: 2, type: "Standard", price: 30, available: 50 },
  { id: 3, type: "Economy", price: 20, available: 100 },
];

export const OrganizerTickets: React.FC = () => {
  const { currentLanguage } = useLanguage();
  const t = (lv: string, en: string) => currentLanguage.code === 'lv' ? lv : en;

  return (
    <div className="mt-8 mb-4">
      <h2 className="text-2xl font-semibold mb-4">
        {t("Biļetes no organizatora", "Tickets from organizer")}
      </h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {mockTickets.map((ticket) => (
          <TicketCard
            key={ticket.id}
            type={ticket.type}
            price={ticket.price}
            available={ticket.available}
          />
        ))}
      </div>
    </div>
  );
};
