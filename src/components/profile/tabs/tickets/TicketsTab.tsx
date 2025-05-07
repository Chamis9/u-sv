
import React, { useEffect } from "react";
import { User } from "@/types/users";
import { 
  Card, 
  CardContent
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AddTicketForm } from "./AddTicketForm";
import { useTicketsTab } from "./hooks/useTicketsTab";
import { 
  TicketsHeader,
  TicketsList
} from "./components";
import { DeleteTicketDialog } from "./components/DeleteTicketDialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface TicketsTabProps {
  user: User;
}

export function TicketsTab({ user }: TicketsTabProps) {
  const {
    addedTickets,
    purchasedTickets,
    isLoading,
    loading,
    addTicketOpen,
    setAddTicketOpen,
    openDeleteConfirmation,
    confirmDelete,
    cancelDelete,
    ticketToDelete,
    isDeleting,
    handleUpdateTicket,
    refreshTickets,
    editTicketOpen,
    setEditTicketOpen,
    currentEditTicket,
    setCurrentEditTicket,
    t,
    isAuthenticated
  } = useTicketsTab(user);
  
  // Force refresh on component mount and when user changes
  useEffect(() => {
    console.log("TicketsTab mounted or user changed, refreshing tickets");
    if (isAuthenticated && user?.id) {
      refreshTickets();
    }
  }, [user.id, isAuthenticated, refreshTickets]);

  console.log("TicketsTab render - Current user:", user);
  console.log("TicketsTab render - Authentication state:", isAuthenticated);
  console.log("TicketsTab render - Added tickets:", addedTickets.length);
  console.log("TicketsTab render - Purchased tickets:", purchasedTickets.length);
  
  if (!isAuthenticated) {
    return (
      <Card>
        <CardContent className="pt-6">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>{t("Nav pieslēgts", "Not logged in")}</AlertTitle>
            <AlertDescription>
              {t(
                "Lai redzētu savas biļetes, lūdzu pieslēdzieties savā kontā", 
                "Please log in to view your tickets"
              )}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <TicketsHeader 
        onAddTicket={() => setAddTicketOpen(true)} 
        onRefresh={() => {
          console.log("Manual refresh triggered");
          refreshTickets();
        }}
      />
      
      <CardContent>
        <Tabs defaultValue="added">
          <TabsList className="mb-4">
            <TabsTrigger value="added">
              {t("Pievienotās biļetes", "Added Tickets")} {addedTickets.length > 0 && `(${addedTickets.length})`}
            </TabsTrigger>
            <TabsTrigger value="purchased">
              {t("Iegādātās biļetes", "Purchased Tickets")} {purchasedTickets.length > 0 && `(${purchasedTickets.length})`}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="added">
            <TicketsList
              tickets={addedTickets}
              onDelete={openDeleteConfirmation}
              onView={(ticket) => {
                setCurrentEditTicket(ticket);
                console.log("Viewing ticket:", ticket.id);
              }}
              onEdit={(ticket) => {
                setCurrentEditTicket(ticket);
                setEditTicketOpen(true);
              }}
              isLoading={isLoading}
              ticketType="added"
            />
          </TabsContent>
          
          <TabsContent value="purchased">
            <TicketsList
              tickets={purchasedTickets}
              onDelete={openDeleteConfirmation}
              onView={(ticket) => {
                setCurrentEditTicket(ticket);
                console.log("Viewing ticket:", ticket.id);
              }}
              isLoading={isLoading}
              ticketType="purchased"
            />
          </TabsContent>
        </Tabs>
      </CardContent>
      
      {/* Add Ticket Dialog */}
      <Dialog open={addTicketOpen} onOpenChange={setAddTicketOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("Pievienot biļeti", "Add Ticket")}</DialogTitle>
          </DialogHeader>
          <AddTicketForm onClose={() => {
            setAddTicketOpen(false);
            refreshTickets();
          }} />
        </DialogContent>
      </Dialog>
      
      {/* Edit Ticket Dialog */}
      <Dialog open={editTicketOpen} onOpenChange={setEditTicketOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("Rediģēt biļeti", "Edit Ticket")}</DialogTitle>
          </DialogHeader>
          {currentEditTicket && (
            <AddTicketForm 
              onClose={() => {
                setEditTicketOpen(false);
                refreshTickets();
              }}
              isEditing={true}
              ticketToEdit={currentEditTicket}
              onUpdate={handleUpdateTicket}
            />
          )}
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <DeleteTicketDialog
        open={ticketToDelete !== null}
        onCancel={cancelDelete}
        onConfirm={confirmDelete}
        isDeleting={isDeleting}
      />
    </Card>
  );
}
