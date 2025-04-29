
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

  // Here we clone the child element and pass the onPurchase prop
  // We need to use React.Children.only to ensure we only have one child and it's a valid element
  const childElement = React.isValidElement(children) 
    ? React.cloneElement(children, { onPurchase: openPurchaseDialog })
    : children;

  return (
    <>
      {childElement}
      
      <PurchaseDialog
        ticket={selectedTicket}
        isOpen={isPurchaseDialogOpen}
        onOpenChange={setIsPurchaseDialogOpen}
        onPurchaseConfirm={handlePurchaseConfirm}
      />
    </>
  );
};
