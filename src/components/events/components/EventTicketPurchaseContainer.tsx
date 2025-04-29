
import React from 'react';
import { UserTicket } from '@/hooks/tickets';
import { useTicketPurchase } from '@/hooks/useTicketPurchase';
import { PurchaseDialog } from './PurchaseDialog';

interface WithOnPurchase {
  onPurchase: (ticket: UserTicket) => void;
}

export interface EventTicketPurchaseContainerProps {
  children: React.ReactNode;
  removeTicketFromState: (ticketId: string) => void;
}

export const EventTicketPurchaseContainer: React.FC<EventTicketPurchaseContainerProps> = ({
  children,
  removeTicketFromState
}) => {
  const {
    selectedTicket,
    isPurchaseDialogOpen,
    setIsPurchaseDialogOpen,
    openPurchaseDialog,
    purchaseTicket
  } = useTicketPurchase();

  // Handler for purchasing a ticket
  const handlePurchase = async (ticket: UserTicket) => {
    openPurchaseDialog(ticket);
  };

  // Handler for confirming the purchase
  const handleConfirmPurchase = async () => {
    if (selectedTicket) {
      const success = await purchaseTicket(selectedTicket);
      if (success) {
        removeTicketFromState(selectedTicket.id);
      }
    }
  };

  // Clone all children and inject the onPurchase prop
  const childrenWithProps = React.Children.map(children, (child) => {
    if (React.isValidElement<WithOnPurchase>(child)) {
      return React.cloneElement(child, {
        onPurchase: handlePurchase
      });
    }
    return child;
  });

  return (
    <>
      {childrenWithProps}
      
      <PurchaseDialog 
        isOpen={isPurchaseDialogOpen}
        onOpenChange={setIsPurchaseDialogOpen}
        ticket={selectedTicket}
        onPurchaseConfirm={handleConfirmPurchase}
      />
    </>
  );
};
