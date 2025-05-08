
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
import { TicketDetailDialog } from "./components/ticket-list/TicketDetailDialog";
import { useTicketDialog } from "./hooks/useTicketDialog";
import { useTicketRefresh } from "./hooks/useTicketRefresh";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface TicketsTabProps {
  user: User;
}

export function TicketsTab({ user }: TicketsTabProps) {
  const { isAuthenticated } = useAuth();
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
    refreshTickets: refreshTicketsFromTab,
    editTicketOpen,
    setEditTicketOpen,
    currentEditTicket,
    setCurrentEditTicket,
    t,
    authUserId
  } = useTicketsTab(user);
  
  // Use the enhanced refresh functionality with the authenticated user ID
  const { refreshTickets } = useTicketRefresh({
    userId: authUserId || undefined,
    isAuthenticated
  });
  
  const { selectedTicket, setSelectedTicket } = useTicketDialog();
  
  // Function to handle refresh button click
  const handleRefreshClick = async () => {
    console.log("Manual refresh triggered from button");
    await refreshTickets();
    // Also refresh using the tab's function to ensure UI consistency
    refreshTicketsFromTab();
  };
  
  // Force refresh on component mount and when user changes
  useEffect(() => {
    const verifyAndRefresh = async () => {
      if (isAuthenticated) {
        console.log("TicketsTab mounted, checking authentication and refreshing tickets");
        // Get the current auth session
        const { data: session, error } = await supabase.auth.getSession();
        if (session?.session && !error) {
          console.log(`Authenticated user ID from session: ${session.session.user.id}`);
          refreshTicketsFromTab();
        } else {
          console.error("Authentication session error:", error);
        }
      }
    };
    
    verifyAndRefresh();
  }, [isAuthenticated, refreshTicketsFromTab]);

  // Debug logging
  console.log("TicketsTab render - Current user:", user);
  console.log("TicketsTab render - Authentication state:", isAuthenticated);
  console.log("TicketsTab render - Added tickets:", addedTickets.length);
  console.log("TicketsTab render - Purchased tickets:", purchasedTickets.length);
  
  if (!isAuthenticated) {
    return (
      <Card className="bg-card dark:bg-gray-900">
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
    <Card className="bg-card dark:bg-gray-900">
      <TicketsHeader 
        onAddTicket={() => setAddTicketOpen(true)} 
        onRefresh={handleRefreshClick}
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
                setSelectedTicket(ticket);
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
                setSelectedTicket(ticket);
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
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto sm:max-w-lg">
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
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto sm:max-w-lg">
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
      
      {/* Ticket Detail View Dialog */}
      <TicketDetailDialog
        selectedTicket={selectedTicket}
        setSelectedTicket={setSelectedTicket}
        onEdit={(ticket) => {
          setCurrentEditTicket(ticket);
          setEditTicketOpen(true);
        }}
        ticketType={selectedTicket?.seller_id === authUserId ? "added" : "purchased"}
      />
    </Card>
  );
}
