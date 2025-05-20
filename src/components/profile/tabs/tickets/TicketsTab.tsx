
import React, { useEffect, useCallback, useRef } from "react";
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
  const initialLoadRef = useRef(false);
  const authListenerRef = useRef<{ subscription: { unsubscribe: () => void } } | null>(null);
  
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
  }, [refreshTickets]);
  
  // Force refresh on component mount only once
  useEffect(() => {
    if (isAuthenticated && !initialLoadRef.current) {
      const verifyAndRefresh = async () => {
        console.log("TicketsTab mounted, performing initial load check");
        initialLoadRef.current = true; // Mark as initialized
        
        try {
          // Get the current auth session
          const { data: session, error } = await supabase.auth.getSession();
          if (session?.session && !error) {
            console.log(`Initial auth check passed, user ID: ${session.session.user.id}`);
            // No need to force a refresh here - the queries will handle it
          } else if (error) {
            console.error("Authentication session error:", error);
          }
        } catch (err) {
          console.error("Error checking session:", err);
        }
      };
      
      verifyAndRefresh();
    }
  }, [isAuthenticated]); // Only depend on authentication status

  // Set up auth state change listener - only once
  useEffect(() => {
    // Only set up the listener if not already set
    if (!authListenerRef.current) {
      // Listen for changes in auth state
      const { data: authListener } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          console.log("Auth state changed:", event);
          if (session && (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED')) {
            console.log("Auth state changed, refreshing tickets");
            refreshTicketsFromTab();
          }
        }
      );

      // Store the listener for cleanup
      authListenerRef.current = authListener;

      // Clean up function
      return () => {
        if (authListenerRef.current) {
          authListenerRef.current.subscription.unsubscribe();
          authListenerRef.current = null;
        }
      };
    }
    
    return () => {}; // No-op if listener already set up
  }, []); // Empty dependency array - only run once
  
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
    <Card className="bg-card dark:bg-gray-900 shadow-sm">
      <TicketsHeader 
        onAddTicket={() => setAddTicketOpen(true)} 
        onRefresh={handleRefreshClick}
      />
      
      <CardContent className="px-2 sm:px-6">
        <Tabs defaultValue="added" className="w-full">
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
        }}
      />
      
      {/* Edit Ticket Dialog */}
      <EditTicketDialog
        open={editTicketOpen}
        onOpenChange={setEditTicketOpen}
        onClose={() => {
          setEditTicketOpen(false);
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
