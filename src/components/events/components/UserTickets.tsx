
import React, { useState } from 'react';
import { useLanguage } from "@/features/language";
import { Button } from "@/components/ui/button";
import { Ticket, Calendar, MapPin, Clock, Tag, Eye, Trash2 } from "lucide-react";
import { UserTicket } from "@/hooks/tickets";
import { formatDate, formatPrice } from "@/utils/formatters";
import { TicketPreviewDialog } from "./TicketPreviewDialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { deleteTicketMutation } from "@/hooks/tickets/mutations/deleteTicketMutation";

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
  const [ticketToDelete, setTicketToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  
  const t = (lv: string, en: string) => currentLanguage.code === 'lv' ? lv : en;

  const handleViewTicket = (ticket: UserTicket) => {
    setSelectedTicket(ticket);
    setIsPreviewOpen(true);
  };
  
  const handleDeleteClick = (ticketId: string) => {
    setTicketToDelete(ticketId);
  };
  
  const confirmDelete = async () => {
    if (!ticketToDelete || !user?.id) return;
    
    try {
      setIsDeleting(true);
      
      // Use the direct mutation function to ensure tickets are properly deleted
      if (onDelete) {
        // If parent provided a delete handler, use it
        onDelete(ticketToDelete);
      } else {
        // Otherwise, use the direct mutation
        const success = await deleteTicketMutation(ticketToDelete, user.id);
        
        if (success) {
          toast({
            title: t("Biļete dzēsta", "Ticket deleted"),
            description: t("Biļete ir veiksmīgi dzēsta", "Ticket has been successfully deleted")
          });
          
          // Notify parent component to refresh tickets
          if (onTicketsChanged) {
            onTicketsChanged();
          }
        } else {
          toast({
            title: t("Kļūda", "Error"),
            description: t("Neizdevās dzēst biļeti", "Failed to delete ticket"),
            variant: "destructive"
          });
        }
      }
      
      setTicketToDelete(null);
    } catch (error) {
      console.error("Error deleting ticket:", error);
      toast({
        title: t("Kļūda", "Error"),
        description: t("Neizdevās dzēst biļeti", "Failed to delete ticket"),
        variant: "destructive"
      });
    } finally {
      setIsDeleting(false);
    }
  };
  
  const cancelDelete = () => {
    setTicketToDelete(null);
  };

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
        {t("Pieejamās biļetes", "Available tickets")}
      </h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {availableTickets.map((ticket) => (
          <div key={ticket.id} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
            {/* Ticket color band - CHANGED FROM GREEN TO YELLOW */}
            <div className="h-2 bg-ticket-accent"></div>
            
            <div className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-1 truncate text-gray-900 dark:text-gray-100">{ticket.title}</h3>
                  <div className="flex items-center text-sm text-muted-foreground mb-1">
                    <Calendar className="h-4 w-4 mr-1" />
                    {ticket.event_date 
                      ? formatDate(ticket.event_date, currentLanguage.code === 'lv' ? 'lv-LV' : 'en-US')
                      : formatDate(ticket.created_at, currentLanguage.code === 'lv' ? 'lv-LV' : 'en-US')}
                    {ticket.event_time && (
                      <span className="ml-2 flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {ticket.event_time}
                      </span>
                    )}
                  </div>
                  
                  {ticket.venue && (
                    <div className="flex items-center text-sm text-muted-foreground mb-3">
                      <MapPin className="h-4 w-4 mr-1" />
                      {ticket.venue}
                    </div>
                  )}
                  
                  <div className="flex items-center mb-4">
                    <Tag className="h-4 w-4 mr-1 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{ticket.category}</span>
                  </div>
                  
                  <div className="text-xl font-bold text-primary">
                    {formatPrice(ticket.price)}
                  </div>
                  
                  {/* Always show quantity and price per unit, even for single tickets */}
                  <div className="text-sm text-muted-foreground mt-1">
                    {ticket.quantity} {ticket.quantity === 1 ? t("biļete", "ticket") : t("biļetes", "tickets")} × {formatPrice(ticket.price_per_unit || ticket.price)}
                  </div>
                </div>
                
                <div className="ml-4 mt-1">
                  <Ticket className="h-10 w-10 text-muted-foreground opacity-20" />
                </div>
              </div>
              
              <div className="mt-4 flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleViewTicket(ticket)}
                  className="flex-1 text-gray-800 border-gray-400"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  {t("Skatīt", "View")}
                </Button>
                
                {/* Show Delete button if user is the owner of this ticket */}
                {isAuthenticated && user?.id === ticket.seller_id && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteClick(ticket.id)}
                    className="flex-1"
                    disabled={isDeleting}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    {t("Dzēst", "Delete")}
                  </Button>
                )}
                
                {/* Don't show Buy button if user is the seller */}
                {(!isAuthenticated || user?.id !== ticket.seller_id) && (
                  <Button
                    variant="orange"
                    size="sm"
                    onClick={() => onPurchase(ticket)}
                    className="flex-1"
                  >
                    <Ticket className="h-4 w-4 mr-2" />
                    {t("Pirkt biļeti", "Buy ticket")}
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Ticket Preview Dialog - Updated to include onPurchase */}
      <TicketPreviewDialog
        ticket={selectedTicket}
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        onPurchase={onPurchase}
      />
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={ticketToDelete !== null} onOpenChange={(open) => !open && cancelDelete()}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t("Vai tiešām vēlaties dzēst šo biļeti?", "Delete this ticket?")}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t(
                "Šī darbība ir neatgriezeniska. Biļete tiks neatgriezeniski izdzēsta.", 
                "This action cannot be undone. This ticket will be permanently deleted."
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>
              {t("Atcelt", "Cancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? t("Dzēšana...", "Deleting...") : t("Dzēst", "Delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
