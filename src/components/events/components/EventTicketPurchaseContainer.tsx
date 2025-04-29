
import React from 'react';
import { UserTicket } from '@/hooks/tickets';
import { useTicketPurchase } from '@/hooks/useTicketPurchase';
import { PurchaseDialog } from './PurchaseDialog';

interface EventTicketPurchaseContainerProps {
  removeTicketFromState: (ticketId: string) => void;
  children: React.ReactNode;
}

export const EventTicketPurchaseContainer: React.FC<EventTicketPurchaseContainerProps> = ({ 
  removeTicketFromState,
  children 
}) => {
  const {
    selectedTicket,
    isPurchaseDialogOpen,
    setIsPurchaseDialogOpen,
    openPurchaseDialog,
    purchaseTicket
  } = useTicketPurchase();

  const handlePurchaseConfirm = async (ticket: typeof selectedTicket) => {
    if (!ticket) return;
    
    const success = await purchaseTicket(ticket);
    if (success) {
      removeTicketFromState(ticket.id);
    }
  };

  return (
    <>
      {React.cloneElement(children as React.ReactElement, { onPurchase: openPurchaseDialog })}
      
      <PurchaseDialog
        ticket={selectedTicket}
        isOpen={isPurchaseDialogOpen}
        onOpenChange={setIsPurchaseDialogOpen}
        onPurchaseConfirm={handlePurchaseConfirm}
      />
    </>
  );
};
