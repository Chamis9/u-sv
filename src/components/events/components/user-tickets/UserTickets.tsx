
import React, { useState } from 'react';
import { useLanguage } from "@/features/language";
import { UserTicket } from "@/hooks/tickets";
import { useAuth } from "@/contexts/AuthContext";
import { TicketPreviewDialog } from "../TicketPreviewDialog";
import { TicketsEmptyState } from "./TicketsEmptyState";
import { TicketGrid } from "./TicketGrid";
import { DeleteConfirmDialog } from "./DeleteConfirmDialog";
import { useTicketActions } from "./useTicketActions";

interface UserTicketsProps {
  availableTickets: UserTicket[];
  onPurchase: (ticket: UserTicket) => void;
  onDelete?: (ticketId: string) => void;
  onTicketsChanged?: () => void;
}

export const UserTickets: React.FC<UserTicketsProps> = ({ 
  availableTickets, 
  onPurchase, 
  onDelete,
  onTicketsChanged 
}) => {
  const { currentLanguage } = useLanguage();
  const [selectedTicket, setSelectedTicket] = useState<UserTicket | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const { user, isAuthenticated } = useAuth();
  
  const t = (lv: string, en: string, lt: string, ee: string) => {
    switch (currentLanguage.code) {
      case 'lv': return lv;
      case 'en': return en;
      case 'lt': return lt;
      case 'et':
      case 'ee': return ee;
      default: return lv;
    }
  };

  const { 
    isDeleting, 
    ticketToDelete, 
    handleDeleteClick, 
    confirmDelete, 
    cancelDelete 
  } = useTicketActions({ 
    onTicketsChanged, 
    t: (lv: string, en: string) => t(lv, en, lv, en), // Fallback for 2-param function
    userId: user?.id 
  });

  const handleViewTicket = (ticket: UserTicket) => {
    setSelectedTicket(ticket);
    setIsPreviewOpen(true);
  };

  if (availableTickets.length === 0) {
    return <TicketsEmptyState t={(lv: string, en: string) => t(lv, en, lv, en)} />;
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold mb-4">
        {t("Pieejamās biļetes", "Available tickets", "Prieinami bilietai", "Saadaolevad piletid")}
      </h2>
      
      <TicketGrid
        availableTickets={availableTickets}
        onView={handleViewTicket}
        onPurchase={onPurchase}
        onDelete={onDelete ? handleDeleteClick : undefined}
        isAuthenticated={isAuthenticated}
        userId={user?.id}
        currentLanguageCode={currentLanguage.code}
        t={t}
        isDeleting={isDeleting}
      />
      
      {/* Ticket Preview Dialog */}
      <TicketPreviewDialog
        ticket={selectedTicket}
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        onPurchase={onPurchase}
      />
      
      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        isOpen={ticketToDelete !== null}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        isDeleting={isDeleting}
        t={(lv: string, en: string) => t(lv, en, lv, en)}
      />
    </div>
  );
};
