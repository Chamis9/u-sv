
import React, { useEffect, useCallback } from "react";
import { User } from "@/types/users";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs } from "@/components/ui/tabs";
import { useTicketsTab } from "./hooks/useTicketsTab";
import { TicketsHeader } from "./components/TicketsHeader";
import { AuthRequiredAlert } from "./components/AuthRequiredAlert";
import { DeleteTicketDialog } from "./components/DeleteTicketDialog";
import { useTicketDialog } from "./hooks/useTicketDialog";
import { useTicketRefresh } from "./hooks/useTicketRefresh";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { AddTicketDialog, EditTicketDialog } from "./components/dialogs";
import { TabsList, TabContent } from "./components/tabs";

interface TicketsTabProps {
  user: User;
}

export function TicketsTab({ user }: TicketsTabProps) {
  const { isAuthenticated } = useAuth();
  const {
    addedTickets,
    purchasedTickets,
    isLoading,
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
  const handleRefreshClick = useCallback(async () => {
    console.log("Manual refresh triggered from button");
    await refreshTickets();
    // Also refresh using the tab's function to ensure UI consistency
    refreshTicketsFromTab();
  }, [refreshTickets, refreshTicketsFromTab]);
  
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

  // Set up automatic refreshing when ticket state changes
  useEffect(() => {
    // Listen for changes in auth state
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session && (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED')) {
          console.log("Auth state changed, refreshing tickets");
          refreshTicketsFromTab();
        }
      }
    );

    return () => {
      // Clean up the subscription
      authListener?.subscription.unsubscribe();
    };
  }, [refreshTicketsFromTab]);
  
  if (!isAuthenticated) {
    return (
      <Card className="bg-card dark:bg-gray-900">
        <CardContent className="pt-6">
          <AuthRequiredAlert t={t} />
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
          <TabsList 
            addedCount={addedTickets.length}
            purchasedCount={purchasedTickets.length}
          />
          
          <TabContent
            value="added"
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
          
          <TabContent
            value="purchased"
            tickets={purchasedTickets}
            onDelete={openDeleteConfirmation}
            onView={(ticket) => {
              setSelectedTicket(ticket);
              console.log("Viewing ticket:", ticket.id);
            }}
            isLoading={isLoading}
            ticketType="purchased"
          />
        </Tabs>
      </CardContent>
      
      {/* Add Ticket Dialog */}
      <AddTicketDialog 
        open={addTicketOpen} 
        onOpenChange={setAddTicketOpen}
        onClose={() => {
          setAddTicketOpen(false);
          // No need to call refreshTickets here, it's now handled in AddTicketDialog
        }}
      />
      
      {/* Edit Ticket Dialog */}
      <EditTicketDialog
        open={editTicketOpen}
        onOpenChange={setEditTicketOpen}
        onClose={() => {
          setEditTicketOpen(false);
          // No need to call refreshTickets here, it's now handled in EditTicketDialog
        }}
        currentTicket={currentEditTicket}
        onUpdate={handleUpdateTicket}
      />
      
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
