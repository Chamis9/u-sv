
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/features/language";
import { UserTicket } from "@/hooks/tickets";
import { TicketsEmptyState } from "./TicketsEmptyState";
import { TicketGrid } from "./TicketGrid";
import { useTicketActions } from "./useTicketActions";

interface UserTicketsProps {
  availableTickets: UserTicket[];
  onPurchase: (ticket: UserTicket) => void;
  onDelete?: (ticketId: string) => void;
}

export const UserTickets: React.FC<UserTicketsProps> = ({ 
  availableTickets, 
  onPurchase,
  onDelete
}) => {
  const { currentLanguage } = useLanguage();
  const { user, isAuthenticated } = useAuth();
  const userId = user?.id;
  
  const {
    selectedTicket,
    isDeleting,
    isConfirmDeleteOpen,
    setIsConfirmDeleteOpen,
    handleViewTicket,
    handleDeleteTicket,
    handleConfirmDelete
  } = useTicketActions(onDelete);

  const t = (lv: string, en: string) => currentLanguage.code === 'lv' ? lv : en;

  const hasTickets = availableTickets && availableTickets.length > 0;

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-semibold mb-6 text-ticket-accent">
        {t("Lietotāju biļetes", "User tickets")}
      </h2>
      
      {hasTickets ? (
        <TicketGrid
          availableTickets={availableTickets}
          onView={handleViewTicket}
          onPurchase={onPurchase}
          onDelete={handleDeleteTicket}
          isAuthenticated={isAuthenticated}
          userId={userId}
          currentLanguageCode={currentLanguage.code}
          t={t}
          isDeleting={isDeleting}
        />
      ) : (
        <TicketsEmptyState t={t} />
      )}
    </div>
  );
};
